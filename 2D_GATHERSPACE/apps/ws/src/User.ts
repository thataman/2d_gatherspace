import { WebSocket } from "ws"
import { outgoingMessage } from "./types"
import { RoomManager } from "./roomManager"
import Jwt, { JwtPayload } from "jsonwebtoken"
import client from "@repo/db/client"

const secretaccesskey = "hqbwgkqWKRGRHGBQUEHRGUHQWJGHQJH"
function generateRandomId(length: number) {
    const data = "abcdefghijklmnopqrstuvwxyz1234567890"
    let result = ""
    for (let i = 0; i < length; i++) {
        result += data.charAt(Math.floor(Math.random() * data.length))
    }
    return result
}


export class User {

    public id: string;
    public userId?: string
    private x: number;
    private y: number
    private spaceId?: string

    constructor(private ws: WebSocket) {
        this.id = generateRandomId(10)
        this.x = 0;
        this.y = 0
        this.initHandlers()
    }

    send(payload: outgoingMessage) {
        this.ws.send(JSON.stringify(payload))
    }

    initHandlers() {
        this.ws.on("message", async (data) => {
            const parsedMessage = JSON.parse(data.toString())
            switch (parsedMessage.type) {
                case "join":
                    const spaceId = parsedMessage.payload.spaceId
                    const token = parsedMessage.payload.token
                    const userId = (Jwt.verify(token, secretaccesskey) as JwtPayload).userId
                    if (!userId) {
                        this.ws.close();
                        return
                    }
                    this.userId = userId
                    const space = await client.space.findFirst({
                        where: {
                            id: spaceId
                        },
                        select: {
                            width: true,
                            height: true
                        }
                    })
                    if (!space) {
                        this.ws.close()
                        return
                    }
                    this.spaceId = spaceId
                    RoomManager.getInstance().addUser(spaceId, this)
                    this.x = Math.floor(Math.random() * space.width)
                    this.y = Math.floor(Math.random() * space.height)

                    //sending data to the user 
                    this.send({
                        type: "space-joined",
                        payload: {
                            spawn: {
                                x: this.x,
                                y: this.y,
                            }
                        },
                        users: RoomManager.getInstance().Rooms.get(spaceId)?.map((e) => ({
                            //jo apna user hai usko chhat kr data bhejna padega
                            id: e.id,
                            x: e.x,
                            y: e.y
                        })) ?? []
                    })

                    //setting data in closecall map
                    RoomManager.getInstance().closeCall.get(this.spaceId!)?.set(this.x, [...(RoomManager.getInstance().closeCall.get(this.spaceId!)?.get(this.x) ?? []), { id: this.id, x: this.x, y: this.y }])
                   
                   //sending data to everyone of user joining
                    RoomManager.getInstance().broadcast({
                        type: "user-join",
                        payload: {
                            userId: this.id,
                            x: this.x,
                            y: this.y
                        }
                    }, this, this.spaceId!)
                    break;
                case "move":
                    let moveX = parseInt(parsedMessage.payload.x)
                    let moveY = parseInt(parsedMessage.payload.y)
                    moveX = Math.pow(moveX - this.x, 2)
                    moveY = Math.pow(moveY - this.y, 2)

                    const roomManager = RoomManager.getInstance()

                    //removing old data
                    if ((moveX == 0 && moveY == 1) || (moveX == 1 && moveY == 0)) {
                        const data = roomManager.closeCall.get(this.spaceId!)?.get((this.x))
                        if (data) {
                            for (let index = 0; index < data.length; index++) {
                                const element = data[index];
                                if (this.id === element.id) {
                                    data.splice(index, 1)
                                    break;
                                }
                            }
                        }

                        //setting up new data
                        this.x = parsedMessage.payload.x
                        this.y = parsedMessage.payload.y
                        roomManager.closeCall.get(this.spaceId!)?.set(this.x, [...(roomManager.closeCall.get(this.spaceId!)?.get(this.x) ?? []), { id: this.id, x: this.x, y: this.y }])

                        //finding closer data
                        const closerData: string[] = []
                        for (let i = -1; i < 2; i++) {
                            const someoneThere = roomManager.closeCall.get(this.spaceId!)?.get((this.x + i))
                            if (someoneThere) {
                                for (let j = 0; j < someoneThere.length; j++) {
                                    const e = someoneThere[j]
                                    if (this.id !== e.id) {
                                        if (this.y == e.y || this.y == e.y + 1 || this.y == e.y - 1) {
                                            closerData.push(e.id)
                                        }
                                    }
                                    else {
                                        someoneThere.splice(j, 1)
                                        j--

                                    }
                                }
                            }

                        }
                        this.send({
                            type: "closer",
                            payload: {
                                data : closerData   
                            }
                        })
                        //sending movement data to every other member
                        RoomManager.getInstance().broadcast({
                            type: "movement",
                            payload: {
                                x: this.x,
                                y: this.y,
                                userId: this.id
                            }
                        }, this, this.spaceId!)
                        return
                    } 
                    //sending rejection data to user
                    else {
                        this.send({
                            type: "movement-rejected",
                            payload: {
                                x: this.x,
                                y: this.y
                            }
                        })
                    }


                    break;
                default:
                    break;
            }
        })
    }

    //sending user left signal
    destroy() {
        RoomManager.getInstance().broadcast({
            type: "user-left",
            payload: {
                userId: this.id
            }
        }, this, this.spaceId!)
        RoomManager.getInstance().removeUser(this, this.spaceId!)
    }
}