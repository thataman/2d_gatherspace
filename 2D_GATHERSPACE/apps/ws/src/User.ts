import { WebSocket } from "ws"
import { outgoingMessage } from "./types"

function generateRandomId(length: number) {
    const data = "abcdefghijklmnopqrstuvwxyz1234567890"
    let result = ""
    for (let i = 0; i < length; i++) {
        result += data.charAt(Math.floor(Math.random() * data.length))
    }
    return result
}


export class User {
    static instance: User;
    public id: string;
    constructor(private ws: WebSocket) {
        this.id = generateRandomId(10)
    }

send(payload : outgoingMessage){
    this.ws.send(JSON.stringify(payload))
}

    initHandlers() {
        this.ws.on("message", (data) => {
            const parsedMessage = JSON.parse(data.toString())
            switch (parsedMessage.type) {
                case "join":

                    break;
                case "move":

                    break;
                default:
                    break;
            }
        })
    }
}