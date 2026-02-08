let gameStarted = false;
let gameOver = false;
let onGround = false;

// Canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 300;

// Imagens
const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

// Jogador
let player = { x: 30, y: 240, width: 32, height: 32, dx: 0, dy: 0 };

// Inimigo
let enemy = { x: 500, y: 250, width: 24, height: 24, dx: -2 };

const gravity = 0.6;
let score = 0;

function resetEnemy() {
  enemy.x = canvas.width + 50;
  enemy.dx = -2 - Math.random() * 2;
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    onGround = true;
  }
}

function draw() {

  // Tela inicial
  if (!gameStarted) {
    ctx.fillStyle = "#e6f0ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MEU PRIMEIRO JOGO", canvas.width / 2, 120);
    ctx.font = "16px Arial";
    ctx.fillText("Espaço / ↑ / Toque para começar", canvas.width / 2, 160);

    requestAnimationFrame(draw);
    return;
  }

  // Game over
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "28px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, 140);
    ctx.font = "16px Arial";
    ctx.fillText("Pressione R", canvas.width / 2, 180);
    return;
  }

  // Fundo
  ctx.fillStyle = "#e6f0ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pontos
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.fillText("Pontos: " + score, 10, 20);

  // Física jogador
  player.dy += gravity;
  player.y += player.dy;
  player.x += player.dx;

  if (player.y > 240) {
    player.y = 240;
    player.dy = 0;
    onGround = true;
  }

  // Inimigo
  enemy.x += enemy.dx;

  if (enemy.x < -50) {
    resetEnemy();
  }

  // Desenhos
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  // Colisão
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    gameOver = true;
  }

  score++;
  requestAnimationFrame(draw);
}

// TECLADO
document.addEventListener("keydown", e => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    startGame();
    if (onGround) {
      player.dy = -12;
      onGround = false;
    }
  }

  if (e.code === "ArrowRight") player.dx = 3;
  if (e.code === "ArrowLeft") player.dx = -3;

  if (e.code === "KeyR") location.reload();
});

document.addEventListener("keyup", () => player.dx = 0);

// MOBILE – toque na tela pula e inicia
canvas.addEventListener("touchstart", () => {
  startGame();
  if (onGround) {
    player.dy = -12;
    onGround = false;
  }
});

resetEnemy();
draw();
