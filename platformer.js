
px = py = 200;
xv = yv = 0;
grav = 0.5;
holdleft = holdright = paused = false;
onG = false;
plats = [];
obstacles = [];
framesPerSecond = 40;
var platform, plat1, plat2, platform2, intrVal;

window.onload = function () {
    canv = document.getElementById('cv');
    ctx = canv.getContext('2d');
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    frameNo = 0;
    intrVal = setInterval(update, 1000 / framesPerSecond);
    drawEverything();
    /* Platform generator */
    plats.push(
        {
            x: 0,
            y: canv.height / 2,
            width: canv.width,
            height: canv.height / 2
        }
    );
}

function update() {
    frameNo++;
    if (holdleft) {
        xv = -3;
    }
    if (holdright) {
        xv = 3;
    }
    //player.x += xv;
    platform.x -= xv;
    platform2.x -= xv;
    platform3.x -= xv;

    player.y += yv;


    if (onG) {
        xv *= 0.8;              // adding friction when onG
    } else {
        yv += grav;            // add gravity while not onG
    }

    onG = false;                //on ground set false by default

    // check whether player is in a platform

    if (player.x > platform.x && player.x < platform.x + platform.width && player.y > platform.y && player.y < platform.y + platform.height) {
        player.y = platform.y;
        onG = true;
    }

    // Add hovering platforms 
    if (frameNo % 50 == 0) {
        obstacles.push(new component(100, (canv.height / 2) - Math.floor(Math.random() * (300 - 100) + 100), "#ecf0f1", 100, 10));
        //obstacles.push(new component(100, (canv.height / 2) - Math.floor(Math.random()*(300 - 100)+100), "black", 3, 3));
    }

    // Add ground platforms


    background.update();
    ctx.fillStyle = "red";
    ctx.fillRect(300, 100, 40, 40);
    platform.update();
    platform2.update();
    platform3.update();
    //player.newPos();
    player.update();

    for (i = 0; i < obstacles.length; i++) {
        obstacles[i].x += 3;
        obstacles[i].update();
    }

    //drawEverything();

}

function component(x, y, color, width, height) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        //ctx = canv.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function drawEverything() {
    /*    background = new Image();
        background.src = "./background.png";
        ctx.drawImage(background, 0, 0, 800, 600)
    */
    background = new component(0, 0, "#3498db", 800, 600);
    background.update();

    platform = new component(0, canv.height / 2, "#ecf0f1", canv.width, canv.height / 2)
    platform.update();

    player = new component(200, 200, "#f1c40f", 20, -20);
    player.update();

    platform2 = new component(canv.width + 100, canv.height / 2, "#ecf0f1", canv.width, canv.height / 2)
    platform2.update();

    platform3 = new component(canv.width, (canv.height / 2) + 100, "#ecf0f1", 100, (canv.height / 2) + 100)
    platform3.update();

}

function keyDown(event) {
    switch (event.keyCode) {
        case 37: holdleft = true;
            break;
        case 38: if (onG) {
            yv = -10;
        }
            break;
        case 39: holdright = true;
            break;
    }
}

function keyUp(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
        case 37: holdleft = false;
            break;
        case 38: if (yv < -3) {
            yv = -3;
        }
            break;
        case 39: holdright = false;
            break;
        case 80: paused = !paused;
            if (!paused) {
                intrVal = setInterval(update, 1000 / framesPerSecond);
            } else {
                ctx.font = "30px Arial";
                ctx.fillText("Paused",canv.width/2 - 80,canv.height/4);
                clearInterval(intrVal);
            }
            break;
    }
}



