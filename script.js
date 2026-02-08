let gameStarted = false;
let gameOver = false;
let onGround = false;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 300;

// carregar imagens corretamente
const playerImg = new Image();
const enemyImg = new Image();
const bonusImg = new Image();

playerImg.src = "player.png";
enemyImg.src = "enemy.png";
bonusImg.src = "bonus.png";

let imagesLoaded = 0;

[playerImg, enemyImg, bonusImg].forEach(img => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) draw();
  };
});

// objetos
let player = { x: 10, y: 200, width: 32, height: 32, dx: 0, dy: 0 };

let enemy = { x: 400, y: 250, width: 24, height: 24, dx: 2 };

let bonus = { x: 280, y: 170, size: 20, active: true };

let platform = { x: 200, y: 200, width: 100, height: 10 };
let platform2 = { x: 350, y: 150, width: 100, height: 10 };

const gravity = 0.6;
let score = 0;

function draw() {

  if (!gameStarted) {
    ctx.fillStyle = "#e6f0ff";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MEU PRIMEIRO JOGO", canvas.width/2, 120);
    ctx.fillText("APERTE ESPAÇO OU ↑", canvas.width/2, 160);

    requestAnimationFrame(draw);
    return;
  }

  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", canvas.width/2,130);
    return;
  }

  ctx.fillStyle = "#e6f0ff";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "black";
  ctx.fillText("Score: "+score,10,20);

  player.dy += gravity;
  player.y += player.dy;
  player.x += player.dx;

  if(player.y > 270){
    player.y = 270;
    player.dy = 0;
    onGround = true;
  }

  enemy.x += enemy.dx;
  if(enemy.x<=0 || enemy.x+enemy.width>=canvas.width) enemy.dx*=-1;

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  if(bonus.active){
    ctx.drawImage(bonusImg, bonus.x, bonus.y, bonus.size, bonus.size);
  }

  ctx.fillStyle="green";
  ctx.fillRect(platform.x,platform.y,platform.width,platform.height);
  ctx.fillRect(platform2.x,platform2.y,platform2.width,platform2.height);

  [platform,platform2].forEach(p=>{
    if(player.x<p.x+p.width && player.x+player.width>p.x &&
       player.y+player.height>p.y && player.y+player.height<p.y+10){
      player.y=p.y-player.height;
      player.dy=0;
      onGround=true;
    }
  });

  if(bonus.active &&
     player.x<bonus.x+bonus.size &&
     player.x+player.width>bonus.x &&
     player.y<bonus.y+bonus.size &&
     player.y+player.height>bonus.y){

    bonus.active=false;
    player.width=48;
    player.height=48;
  }

  if(player.x<enemy.x+enemy.width &&
     player.x+player.width>enemy.x &&
     player.y<enemy.y+enemy.height &&
     player.y+player.height>enemy.y){

    if(player.dy>0){
      enemy.x=-100;
      player.dy=-8;
      score+=50;
    } else gameOver=true;
  }

  score++;
  requestAnimationFrame(draw);
}

// controles
document.addEventListener("keydown",e=>{
  if(e.code==="Space"||e.code==="ArrowUp") gameStarted=true;
  if(onGround && (e.code==="Space"||e.code==="ArrowUp")){
    player.dy=-12;
    onGround=false;
  }
  if(e.code==="ArrowLeft") player.dx=-3;
  if(e.code==="ArrowRight") player.dx=3;
});
