// Query selectors
const canvas = document.querySelector<HTMLCanvasElement>("#brickBreaker");

//null errors
if (!canvas) {
  throw new Error("Error with canvas selector");
}

//context 2D canvas
const context = canvas.getContext("2d");

//null errors
if (!context) {
  throw new Error("Error with canvas selector");
}

// Canvas Border
canvas.style.border = "1px solid black";

let life = 3,
  gameOver = false,
  paddleGoRight = false,
  paddleGoLeft = false,
  score = 0;

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
const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - paddleHeight - paddleMarginBottom,
  width: paddleWidth,
  height: paddleHeight,
  dx: 5,
};

// ball variables
const ball = {
  x: canvas.width / 2,
  y: paddle.y - ballRadius,
  radius: ballRadius,
  speed: 3,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};
function drawPaddle(): void {
  if (!context) {
    throw new Error("Error with canvas selector");
  }
  //paddle styling
  context.fillStyle = "#899499";
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  //stroke
  context.strokeStyle = "#36454F";
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
  context.strokeStyle = "#300066";
  context.stroke();
  context.closePath();
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// draw function
function draw() {
  drawPaddle();
  drawBall();
}

// update game function
function update() {
  movePaddle();
  moveBall();
  ballCollisionWall();
  ballCollisionPaddle();
}

// game loop
function loop() {
  context?.drawImage(BG_IMG, 0, 0);
  draw();
  update();
  requestAnimationFrame(loop);
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

function resetBall() {
  if (!canvas) {
    throw new Error("Error with canvas selector");
  }
  ball.x = canvas.width / 2;
  ball.y = paddle.y - ballRadius;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}

// Bricks
let rowCount = 5,
  columnCount = 9,
  brickWidth = 54,
  brickHeight = 18,
  brickPadding = 12,
  topMargin = 40,
  leftMargin = 30;

//Event listeners
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    paddleGoLeft = true;
    console.log("left");
  } else if (event.keyCode == 39) {
    paddleGoRight = true;
    console.log("right");
  }
});

document.addEventListener("keyup", function (event) {
  if (event.keyCode == 37) {
    paddleGoLeft = false;
  } else if (event.keyCode == 39) {
    paddleGoRight = false;
  }
});

function movePaddle(): void {
  if (!canvas) {
    throw new Error("Error with canvas selector");
  }
  // keeps paddle from going too far right
  if (paddleGoRight && paddle.x + paddleWidth < canvas.width) {
    paddle.x += paddle.dx;
    // keeps paddle from going too far left
  } else if (paddleGoLeft && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}
