let config = {
    type: Phaser.AUTO, // webgl or canvas
    width: 1280,
    height: 720,
    rows: 2,
    cols: 5,
    timeout:30,
    cards:[1,2,3,4,5],
    scene: new GameScene(),
    // levels: {
    //     first: {
    //         rows: 2,
    //         cols: 3,
    //         cards: [1, 2, 3, ],
    //     },
    //     second: {
    //         rows: 2,
    //         cols: 4,
    //         cards: [1, 2, 3, 4, ],
    //     }
    //     }
    // scene:scene
};
// let scene = new Phaser.Scene("Game");
let game = new Phaser.Game(config);