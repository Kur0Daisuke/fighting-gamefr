import Load from "./js/imageLoader.js";
import InputManager from "./js/InputManager.js";

const canvas = document.getElementById("game");
const ctx    = canvas.getContext("2d");

console.log("Game is Loading, hold up!")
const data = await Load();

const fps = 1/60;
const Gravity = 1/3;

const ratio = (img) => {
    let hRatio = canvas.width / img.width    ;
    let vRatio = canvas.height / img.height  ;
    let ratio  = Math.min ( hRatio, vRatio );
    return ratio;
}

function PlayerSprite(player, sw, sh, w, h, hitbox, drawHitBox) {
    this.CurrentAnimation = "Idle";
    this.CurrentFrame = 0;
    this.sprites = data[player];
    this.time = 0;
    this.spriteWidth = sw;
    this.spriteHeight = sh;
    this.attacking = false;
    this.width = w;
    this.height = h;

    this.Animate = (position) => {
        if(this.attacking) this.CurrentAnimation = "Attack1";
        this.time += fps;
        
        if(player == "dummy")console.log(this.CurrentFrame >= this.sprites[this.CurrentAnimation].totalFrames-1)
        if(this.CurrentFrame >= this.sprites[this.CurrentAnimation].totalFrames-1 && this.attacking) {
            this.attacking = false;
            this.CurrentFrame = 0;
        }
        if(this.CurrentFrame >= this.sprites[this.CurrentAnimation].totalFrames-1) this.CurrentFrame = 0;

        ctx.drawImage(
            this.sprites[this.CurrentAnimation].src, 
            this.CurrentFrame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            position.x - (this.spriteWidth/2), position.y - (this.spriteHeight/2),
            this.width, this.height
        )
        if(drawHitBox) ctx.fillRect(position.x - (this.spriteWidth/2), position.y - (this.spriteHeight/2), hitbox.width, hitbox.height)
        if(this.time < this.sprites[this.CurrentAnimation].speed) return;

        this.CurrentFrame++;
        this.time = 0;
    }

    this.ChangeSprite = (sprite) => {
        if(!this.attacking) this.CurrentAnimation = sprite;
    }
}

function Player({
    position,
    player,
    scripts = [],
    spriteWidth=200,
    spriteHeight=200,
    width=200,
    height=200,
    playerHitBox = {
        width: 200, 
        height: 200
    },
    drawHitBox = false
}){
    this.position = position;
    this.velocity = {
        x: 0,
        y: 0,
    }
    this.player = player;
    this.sprite = new PlayerSprite(player, spriteWidth, spriteHeight, width, height, playerHitBox, drawHitBox);
    this.heightLimit = canvas.height-(canvas.height/3.08);
    this.speed = 2;
    this.scripts = scripts;
    this.playerHitBox = playerHitBox;

    this.IsOnGround = () => this.position.y > this.heightLimit

    this.OnLoad = (() => {
        for (let i = 0; i < this.scripts.length; i++) {
            this.scripts[i].parent = {
                position: this.position,
                velocity: this.velocity,
                sprite: this.sprite,
                player,
                speed: this.speed,
                methods: {
                    IsOnGround: this.IsOnGround
                }
            };
        }
    })()

    this.Update = () => {
        for (let i = 0; i < this.scripts.length; i++) {
            this.scripts[i]?.Update();
        }

        this.position.y += this.velocity.y;
        this.velocity.y += Gravity;

        if(this.IsOnGround()) {
            this.velocity.y = 0;
        }
    }
    this.Init = () => {
        this.Update();
        this.Draw()
    }
    this.Draw = () => this.sprite.Animate(this.position);
}

function Object({
    position,
    sprite,
    tile = [{x: 0, y: 0}]
}){
    this.position = position;
    this.tile = tile;
    this.width = sprite.src.width*ratio(sprite.src);
    this.height = sprite.src.height*ratio(sprite.src);
    this.Draw = () => {
        for (let i = 0; i < this.tile.length; i++) {
            ctx.drawImage(sprite.src,
                0, 0, 
                sprite.src.width, sprite.src.height, 
                position.x + (this.tile[i].x * this.width), position.y, 
                this.width, this.height)
        }
    }
}

function Movement() {
    this.Update = () => {
        if(this.parent.player == "player1") {
            if(InputManager.GetKey(" ") && !this.parent.sprite.attacking) {
                this.parent.sprite.attacking = true;
                this.parent.sprite.CurrentFrame = 0;
            }

            if(this.parent.velocity.y > 0) {
                this.parent.sprite.ChangeSprite("Fall")
                if(!this.parent.sprite.attacking) this.parent.sprite.CurrentFrame = 0;
            }else if(InputManager.AxisX != 0) {
                this.parent.sprite.ChangeSprite("Run");
            }else this.parent.sprite.ChangeSprite("Idle");
            
            if(this.parent.methods.IsOnGround()) {
                if(InputManager.GetKey("w")){
                    this.parent.velocity.y = -5;
                }
            }

            this.parent.position.x += InputManager.AxisX * this.parent.speed;
        }
    }
}

const bg = new Object({
    position: { x: 0, y: 0},
    sprite: { w: canvas.clientWidth, h: canvas.clientHeight, src: data["background"].src },
    tile: [{x: 0, y: 0}, {x: 1, y: 0}]
})

const Player1 = new Player({
    position: {
        x : 150,
        y : 50,
    },
    player: "player1",
    scripts: [new Movement()],
    drawHitBox: true
})

const dummy = new Player({
    position: {
        x : 150,
        y : 50,
    },
    player: "dummy",
    spriteWidth: 32,
    spriteHeight: 32,
    width: 32,
    height: 32,
    playerHitBox: {
        width: 32,
        height: 32
    }
})

function Init() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    ctx.imageSmoothingEnabled = false;
    InputManager.update()
    bg.Draw()
    Player1.Init()
    dummy.Init()
    requestAnimationFrame(Init)
}
Init()

console.log(data, Player1, dummy)