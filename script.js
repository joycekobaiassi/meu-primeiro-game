let gameStarted=false;
let gameOver=false;
let win=false;
let onGround=false;
let invincible=false;
let lives=3;
let cameraX=0;

const WORLD_WIDTH=2400;

const music=new Audio("music.mp3");
music.loop=true;
music.volume=0.4;
const jumpSound=new Audio("jump.wav");
const coinSound=new Audio("coin.wav");
const hitSound=new Audio("hit.wav");


const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

canvas.width=900;
canvas.height=400;

const playerImg=new Image();
playerImg.src="player.png";

const enemyImg=new Image();
enemyImg.src="enemy.png";

const bonusImg=new Image();
bonusImg.src="bonus.png";

let particles=[];

let player={x:50,y:300,width:32,height:32,dx:0,dy:0,big:false};

let enemies=[];
for(let i=0;i<10;i++){
 enemies.push({
  x:400+Math.random()*1800,
  y:340,
  width:24,
  height:24,
  dx:Math.random()>0.5?2:-2
 });
}

let platforms=[];
let lastY=320;

for(let x=100;x<WORLD_WIDTH-100;x+=160){
 let y=lastY+(Math.random()*160-80);
 y=Math.max(140,Math.min(330,y));
 platforms.push({x,y,w:120});
 lastY=y;
}

let bonuses=[];
for(let i=0;i<8;i++){
 bonuses.push({
  x:200+Math.random()*(WORLD_WIDTH-300),
  y:120+Math.random()*160,
  size:24,
  rot:0,
  active:true
 });
}

let clouds=[];
for(let i=0;i<6;i++){
 clouds.push({x:Math.random()*WORLD_WIDTH,y:40+Math.random()*80,s:40+Math.random()*40});
}

let flag={x:WORLD_WIDTH-80,y:180,w:20,h:60,wave:0};

const gravity=0.6;
let score=0;

function draw(){

cameraX=player.x-300;
cameraX=Math.max(0,Math.min(WORLD_WIDTH-canvas.width,cameraX));

if(!gameStarted){
 ctx.fillStyle="#cce6ff";
 ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="black";
 ctx.textAlign="center";
 ctx.font="24px Arial";
 ctx.fillText("MEU PRIMEIRO JOGO",canvas.width/2,140);
 ctx.font="16px Arial";
 ctx.fillText("APERTE ESPAÇO OU ↑",canvas.width/2,180);
 requestAnimationFrame(draw);
 return;
}

if(win||gameOver){
 ctx.fillStyle="rgba(0,0,0,.6)";
 ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="white";
 ctx.textAlign="center";
 ctx.font="26px Arial";
 ctx.fillText(win?"VOCÊ VENCEU":"GAME OVER",canvas.width/2,160);
 ctx.font="16px Arial";
 ctx.fillText("Pressione R",canvas.width/2,200);
 return;
}

ctx.fillStyle="#cce6ff";
ctx.fillRect(0,0,canvas.width,canvas.height);

// nuvens
ctx.fillStyle="white";
clouds.forEach(c=>{
 c.x+=0.2;
 if(c.x>WORLD_WIDTH)c.x=-100;
 ctx.beginPath();
 ctx.arc(c.x-cameraX,c.y,c.s,0,Math.PI*2);
 ctx.fill();
});

// HUD
ctx.fillStyle="black";
ctx.textAlign="left";
ctx.fillText("PONTOS "+score,20,30);
ctx.fillText("VIDAS "+lives,20,50);

// física
player.dy+=gravity;
player.y+=player.dy;
player.x+=player.dx;

if(player.y>360-player.height){
 player.y=360-player.height;
 player.dy=0;
 onGround=true;
}

// plataformas
ctx.fillStyle="green";
platforms.forEach(p=>{
 ctx.fillRect(p.x-cameraX,p.y,p.w,10);
 if(player.x<p.x+p.w && player.x+player.width>p.x &&
    player.y+player.height>p.y && player.y+player.height<p.y+10){
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
ctx.beginPath();
ctx.moveTo(flag.x-cameraX,flag.y);
ctx.lineTo(flag.x-cameraX+20+Math.sin(flag.wave)*6,flag.y+15);
ctx.lineTo(flag.x-cameraX,flag.y+30);
ctx.fill();

if(player.x>flag.x)win=true;

// bônus girando + partículas
bonuses.forEach(b=>{
 if(b.active){
  b.rot+=0.1;
  ctx.save();
  ctx.translate(b.x-cameraX+12,b.y+12);
  ctx.rotate(b.rot);
  ctx.drawImage(bonusImg,-12,-12,24,24);
  ctx.restore();

  if(player.x<b.x+24 && player.x+player.width>b.x &&
     player.y<b.y+24 && player.y+player.height>b.y){

   b.active=false;
coinSound.play();

   for(let i=0;i<12;i++)
    particles.push({x:b.x,y:b.y,dx:Math.random()*4-2,dy:Math.random()*-3,life:30});

   score+=100;
player.big=true;
player.width=48;
player.height=48;
player.y-=16;

  }
 }
});

// partículas
particles.forEach(p=>{
 p.x+=p.dx;
 p.y+=p.dy;
 p.life--;
 ctx.fillRect(p.x-cameraX,p.y,2,2);
});
particles=particles.filter(p=>p.life>0);

// inimigos
enemies.forEach(e=>{
 e.x+=e.dx;
 if(e.x<0||e.x>WORLD_WIDTH)e.dx*=-1;
 ctx.drawImage(enemyImg,e.x-cameraX,e.y,24,24);

 if(player.x<e.x+24 && player.x+player.width>e.x &&
    player.y<e.y+24 && player.y+player.height>e.y){

  if(player.dy>0){
   e.x=-300;
   player.dy=-8;
   score+=50;
  }else if(!invincible){
   lives--;
hitSound.play();

   invincible=true;
   setTimeout(()=>invincible=false,1200);
   if(lives<=0)gameOver=true;
  }
 }
});

// jogador
if(!invincible||Date.now()%200<100)
 ctx.drawImage(playerImg,player.x-cameraX,player.y,player.width,player.height);

requestAnimationFrame(draw);
}

// controles
document.addEventListener("keydown",e=>{
 if(e.code==="Space"||e.code==="ArrowUp"){
  gameStarted=true;
  music.play();
  if(onGround){player.dy=-12;onGround=false;}
jumpSound.play();

 }
 if(e.code==="ArrowLeft")player.dx=-3;
 if(e.code==="ArrowRight")player.dx=3;
 if(e.code==="KeyR"&&(win||gameOver))location.reload();
});

draw();
// ===== CONTROLE MOBILE =====
canvas.addEventListener("touchstart", e=>{
 e.preventDefault();

 gameStarted=true;
 music.play().catch(()=>{});

 let touchX=e.touches[0].clientX;
 let touchY=e.touches[0].clientY;

 // parte superior = pulo
 if(touchY<canvas.height/2){
  if(onGround){
   player.dy=-12;
   onGround=false;
   jumpSound.play().catch(()=>{});
  }
 }

 // metade inferior = andar
 else{
  if(touchX<window.innerWidth/2){
   player.dx=-3;
  }else{
   player.dx=3;
  }
 }

},{passive:false});

canvas.addEventListener("touchend",()=>{
 player.dx=0;
});

