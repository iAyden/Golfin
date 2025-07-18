package main

import (
	"bytes"
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

const springApiUrl = "golfin.dns.net:8888"
const raspUrl = "http:arduinito.net"

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var gameId = ""
var mutex = &sync.Mutex{}

type Message struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type UStats struct {
	Position      int `json:"position"`
	Shots         int `json:"shots"`
	Points        int `json:"points"`
	SpringedTraps int `json:"springedTraps"`
	Won           int `json:"won"`
}

type GStats struct {
	GameId             int     `json:"id"`
	Winner             string  `json:"winner"`
	Players            []*User `json:"players"`
	Course             string  `json:"course"`
	TimeElapsed        int     `json:"totalTime"`
	TotalSpringedTraps int     `json:"totalSpringedTraps"`
}

type User struct {
	UserConn *websocket.Conn `json:"-"`
	//se necesita inicializar el mapa con make()
	Name     string `json:"username"`
	Karma    int    `json:"karma"`
	JoinCode string `json:"code"`
	Finished bool   `json:"-"`

	BoughtTraps []string
	Stats       UStats `json:"stats"`

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
	Stats GStats `json:"stats"`
}

var games = make(map[int]*Game)

func main() {
	fmt.Println("Servidor corriendo en el puerto 1337")
	http.HandleFunc("/game", handleConnections)
	http.HandleFunc("/playerScored", playerScored)
	http.Handle("/", http.FileServer(http.Dir("static")))

	http.ListenAndServe(":1337", nil)
}

func playerScored(w http.ResponseWriter, r *http.Request) {
	//increible la validación
	//creo qué tan solo sería checar el origen del request
	//que concuerde con el del pico

	w.Header().Set("Access-Control-Allow-Origin", "*")
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
	//necesitamos handlear de alguna manera la reconexión
	//alguna clase de id
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
		_, rawMsg, err := user.UserConn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			break
		}
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

			//nukeamos esta funcion de lectura
			return
		}
	}
}

func (game *Game) gameLoop() {
	fmt.Println("Inicamos el loop del juego")
	var finished bool
	party := game.Party
	game.Round = 1

	var globalTimer int

	fmt.Println("el id del juego es")
	fmt.Println(game.Id)
	start := time.Now()

	var mensaje Message

	fmt.Println("El juego es ", games[game.Id])
	for !finished {
		for i := range party.Members {

			if party.Members[i].Finished {
				fmt.Println("Salteamos el turno del jugador", party.Members[i].Finished, party.Members[i].Name)
				i++
				//idea
				//cuando un jugador termine puede darle a otros jugadores karma
				//le podemos dar más karma con cada ronda qué pasa

			}
			var msg map[string]interface{}

			sendMessage("startUserTurn", msg, party.Members[i])
			game.PlayerTurn = party.Members[i].Name

			data := map[string]interface{}{
				"time": 5,
			}

			for j := 5; j >= 0; j-- {

				data["time"] = j
				sendMessage("startTimer", data, party.Members[i])

				data["time"] = globalTimer
				mensaje.Type = "globalTimer"
				mensaje.Payload, _ = json.Marshal(data)
				game.Party.Broadcast <- mensaje
				<-done
				time.Sleep(1 * time.Second)
				globalTimer++
			}

			for j := 10; j >= 0; j-- {

				data["time"] = j
				sendMessage("turnTimer", data, party.Members[i])

				data["time"] = globalTimer
				mensaje.Type = "globalTimer"
				mensaje.Payload, _ = json.Marshal(data)
				game.Party.Broadcast <- mensaje
				<-done

				if party.Members[i].Finished {
					playerFinished(party, game, i, start)
					finished = partyFinished(party)
					break
				}

				time.Sleep(1 * time.Second)
				globalTimer++
			}

			sendMessage("endUserTurn", msg, party.Members[i])

			if finished {
				break
			}

		}

		game.Round++
		finished = partyFinished(party)

		fmt.Println("se acabó la partida ", finished)
	}
	fmt.Println("fin de la partida")

	msg := Message{
		Type: "gameEnded",
	}
	game.Party.Broadcast <- msg
	<-done

	winner := getWinner(game.Party.Members)
	winner.Stats.Won = 1

	fmt.Println("Ganó la partida", winner.Name)

	game.Stats.Winner = winner.Name
	game.Stats.TimeElapsed = int(time.Since(start))

	sendUserStats(game.Party.Members)
	sendGameStats(game)

}

func partyFinished(party *Party) bool {

	temp := true
	finished := false

	for _, player := range party.Members {
		mutex.Lock()
		fmt.Println(player.Name, player.Finished)
		finished = temp && player.Finished
		temp = player.Finished
		mutex.Unlock()
	}

	return finished
}

func playerFinished(party *Party, game *Game, i int, start time.Time) {

	fmt.Println(party.Members[i].Name, " acabó!")
	timeOfGoal := time.Since(start)
	score := getScoreName(4, game.Round)

	points := calculatePoints(score, timeOfGoal)
	party.Members[i].Stats.Points = points
	party.Members[i].Stats.Shots = game.Round

	data := map[string]interface{}{
		"name":   party.Members[i].Name,
		"score":  score,
		"points": points,
	}

	payload, _ := json.Marshal(data)

	msg := Message{
		Type:    "playerFinished",
		Payload: payload,
	}

	party.Broadcast <- msg
	<-done
	time.Sleep(5 * time.Second)

	msg.Type = "endPlayerFinished"
	party.Broadcast <- msg
	<-done

	//en este punto podemos mandar el mensaje para redirigir
	//a la pantalla de fantasmas (jugadores qué ya terminaron)
	msg = Message{
		Type: "finished",
	}

	party.Members[i].Msg <- msg

}

