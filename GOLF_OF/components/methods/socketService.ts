type Callback = (data: any) => void;

class SocketService {
    private socket: WebSocket | null = null;
    private listeners: Record<string,Callback[]> = {};

    connect (url: string){
        this.socket = new WebSocket(url);

        this.socket.onopen = () => { console.log("WebSocket Conectado"); };


        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // console.log("Mensaje recibido: ", data);
                this.emit(data.type, data.payload);
            } catch (error) { console.error("Error al parsear el mensaje: ", error); }
        }

        this.socket.onerror = (error) => { console.error("Error con websocket",error); };
        this.socket.onclose = () => {console.warn("WebSocket cerrado");};
    }


    send(type:string, payload: any){
        (this.socket?.readyState === WebSocket.OPEN) ? this.socket.send(JSON.stringify({type,payload})) : console.warn("El websocket no esta abierto");
    }

    createLobby(username: string){ this.send("createParty",{username});  }

    joinLobby(username:string, code:string) { this.send("joinParty",{username,code});  }

    startGame(code: string) { this.send("startGame", { code }); }

    buyTrap(trapName: string) { this.send("buyTrap", { trap: trapName }); console.log("Entro al metodo buyTrap"); }

    on(eventType: string, callback: Callback){
        this.listeners[eventType] ??= this.listeners[eventType] = [];
        this.listeners[eventType].push(callback);
    }

    off(eventType: string, callback: Callback) {
        if (!this.listeners[eventType]) return;
        this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    }

   
    private emit(eventType: string, data: any){
        (this.listeners[eventType]) ? this.listeners[eventType].forEach((cb) => cb(data)): console.error("No hay listeners para el evento:", eventType); // ternario
    }

    close() {
        this.socket?.close();
        this.socket = null; 
    }

    async getEventData<T = any>(eventType: string): Promise<T> {
    return new Promise((resolve) => {
        const handler = (data: T) => {
            resolve(data);
            this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== handler);
        };
        this.on(eventType, handler);
    }); 
}
}
const socketService = new SocketService();

export default socketService;