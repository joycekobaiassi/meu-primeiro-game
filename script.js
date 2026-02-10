let gameStarted=false;
let gameOver=false;
let win=false;
let onGround=false;
let invincible=false;
let lives=3;
let cameraX=0;
let started=false;

const music=new Audio("music.mp3");
music.loop=true;
music.volume=0.4;

const jumpSound=new Audio("jump.mp3");
const coinSound=new Audio("coin.mp3");

const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

canvas.width=1600;
canvas.height=400;

// imagens
const playerImg=new Image();
playerImg.src="player.png";

const enemyImg=new Image();
enemyImg.src="enemy.png";

const bonusImg=new Image();
bonusImg.src="bonus.png";

// jogador
let player={x:50,y:300,width:32,height:32,dx:0,dy:0,big:false};

// inimigos
let enemies=[];
for(let i=0;i<8;i++){
 enemies.push({
  x:400+Math.random()*1000,
  y:340,
  width:24,
  height:24,
  dx:Math.random()>0.5?2:-2
 });
}

// plataformas
let platforms=[];
let lastY=330;

for(let x=80;x<canvas.width-80;x+=120){
 let y=lastY+(Math.random()*140-70);
 if(y>330)y=330;
 if(y<140)y=140;
 platforms.push({x,y,w:100});
 lastY=y;
}

// bônus
let bonuses=[];
for(let i=0;i<6;i++){
 bonuses.push({
  x:200+Math.random()*(canvas.width-300),
  y:140+Math.random()*150,
  size:24,
  active:true,
  rot:0
 });
}

// bandeira
let flag={x:canvas.width-60,y:180,w:20,h:60,wave:0};

const gravity=0.6;
let score=0;

// START TOUCH / CLICK
function startGame(){
 if(started)return;
 started=true;
 gameStarted=true;
 music.play().catch(()=>{});
}

canvas.addEventListener("touchstart",()=>{
 startGame();
 if(onGround){
  player.dy=-12;
  jumpSound.play().catch(()=>{});
  onGround=false;
 }
});

canvas.addEventListener("mousedown",startGame);

function draw(){

cameraX=player.x-300;
if(cameraX<0)cameraX=0;

// tela inicial
if(!gameStarted){
 ctx.fillStyle="#e6f0ff";
 ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="black";
 ctx.font="24px Arial";
 ctx.textAlign="center";
 ctx.fillText("TOQUE NA TELA PARA COMEÇAR",canvas.width/2,160);
 requestAnimationFrame(draw);
 return;
}

// vitória
if(win){
 ctx.fillStyle="rgba(0,0,0,0.6)";
 ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="white";
 ctx.font="28px Arial";
 ctx.textAlign="center";
 ctx.fillText("VOCÊ VENCEU!",canvas.width/2,160);
 ctx.fillText("TOQUE PARA REINICIAR",canvas.width/2,200);
 return;
}

// game over
if(gameOver){
 ctx.fillStyle="rgba(0,0,0,0.6)";
 ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="white";
 ctx.font="28px Arial";
 ctx.textAlign="center";
 ctx.fillText("GAME OVER",canvas.width/2,160);
 ctx.fillText("TOQUE PARA REINICIAR",canvas.width/2,200);
 return;
}

// fundo
ctx.fillStyle="#e6f0ff";
ctx.fillRect(0,0,canvas.width,canvas.height);

// HUD
ctx.fillStyle="black";
ctx.textAlign="left";
ctx.fillText("PONTOS: "+score,20,40);
ctx.fillText("VIDAS: "+lives,20,60);

// física
player.dy+=gravity;
player.y+=player.dy;

if(player.y>360-player.height){
 player.y=360-player.height;
 player.dy=0;
 onGround=true;
}

// plataformas
ctx.fillStyle="green";
platforms.forEach(p=>{
 ctx.fillRect(p.x-cameraX,p.y,p.w,10);
 if(player.x<p.x+p.w &&
    player.x+player.width>p.x &&
    player.y+player.height>p.y &&
    player.y+player.height<p.y+10){
   player.y=p.y-player.height;
   player.dy=0;
   onGround=true;
 }
});

// bandeira
flag.wave+=0.1;
ctx.fillStyle="black";
ctx.fillRect(flag.x-cameraX+8,flag.y-20,4,80);
ctx.fillStyle="red";
ctx.fillRect(flag.x-cameraX,flag.y,flag.w,flag.h);

// vitória
if(player.x<flag.x+flag.w &&
 player.x+player.width>flag.x &&
 player.y<flag.y+flag.h &&
 player.y+player.height>flag.y){
 win=true;
}

// moedas girando
bonuses.forEach(b=>{
 if(b.active){
  b.rot+=0.1;
  ctx.save();
  ctx.translate(b.x-cameraX+12,b.y+12);
  ctx.rotate(b.rot);
  ctx.drawImage(bonusImg,-12,-12,24,24);
  ctx.restore();

  if(player.x<b.x+24 &&
   player.x+player.width>b.x &&
   player.y<b.y+24 &&
   player.y+player.height>b.y){
   b.active=false;
   coinSound.play().catch(()=>{});
   if(!player.big){
    player.big=true;
    player.width=48;
    player.height=48;
    player.y-=16;
   }
  }
 }
});

// inimigos
enemies.forEach(e=>{
 e.x+=e.dx;
 ctx.drawImage(enemyImg,e.x-cameraX,e.y,e.width,e.height);

 if(player.x<e.x+e.width &&
  player.x+player.width>e.x &&
  player.y<e.y+e.height &&
  player.y+player.height>e.y){

  if(player.dy>0){
   e.x=-500;
   player.dy=-8;
   score+=50;
  }else if(!invincible){
   lives--;
   if(lives<=0)gameOver=true;
   player.x=50;
   player.y=300;
   invincible=true;
   setTimeout(()=>invincible=false,1000);
  }
 }
});

// jogador
ctx.drawImage(playerImg,player.x-cameraX,player.y,player.width,player.height);

score++;
requestAnimationFrame(draw);
}

draw();