func playerTurn() {

}
func sendGameStats(game *Game) {
	data := map[string]interface{}{
		"id":    game.Id,
		"stats": game.Stats,
	}

	json, _ := json.Marshal(data)

	http.Post(springApiUrl+"/add-gstats", "application/json", bytes.NewBuffer(json))
}

func getWinner(members []*User) *User {
	winner := members[0]
	for i := 0; i < len(members); i++ {
		if winner.Stats.Points > members[i].Stats.Points {
			winner = members[i]
		}
	}

	return winner

}
func sendUserStats(members []*User) {

	for _, member := range members {
		post := map[string]interface{}{
			"username": member.Name,
			"data":     member.Stats,
		}
		data, _ := json.Marshal(post)
		http.Post(springApiUrl+"/add-ustats", "application/json", bytes.NewBuffer(data))
	}

}

var shotsMultp = map[string]float32{
	"ace":           2.00,
	"albatross":     1.75,
	"eagle":         1.50,
	"birdie":        1.25,
	"par":           1.00,
	"boogie":        0.75,
	"double boogie": 0.5,
	"triple boogie": 0.25,
}

func calculatePoints(score string, time time.Duration) int {
	//necesitamos obtener el par del campo para poder calcular el puntaje
	var points float64

	multiplier := shotsMultp[score]
	timer := time.Seconds()

	points = timer / float64(multiplier)

	return int(points * 10)
}

var scoreMap = map[int]string{
	-3: "triple boogie",
	-2: "double boogie",
	-1: "boogie",
	0:  "par",
	1:  "birdie",
	2:  "eagle",
	3:  "albatross",
}

func getScoreName(holePar int, shots int) string {
	if shots == 1 {
		return "ace"
	}
	return scoreMap[holePar-shots]
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
func (user *User) readGameMessages(game *Game) {
	for {

		_, rawMsg, err := user.UserConn.ReadMessage()

		if err != nil {
			fmt.Println(err)
			break
		}

		var msg Message
		json.Unmarshal(rawMsg, &msg)
		fmt.Println("El mensaje de juego qué recibimos")
		fmt.Println(msg)

		var payload = make(map[string]interface{})
		json.Unmarshal(msg.Payload, &payload)

		switch msg.Type {
		case "buyTrap":
			buyTrap(user, msg)
		case "activateTrap":
			activateTrap(user, msg, game)
		}
	}
}

func activateTrap(user *User, msg Message, game *Game) {
	//si un jugador activó una trampa que otro tiene disponible
	// se le desactiva al otro jugador hasta que acaba la duración de la trampa

	var payload map[string]interface{}
	json.Unmarshal(msg.Payload, &payload)

	trap := payload["trap"].(string)
	trapLocation := fmt.Sprintf("/trampa?trampa='%s'", trap)
	url := (raspUrl + trapLocation)

	http.Get(url)

	var data = map[string]interface{}{
		"Trap": trap,
	}
	var gameMembers = game.Party.Members

	for i := 0; i < len(gameMembers); i++ {
		traps := gameMembers[i].BoughtTraps
		for j := 0; i < len(traps); i++ {
			if traps[j] == trap {
				sendMessage("deactivateTrap", data, user)
			}
		}
	}
	trapPrice := trapPrice[trap]
	deviation := int(float64(trapPrice) * 0.30)

	newKarma := mathRand.Intn(trapPrice+deviation) + trapPrice - deviation

	affectedPlayer := game.PlayerTurn
	for i := 0; i < len(gameMembers); i++ {
		if gameMembers[i].Name == affectedPlayer {

			newTotalKarma := gameMembers[i].Karma + newKarma
			data := map[string]interface{}{
				"karma": newTotalKarma,
			}
			sendMessage("karmaTrigger", data, gameMembers[i])
		}
	}

	user.Stats.SpringedTraps += 1
	game.Stats.TotalSpringedTraps += 1

}
func buyTrap(user *User, msg Message) {

	var payload map[string]interface{}
	json.Unmarshal(msg.Payload, &payload)

	trap := payload["trap"].(string)
	if hasEnoughKarma(trap, user) {
		user.Karma -= trapPrice[trap]

		data := map[string]interface{}{
			"Karma": user.Karma,
		}

		user.BoughtTraps = append(user.BoughtTraps, trap)

		sendMessage("buyTrap", data, user)
	} else {

		data := map[string]interface{}{}
		sendMessage("buyTrap", data, user)

	}
}

var trapPrice = make(map[string]int)

func hasEnoughKarma(trap string, player *User) bool {
	return player.Karma >= trapPrice[trap]
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

	gameIdMap := map[string]interface{}{
		"gameId": game.Id,
	}

	gameIdJson, _ := json.Marshal(gameIdMap)
	message := Message{
		Type:    "gameId",
		Payload: gameIdJson,
	}

	party.Broadcast <- message
	<-done

	endpoint := fmt.Sprintf("/gameId?id=%d", intnum)
	http.Get(raspUrl + endpoint)

	intnum++

	stringNum := strconv.Itoa(intnum)
	os.WriteFile("gameSeed.txt", []byte(stringNum), 0644)

	go game.gameLoop()

	for i := 0; i < len(party.Members); i++ {
		party.Members[i].readGameMessages(game)
	}

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
