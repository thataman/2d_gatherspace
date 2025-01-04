interface element {
  id: string,
  imageUrl: string,
  static: boolean,
  height: number,
  width: number
}
interface spaceElement {
  id: string,
  element: element,
  x: number,
  y : number

}

export class ElementSpriteManger {

private static instance : ElementSpriteManger
private elementSprite :Map<string,Phaser.GameObjects.Image> = new Map()
public elementList : spaceElement[]


public static getInstance() :ElementSpriteManger {
    if (!this.instance) {
      this.instance = new ElementSpriteManger()
    }
    return this.instance
  }

  public getallelementSprite(){
    return this.elementSprite
     }

 public getelementSprite(key :string){
return this.elementSprite[key]
 }


 public setelementSprite(key :string ,gameSprite : Phaser.GameObjects.Image){
    this.elementSprite[key] = gameSprite
     }

  }
