// 캔버스틀을 이용해서 객체 만들기
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 플레이어 등장 좌표와 폭과 높이
var player = new Image();
player.src = 'Player.png'
var dino = {
    x: 10,
    y: 200,
    width: 50,
    height: 50,
    
    draw() {
        //ctx.fillStyle = 'green';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(player, this.x, this.y)
    },
    jump(){
        this.y -= 5;
    },
    fall(){
        this.y += 5;
    },
}


var background = new Image();
background.src = 'Sky.png';

const bg1={
    x:0,
    y:0,
    width:100,
    height:100,
    draw(){
        ctx.drawImage(background, this.x,this.y,this.width,this.height);
    }
}
const bg2={
    x:100,
    y:0,
    width:100,
    height:100,
    draw(){
        ctx.drawImage(background, this.x,this.y,this.width,this.height);
    }
}
function drawBackground(){
    bg1.draw();
    bg2.draw();
}
background.onload = function(){
    updateframe();
}
// var cactus1 = new Image();
// cactus1.src = 'Cactus B.png'
// class Cactus {
//     constructor() {
//         this.x = 500;
//         this.y = 200;
//         this.width = 50;
//         this.height = 50;
//     }
//     draw() {
//         //ctx.fillStyle = 'red';
//         //ctx.fillRect(this.x, this.y, this.width, this.height);
//         ctx.drawImage(cactus1, this.x, this.y)
//     }
// }
// 장애물 종류 정의
const cactusImages = ['Cactus A.png', 'Cactus B.png', 'Cactus C.png'];

// 클래스 정의
class Cactus {
    constructor() {
        this.x = canvas.width; // 시작 위치
        this.y = 200; // 고정된 y 좌표
        this.width = 50; // 폭
        this.height = 50; // 높이
        // 무작위로 장애물 이미지 선택
        this.image = new Image();
        this.image.src = cactusImages[Math.floor(Math.random() * cactusImages.length)];
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y);
    }
}

var timer = 0;
var cactusspawner = [];
var jumpTimer = 0;
var animation; 

function updateframe(){  
    if(timer%1==0){
        bg1.x--;
        bg2.x--;
        if(bg1.x<=-100){
            bg1.x=0;
            bg2.x=100;
        }
    }  
    drawBackground();
    // 1초에 60번 코드 실행
    animation = requestAnimationFrame(updateframe)
    timer++;

    ctx.clearRect(0,0, canvas.width, canvas.height)
    // 120프레임마다 장애물을 생성,array에 보관 됨
    if(timer % 100 === 0){
        // var cactus = new Cactus();
        // cactusspwaner.push(cactus);
         // 랜덤한 간격으로 장애물을 생성
    if (Math.floor(Math.random()) < 3) { // 예: 5%의 확률로 생성
        var cactus = new Cactus();
        cactusspawner.push(cactus);                
    }
   
    }
    // 장애물 여러개 관리하기
    cactusspawner.forEach((a, i, o)=>{
        // x좌표가 0미만이면 제거
        if(a.x < 0){
            o.splice(i, 1)
        }
        a.x-= 3; // 장애물 속도

        collision1(dino,a); // 충돌체크(플레이어와 모든장애물)

        a.draw(); // array에 있던것은 다 draw() 됨
    })

    if(isJump == true){
        dino.jump();
        jumpTimer+=2;
    }
    if(isJump == false){
        if(dino.y < 200){
            dino.fall();
        }        
    }
    if(jumpTimer > 100){
        isJump = false;
        jumpTimer = 0
    }
    dino.draw(); 
}
updateframe();

// 충돌확인
function collision1(dino, cactus){
    var gapX = cactus.x - (dino.x + dino.width);
    var gapY = cactus.y - (dino.y + dino.height);

    if(gapX < 0 && gapY < 0){
        ctx.clearRect(0,0,canvas.width, canvas.height)
        cancelAnimationFrame(animation)
    }
}

var lastSpacePressTime = 0;
var isJump = false;
document.addEventListener('keydown', function(e){    
    if(e.code === 'Space'){
        const currentTime = Date.now();
        const timeSineceLastPress = currentTime - lastSpacePressTime;
        if(timeSineceLastPress > 500){
            isJump = true;
            lastSpacePressTime = currentTime;
        }        
    }
})

var score = 0;
var scoreInterval;

function updateScore(){
    score += 1;
    document.querySelector('.socre span').textContent = score;
}

function frameRun(){
    if(timer % 10 === 0){
        updateScore();
    }
}

scoreInterval = setInterval(updateScore, 2000)

const replayBtn = document.querySelector('.replay');
replayBtn.addEventListener('click', () => {
    resetGame();
})

function resetGame(){
    cancelAnimationFrame(animation);
    clearInterval(scoreInterval);
    score = 0;
    document.querySelector('.score span').textContent = score;
    cactusspawner = [];
    isJump = false;
    lastSpacePressTime = 0;

    updateframe();

    
}