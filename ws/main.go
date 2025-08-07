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

const springApiUrl = "https://birth-classics-ent-bread.trycloudflare.com"
const raspUrl = "http://192.168.0.16" // http://192.168.0.16
const serverIp = "192.168.0.24:1337"

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
	GameId        string `json:"id"`
	Position      int    `json:"position"`
	Shots         int    `json:"shots"`
	Points        int    `json:"points"`
	Score         string `json:"score"`
	SpringedTraps int    `json:"springedTraps"`
	KarmaTrigger  int    `json:"karmaTrigger"`
	KarmaSpent    int    `json:"karmaSpent"`
	Won           int    `json:"won"`
}

type GStats struct {
	GameId             int      `json:"id"`
	Winner             string   `json:"winner"`
	Players            []string `json:"players"`
	Course             string   `json:"course"`
	TimeElapsed        int      `json:"totalTime"`
	TotalSpringedTraps int      `json:"totalSpringedTraps"`
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

	Msg   chan Message `json:"-"`
	Nuked chan string  `json:"-"`
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

	http.ListenAndServe(serverIp, nil)
}

func playerScored(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\033[1;31mEntramos a Player Scored\033[0m")
	//increible la validación
	//creo qué tan solo sería checar el origen del request
	//que concuerde con el del pico
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var data = make(map[string]interface{})

	json.NewDecoder(r.Body).Decode(&data)
	gameId := data["data"].(float64)

	actualGame := games[int(gameId)]

	actualPlayerName := actualGame.PlayerTurn
	fmt.Println("Nombre actual del jugador")
	fmt.Println(actualPlayerName)

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
		Nuked:    make(chan string),
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
		fmt.Println("El mensaje que recibimos del cliente es: ", msg)

		switch msg.Type {
		case "createParty":
			createParty(user, msg)
		case "joinParty":
			joinParty(user, msg)
		case "startGame":
			//xddddi
			go startGame(user, msg)
		case "nuke":
			user.Nuked <- "nukeado"
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

	var mensaje Message

	globalTime := time.Now()

	for !finished {
		for i := range party.Members {

			start := time.Now().Add(-time.Duration(game.Round*10) * time.Second)

			if party.Members[i].Finished {
				fmt.Println("Salteamos el turno del jugador", party.Members[i].Finished, party.Members[i].Name)
				if i+1 == len(party.Members) {
					i = 0
				} else {
					i++
				}
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

	winner := getWinner(game.Party.Members)
	winner.Stats.Won = 1

	fmt.Println("Ganó la partida", winner.Name)

	game.Stats.Winner = winner.Name
	game.Stats.TimeElapsed = int(time.Since(globalTime).Seconds())

	for i, player := range game.Party.Members {
		game.Party.Members[i].Stats.GameId = strconv.Itoa(game.Id)
		game.Stats.Players = append(game.Stats.Players, player.Name)
	}

	sendUserStats(game.Party.Members, game)
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
	party.Members[i].Stats.Score = score

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
func sendGameStats(game *Game) {
	data := map[string]interface{}{
		"id":                 game.Id,
		"winner":             game.Stats.Winner,
		"players":            game.Stats.Players,
		"course":             game.Stats.Course,
		"totalTime":          game.Stats.TimeElapsed,
		"totalSpringedTraps": game.Stats.TotalSpringedTraps,
	}

	json, _ := json.Marshal(data)

	res, err := http.Post(springApiUrl+"/api/games/add", "application/json", bytes.NewBuffer(json))
	fmt.Println(res, err)
}
func sendUserStats(members []*User, game *Game) {

	dataArr := []map[string]interface{}{}
	for _, member := range members {
		post := map[string]interface{}{
			"username": member.Name,
			"data":     member.Stats,
		}

		dataArr = append(dataArr, post)
		fmt.Println(member.Stats)
		data, _ := json.Marshal(post)
		res, err := http.Post(springApiUrl+"/api/stats/add-ustats", "application/json", bytes.NewBuffer(data))
		fmt.Println(res, err)
	}

	payload, _ := json.Marshal(dataArr)
	msg := Message{
		Type:    "gameEnded",
		Payload: payload,
	}

	game.Party.Broadcast <- msg
	<-done
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
			go activateTrap(user, msg, game)
		}
	}
}
func activateTrap(user *User, msg Message, game *Game) {
	//si un jugador activó una trampa que otro tiene disponible
	// se le desactiva al otro jugador hasta que acaba la duración de la trampa

	var payload map[string]interface{}
	json.Unmarshal(msg.Payload, &payload)

	trap := payload["trap"].(string)
	fmt.Println("La trampa que vamos a activar es ", trap)
	trapLocation := "/" + trap
	url := (raspUrl + trapLocation)

	res, err := http.Get(url)

	fmt.Println(res, err)

	var data = map[string]interface{}{
		"trap": trap,
	}

	sendMessage("deactivateTrap", data, user)

	var gameMembers = game.Party.Members

	for i := 0; i < len(user.BoughtTraps); i++ {
		if user.BoughtTraps[i] == trap {
			user.BoughtTraps = pop(user.BoughtTraps, i)
		}
	}

	for i := 0; i < len(gameMembers); i++ {
		traps := gameMembers[i].BoughtTraps

		for j := 0; j < len(traps); j++ {

			if traps[j] == trap {
				sendMessage("deactivateTrap", data, game.Party.Members[i])
				//debería llegar 5 segundos despues
				go reactivateTrap(game.Party.Members[i], data)
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
			gameMembers[i].Karma = newTotalKarma

			data := map[string]interface{}{
				"username": gameMembers[i].Name,
				"karma":    newTotalKarma,
			}
			fmt.Println("El nuevo karma total")
			fmt.Println(gameMembers[i].Name, newTotalKarma)
			gameMembers[i].Stats.KarmaTrigger += 1
			sendMessage("karmaTrigger", data, gameMembers[i])
		}
	}

	user.Stats.SpringedTraps += 1
	game.Stats.TotalSpringedTraps += 1

	//aquí en realidad debería ser la duración de la trampa
	//pero como todas duran 5 segundos ps x
	go reactivateTrap(user, data)
}

func reactivateTrap(user *User, data map[string]interface{}) {
	time.Sleep(5 * time.Second)
	sendMessage("reactivateTrap", data, user)
}
func pop(slice []string, position int) []string {
	return append(slice[:position], slice[position+1:]...)
}
func buyTrap(user *User, msg Message) {

	var payload map[string]interface{}
	json.Unmarshal(msg.Payload, &payload)

	trap := payload["trap"].(string)

	if hasEnoughKarma(trap, user) {
		user.Stats.KarmaSpent += trapPrice[trap]
		user.Karma -= trapPrice[trap]

		data := map[string]interface{}{
			"username": user.Name,
			"karma":    user.Karma,
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
	//cancer
	trapPrice["tornado"] = 100
	trapPrice["casino"] = 150
	trapPrice["castle"] = 125
	trapPrice["windmill"] = 150
	trapPrice["wall"] = 250

	trapPrice["ramp"] = 300
	trapPrice["slap"] = 100
	trapPrice["hole"] = 250
	trapPrice["random"] = 150

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

	party := partys[code]
	for i := range party.Members {

		randInt := mathRand.Intn(len(party.Members))

		playerP := party.Members[randInt]

		party.Members[randInt] = party.Members[i]
		party.Members[i] = playerP

		//existe la manera para swapear a,b = b,a

	}
	for i := range party.Members {

		randInt := mathRand.Intn(250) + 100
		fmt.Println("Karma aleatorio de ", party.Members[i].Name)
		fmt.Println(randInt)
		party.Members[i].Karma = randInt

		data := map[string]interface{}{
			"karma": party.Members[i].Karma,
		}

		sendMessage("userStartGame", data, party.Members[i])
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
	// fmt.Println(data)

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

	postIdToRasp(strconv.Itoa(intnum))
	intnum++

	stringNum := strconv.Itoa(intnum)
	os.WriteFile("gameSeed.txt", []byte(stringNum), 0644)

	interfaceMap := map[string]interface{}{}
	for i := 0; i < len(party.Members); i++ {
		sendMessage("nuke", interfaceMap, party.Members[i])
		<-party.Members[i].Nuked
		go party.Members[i].readGameMessages(game)
	}
	go game.gameLoop()

}

func postIdToRasp(id string) {
	data := map[string]interface{}{
		"data": id,
	}

	// Marshal into JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		panic(err)
	}

	// Cr  eate the request

	resp, err := http.Post(raspUrl+"/picoW", "application/json", bytes.NewBuffer(jsonData))
	fmt.Println(resp)
	if err != nil {
		panic(err)
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
