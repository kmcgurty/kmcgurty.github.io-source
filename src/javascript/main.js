var global = {
    fpsCap: 15,
    displayFps: true,
    pause: false,
    displayBoxes: true,
    ctx: null,
    rain: [],
    spSheet: {
        img: null,
        width: 43,
        height: 57,
        numSprites: 90
    },
    background: null,
    cols: 0,
    drawWidth: 23,
    drawHeight: 35
};

window.onload = init;

function init() {
    loadHTML();
    loadSpriteSheet();
    addLiseners();
    canvasSetup();
    draw();
}

function canvasSetup() {
    global.rain = [];

    var canvas = document.getElementById('matrix-rain');
    global.ctx = canvas.getContext("2d");
    global.ctx.canvas.width = window.innerWidth;
    global.ctx.canvas.height = window.innerHeight;
    global.background = createBackground();

    global.cols = Math.ceil(window.innerWidth / global.drawWidth);


    for (var i = 0; i < global.cols; i++) {
        global.rain[i] = new Column();
    }
}

function draw() {
    if (global.displayFps) {
        document.querySelector("#fps-counter").innerHTML = countFPS() + "/" + global.fpsCap;
    }

    setTimeout(function() { //rate limit drawing
        global.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        global.ctx.fillStyle = global.background; //striped monitor-like background
        global.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        global.ctx.save();

        for (var i = 0; i < global.cols; i++) {
            if (!global.rain[i].shouldReset) {
                global.rain[i].appendChar();
                global.rain[i].getReset();
            } else {
                global.rain[i].removeChar();
            }

            global.rain[i].show();
        }

        global.ctx.restore();

        if (!global.pause) {
            requestAnimationFrame(draw);
        }
    }, 1000 / global.fpsCap);
}

countFPS = (function() {
    var lastLoop = (new Date()).getMilliseconds();
    var count = 1;
    var fps = 0;

    return function() {
        var currentLoop = (new Date()).getMilliseconds();
        if (lastLoop > currentLoop) {
            fps = count;
            count = 1;
        } else {
            count += 1;
        }
        lastLoop = currentLoop;
        return fps;
    };
}());

function loadSpriteSheet() {
    global.spSheet.img = new Image();
    global.spSheet.img.src = "/images/sprite-sheet.png";
}

function createBackground() {
    //special thanks to http://stackoverflow.com/questions/9019220/html5-canvas-fill-with-two-colours
    //for the striped background
    var pattern = document.createElement('canvas');
    pattern.width = window.innerWidth;
    pattern.height = 10;
    var pctx = pattern.getContext('2d');

    pctx.fillStyle = "rgb(25, 25, 25)";
    pctx.fillRect(0, 0, pattern.width, pattern.height);
    pctx.fillStyle = "rgb(20, 20, 20)";
    pctx.fillRect(0, (pattern.height / 2), pattern.width, pattern.height);

    return pctx.createPattern(pattern, "repeat");
}

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}