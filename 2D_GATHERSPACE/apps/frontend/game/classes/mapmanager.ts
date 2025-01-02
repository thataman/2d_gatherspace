import Phaser from "phaser"
import Elementslist from "../elementslist";


export class mapManager extends Phaser.Scene {

  static instance: any;
  selectedelements: any | null
  ghostelements: any | null
  static createthis: any | null

  constructor() {
    super({ key: "mapManager" })
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new mapManager()
    }
    return this.instance
  }

  public clearSelectedElements = (elements: any) => {
    this.selectedelements = elements;


  };

  public clearGhostElements = (elements: any) => {
    this.ghostelements = elements;

  };


  public getGhostElements = () => {
    return this.ghostelements;
  };

  public setSelectedElements = (elements: any) => {
    this.selectedelements = elements;
    if (this.ghostelements) {
      this.ghostelements.destroy()
      this.ghostelements = null
    }
    if (!this.ghostelements) {
      this.ghostelements = mapManager.getInstance().createthis.add.image(0, 0, elements).setAlpha(0.5)


    }
  };


  public getSelectedElements = () => {
    return this.selectedelements;
  };

  preload() {
    Elementslist.map((c) => (
      this.load.image(c.key, c.sprite)
    ))
  }

  create() {

    mapManager.getInstance().createthis = this
    const map = this.make.tilemap({ width: 50, height: 50, tileWidth: 16, tileHeight: 16 });

    // Add a tileset
    const tileset = map.addTilesetImage('grass', null!, 16, 16);

    // Create a layer
    const layer = map.createBlankLayer('Ground', tileset!);

    // Fill the layer with a default tile
    layer?.fill(0);

    // Optional: Set camera bounds to match the map size
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.add.image(400, 300, "apple")



    this.input.on("pointermove", (pointer: any) => {
    

      if (mapManager.getInstance().ghostelements) {
        console.log("ghostelemen made");

        mapManager.getInstance().ghostelements.setPosition(pointer.worldX, pointer.worldY)
      }
    })


    this.input.on("pointerdown", (pointer: any) => {



      if (mapManager.getInstance().getSelectedElements()) {
        let x = pointer.worldX
        let y = pointer.worldY


        this.add.image(x, y, mapManager.getInstance().getSelectedElements())
        console.log("element placed");

        if (mapManager.getInstance().ghostelements) {
          console.log("destroying ghostelements");

          mapManager.getInstance().ghostelements.destroy()
          mapManager.getInstance().ghostelements = null
        }


        mapManager.getInstance().clearSelectedElements(null)



      }
    })






  }

  upload() {

  }





}