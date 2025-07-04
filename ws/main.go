package main

import (
	cryptoRand "crypto/rand"
	"encoding/hex"
	"encoding/json"
	mathRand "math/rand"
	"os"

	"fmt"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var gameId = ""
var mutex = &sync.Mutex{}

type Message struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"` // can decode later based on Type
}

type UStats struct {
	Position      int `json:"position"`
	Shots         int `json:"shots"`
	Points        int `json:"points"`
	SpringedTraps int `json:"springedTraps"`
}

type User struct {
	UserConn *websocket.Conn `json:"-"`
	//se necesita inicializar el mapa con make()
	Name     string `json:"username"`
	Points   int    `json:"points"`
	Karma    int    `json:"karma"`
	JoinCode string `json:"code"`
	Finished bool   `json:"-"`

	Stats UStats `json:"stats"`

	Msg chan Message `json:"-"`
}

type Party struct {
	Owner   string  `json:"owner"`
	Code    string  `json:"code"`
	Members []*User `json:"members"`

	Broadcast chan Message `json:"-"`
}

var partys = make(map[string]*Party)

type Game struct {
	//agregar id para qué el arduino sepa cual es el juego qué esta utilizando
	//actualmente el campo

	Id         int    `json:"id"`
	Round      int    `json:"round"`
	PlayerTurn string `json:"playerTurn"`
	Party      *Party `json:"party"`
	//agregar game stats
}

var games = make(map[int]*Game)

func main() {
	http.HandleFunc("/game", handleConnections)
	http.HandleFunc("/playerScored", playerScored)
	http.Handle("/", http.FileServer(http.Dir("static")))

	fmt.Println("Starting server on :8080")
	errorPrueba := http.ListenAndServe(":8080", nil)
	if errorPrueba != nil {
		fmt.Println("Error starting server:", errorPrueba)
	}
}

func playerScored(w http.ResponseWriter, r *http.Request) {
	//increible la validación
	//creo qué tan solo sería checar el origen del request
	//que concuerde con el del pico
	var data = make(map[string]interface{})

	json.NewDecoder(r.Body).Decode(&data)
	fmt.Println(data)

	gameId := data["id"].(float64)

	fmt.Println(gameId)
	actualGame := games[int(gameId)]

	fmt.Println(actualGame)

	actualPlayerName := actualGame.PlayerTurn
	for i := 0; i < len(actualGame.Party.Members); i++ {
		if actualGame.Party.Members[i].Name == actualPlayerName {
			mutex.Lock()
			actualGame.Party.Members[i].Finished = true
			mutex.Unlock()
		}
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket upgrade failed:", err)
		return
	}

	user := &User{
		UserConn: ws,
		Msg:      make(chan Message),
	}

	fmt.Print("Nuevo user con web socket")
	fmt.Println(ws.LocalAddr().String())

	go user.readMessages()
	go user.writeMessages()

}

func (user *User) readMessages() {

	for {
		_, rawMsg, _ := user.UserConn.ReadMessage()

		var msg Message

		json.Unmarshal(rawMsg, &msg)
		fmt.Println("El mensaje que recibimos del cliente es:")
		fmt.Println(msg)

		switch msg.Type {
		case "createParty":
			createParty(user, msg)
		case "joinParty":
			joinParty(user, msg)
		case "startGame":
			startGame(user, msg)
			//iniciamos otra rutina de lectura de mensajes
			//, pero ahora exclusiva para los mensajes referentes al juego
			//creo qué no tiene mucha utilidad pero para tener más orden
			go user.readGameMessages()

			return
		}

	}
}

