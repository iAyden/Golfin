package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

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
	UserConn map[*websocket.Conn]bool
	//se necesita inicializar el mapa con make()
	Name   string `json:"name"`
	Points int    `json:"points"`
	Karma  int    `json:"karma"`
}

type Party struct {
	Id      string `json:"id"`
	Code    string `json:"code"`
	Members []User `json:"members"`
}

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
	b := make([]byte, 4) // 4 bytes = 8 hex digits
	_, err := rand.Read(b)
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

			id := uuid.New().String()
			usr := User{
				Name: "placeholder",
			}
			party := Party{
				Id:   id,
				Code: genCode(),
			}
			fmt.Println("vamo' a crear party")

			party.Members = append(party.Members, usr)

			ws.WriteJSON(party)

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
