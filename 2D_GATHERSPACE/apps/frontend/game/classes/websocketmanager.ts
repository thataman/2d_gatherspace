import { SpaceManager } from "./spacemanager"
import { PlayerSpriteManger } from "./playerspritemanager"
import { UserDataManger } from "./userdatamanager"
import { ElementSpriteManger } from "./elementspritemanager"

export class WebSocketManager {


    private static instance: WebSocketManager
    static spaceId: string
    static token: string
    private roomdata: string[] | null = null

    private constructor(public wsSession: any) {

        this.inithandlers()
    }

    inithandlers() {
        this.wsSession.onmessage = (event) => {
            const message = event.data
            const decodedMessage = JSON.parse(message)
            switch (decodedMessage.type) {
                case "connected":
                    const payload = {
                        type: "join",
                        payload: {
                            spaceId: WebSocketManager.spaceId,
                            token: WebSocketManager.token
                        }
                    }

                    this.send(JSON.stringify(payload))

                    break;

                case "space-joined":
                    UserDataManger.getInstance().spawnX = decodedMessage.payload.spawn.x
                    UserDataManger.getInstance().spawnY = decodedMessage.payload.spawn.y
                    //also need to send id or avatar for player
                    const playersprite = SpaceManager.getInstance().physics.add.sprite(decodedMessage.payload.spawn.x, decodedMessage.payload.spawn.y, "player1")
                    playersprite.setCollideWorldBounds(true)
                    UserDataManger.getInstance().setPlayerSprite(playersprite)
                    SpaceManager.getInstance().playersprite.set(playersprite)
                    ElementSpriteManger.getInstance().getallelementSprite().forEach((value, key) => {
                        SpaceManager.getInstance().physics.add.collider(playersprite, value)
                    })

                    decodedMessage.payload.users.map((e) => {
                        const otherPlayerSprite = SpaceManager.getInstance().physics.add.sprite(e.x, e.y, "player")
                        PlayerSpriteManger.getInstance().setPlayerSprite(e.id, otherPlayerSprite)
                        SpaceManager.getInstance().physics.add.collider(playersprite, otherPlayerSprite)
                    })
                    break;

                case "movement-rejected":
                    const x = decodedMessage.payload.x
                    const y = decodedMessage.payload.y
                    UserDataManger.getInstance().getPlayerSprite().setPosition(x, y)
                    break;


                case "closer":
                    const data = decodedMessage.payload.data
                    //establish webrtc connection
                    let newids
                    if (this.roomdata?.length! > 0) {
                        let newset = new Set(data)
                        let oldset = new Set(this.roomdata)
                        newids = data.filter(item => !oldset.has(item))// inme new connection establish hopga 
                        const removedids = this.roomdata?.filter(item => !newset.has(item))//settimeout lagega aaenge 5 sec me to think hai wrna ni 
                        oldset.clear();
                        newset.clear();
                       
                    } else {
                        newids = data
                
                    }

                    this.roomdata = data
                    // call with delay ( )function 
                    //if more than 5 sec they stay far disconnect and also if user is single destroy its connection
                    break;


                case "movement":
                    const x1 = decodedMessage.payload.x
                    const y1 = decodedMessage.payload.y
                    const id = decodedMessage.payload.userId
                    const smoothnessFactor = 0.1
                    const thresholdLimit = 0.5

                    const playerPosition = PlayerSpriteManger.getInstance().getPlayerSprite(id)
                    const deltaX = x1 - playerPosition.x
                    const deltaY = y1 - playerPosition.y
                    while (Math.abs(deltaX) > thresholdLimit && Math.abs(deltaY) > thresholdLimit) {
                        playerPosition.x += deltaX * smoothnessFactor
                        playerPosition.y += deltaY * smoothnessFactor
                    }
                    playerPosition.x = x1
                    playerPosition.y = y1

                    break;

                case "user-left":
                    const id1 = decodedMessage.payload.userId
                    const allPLayerData = PlayerSpriteManger.getInstance().getAllPlayerSprite()
                    if (allPLayerData.has(id1)) {
                        const leftUserSprite = allPLayerData.get(id1)
                        leftUserSprite?.destroy()
                        allPLayerData.delete(id1)
                    }
                    break;

                case "user-join":
                    const x2 = decodedMessage.payload.x
                    const y2 = decodedMessage.payload.y
                    const id2 = decodedMessage.payload.userId
                    //need to set player eleent too
                    const otherPlayerSpriteAfterJoin = SpaceManager.getInstance().add.sprite(x2, y2, "player1")
                    SpaceManager.getInstance().physics.add.collider(UserDataManger.getInstance().getPlayerSprite(), otherPlayerSpriteAfterJoin)
                    PlayerSpriteManger.getInstance().setPlayerSprite(id2, otherPlayerSpriteAfterJoin)
                    break;

                default:
                    break;
            }
        }
    }

    send(message: any) {
        if (this.wsSession && this.wsSession.readyState === WebSocket.OPEN) {
            this.wsSession.send(message)
        }
    }

    destroy() {
        if (this.wsSession) {
            this.wsSession.close()
        }
    }

    public static initialize(wsSession: any) {
        if (!this.instance) {
            this.instance = new WebSocketManager(wsSession)
        } else {
            console.warn("already initialised");

        }

    }

    public static getInstance() {
        if (this.instance) {
            return this.instance
        } else {
            console.warn("websocket instance is not present")
        }

    }

}