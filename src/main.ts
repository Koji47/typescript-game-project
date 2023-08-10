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
  paddleGoLeft = false;

// paddle attributes
const paddleWidth = 100,
  paddleHeight = 20,
  paddleMarginBottom = 50;

// paddle starting position
const paddleX = canvas.width - paddleWidth;

// paddle variables
const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - paddleHeight - paddleMarginBottom,
  width: paddleWidth,
  height: paddleHeight,
  speed: 5,
};

// Ball
const ballRadius = 8;

// ball variables
const ball = {
  x: canvas.width / 2,
  y: paddle.y - ballRadius,
  radius: ballRadius,
  speed: 3,
  dx: 3,
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

function draw() {
  drawPaddle();
  drawBall();
}
draw();

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function update() {}

// Bricks
let rowCount = 5,
  columnCount = 9,
  brickWidth = 54,
  brickHeight = 18,
  brickPadding = 12,
  topMargin = 40,
  leftMargin = 30,
  score = 0;

// const handleMovementKeyDown = (event:KeyboardEvent) => {

// // switch (KeyboardEvent.key){
// //     case "ArrowLeft":
// //         paddleGoLeft = true;
// //         break
// //     case "ArrowRight":
// //         paddleGoRight = true;
// //         break

// // }
// if (event.keyCode == 37){
//     paddleGoLeft = true;
// } else if (event.keyCode == 39) {
//     paddleGoRight = true;
// }
// };

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

function movePaddle(): void {
  if (!canvas) {
    throw new Error("Error with canvas selector");
  }
  // keeps paddle from going too far right
  if (paddleGoRight && paddle.x + paddleWidth < canvas.width) {
    paddle.x += paddle.speed;
    // keeps paddle from going too far left
  } else if (paddleGoLeft && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }
}
