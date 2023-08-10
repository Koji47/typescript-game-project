// import "./style.css";

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

// paddle attributes
const paddleWidth = 100;
const paddleHeight = 20;
const paddleMarginBottom = 50;

// paddle starting position
const paddleX = canvas.width - paddleWidth;

// paddle variable
const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - paddleHeight - paddleMarginBottom,
  width: paddleWidth,
  height: paddleHeight,
  speed: 5,
};

//paddle styling
context.fillStyle = "#899499";
context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
//stroke
context.strokeStyle = "#36454F";
context.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

let paddleGoRight = false;
let paddleGoLeft = false;

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

const movePaddle = () => {
  if (paddleGoRight && paddle.x + paddleWidth < canvas.width) {
    // keeps paddle from going too far right
    paddle.x += paddle.speed;
  } else if (paddleGoLeft && paddle.x > 0) {
    paddle.x -= paddle.speed;
  } // keeps paddle from going too far left
};

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
