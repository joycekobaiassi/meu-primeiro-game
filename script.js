let gameStarted = false;
let gameOver = false;
let onGround = false;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 300;

// imagens
const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

// jogador
let player = {
  x: 10,
  y: 200,
  width: 32,
  height: 32,
  dy: 0,
  dx: 0
};

// plataformas
let platform = { x: 200, y: 200, width: 100, height: 10 };
let platform2 = { x: 350, y: 150, width: 100, height: 10 };

// inimigo
let enemy = {
  x: 400,
  y: 250,
  width: 24,
  height: 24,
  dx: 2
};

// bônus 🍄
let bonus = {
  x: 280,
  y: 170,
  size: 15,
  active: true
};

const gravity = 0.6;
let score = 0;

function draw() {

if (gameOver) {
  ctx.fillStyle="rgba(0,0,0,0.6)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="white";
  ctx.font="30px Arial";
  ctx.textAlign="center";
  ctx.fillText("GAME OVER",300,130);
  ctx.font="16px Arial";
  ctx.fillText("Pressione R",300,170);
  requestAnimationFrame(draw);
  return;
}

if(!gameStarted){
  ctx.clearRect(0,0,600,300);
  ctx.font="26px Arial";
  ctx.textAlign="center";
  ctx.fillText("MEU PRIMEIRO JOGO",300,120);
  ctx.font="16px Arial";
  ctx.fillText("APERTE ⬆️",300,160);
  requestAnimationFrame(draw);
  return;
}

ctx.clearRect(0,0,600,300);

// jogador
player.dy+=gravity;
player.y+=player.dy;
player.x+=player.dx;

if(player.y>270){
  player.y=270;
  player.dy=0;
  onGround=true;
}

// inimigo
enemy.x+=enemy.dx;
if(enemy.x<0||enemy.x+enemy.width>600) enemy.dx*=-1;

// draw
ctx.drawImage(playerImg,player.x,player.y,player.width,player.height);
ctx.drawImage(enemyImg,enemy.x,enemy.y,enemy.width,enemy.height);

// plataformas
ctx.fillStyle="green";
ctx.fillRect(platform.x,platform.y,platform.width,platform.height);
ctx.fillRect(platform2.x,platform2.y,platform2.width,platform2.height);

// colisão plataformas
[platform,platform2].forEach(p=>{
if(player.x<p.x+p.width&&player.x+player.width>p.x&&player.y+player.height>p.y&&player.y+player.height<p.y+10){
player.y=p.y-player.height;
player.dy=0;
onGround=true;
}
});

// bônus
if(bonus.active){
ctx.fillStyle="yellow";
ctx.fillRect(bonus.x,bonus.y,bonus.size,bonus.size);
}

if(bonus.active &&
player.x<bonus.x+bonus.size &&
player.x+player.width>bonus.x &&
player.y<bonus.y+bonus.size &&
player.y+player.height>bonus.y){
bonus.active=false;
player.width=48;
player.height=48;
}

// colisão inimigo estilo mario
if(player.x<enemy.x+enemy.width&&player.x+player.width>enemy.x&&player.y<enemy.y+enemy.height&&player.y+player.height>enemy.y){

if(player.dy>0 && player.y+player.height-enemy.y<15){
enemy.x=-100;
player.dy=-8;
}else{
gameOver=true;
}
}

requestAnimationFrame(draw);
}

// teclado PC
document.addEventListener("keydown",e=>{
if(e.code==="Space"){
if(!gameStarted){gameStarted=true;onGround=true;return;}
if(onGround){player.dy=-12;onGround=false;}
}
if(e.code==="ArrowLeft")player.dx=-3;
if(e.code==="ArrowRight")player.dx=3;
if(e.code==="KeyR"&&gameOver)location.reload();
});

// mobile
left.ontouchstart=()=>player.dx=-3;
right.ontouchstart=()=>player.dx=3;

jump.ontouchstart=()=>{
if(!gameStarted){gameStarted=true;onGround=true;return;}
if(onGround){player.dy=-12;onGround=false;}
};

draw();
