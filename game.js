const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");


// =====================================================
// 화면 크기
// =====================================================

let screenWidth;
let screenHeight;

function resizeCanvas() {

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = screenWidth * dpr;
    canvas.height = screenHeight * dpr;

    canvas.style.width = screenWidth + "px";
    canvas.style.height = screenHeight + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


// =====================================================
// 이미지
// =====================================================

// 고양이 이미지
const catImage = new Image();

catImage.src = "assets/cat.png";


// 뒤쪽 GIF
const backgroundGif = new Image();

backgroundGif.src = "assets/background.gif";


// =====================================================
// 게임 변수
// =====================================================

let score = 0;

let cameraX = 0;


// 맵의 전체 길이
const MAP_WIDTH = 8000;


// =====================================================
// 플레이어
// =====================================================

const player = {

    x: 200,

    y: 300,

    width: 60,
    height: 60,

    velocityX: 0,
    velocityY: 0,

    speed: 0.7,

    maxSpeed: 7,

    jumpPower: 14,

    grounded: false
};


// =====================================================
// 조작
// =====================================================

const input = {

    left: false,

    right: false,

    jump: false
};


// =====================================================
// 키보드
// =====================================================

window.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {

            input.left = true;
        }


        if (
            event.key === "ArrowRight" ||
            event.key === "d"
        ) {

            input.right = true;
        }


        if (
            event.key === "ArrowUp" ||
            event.key === "w" ||
            event.key === " "
        ) {

            input.jump = true;
        }

    }
);


window.addEventListener(
    "keyup",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {

            input.left = false;
        }


        if (
            event.key === "ArrowRight" ||
            event.key === "d"
        ) {

            input.right = false;
        }


        if (
            event.key === "ArrowUp" ||
            event.key === "w" ||
            event.key === " "
        ) {

            input.jump = false;
        }

    }
);


// =====================================================
// 터치 버튼
// =====================================================

function setupButton(
    id,
    key
) {

    const button =
        document.getElementById(id);


    button.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            input[key] = true;

        }
    );


    button.addEventListener(
        "pointerup",
        function(event) {

            event.preventDefault();

            input[key] = false;

        }
    );


    button.addEventListener(
        "pointercancel",
        function() {

            input[key] = false;

        }
    );


    button.addEventListener(
        "pointerleave",
        function() {

            input[key] = false;

        }
    );
}


setupButton(
    "leftButton",
    "left"
);


setupButton(
    "rightButton",
    "right"
);


setupButton(
    "jumpButton",
    "jump"
);


// =====================================================
// 맵
// =====================================================

const platforms = [

    // 시작 구간
    {
        x: 0,
        y: 0,
        width: 1000,
        height: 70
    },

    // 두 번째 구간
    {
        x: 1150,
        y: 0,
        width: 800,
        height: 70
    },

    // 세 번째
    {
        x: 2100,
        y: 0,
        width: 1000,
        height: 70
    },

    // 네 번째
    {
        x: 3250,
        y: 0,
        width: 900,
        height: 70
    },

    // 다섯 번째
    {
        x: 4300,
        y: 0,
        width: 1100,
        height: 70
    },

    // 마지막
    {
        x: 5550,
        y: 0,
        width: 2450,
        height: 70
    },


    // 공중 발판

    {
        x: 400,
        y: 180,
        width: 180,
        height: 25
    },

    {
        x: 700,
        y: 280,
        width: 180,
        height: 25
    },

    {
        x: 1300,
        y: 180,
        width: 200,
        height: 25
    },

    {
        x: 1600,
        y: 300,
        width: 180,
        height: 25
    },

    {
        x: 2300,
        y: 190,
        width: 200,
        height: 25
    },

    {
        x: 2700,
        y: 320,
        width: 180,
        height: 25
    },

    {
        x: 3450,
        y: 200,
        width: 180,
        height: 25
    },

    {
        x: 3800,
        y: 320,
        width: 180,
        height: 25
    },

    {
        x: 4550,
        y: 180,
        width: 200,
        height: 25
    },

    {
        x: 5000,
        y: 300,
        width: 180,
        height: 25
    },

    {
        x: 5900,
        y: 200,
        width: 200,
        height: 25
    },

    {
        x: 6400,
        y: 320,
        width: 200,
        height: 25
    }

];


// =====================================================
// 코인
// =====================================================

