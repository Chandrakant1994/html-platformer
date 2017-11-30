
px = py = 200;
xv = yv = 0;
grav = 0.5;
holdleft = holdright = paused = false;
onG = false;
plats = [];
obstacles = [];
framesPerSecond = 70;
health = 3;
var plat, platform, plat1, plat2, platform2, intrVal;

window.onload = function () {
    canv = document.getElementById('cv');
    ctx = canv.getContext('2d');
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    frameNo = 0;
    drawEverything();
    beginGame();
    /* Platform generator */
}

function update() {
    frameNo++;
    background.update();
    if (holdleft) {
        xv = -3;
    }
    if (holdright) {
        xv = 3;
    }

    player.y += yv;

    if (onG) {
        xv *= 0.8;              // adding friction when onG
    } else {
        yv += grav;            // add gravity while not onG
    }

    onG = false;                //on ground set false by default

    // check whether player is in a platform
    for (i = 0; i < plats.length; i++) {

        if ((player.x + player.width > plats[i].x) &&
            (player.x < plats[i].x + plats[i].width)) {

            if ((player.y > plats[i].y) &&
                (player.y + player.height < plats[i].y)) {

                player.y = plats[i].y;
                player.angle = 0;                                       // To land player on ground without any roation angle
                onG = true;
            }

            if ((player.y > plats[i].y) &&
                (player.y + player.height >= plats[i].y)) {

                if (player.x < plats[i].x) {
                    if (holdright)
                        xv = 0;

                    console.log(player.x + player.width, plats[i].x)

                }

                if (player.x > plats[i].x)
                    if (holdleft)
                        xv = 0;
            }
        }

        plats[i].x -= xv;
        plats[i].update();

    }

    for (i = 0; i < obstacles.length; i++) {

        if ((player.x + player.width > obstacles[i].x) &&
            (player.x + player.width < obstacles[i].x + obstacles[i].width)) {

            if ((player.y + player.height > obstacles[i].y) && (player.y + player.height < obstacles[i].y + obstacles[i].height) ||
                (player.y > obstacles[i].y) && (player.y < obstacles[i].y + obstacles[i].height)) {

                if (health == 0) {

                    clearInterval(intrVal);
                    ctx.font = "30px Arial";
                    ctx.fillStyle = "red";
                    ctx.fillText("You Died", canv.width / 2 - 80, canv.height / 4);

                    ctx.font = "30px Arial";
                    ctx.fillStyle = "White";
                    ctx.fillText("Restart ?", canv.width / 2 - 80, canv.height / 4 + 100);

                }

                obstacles.splice(i, 1);
                health--;
            }
        }
    }

    // Add hovering platforms 
    if (frameNo % 50 == 0) {
        //obstacles.push(new component(100, (canv.height / 2) - Math.floor(Math.random() * (300 - 100) + 100), "#ecf0f1", 100, 10));
        generateEnemies();
    }

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 40, 40);
    ctx.font = "25px";
    ctx.fillStyle = "white";
    ctx.fillText("Score : " + Math.floor((player.x - (platform.x + 200)) / 15), canv.width - 200, 40);


    if (!onG) {
        player.angle += 16 * Math.PI / 180;
    }
    player.update();

    for (i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= 5;
        obstacles[i].update();
    }

    // Add ground platforms
    if (plats[plats.length - 1].x + plats[plats.length - 1].width < canv.width - 100)
        generatePlatform();

    if (player.y > canv.height) {
        clearInterval(intrVal);
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("You Died", canv.width / 2 - 80, canv.height / 4);

        ctx.font = "30px Arial";
        ctx.fillStyle = "White";
        ctx.fillText("Restart ?", canv.width / 2 - 80, canv.height / 4 + 100);
    }

}

function component(x, y, color, width, height, type) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.type = type;
    this.speedX = 0;
    this.speedY = 0;
    this.angle = 0;
    this.update = function () {
        //ctx = canv.getContext('2d');
        if (this.angle == 0) {
            if (this.type == "stroked") {
                ctx.fillStyle = this.color;
                ctx.lineWidth = 7;
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
            else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
        else {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = this.color;
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        }
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

    platform = new component(0, canv.height / 2, "#ecf0f1", canv.width, canv.height / 2, "plane")
    platform.update();

    player = new component(200, 0, "#f1c40f", 30, -30, "plane"); // #e67e22 
    player.update();

    platform2 = new component(canv.width, (canv.height / 2) - 100, "#ecf0f1", 100, (canv.height / 2) + 100, "last")
    platform2.update();

    platform3 = new component(canv.width + 100, canv.height / 2, "#ecf0f1", canv.width, canv.height / 2, "plane")
    platform3.update();

    lava = new component(-100, (canv.height / 2) + 100, "#e74c3c", 100, canv.height / 2, "lava")
    lava.update();

    plats.push(platform);
    plats.push(platform2);
    plats.push(platform3);
    plats.push(lava);


}

function beginGame() {
    intrVal = setInterval(update, 1000 / framesPerSecond);
}

function generatePlatform() {
    plats.push(new component(canv.width, canv.height / 2, "#ecf0f1", canv.width, canv.height / 2, "plane"));
}

function generateEnemies() {
    obstacles.push(new component(canv.width, (canv.height / 2) - (Math.floor(Math.random() * (350 - 10)) + 10), "blue", 20, 20, "stroked"));
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
        case 40: player.height = -15;
            break;
    }
}

function keyUp(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
        case 13: beginGame();
            break;
        case 37: holdleft = false;
            break;
        case 38: if (yv < -3) {
            yv = -3;
        }
            break;
        case 39: holdright = false;
            break;
        case 40: //player.height = -30;
            break;
        case 80: paused = !paused;
            if (!paused) {
                intrVal = setInterval(update, 1000 / framesPerSecond);
            } else {
                ctx.font = "30px Arial";
                ctx.fillText("Paused", canv.width / 2 - 80, canv.height / 4);
                clearInterval(intrVal);
            }
            break;
    }
}



