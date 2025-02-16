import Phaser from "phaser"
import Elementslist from "../elementslist";

interface element {
  width: number,
  height: number,
  x: number,
  y: number
}

export class MapManager extends Phaser.Scene {

  static instance: MapManager | null = null;
  private selectedelements: string | null = null;
  private staticElement: boolean = false
  private ghostelements!: Phaser.GameObjects.Image | null
  protected static createthis: Phaser.Scene
  public mapElement: element[] = []




  constructor() {
    super({ key: "MapManager" })
    MapManager.instance = this
  }

  public checkoutbound(x, y, width = 32, height = 32, mapwidth = 800, mapheight = 600) {

    let x1 = x - (width / 2); let y1 = y + (height / 2)
    let x2 = x + (width / 2); let y2 = y - (height / 2)

    if (x1 > mapwidth || x1 < 0 || x2 > mapwidth || x2 < 0 || y1 > mapheight || y1 < 0 || y2 > mapheight || y2 < 0) {
      return false
    }

    return true
  }

  public checkOverlap(x, y, width = 32, height = 32) {
    if (this.mapElement == null) return true

    let x1 = x - width / 2;
    let y1 = y + height / 2;
    let x2 = x + width / 2;
    let y2 = y - height / 2;
    for (const e of this.mapElement) {
      let x3 = e.x - e.width / 2;
      let y3 = e.y + e.height / 2;
      let x4 = e.x + e.width / 2;
      let y4 = e.y - e.height / 2;

      if (
        x1 < x4 && x2 > x3 && y1 > y4 && y2 < y3
      ) {

        return false;
      }

    }
    return true

  }

  public static getInstance(): MapManager {
    if (!this.instance) {
      this.instance = new MapManager()
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
    this.staticElement = staticElement

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
    Elementslist.map((c) => (
      this.load.image(c.key, c.sprite)
    ))
  }

  create() {


    const map = this.make.tilemap({ width: 50, height: 50, tileWidth: 16, tileHeight: 16 });
    const tileset = map.addTilesetImage('grass', null!, 16, 16);
    const layer = map.createBlankLayer('Ground', tileset!);
    layer?.fill(0);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
   


    this.input.on("pointermove", (pointer: any) => {


      if (this.ghostelements) {


        this.ghostelements?.setPosition(pointer.worldX, pointer.worldY)
      }
    })


    this.input.on("pointerdown", (pointer: any) => {



      if (this.getSelectedElements()) {
        let x = pointer.worldX
        let y = pointer.worldY


        if (this.checkoutbound(x, y)) {
          //this.staticelement me width height only for map manager ke liye
          if (this.checkOverlap(x, y)) {
            if (this.staticElement) {


              this.add.image(x, y, this.getSelectedElements())
              // const data = {
              // elementId : this.getSelectedElements(),
              // spaceId : "random",
              // x ,
              // y
              // }
              // console.log(data);
              const data = {
                width: 32,
                height: 32,
                x,
                y
              }
              this.mapElement.push(data)
              console.log(this.mapElement);

            }
          }
        }

      }
    })






  }

  update() {
    
  }





}