const coins = [

    {
        x: 500,
        y: 240,
        collected: false
    },

    {
        x: 800,
        y: 340,
        collected: false
    },

    {
        x: 1400,
        y: 240,
        collected: false
    },

    {
        x: 1700,
        y: 360,
        collected: false
    },

    {
        x: 2400,
        y: 250,
        collected: false
    },

    {
        x: 2800,
        y: 380,
        collected: false
    },

    {
        x: 3550,
        y: 260,
        collected: false
    },

    {
        x: 3900,
        y: 380,
        collected: false
    },

    {
        x: 4650,
        y: 240,
        collected: false
    },

    {
        x: 5100,
        y: 360,
        collected: false
    },

    {
        x: 6000,
        y: 260,
        collected: false
    },

    {
        x: 6500,
        y: 380,
        collected: false
    }

];


// =====================================================
// 충돌
// =====================================================

function collision(
    a,
    b
) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );
}


// =====================================================
// 플레이어 업데이트
// =====================================================

function updatePlayer() {

    // -----------------------------
    // 좌우 이동
    // -----------------------------

    if (input.left) {

        player.velocityX -=
            player.speed;

    }


    if (input.right) {

        player.velocityX +=
            player.speed;

    }


    // -----------------------------
    // 최대 속도
    // -----------------------------

    if (
        player.velocityX >
        player.maxSpeed
    ) {

        player.velocityX =
            player.maxSpeed;

    }


    if (
        player.velocityX <
        -player.maxSpeed
    ) {

        player.velocityX =
            -player.maxSpeed;

    }


    // -----------------------------
    // 마찰
    // -----------------------------

    if (
        !input.left &&
        !input.right
    ) {

        player.velocityX *= 0.85;

    }


    // -----------------------------
    // 점프
    // -----------------------------

    if (
        input.jump &&
        player.grounded
    ) {

        player.velocityY =
            -player.jumpPower;

        player.grounded =
            false;

        input.jump = false;
    }


    // -----------------------------
    // 중력
    // -----------------------------

    player.velocityY += 0.7;


    // -----------------------------
    // 이동
    // -----------------------------

    player.x +=
        player.velocityX;

    player.y +=
        player.velocityY;


    // 맵 밖으로 못 나가게
    if (player.x < 0) {

        player.x = 0;

        player.velocityX = 0;
    }


    if (
        player.x >
        MAP_WIDTH -
        player.width
    ) {

        player.x =
            MAP_WIDTH -
            player.width;

    }


    // -----------------------------
    // 발판 충돌
    // -----------------------------

    player.grounded = false;


    for (
        const platform of platforms
    ) {

        const platformScreenY =
            screenHeight -
            100 -
            platform.y -
            platform.height;


        const platformObject = {

            x: platform.x,

            y: platformScreenY,

            width: platform.width,

            height: platform.height

        };


        if (

            player.velocityY >= 0 &&

            player.x +
            player.width >
            platformObject.x &&

            player.x <
            platformObject.x +
            platformObject.width &&

            player.y +
            player.height >=
            platformObject.y &&

            player.y +
            player.height <=
            platformObject.y + 25

        ) {

            player.y =
                platformObject.y -
                player.height;

            player.velocityY = 0;

            player.grounded = true;

        }

    }


    // -----------------------------
    // 떨어지면 처음으로
    // -----------------------------

    if (
        player.y >
        screenHeight + 200
    ) {

        player.x = 200;

        player.y = 200;

        player.velocityX = 0;

        player.velocityY = 0;

    }


    // -----------------------------
    // 카메라
    // -----------------------------

    const targetCamera =
        player.x -
        screenWidth * 0.35;


    cameraX +=
        (
            targetCamera -
            cameraX
        ) * 0.08;


    if (cameraX < 0) {

        cameraX = 0;

    }


    if (
        cameraX >
        MAP_WIDTH -
        screenWidth
    ) {

        cameraX =
            MAP_WIDTH -
            screenWidth;

    }

}


// =====================================================
// 코인 업데이트
// =====================================================

function updateCoins() {

    for (
        const coin of coins
    ) {

        if (
            coin.collected
        ) {

            continue;

        }


        const coinObject = {

            x: coin.x - 15,

            y: coin.y - 15,

            width: 30,

            height: 30

        };


        if (
            collision(
                player,
                coinObject
            )
        ) {

            coin.collected =
                true;

            score += 10;

            scoreText.textContent =
                "SCORE : " + score;

        }

    }

}


// =====================================================
// 배경 그리기
// =====================================================

