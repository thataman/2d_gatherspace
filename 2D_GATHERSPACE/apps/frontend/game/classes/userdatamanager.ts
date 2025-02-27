export class UserDataManger {

    private static instance: UserDataManger
    private playerSprite: Phaser.GameObjects.Image
    public spawnX: number
    public spawnY: number


    private constructor() {

    }

    public static getInstance(): UserDataManger {
        if (!this.instance) {
            this.instance = new UserDataManger()
        }
        return this.instance
    }

    public getPlayerSprite() {
        return this.playerSprite
    }

    public setPlayerSprite(gameSprite: Phaser.GameObjects.Image) {
        this.playerSprite = gameSprite
    }

}
