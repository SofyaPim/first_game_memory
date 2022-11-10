class Card extends Phaser.GameObjects.Sprite{
    constructor(scene, value, position) {
        super(scene, 0, 0,'card');//positionX, positionY
        this.scene = scene;
        this.value = value;
        this.scene.add.existing(this);
        this.setInteractive();// установка флага интерактивности для обработки событий
        this.opened = false;//устанавливаем св-во открытой карты false изначально
        
        //console.log(this.opened)
        // this.on('pointerdown', () => {
        //     console.log(this.value, 'cliked')
        // })
       
    }
    init(position){// инициализируем карты 
        this.position = position; // устанавливаем св-во карты - позиция
        this.close();// рубашкой вверх
           
            
       this.setPosition(-this.width, -this.height); // изначальная позиция карт выше и левее верхнего левого угла экрана
    }
    move(params){
      // добавление анимации
        this.scene.tweens.add({
            targets: this,
            x:params.x, //  премещение карты на свою позицию
            y: params.y,
            ease: 'Linear',
            delay: params.delay,
            duration: 300,
            onComplete: () => { //метод твинов
                if(params.callback){ // передаем ф-цию в кач-ве парам-ра
                    params.callback();
                }
            }
        })
        console.log(params); // object c параметрами - х, у и delay
    }
    flip(callback){
        // добавление анимации
          this.scene.tweens.add({//запускаем анимацию
            targets: this,
            scaleX:0,//уменьшаем ширину
            ease: 'Linear',
            duration: 300,
            onComplete: () => {//разворачиваем карту
                this.show(callback); 
            }
        })
    }
    show(callback){
       let texture = this.opened ? 'card' + this.value :'card'; //если флаг открыт, то карта с картинкой, иначе - рубашка
       this.setTexture(texture);//меняем текстуру карты
        this.scene.tweens.add({ //запускаем анимацию
            targets: this,
            scaleX:1,//вернуть карте ширину
            ease: 'Linear',
            duration: 300,
            onComplete: () => {
                if(callback){
                    callback();
                }
            }
            
        })
       
    }
    open(callback){

        this.opened = true;//флаг карты
        this.flip(callback);//анимация при открытии
       
        
    }
    close(){
        if(this.opened){ //если карта открыта
            this.opened = false;// флаг карты, устанавливает текстуру закрытой карты
        this.flip(); //запуск анимации при закрытии
        }
        
       
        
    }
}