export class PlayerSpriteManger {

  private static instance: PlayerSpriteManger
  private playerSprite: Map<string, Phaser.GameObjects.Image> = new Map()

  public static getInstance(): PlayerSpriteManger {
    if (!this.instance) {
      this.instance = new PlayerSpriteManger()
    }
    return this.instance
  }

  public getPlayerSprite(key: string) {
    return this.playerSprite[key]
  }

  public getAllPlayerSprite() {
    return this.playerSprite
  }

  public setPlayerSprite(key: string, gameSprite: Phaser.GameObjects.Image) {
    this.playerSprite[key] = gameSprite
  }

}
