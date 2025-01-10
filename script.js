const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 550;

const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const gameOverOverlay = document.getElementById('gameOver');
const startButton = document.getElementById('startButton');

const gridSize = 20;
let worm = [{ x: 5 * gridSize, y: 5 * gridSize }];
let direction = { x: gridSize, y: 0 };
let fruit = getRandomPosition();
let score = 0;
let gameOver = false;

const wormHeadImg = new Image();
wormHeadImg.src = '01.png';

document.addEventListener('keydown', changeDirection);

function getRandomPosition() {
    const pos = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
    if (worm.some(segment => segment.x === pos.x && segment.y === pos.y)) {
        return getRandomPosition();
    }
    return pos;
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction.x === 0) { // left arrow
        direction = { x: -gridSize, y: 0 };
    } else if (key === 38 && direction.y === 0) { // up arrow
        direction = { x: 0, y: -gridSize };
    } else if (key === 39 && direction.x === 0) { // right arrow
        direction = { x: gridSize, y: 0 };
    } else if (key === 40 && direction.y === 0) { // down arrow
        direction = { x: 0, y: gridSize };
    }
}

function update() {
    if (gameOver) return;

    const head = { x: worm[0].x + direction.x, y: worm[0].y + direction.y };
    worm.unshift(head);

    if (head.x === fruit.x && head.y === fruit.y) {
        eatSound.play();
        fruit = getRandomPosition();
        score++;
    } else {
        worm.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || worm.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOverSound.play();
        gameOver = true;
        gameOverOverlay.style.display = 'flex';
    }

    draw();
    if (!gameOver) {
        setTimeout(update, 100);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(fruit.x, fruit.y, gridSize, gridSize);

    worm.forEach((segment, index) => {
        if (index === 0) {
            ctx.drawImage(wormHeadImg, segment.x, segment.y, gridSize, gridSize);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        }
    });

    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 20, 20);
}

function startGame() {
    gameOver = false;
    worm = [{ x: 5 * gridSize, y: 5 * gridSize }];
    direction = { x: gridSize, y: 0 };
    fruit = getRandomPosition();
    score = 0;
    gameOverOverlay.style.display = 'none';
    startButton.style.display = 'none';
    update();
}

function restartGame() {
    startGame();
}

startButton.addEventListener('click', startGame);

function init() {
    worm = [{ x: 5 * gridSize, y: 5 * gridSize }];
    direction = { x: gridSize, y: 0 };
    fruit = getRandomPosition();
    score = 0;
    gameOverOverlay.style.display = 'none';
    draw();
}

init();
