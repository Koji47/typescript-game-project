// Query selectors
const canvas = document.querySelector<HTMLCanvasElement>("#brickBreaker");
const livesCounter = document.querySelector<HTMLSpanElement>("#livesCounter");
const scoreCounter = document.querySelector<HTMLSpanElement>("#scoreCounter");
const resetButton = document.querySelector<HTMLButtonElement>(".button-reset");
const leftButton = document.querySelector<HTMLButtonElement>(".button-container__leftButton");
const rightButton = document.querySelector<HTMLButtonElement>(".button-container__rightButton");

//null errors
if (!livesCounter) {
  throw new Error("Error with lives counter selector");
}
if (!scoreCounter) {
  throw new Error("Error with score counter selector");
}
if (!leftButton || !rightButton || !resetButton) {
  throw new Error("Error with button selector");
}
if (!canvas) {
  throw new Error("Error with canvas selector");
}

//context 2D canvas
const context = canvas.getContext("2d");

//null error for context
if (!context) {
  throw new Error("Error with canvas selector");
}

// Canvas Border
canvas.style.border = "1px solid black";

let life = 3,
  score = 0,
  gameOver = false,
  gamePaused = false,
  paddleGoRight = false,
  paddleGoLeft = false,
  touchLeft = false,
  touchRight = false,
  animate: any;

// paddle attributes
const paddleWidth = 100,
  paddleHeight = 20,
  paddleMarginBottom = 50,
  ballRadius = 8,
  BG_IMG = new Image();
BG_IMG.src = "src/assets/BG_IMG.jpg";

// paddle starting position
const paddleX = canvas.width - paddleWidth;

// paddle variables
type paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
};
const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - paddleHeight - paddleMarginBottom,
  width: paddleWidth,
  height: paddleHeight,
  speed: 3,
};

// ball variables
type ball = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  dx: number;
  dy: number;
};
const ball = {
  x: canvas.width / 2,
  y: paddle.y - ballRadius,
  radius: ballRadius,
  speed: 3,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};

// brick variables
type Brick = {
  rows: number;
  columns: number;
  width: number;
  height: number;
  offSetLeft: number;
  offSetTop: number;
  marginTop: number;
};
let brick = {
  rows: 3,
  columns: 5,
  width: 55,
  height: 20,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 40,
  fillColour: "#ffdc60",
  strokeColour: "#fff",
};

// create bricks
let bricks: { x: number; y: number; status: boolean }[][] = [];

function createBricks() {
  for (let r = 0; r < brick.rows; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.columns; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
}
createBricks();

// draw bricks
function drawBricks() {
  if (!context) {
    throw new Error("Error with canvas selector");
  }
  for (let r = 0; r < brick.rows; r++) {
    for (let c = 0; c < brick.columns; c++) {
      const b = bricks[r][c];
      if (b.status) {
        context.fillStyle = brick.fillColour;
        context.fillRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}
function drawPaddle(): void {
  if (!context) {
    throw new Error("Error with canvas selector");
  }
  //paddle styling
  context.fillStyle = "#300066";
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  //stroke
  context.strokeStyle = "#fff863";
  context.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}
function drawBall(): void {
  if (!context) {
    throw new Error("Error with canvas selector");
  }
  context.beginPath();
  context.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  context.fillStyle = "#5a00b4";
  context.fill();
  context.strokeStyle = "#ffdc60";
  context.stroke();
  context.closePath();
}

// Game logic loop
// Draw function
function draw() {
  drawPaddle();
  drawBall();
  drawBricks();
}

// Update game function
function update() {
  movePaddle();
  moveBall();
  ballCollisionWall();
  ballCollisionPaddle();
  ballCollisionBrick();
  updateLivesCounter();
  updateScoreCounter();
  gameOverFunction();
}

// Game loop
function loop() {
  if (!gamePaused) {
    if (!canvas) {
      throw new Error("Error with canvas selector");
    }
    context?.clearRect(0, 0, canvas.width, canvas.height);
    context?.drawImage(BG_IMG, 0, 0);
    draw();
    update();
    animate = requestAnimationFrame(loop);
  }
}
loop();

function ballCollisionWall() {
  if (!canvas) {
    throw new Error("Error with canvas selector");
  }

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  if (ball.y + ball.radius > canvas.height) {
    life = life - 1;

    resetBall();
  }
}
function ballCollisionPaddle() {
  if (
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y
  ) {
    ball.dy = -ball.dy;
  }
}
function ballCollisionBrick() {
  for (let r = 0; r < brick.rows; r++) {
    for (let c = 0; c < brick.columns; c++) {
      const b = bricks[r][c];
      if (b.status) {
        if (
          // right edge ball > left edge brick,
          ball.x + ball.radius > b.x &&
          //left edge ball < right edge brick,
          ball.x - ball.radius < b.x + brick.width &&
          //bottom edge ball > top edge brick,
          ball.y + ball.radius > b.y &&
          //top edge ball < bottom edge brick
          ball.y - ball.radius < b.y + brick.height
        ) {
          b.status = false;
          ball.dy = -ball.dy;
          score += 1;
        }
      }
    }
  }
}

function updateLivesCounter() {
  if (!livesCounter) {
    throw new Error("Error with lives counter selector");
  }
  livesCounter.textContent = life.toString();
}
function updateScoreCounter() {
  if (!scoreCounter) {
    throw new Error("Error with lives counter selector");
  }
  scoreCounter.textContent = score.toString();
}

function resetBall() {
  if (!canvas) {
    throw new Error("Error with canvas selector");
  }
  ball.x = canvas.width / 2;
  ball.y = paddle.y - ballRadius;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}
function resetGame() {
  cancelAnimationFrame(animate);
  life = 3;
  score = 0;
  bricks = [];
  createBricks();
  resetBall();
  updateLivesCounter();
  updateScoreCounter();
  gameOver = false;
  gamePaused = false;
  loop();
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}
function movePaddle(): void {
  if (!canvas) {
    throw new Error("Error with canvas selector");
  }
  // keeps paddle from going too far right
  if ((paddleGoRight || touchRight) && paddle.x + paddleWidth < canvas.width) {
    paddle.x += paddle.speed;
    // keeps paddle from going too far left
  } else if ((paddleGoLeft || touchLeft) && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }
}

function gameOverFunction() {
  if (life <= 0) {
    if (!resetButton) {
      throw new Error("Error with button selector");
    }
    gameOver = true;
    gamePaused = true;
    resetButton.className = `button-reset show`;
  }
}

//Event listeners
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    paddleGoLeft = true;
  } else if (event.keyCode == 39) {
    paddleGoRight = true;
  }
});
document.addEventListener("keyup", function (event) {
  if (event.keyCode == 37) {
    paddleGoLeft = false;
  } else if (event.keyCode == 39) {
    paddleGoRight = false;
  }
});

//Event listeners for touch inputs on mobile/tablet
leftButton.addEventListener("touchstart", () => (touchLeft = true));
leftButton.addEventListener("touchend", () => (touchLeft = false));
rightButton.addEventListener("touchstart", () => (touchRight = true));
rightButton.addEventListener("touchend", () => (touchRight = false));

resetButton.addEventListener("click", () => {
  resetGame();
  gamePaused = false;
});

resetButton.addEventListener("hold", () => {
  resetGame();
  gamePaused = false;
});
