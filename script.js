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

const bonusImg = new Image();
bonusImg.src = "bonus.png"; // se quiser usar imagem do bonus

// Jogador
let player = { x: 10, y: 200, width: 32, height: 32, dx: 0, dy: 0 };

// Plataformas
let platform = { x: 200, y: 200, width: 100, height: 10 };
let platform2 = { x: 350, y: 150, width: 100, height: 10 };

// Inimigo
let enemy = { x: 400, y: 250, width: 24, height: 24, dx: 2 };

// Bonus
let bonus = { x: 280, y: 170, size: 20, active: true };

const gravity = 0.6;
let score = 0;

// Função para iniciar o jogo
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    onGround = true;
  }
}

// Função principal
function draw() {
  // Tela inicial
  if (!gameStarted) {
    ctx.fillStyle = "#e6f0ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "26px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MEU PRIMEIRO JOGO", canvas.width / 2, 120);

    ctx.font = "16px Arial";
    ctx.fillText("Pressione ESPAÇO ou ⬆️ para INICIAR", canvas.width / 2, 160);

    requestAnimationFrame(draw);
    return;
  }

  // GAME OVER
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, 130);

    ctx.font = "16px Arial";
    ctx.fillText("Pressione R para reiniciar", canvas.width / 2, 170);

    requestAnimationFrame(draw);
    return;
  }

  // Fundo
  ctx.fillStyle = "#e6f0ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pontuação
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Pontos: " + score, 10, 20);

  // Física do jogador
  player.dy += gravity;
  player.y += player.dy;
  player.x += player.dx;

  if (player.y > 270) {
    player.y = 270;
    player.dy = 0;
    onGround = true;
  }

  // Movimentação do inimigo
  enemy.x += enemy.dx;
  if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) enemy.dx *= -1;

  // Desenhar jogador
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Plataformas
  ctx.fillStyle = "green";
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  ctx.fillRect(platform2.x, platform2.y, platform2.width, platform2.height);

  // Colisão plataformas
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

  // Bonus
  if (bonus.active) {
    // ctx.fillStyle = "yellow";
    // ctx.fillRect(bonus.x, bonus.y, bonus.size, bonus.size);
    ctx.drawImage(bonusImg, bonus.x, bonus.y, bonus.size, bonus.size);
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

  // Inimigo
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  // Colisão com inimigo
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    if (player.dy > 0 && player.y + player.height - enemy.y < 15) {
      // pulou em cima
      enemy.x = -100;
      player.dy = -8;
      score += 50;
    } else {
      gameOver = true;
    }
  }

  score++;
  requestAnimationFrame(draw);
}

// Controles PC
document.addEventListener("keydown", e => {
  if (e.code === "Space" || e.code === "ArrowUp") startGame();
  if (onGround && e.code === "Space") {
    player.dy = -12;
    onGround = false;
  }
  if (e.code === "ArrowLeft") player.dx = -3;
  if (e.code === "ArrowRight") player.dx = 3;
  if (e.code === "KeyR" && gameOver) location.reload();
});

// Controles Mobile (supondo que você criou botões com id: jump, left, right)
document.getElementById("jump")?.addEventListener("touchstart", () => {
  startGame();
  if (onGround) { player.dy = -12; onGround = false; }
});
document.getElementById("left")?.addEventListener("touchstart", () => player.dx = -3);
document.getElementById("right")?.addEventListener("touchstart", () => player.dx = 3);

draw();