function drawBackground() {

    // 하늘
    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            screenHeight
        );


    sky.addColorStop(
        0,
        "#4db8ff"
    );


    sky.addColorStop(
        1,
        "#bde9ff"
    );


    ctx.fillStyle = sky;


    ctx.fillRect(
        0,
        0,
        screenWidth,
        screenHeight
    );


    // ---------------------------------
    // 뒤쪽 GIF
    // ---------------------------------

    if (
        backgroundGif.complete &&
        backgroundGif.naturalWidth > 0
    ) {

        ctx.save();


        /*
         * GIF를 화면 뒤쪽에 크게 표시
         * globalAlpha = 투명도
         * filter = 흐림
         */

        ctx.globalAlpha = 0.22;

        ctx.filter =
            "blur(8px)";


        const gifWidth =
            screenWidth * 1.3;

        const gifHeight =
            screenHeight * 0.8;


        ctx.drawImage(

            backgroundGif,

            screenWidth * 0.5 -
            gifWidth * 0.5,

            screenHeight * 0.12,

            gifWidth,

            gifHeight

        );


        ctx.restore();

    }


    // ---------------------------------
    // 구름
    // ---------------------------------

    drawCloud(
        120 - cameraX * 0.15,
        110,
        1
    );


    drawCloud(
        550 - cameraX * 0.10,
        190,
        0.8
    );


    drawCloud(
        950 - cameraX * 0.12,
        80,
        1.2
    );


    drawCloud(
        1450 - cameraX * 0.10,
        150,
        0.9
    );


    drawCloud(
        2000 - cameraX * 0.12,
        100,
        1.1
    );


    drawCloud(
        2700 - cameraX * 0.10,
        180,
        0.8
    );

}


// =====================================================
// 구름
// =====================================================

function drawCloud(
    x,
    y,
    scale
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.scale(
        scale,
        scale
    );


    ctx.fillStyle =
        "rgba(255,255,255,0.85)";


    ctx.beginPath();

    ctx.arc(
        0,
        20,
        30,
        0,
        Math.PI * 2
    );


    ctx.arc(
        35,
        10,
        40,
        0,
        Math.PI * 2
    );


    ctx.arc(
        75,
        20,
        30,
        0,
        Math.PI * 2
    );


    ctx.fillRect(
        0,
        20,
        75,
        30
    );


    ctx.fill();

    ctx.restore();

}


// =====================================================
// 맵 그리기
// =====================================================

function drawMap() {

    const groundY =
        screenHeight - 100;


    for (
        const platform of platforms
    ) {

        const x =
            platform.x -
            cameraX;


        const y =
            groundY -
            platform.y -
            platform.height;


        // 화면 밖이면 그리지 않음

        if (
            x + platform.width < 0 ||
            x > screenWidth
        ) {

            continue;

        }


        // 흙

        ctx.fillStyle =
            "#8b5a35";


        ctx.fillRect(

            x,
            y,
            platform.width,
            platform.height

        );


        // 잔디

        ctx.fillStyle =
            "#5f9d42";


        ctx.fillRect(

            x,
            y,
            platform.width,
            10

        );


        // 작은 풀무늬

        ctx.fillStyle =
            "#78bd52";


        for (
            let grassX = x;
            grassX <
            x + platform.width;
            grassX += 25
        ) {

            ctx.fillRect(
                grassX,
                y - 4,
                12,
                5
            );

        }

    }

}


// =====================================================
// 코인 그리기
// =====================================================

function drawCoins() {

    for (
        const coin of coins
    ) {

        if (
            coin.collected
        ) {

            continue;

        }


        const x =
            coin.x -
            cameraX;


        const y =
            coin.y;


        if (
            x < -50 ||
            x > screenWidth + 50
        ) {

            continue;

        }


        ctx.fillStyle =
            "#ffd83d";


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            13,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#fff4a3";


        ctx.beginPath();


        ctx.arc(
            x - 4,
            y - 4,
            4,
            0,
            Math.PI * 2
        );


        ctx.fill();

    }

}


// =====================================================
// 플레이어 그리기
// =====================================================

function drawPlayer() {

    const drawX =
        player.x -
        cameraX;


    const drawY =
        player.y;


    if (
        catImage.complete &&
        catImage.naturalWidth > 0
    ) {

        ctx.drawImage(

            catImage,

            drawX - 10,

            drawY - 20,

            80,

            80

        );

    } else {

        // 이미지가 아직 없을 경우
        // 임시 고양이

        ctx.fillStyle =
            "#f5a84b";


        ctx.fillRect(

            drawX,
            drawY,
            player.width,
            player.height

        );

    }

}


// =====================================================
// 게임 업데이트
// =====================================================

function update() {

    updatePlayer();

    updateCoins();

}


// =====================================================
// 게임 그리기
// =====================================================

function draw() {

    drawBackground();

    drawMap();

    drawCoins();

    drawPlayer();

}


// =====================================================
// 게임 루프
// =====================================================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


// 게임 시작

gameLoop();
