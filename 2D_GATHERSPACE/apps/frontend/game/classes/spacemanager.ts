import Phaser from "phaser"
import { ElementSpriteManger } from "./elementspritemanager";
import { PlayerSpriteManger } from "./playerspritemanager";
import { UserDataManger } from "./userdatamanager";
import { WebSocketManager } from "./websocketmanager";



export class SpaceManager extends Phaser.Scene {

    static instance: SpaceManager | null = null;
    private selectedelements: string | null = null;
    private staticElement: boolean = false
    private ghostelements!: Phaser.GameObjects.Image | null
    protected static createthis: Phaser.Scene
    public cursors : any
    public playersprite : any
    public moving : boolean = false

    constructor() {
        super({ key: "SpaceManager" })
        SpaceManager.instance = this 
        UserDataManger.getInstance()
        PlayerSpriteManger.getInstance()
    }

    public static getInstance(): SpaceManager {
        if (!this.instance) {
            this.instance = new SpaceManager()
        }
        return this.instance
    }

    public clearSelectedElements = (): void => {
        this.selectedelements = null;


    };

    public clearGhostElements = (): void => {
        this.ghostelements?.destroy()
        this.ghostelements = null;

    };

    public getGhostElements = (): Phaser.GameObjects.Image | null => {
        return this.ghostelements;
    };

    public setSelectedElements = (elements: string, staticElement: boolean): void => {
        this.selectedelements = elements;
        console.log(staticElement);

        this.staticElement = staticElement
        console.log(this.staticElement);

        if (this.ghostelements) {
            this.clearGhostElements()
        }
        if (!this.ghostelements) {
            this.ghostelements = this.add?.image(0, 0, elements).setAlpha(0.5)
            // this.ghostelements = mapManager.getInstance()?.createthis?.add.image(0, 0, elements).setAlpha(0.5)


        }
    };

    public getSelectedElements = (): string | any => {
        return this.selectedelements;
    };

    preload() {
       ElementSpriteManger.getInstance().elementList.map((e) => (
            this.load.image(e.element.id, e.element.imageUrl)
        ))
    }

    create() {
const width = Math.abs(ElementSpriteManger.getInstance().dimensionX/16)+1
const height = Math.abs(ElementSpriteManger.getInstance().dimensionY/16)+1
        const map = this.make.tilemap({ width, height, tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('grass', null!, 16, 16);
        const layer = map.createBlankLayer('Ground', tileset!);
        layer?.fill(0);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        const cursors = this.input.keyboard?.createCursorKeys();
    this.cursors = cursors
        //example
        this.add.image(400, 300, "apple")

        //mapping elements
        ElementSpriteManger.getInstance().elementList.map((e)=>{
        let element = this.physics.add.staticImage(e.x , e.y ,e.element.id)
        
        ElementSpriteManger.getInstance().setelementSprite(e.id,element)
    })



        this.input.on("pointermove", (pointer: any) => {


            if (SpaceManager.getInstance().ghostelements) {


                SpaceManager.getInstance().ghostelements?.setPosition(pointer.worldX, pointer.worldY)
            }
        })


        this.input.on("pointerdown", (pointer: any) => {
            if (SpaceManager.getInstance().getSelectedElements()) {
                let x = pointer.worldX
                let y = pointer.worldY

                if (SpaceManager.getInstance().staticElement) {
                    this.add.image(x, y, SpaceManager.getInstance().getSelectedElements())
                    const data = {
                        elementId: SpaceManager.getInstance().getSelectedElements(),
                        spaceId: "random",
                        x,
                        y
                    }
                    console.log(data);
                }
                else {
                    this.add.image(x, y, SpaceManager.getInstance().getSelectedElements())
                    const data = {
                        elemntId: SpaceManager.getInstance().getSelectedElements(),
                        spaceId: "random",
                        x,
                        y
                    }
                }
               
            }
        })
    }

    update() {
        if (this.playersprite) {
            let moved = false
            if (this.cursors.left.isDown)
              {
                this.playersprite.setVelocityY(0);
                  this.playersprite.setVelocityX(-50);
              
                  moved = true
              }
              else if (this.cursors.right.isDown)
              {
                this.playersprite.setVelocityY(0);
                  this.playersprite.setVelocityX(50);
                  moved = true
              }
              else if(this.cursors.up.isDown)
              {
                this.playersprite.setVelocityX(0);
                  this.playersprite.setVelocityY(-50);
                  moved = true
              }else if(this.cursors.down.isDown){
        
                this.playersprite.setVelocityX(0);
                this.playersprite.setVelocityY(50);
                moved = true
              }else{
                this.playersprite.setVelocity(0)
              }
              
             
              if (!moved && this.moving) {
                // Only update the position when the player stops moving
                console.log("ho");
                const payload = {
                    type: "move",
                    payload: {
                        x: this.playersprite.x,
                         y: this.playersprite.y
                    }
                }
                
                WebSocketManager.getInstance()?.send(payload)
                console.log(
                { x: this.playersprite.x, y: this.playersprite.y })
                
            }
        
        this.moving = moved
        }
    }
}