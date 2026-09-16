const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

// =========================================
// 화면 크기
// =========================================

let screenWidth = 0;
let screenHeight = 0;

function resizeCanvas() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = screenWidth * dpr;
    canvas.height = screenHeight * dpr;

    canvas.style.width = screenWidth + "px";
    canvas.style.height = screenHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// =========================================
// 이미지
// =========================================

// 고양이
const catImage = new Image();
catImage.src = "assets/cat.png";

// =========================================
// 게임 변수
// =========================================

let score = 0;
let cameraX = 0;

// 전체 맵 길이
const MAP_WIDTH = 8000;

// =========================================
// 플레이어
// =========================================

const player = {
    x: 200,
    y: 200,
    width: 60,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    speed: 0.7,
    maxSpeed: 7,
    jumpPower: 14,
    grounded: false
};

// =========================================
// 조작
// =========================================

const input = {
    left: false,
    right: false,
    jump: false
};

// =========================================
// 키보드 조작
// =========================================

window.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
        input.left = true;
    }
    if (event.key === "ArrowRight" || event.key === "d") {
        input.right = true;
    }
    if (event.key === "ArrowUp" || event.key === "w" || event.key === " ") {
        input.jump = true;
    }
});

window.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
        input.left = false;
    }
    if (event.key === "ArrowRight" || event.key === "d") {
        input.right = false;
    }
    if (event.key === "ArrowUp" || event.key === "w" || event.key === " ") {
        input.jump = false;
    }
});

// =========================================
// 터치/버튼 조작
// =========================================

function setupButton(id, key) {
    const button = document.getElementById(id);

    button.addEventListener("pointerdown", function(event) {
        event.preventDefault();
        input[key] = true;
    });

    button.addEventListener("pointerup", function(event) {
        event.preventDefault();
        input[key] = false;
    });

    button.addEventListener("pointercancel", function() {
        input[key] = false;
    });

    button.addEventListener("pointerleave", function() {
        input[key] = false;
    });
}

setupButton("leftButton", "left");
setupButton("rightButton", "right");
setupButton("jumpButton", "jump");

// =========================================
// 맵
// =========================================

const platforms = [
    // 지상
    { x: 0, y: 0, width: 1000, height: 70 },
    { x: 1150, y: 0, width: 800, height: 70 },
    { x: 2100, y: 0, width: 1000, height: 70 },
    { x: 3250, y: 0, width: 900, height: 70 },
    { x: 4300, y: 0, width: 1100, height: 70 },
    { x: 5550, y: 0, width: 2450, height: 70 },

    // 공중 발판
    { x: 400, y: 180, width: 180, height: 25 },
    { x: 700, y: 280, width: 180, height: 25 },
    { x: 1300, y: 180, width: 200, height: 25 },
    { x: 1600, y: 300, width: 180, height: 25 },
    { x: 2300, y: 190, width: 200, height: 25 },
    { x: 2700, y: 320, width: 180, height: 25 },
    { x: 3450, y: 200, width: 180, height: 25 },
    { x: 3800, y: 320, width: 180, height: 25 },
    { x: 4550, y: 180, width: 200, height: 25 },
    { x: 5000, y: 300, width: 180, height: 25 },
    { x: 5900, y: 200, width: 200, height: 25 },
    { x: 6400, y: 320, width: 200, height: 25 }
];

// =========================================
// 코인
// =========================================

const coins = [
    { x: 500, y: 240, collected: false },
    { x: 800, y: 340, collected: false },
    { x: 1400, y: 240, collected: false },
    { x: 1700, y: 360, collected: false },
    { x: 2400, y: 250, collected: false },
    { x: 2800, y: 380, collected: false },
    { x: 3550, y: 260, collected: false },
    { x: 3900, y: 380, collected: false },
    { x: 4650, y: 240, collected: false },
    { x: 5100, y: 360, collected: false },
    { x: 6000, y: 260, collected: false },
    { x: 6500, y: 380, collected: false }
];

// =========================================
// 충돌
// =========================================

function collision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// =========================================
// 플레이어 업데이트
// =========================================

