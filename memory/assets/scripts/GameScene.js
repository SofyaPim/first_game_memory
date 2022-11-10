class GameScene extends Phaser.Scene{
    constructor(){
        super('Game');
    }
    preload() {
        console.log(this);
        // 1. загрузить ресурсы
        this.load.image('bg', 'assets/sprites/background.png');
        this.load.image('card', 'assets/sprites/card.png');
        this.load.image('card1', 'assets/sprites/card1.png');
        this.load.image('card2', 'assets/sprites/card2.png');
        this.load.image('card3', 'assets/sprites/card3.png');
        this.load.image('card4', 'assets/sprites/card4.png');
        this.load.image('card5', 'assets/sprites/card5.png');

        this.load.audio('flip', 'assets/sounds/flip.mp3');
        this.load.audio('game', 'assets/sounds/game.mp3');
        this.load.audio('succes', 'assets/sounds/succes.mp3');
        this.load.audio('complete', 'assets/sounds/complete.mp3');
        this.load.audio('timeout', 'assets/sounds/timeout.mp3');
        
    };
    
    create() {
        // 2. создаем объекты на сцене
        this.timeout = config.timeout; // получаем таймер из main.js
        this.createSounds();
        this.createTimer();//создаем траймер
        this.createBackground();
        this.createText();
        this.createCards();
        this.start();
    }
    createSounds(){
        this.sounds = { // объект со звуками
            flip: this.sound.add('flip'), //объект WebAudioSound с методом add
            game: this.sound.add('game'),
            succes: this.sound.add('succes'),
            complete: this.sound.add('complete'),
            timeout: this.sound.add('timeout'),

        }
    }
    onTimerTick(){
        this.timeoutText.setText("Time: " + this.timeout); //текущее значение таймера
        if(this.timeout <= 0){
            this.timer.paused = true;
            this.sounds.timeout.play();
            this.restart();
        }else{
            --this.timeout;
        }
         
    }
    createTimer(){
        this.timer = this.time.addEvent({ // создаем экз класса TimerEvent
            delay:1000,
            callback:this.onTimerTick, // какая ф-ция запущена
            callbackScope:this, // привязываем контекст (this) 
            loop: true // флаг loop - аналог setInterval вызывает callback через кажд секунд
        });
    }
    createText(){
       this.timeoutText =  this.add.text(10, 30, "", {// вводим переменную для изменения параматров текст с координатоми и стилями 
            font:'24px BasculaCollege',
            fill: '#ffffff'
        })
    }
    restart(){
        let count = 0; // замыкаем вызов ф-ции

        let onCardMoveComplete = () => {
            ++count;
            if(count >= this.cards.length){ //все карты использованы можно вызывать
                 this.start(); //запуск игры
            }
        }
        this.cards.forEach( card => {
            card.move({ // запуск анимации move с изменением парам-ов
                x: this.sys.game.config.width + card.width, // рсаположение карт за нижним правым краем экрана
                y: this.sys.game.config.height + card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete  // вызываем метод
            })
           
        })
       
    }
    start(){
        this.initCardsPositions();
        this.timeout = config.timeout; // перезапускаем таймер
         this.openedCard = null;//указываем, что все карты закрыты
        this.openedCardsCount = 0;//инициируем счетчик карт, сброс
        this.timer.paused = false;
        this.initCards();//тасуем и закрываем карты и выводим за экран
        this.showCards(); // выводим карты на экран
        this.sounds.game.play({volume:0.1});
    }
    showCards(){
        this.cards.forEach( card => {
          //  console.log(card.depth);
            card.depth = card.position.delay; // устанавливаем уровень карты ссоотв ее задержки
            card.move({ // запуск анимации move с изменением парам-ов
                x: card.position.x, // карты на своих местах
                y: card.position.y,
                delay: card.position.delay // у кажд карты своя задержка из   initCardsPositions()
            })
           
        })
    }
    initCards(){
        let positions = Phaser.Utils.Array.Shuffle(this.positions); //метод Utils.Array -  shuffle -  перебирает массив 
       //! let positions = this.getCardPositions;
        this.cards.forEach( card => {
            card.init(positions.pop()) //удаляет последний эл-т массива
           
        })

    }
    createBackground(){
         this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    }
    createCards(){
        this.cards = [];
        
    
        for (let value of config.cards) {
            for(let i = 0; i < 2; i++){ //создаем по 2 экз каждой  карты
                this.cards.push(new Card(this, value))//для каждой позиции создем экземпляр класса Card
            }
        }
        this.input.on('gameobjectdown', this.onCardClicked, this);
        // gameobjectdown событие для всех объектов на сцене с флагом - interactive

    }

    onCardClicked(pointer, card){
        if(card.opened){
            return false; //нажатие по открытым картвм не обрабатываются
        }
      //  console.log(pointer); объект, который кликнули
        if(this.openedCard){ //если есть открытая карта
            
            if(this.openedCard.value === card.value){ //если значения карт совпадют
                //запомнить
                this.openedCard = null; //обнуляем св-во и карты остануться открытыми
                ++this.openedCardsCount; // увеличиваем счетчик карт
                this.sounds.succes.play({
                    volume:0.03
                });
            }else{
                //скрыть прошлую если картинки разные
                
                this.openedCard.close();
                this.openedCard = card;//установить в текущую карту, ту на которой произошел клик
                
            }
        }else{
            //записать в св-во открытой карты текущую карту
            this.openedCard = card;
        }
        card.open(() => { //метод карты с анимацией и flip() 
            if(this.openedCardsCount === this.cards.length / 2){ //сравниваем счетчик с количеством пар
            this.sounds.complete.play({volume:0.1});
            setTimeout(() => {
                this.restart(); //возобновляем игру
            }, 500);
            
        }
        });
       this.sounds.flip.play({ volume:0.05});
        
    }
    initCardsPositions() {
        let positions = [];
        let cardTexture = this.textures.get('card').getSourceImage();//берем текстуру карты, textures - cв-во, getSourceImage() - метод
        let cardWidth = cardTexture.width + 4;//cardTexture объект со св-вами - width и  height + добавляем отступ
        let cardHeight = cardTexture.height + 4;
        //расчитываем смещение карт относительно canvas по осям, чтобы они были по центру
        let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2; //240
        //this.sys.game.config.width (1280) вся ширина игры  cardWidth (200) - ширина карты, config.cols(5) - кол-во столбцов
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;
        let id = 0;
       // console.log(this.textures.get('card').getSourceImage().width);//196
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                positions.push({  //устанавливаем позиции карты
                    delay: ++id * 100, // устанавливаем инкремент задержки карты
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                });
            }
        }
        console.log(positions);
    
       this.positions = positions;//Phaser.Utils.Array.Shuffle(this.positions)
    };
    // initCardsPositions() {
    //     let positions = [];
    //     let cardTexture = this.textures.get('card').getSourceImage();//берем текстуру карты, textures - cв-во, getSourceImage() - метод
    //     let cardWidth = cardTexture.width + 4;//cardTexture объект со св-вами - width и  height + добавляем отступ
    //     let cardHeight = cardTexture.height + 4;
    //     //расчитываем смещение карт относительно canvas по осям, чтобы они были по центру
    //     let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2; //240
    //     //this.sys.game.config.width (1280) вся ширина игры  cardWidth (200) - ширина карты, config.cols(5) - кол-во столбцов
    //     let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;
    //     let id = 0;
    //    // console.log(this.textures.get('card').getSourceImage().width);//196
       
    //     for (let row = 0; row < config.levels.first.rows; row++) {
    //         for (let col = 0; col < config.levels.first.cols; col++) {
    //             positions.push({  //устанавливаем позиции карты
    //                 delay: ++id * 100, // устанавливаем инкремент задержки карты
    //                 x: offsetX + col * cardWidth,
    //                 y: offsetY + row * cardHeight,
    //             });
    //         }
    //     }
    //     console.log(positions);
    
    //    this.positions = positions;//Phaser.Utils.Array.Shuffle(this.positions)
    // };
}