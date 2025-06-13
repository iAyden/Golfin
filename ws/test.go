package main

import (
	cryptoRand "crypto/rand"
	"encoding/hex"
	"encoding/json"

	"fmt"
	"net/http"
	"sync"

	mathRand "math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var (
	clients   = make(map[*websocket.Conn]bool) // All connected clients
	broadcast = make(chan []byte)              // Messages to be sent
	mutex     = &sync.Mutex{}                  // Thread safety
	upgrader  = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
)

type Message struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"` // can decode later based on Type
}

type User struct {
	UserConn *websocket.Conn
	//se necesita inicializar el mapa con make()
	Name     string `json:"username"`
	Points   int    `json:"points"`
	Karma    int    `json:"karma"`
	JoinCode string `json:"code"`
}

type Party struct {
	Id      string `json:"id"`
	Code    string `json:"code"`
	Members []User `json:"members"`
}

var partys = make(map[string]Party)

func main() {
	http.HandleFunc("/game", handleConnections)
	http.Handle("/", http.FileServer(http.Dir("static")))
	go handleMessages() // Background goroutine for broadcasting

	fmt.Println("Server started at :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
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

func handleConnections(w http.ResponseWriter, r *http.Request) {

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket upgrade failed:", err)
		return
	}
	defer ws.Close()

	mutex.Lock()
	clients[ws] = true
	mutex.Unlock()
	for {
		_, rawMsg, err := ws.ReadMessage()

		var msg Message

		json.Unmarshal(rawMsg, &msg)
		switch msg.Type {
		case "createParty":
			//checar como se pueden obtener los datos del payload

			id := uuid.New().String()
			usr := User{
				UserConn: ws,
			}
			//npi como puedo obtener el payload

			json.Unmarshal(msg.Payload, &usr)

			code := genCode()
			party := Party{
				Id:   id,
				Code: code,
			}
			fmt.Println("vamo' a crear party")
			//chafa pq pueden generarse dos codigos iguales, baja probabilidad pero chafa igual.
			partys[code] = party
			party.Members = append(party.Members, usr)

			ws.WriteJSON(party)

		case "joinParty":
			usr := User{}

			json.Unmarshal(msg.Payload, &usr)

			if partys[usr.JoinCode].Code != "" {
				usr.UserConn = ws
				party := partys[usr.JoinCode]

				party.Members = append(party.Members, usr)

				ws.WriteJSON(party)
			}

			//regresar que no se encontro la party
		case "startGame":
			var payload map[string]interface{}

			json.Unmarshal(msg.Payload, &payload)
			code := payload["code"].(string)

			party := partys[code]
			for _, player := range party.Members {

				mathRand.Seed(time.Now().UnixNano())
				randInt := mathRand.Intn(200) + 100
				player.Karma = randInt

			}
		}
		if err != nil {
			fmt.Println("Client disconnected:", err)
			mutex.Lock()
			delete(clients, ws)
			mutex.Unlock()
			break
		}
		broadcast <- rawMsg
	}
}

func handleMessages() {

	for {
		msg := <-broadcast

		mutex.Lock()
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {

				fmt.Println("Write error:", err)
				client.Close()
				delete(clients, client)
			}
		}
		mutex.Unlock()
	}
}
