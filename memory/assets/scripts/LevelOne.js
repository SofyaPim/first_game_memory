class LevelOne extends GameScene{
    constructor(){
        super('LevelOne');
    }
    config = {
        type: Phaser.AUTO, // webgl or canvas
        width: 1280,
        height: 720,
        rows: 2,
        cols: 2,
        timeout:15,
        cards:[1,2],
        scene: new GameScene()
    };
    
}