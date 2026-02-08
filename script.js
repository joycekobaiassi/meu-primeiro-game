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

// bonus 🍄
let bonus = {
  x: 280,
  y: 170,
  size: 15,
  active: true
};

const gravity = 0.6;
let score = 0;

function draw() {

  // GAME OVER
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, 130);
    ctx.font = "16px Arial";
    ctx.fillText("Pressione R para reiniciar", canvas.width/2, 170);

    requestAnimationFrame(draw);
    return;
  }

  // tela inicial
  if (!gameStarted) {
    ctx.fillStyle = "#e6f0ff";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "26px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MEU PRIMEIRO JOGO", canvas.width/2, 120);
    ctx.font = "16px Arial";
    ctx.fillText("Pressione SPACE para INICIAR", canvas.width/2, 160);

    requestAnimationFrame(draw);
    return;
  }

  // fundo
  ctx.fillStyle = "#e6f0ff";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "black";
  ctx.fillText("Pontos: " + score, 10, 20);

  // física jogador
  player.dy += gravity;
  player.y += player.dy;
  player.x += player.dx;

  if (player.y > 270) {
    player.y = 270;
    player.dy = 0;
    onGround = true;
  }

  // inimigo anda
  enemy.x += enemy.dx;
  if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) enemy.dx *= -1;

  // desenha jogador
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // plataformas
  ctx.fillStyle = "green";
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  ctx.fillRect(platform2.x, platform2.y, platform2.width, platform2.height);

  // colisão plataformas
  [platform, platform2].forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height > p.y &&
      player.y + player.height < p.y + 10
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      onGround = true;
    }
  });

  // bonus
  if (bonus.active) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bonus.x, bonus.y, bonus.size, bonus.size);
  }

  if (
    bonus.active &&
    player.x < bonus.x + bonus.size &&
    player.x + player.width > bonus.x &&
    player.y < bonus.y + bonus.size &&
    player.y + player.height > bonus.y
  ) {
    bonus.active = false;
    player.width = 48;
    player.height = 48;
  }

  // inimigo
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

// colisão inimigo
// colisão inimigo (Mario style)
if (
  player.x < enemy.x + enemy.width &&
  player.x + player.width > enemy.x &&
  player.y < enemy.y + enemy.height &&
  player.y + player.height > enemy.y
) {

  // pulou em cima
  if (player.dy > 0 && player.y + player.height - enemy.y < 15) {
    enemy.x = -100;       // some inimigo
    player.dy = -8;      // quicada
    score += 50;

  } else {
    gameOver = true;
  }
}


  score++;
  requestAnimationFrame(draw);
}

// controles
document.addEventListener("keydown", e => {

  if (e.code === "Space") {
    if (!gameStarted) {
      gameStarted = true;
      onGround = true;
      return;
    }
    if (onGround) {
      player.dy = -12;
      onGround = false;
    }
  }

  if (e.code === "ArrowRight") player.dx = 3;
  if (e.code === "ArrowLeft") player.dx = -3;

  if (e.code === "KeyR" && gameOver) location.reload();
});

draw();
// controles mobile 📱
document.getElementById("left").addEventListener("touchstart", () => {
  player.dx = -3;
});

document.getElementById("right").addEventListener("touchstart", () => {
  player.dx = 3;
});

document.getElementById("jump").addEventListener("touchstart", () => {

  if (!gameStarted) {
    gameStarted = true;
    onGround = true;
    return;
  }

  if (onGround) {
    player.dy = -12;
    onGround = false;
  }
});
