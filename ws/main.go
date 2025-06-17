package main

import (
	cryptoRand "crypto/rand"
	"encoding/hex"
	"encoding/json"
	mathRand "math/rand"

	"fmt"
	"net/http"
	"sync"

	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var (
	clients  = make(map[*websocket.Conn]bool) // All connected clients
	mutex    = &sync.Mutex{}                  // Thread safety
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
)

type Message struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"` // can decode later based on Type
}

type User struct {
	UserConn *websocket.Conn `json:"-"`
	//se necesita inicializar el mapa con make()
	Name     string       `json:"username"`
	Points   int          `json:"points"`
	Karma    int          `json:"karma"`
	JoinCode string       `json:"code"`
	Msg      chan Message `json:"-"`
}

type Party struct {
	Id        string       `json:"id"`
	Owner     string       `json:"owner"`
	Code      string       `json:"code"`
	Members   []*User      `json:"members"`
	Broadcast chan Message `json:"-"`
}

var partys = make(map[string]*Party)

func main() {
	http.HandleFunc("/game", handleConnections)
	http.Handle("/", http.FileServer(http.Dir("static")))
	//establecer rutina global para la party
	fmt.Println("Server started at :8080")
	http.ListenAndServe(":8080", nil)
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

		_, rawMsg, err := user.UserConn.ReadMessage()

		var msg Message

		json.Unmarshal(rawMsg, &msg)
		fmt.Println("El mensaje que recibimos del cliente es:")
		fmt.Println(msg)
		switch msg.Type {
		case "createParty":
			//no hay validación si ya tiene una party
			//reconnects ig

			id := uuid.New().String()

			// var payloadd map[string]interface{}
			err = json.Unmarshal(msg.Payload, user)
			if err != nil {
				fmt.Println(err)
			}

			code := genCode()
			owner := user.Name + "'s Party"
			fmt.Println(owner)
			party := &Party{
				Id:        id,
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

		case "joinParty":

			json.Unmarshal(msg.Payload, user)
			//truena horrorosamente cuando la party no existe
			fmt.Println("checamos que exista la party")
			if partys[user.JoinCode].Code != "" {
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
			}

		case "startGame":
			//req
			//type : "startGame"
			// payload : { "code" : "XYZ"}
			var rqPayload map[string]interface{}

			json.Unmarshal(msg.Payload, &rqPayload)
			code := rqPayload["code"].(string)

			party := partys[code]
			for _, player := range party.Members {

				mathRand.Seed(time.Now().UnixNano())
				randInt := mathRand.Intn(250) + 100
				player.Karma = randInt
			}

			payload, _ := json.Marshal(party)

			response := Message{
				Type:    "startGame",
				Payload: payload,
			}

			fmt.Println(response)
			party.Broadcast <- response

		}
		if err != nil {
			fmt.Println("Client disconnected:", err)
			mutex.Lock()
			delete(clients, user.UserConn)
			mutex.Unlock()
			break
		}

	}
}

func (party *Party) broadcastParty() {
	for broadcast := range party.Broadcast {
		fmt.Println("p", party)
		for _, member := range party.Members {
			fmt.Println("p", member.Name)
		}
		fmt.Println("p Broadcasting a la party con código " + party.Code)
		for _, member := range party.Members {
			fmt.Println("p Mandando mensaje al cliente ", member.Name)
			member.Msg <- broadcast
		}
	}
}

func (user *User) writeMessages() {
	for response := range user.Msg {
		fmt.Println("w Writeando al Cliente ", user.Name)
		fmt.Println("w", response)

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
