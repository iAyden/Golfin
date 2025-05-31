package main 


import (
	"fmt"
	"net/http"
	"bufio"
	"github.com/gorilla/websocket"
	"os"
)

// Upgrade HTTP connection to WebSocket
//we instantiate a upgrader struct
var upgrader = websocket.Upgrader{
	
	CheckOrigin: func(r *http.Request) bool {
		//anonymous function that allows all origin

		//normally if the clients request was made from a different origin than the one of
		//the server it rejects it

		//with this we allow all origins 

		return true 	
	},
		
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	// Upgrade connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Upgrade error:", err)
		return
	}
	fmt.Println("Connected")
	//cuando la funcion returnee cerramos la conexión
	
	defer conn.Close()

	for {
		// Read message
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Read error:", err)
			break
		}
		fmt.Printf("Received: %s\n", msg)

		reader := bufio.NewReader(os.Stdin)
		// Echo back the message
    	fmt.Print("Enter a line: ")
    	line, err := reader.ReadString('\n')
		
    	fmt.Println("You entered:", line)
		
		var byteArr []byte
		
		for i:= 0 ; i < len(line) ; i++ {
			byteArr[i] = byte( line[i])
		}
		err = conn.WriteMessage(msgType, byteArr)
		if err != nil {
			fmt.Println("Write error:", err)
			break
		}
	}
}

func main() {
	

	http.HandleFunc("/ws", handleWebSocket)
	fmt.Println("Server started at :8080")
	http.ListenAndServe(":8080", nil)
}