func (game *Game) gameLoop() {
	fmt.Println("Inicamos el loop del juego")
	var finished bool
	party := game.Party
	game.Round = 1
	fmt.Println("El juego es ", games[game.Id])
	for !finished {
		fmt.Println("inicio de la ronda ", game.Round)
		for i := range party.Members {

			if party.Members[i].Finished {
				i++
				fmt.Println("Salteamos el turno del jugador", party.Members[i].Finished, party.Members[i].Name)
			}
			var msg map[string]interface{}

			sendMessage("startUserTurn", msg, party.Members[i])
			game.PlayerTurn = party.Members[i].Name

			fmt.Println("Es turno del jugador", game.PlayerTurn)

			data := map[string]interface{}{
				"time": 5,
			}

			for j := 5; j >= 0; j-- {
				data["time"] = j
				sendMessage("startTimer", data, party.Members[i])

				fmt.Println("tiempo de preparación")
				time.Sleep(1 * time.Second)

			}

			for j := 10; j >= 0; j-- {
				fmt.Println("turno jugador", party.Members[i].Name)
				data["time"] = j
				sendMessage("turnTimer", data, party.Members[i])

				if party.Members[i].Finished {
					fmt.Println("Termino el jugador")
					sendMessage("playerFinished", msg, party.Members[i])
					break
				}

				time.Sleep(1 * time.Second)
			}

			fmt.Println("fin del turno del jugador")
		}

		fmt.Println("fin de la ronda")

		game.Round++

		temp := true
		for _, player := range party.Members {
			finished = temp && player.Finished
			temp = player.Finished
		}
		fmt.Println("Party finished: ", finished)
	}
	fmt.Println("fin de la partida")
}
func sendMessage(tp string, data map[string]interface{}, player *User) {

	payload, err := json.Marshal(data)

	if err != nil {
		fmt.Println(err)
	}

	msg := Message{
		Type:    tp,
		Payload: payload,
	}

	player.Msg <- msg
}
func (user *User) readGameMessages() {
	for {

		_, rawMsg, _ := user.UserConn.ReadMessage()

		var msg Message
		json.Unmarshal(rawMsg, &msg)
		fmt.Println("El mensaje de juego qué recibimos")
		fmt.Println(msg)

		var payload = make(map[string]interface{})
		json.Unmarshal(msg.Payload, &payload)

		switch msg.Type {
		case "buy":
			trap := payload["trap"].(string)
			karma := payload["trap"].(int)

			if hasEnoughKarma(trap, karma) {
				user.Msg <- msg
			} else {
				response := Message{
					Type: "buy",
				}
				user.Msg <- response
			}

		}

	}
}

var trapPrice = make(map[string]int)

func hasEnoughKarma(trap string, karma int) bool {
	if karma >= trapPrice[trap] {
		return true
	}
	return false
}

func createParty(user *User, msg Message) {
	//no hay validación si ya tiene una party
	//reconnects ig

	// var payloadd map[string]interface{}
	err := json.Unmarshal(msg.Payload, user)
	if err != nil {
		fmt.Println(err)
	}

	code := genCode()
	owner := user.Name
	fmt.Println(owner)
	party := &Party{
		Owner:     owner,
		Code:      code,
		Broadcast: make(chan Message),
	}
	//chafa pq pueden generarse dos codigos iguales, baja probabilidad pero chafa igual.
	partys[code] = party
	party.Members = append(party.Members, user)

	payload, err := json.Marshal(party)
	if err != nil {
		fmt.Println(err)
	}

	response := Message{
		Type:    "createParty",
		Payload: payload,
	}
	//aqui podemos inicializar la goroutine para el broadcasting de las partys

	go party.broadcastParty()
	user.Msg <- response

}

func joinParty(user *User, msg Message) {

	json.Unmarshal(msg.Payload, user)
	_, ok := partys[user.JoinCode]

	if ok {
		party := partys[user.JoinCode]
		party.Members = append(party.Members, user)

		fmt.Println(user.Name, "joining ", party.Owner)

		payload, err := json.Marshal(party)
		if err != nil {
			fmt.Println(err)
		}

		response := Message{
			Type:    "joinParty",
			Payload: payload,
		}

		party.Broadcast <- response
		<-done

		return

	}

	response := Message{
		Type: "joinParty",
	}

	user.Msg <- response

}

func startGame(user *User, msg Message) {
	//req
	//type : "startGame"
	// payload : { "code" : "XYZ"}
	var rqPayload = make(map[string]interface{})

	json.Unmarshal(msg.Payload, &rqPayload)
	code := rqPayload["code"].(string)

	mathRand.Seed(time.Now().UnixNano())
	party := partys[code]
	for i := range party.Members {

		randInt := mathRand.Intn(250) + 100
		party.Members[i].Karma = randInt

		randInt = mathRand.Intn(len(party.Members))

		playerP := party.Members[randInt]

		party.Members[randInt] = party.Members[i]
		party.Members[i] = playerP

		//existe la manera para swapear a,b = b,a

	}
	payload, _ := json.Marshal(party)

	response := Message{
		Type:    "startGame",
		Payload: payload,
	}
	party.Broadcast <- response
	<-done
	//necesitamos crear el id

	game := &Game{
		Party: party,
	}

	data, err := os.ReadFile("gameSeed.txt")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(data)

	intnum, _ := strconv.Atoi(string(data))
	games[intnum] = game
	game.Id = intnum
	intnum++

	stringNum := strconv.Itoa(intnum)
	os.WriteFile("gameSeed.txt", []byte(stringNum), 0644)
	game.gameLoop()

}

var done = make(chan string)

func (party *Party) broadcastParty() {
	for broadcast := range party.Broadcast {
		for _, member := range party.Members {
			member.Msg <- broadcast
		}
		done <- "papu"
	}
}

func (user *User) writeMessages() {
	for response := range user.Msg {
		user.UserConn.WriteJSON(response)
	}
}

func genCode() string {
	b := make([]byte, 4)
	_, err := cryptoRand.Read(b)
	if err != nil {
		panic(err)
	}

	hexStr := hex.EncodeToString(b)
	return hexStr[1:5]
}
