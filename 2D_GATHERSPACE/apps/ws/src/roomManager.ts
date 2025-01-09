import { outgoingMessage } from "./types"
import { User } from "./User"


export class RoomManager {
    Rooms: Map<string, User[]> = new Map()

    static instance: RoomManager

    constructor() {
        this.Rooms = new Map()
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager()
        }
        return this.instance
    }

    public addUser(spaceId: string, user: User) {
        if (!this.Rooms.has(spaceId)) {
            this.Rooms.set(spaceId, [user])
            return
        }

        this.Rooms.set(spaceId, [...(this.Rooms.get(spaceId) ?? []), user])
    }

    public broadcast(message : outgoingMessage,user:User ,roomId:string){
if (this.Rooms.has(roomId)) {
    return
}

this.Rooms.get(roomId)?.forEach((e)=>{
    if(e.id !== user.id){
        e.send(message)
    }
})
    }

    public removeUser(user : User, spaceId:string){
if(this.Rooms.has(spaceId)){
    return
}
this.Rooms.set(spaceId,this.Rooms.get(spaceId)?.filter((u)=>u.id!== user.id) ?? [])
    }
}