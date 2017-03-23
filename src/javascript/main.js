var global = {
    fpsCap: 20,
    displayFps: true,
    pause: false,
    shadows: false,
    fontSize: 37,
    displayBoxes: true,
    ctx: null,
    rain: [],
    background: null,
    cols: 0
};

window.onload = init;

function init() {
    loadHTML();
    addLiseners();
    canvasSetup();
}

function canvasSetup() {
    global.rain = [];

    var canvas = document.getElementById('matrix-rain');
    global.ctx = canvas.getContext("2d");
    global.ctx.canvas.width = window.innerWidth;
    global.ctx.canvas.height = window.innerHeight;
    global.ctx.font = global.fontSize + "px  matrix-font";
    global.background = createBackground();

    global.cols = Math.ceil(window.innerWidth / global.fontSize); //multiply by two to fill the other half of the page

    for (var i = 0; i < global.cols; i++) {
        global.rain[i] = new Stream();
        global.rain[i].appendChar();
    }

    draw();
}

function draw() {
    if (global.displayFps) {
        document.querySelector("#fps-counter").innerHTML = countFPS() + "/" + global.fpsCap;
    }

    if (!global.pause) {
        setTimeout(function() { //rate limit drawing
            global.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            global.ctx.fillStyle = global.background; //striped monitor-like background
            global.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            global.ctx.save();

            if (global.shadows) {

                global.ctx.shadowBlur = 15;
                global.ctx.shadowColor = "lime";

            }

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

            requestAnimationFrame(draw);
        }, 1000 / global.fpsCap);
    }
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

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