function updatePlayer() {
    if (input.left) player.velocityX -= player.speed;
    if (input.right) player.velocityX += player.speed;

    if (player.velocityX > player.maxSpeed) player.velocityX = player.maxSpeed;
    if (player.velocityX < -player.maxSpeed) player.velocityX = -player.maxSpeed;

    if (!input.left && !input.right) player.velocityX *= 0.85;

    if (input.jump && player.grounded) {
        player.velocityY = -player.jumpPower;
        player.grounded = false;
        input.jump = false;
    }

    player.velocityY += 0.7;

    player.x += player.velocityX;
    player.y += player.velocityY;

    if (player.x < 0) {
        player.x = 0;
        player.velocityX = 0;
    }

    if (player.x > MAP_WIDTH - player.width) {
        player.x = MAP_WIDTH - player.width;
    }

    player.grounded = false;
    const groundY = screenHeight - 100;

    for (const platform of platforms) {
        const platformObject = {
            x: platform.x,
            y: groundY - platform.y - platform.height,
            width: platform.width,
            height: platform.height
        };

        if (
            player.velocityY >= 0 &&
            player.x + player.width > platformObject.x &&
            player.x < platformObject.x + platformObject.width &&
            player.y + player.height >= platformObject.y &&
            player.y + player.height <= platformObject.y + 25
        ) {
            player.y = platformObject.y - player.height;
            player.velocityY = 0;
            player.grounded = true;
        }
    }

    if (player.y > screenHeight + 200) {
        player.x = 200;
        player.y = 200;
        player.velocityX = 0;
        player.velocityY = 0;
    }

    const targetCamera = player.x - screenWidth * 0.35;
    cameraX += (targetCamera - cameraX) * 0.08;

    if (cameraX < 0) cameraX = 0;
    if (cameraX > MAP_WIDTH - screenWidth) cameraX = MAP_WIDTH - screenWidth;
}

// =========================================
// 코인 업데이트
// =========================================

function updateCoins() {
    for (const coin of coins) {
        if (coin.collected) continue;

        const coinObject = {
            x: coin.x - 15,
            y: coin.y - 15,
            width: 30,
            height: 30
        };

        if (collision(player, coinObject)) {
            coin.collected = true;
            score += 10;
            scoreText.textContent = "SCORE : " + score;
        }
    }
}

// =========================================
// 배경 그리기
// =========================================

function drawBackground() {
    // CSS 배경 GIF가 보이도록 캔버스 초기화
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    // 반투명 하늘색 톤 오버레이
    const sky = ctx.createLinearGradient(0, 0, 0, screenHeight);
    sky.addColorStop(0, "rgba(77, 184, 255, 0.35)");
    sky.addColorStop(1, "rgba(199, 239, 255, 0.35)");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    // 구름
    drawCloud(100 - cameraX * 0.12, 100, 1);
    drawCloud(550 - cameraX * 0.08, 180, 0.8);
    drawCloud(1000 - cameraX * 0.10, 80, 1.2);
    drawCloud(1500 - cameraX * 0.08, 150, 0.9);
    drawCloud(2100 - cameraX * 0.10, 100, 1.1);
    drawCloud(2800 - cameraX * 0.08, 180, 0.8);
    drawCloud(3600 - cameraX * 0.10, 90, 1);
    drawCloud(4500 - cameraX * 0.08, 170, 0.9);
}

// =========================================
// 구름
// =========================================

function drawCloud(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.beginPath();
    ctx.arc(0, 20, 30, 0, Math.PI * 2);
    ctx.arc(35, 10, 40, 0, Math.PI * 2);
    ctx.arc(75, 20, 30, 0, Math.PI * 2);
    ctx.fillRect(0, 20, 75, 30);
    ctx.fill();
    ctx.restore();
}

// =========================================
// 맵 그리기
// =========================================

function drawMap() {
    const groundY = screenHeight - 100;

    for (const platform of platforms) {
        const x = platform.x - cameraX;
        const y = groundY - platform.y - platform.height;

        if (x + platform.width < 0 || x > screenWidth) continue;

        // 흙
        ctx.fillStyle = "#8b5a35";
        ctx.fillRect(x, y, platform.width, platform.height);

        // 잔디
        ctx.fillStyle = "#5f9d42";
        ctx.fillRect(x, y, platform.width, 10);

        // 잔디 디테일
        ctx.fillStyle = "#78bd52";
        for (let grassX = x; grassX < x + platform.width; grassX += 25) {
            ctx.fillRect(grassX, y - 4, 12, 5);
        }
    }
}

// =========================================
// 코인 그리기
// =========================================

function drawCoins() {
    for (const coin of coins) {
        if (coin.collected) continue;

        const x = coin.x - cameraX;
        const y = coin.y;

        if (x < -50 || x > screenWidth + 50) continue;

        ctx.fillStyle = "#ffd83d";
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff4a3";
        ctx.beginPath();
        ctx.arc(x - 4, y - 4, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// =========================================
// 고양이 그리기
// =========================================

function drawPlayer() {
    const drawX = player.x - cameraX;
    const drawY = player.y;

    if (catImage.complete && catImage.naturalWidth > 0) {
        ctx.drawImage(catImage, drawX - 10, drawY - 20, 80, 80);
    } else {
        ctx.fillStyle = "#f5a84b";
        ctx.fillRect(drawX, drawY, player.width, player.height);
    }
}

// =========================================
// 게임 루프
// =========================================

function update() {
    updatePlayer();
    updateCoins();
}

function draw() {
    drawBackground();
    drawMap();
    drawCoins();
    drawPlayer();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
