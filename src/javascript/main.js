var global = {
    fpsCap: 15,
    pause: false,
    displayBoxes: true, // boxes are toggled off later on
    ctx: null,
    rain: [],
    spSheet: {
        img: null
    },
    background: null, //background pattern
    cols: 0, //number of columns on the screen
    drawWidth: 23, //char px
    drawHeight: 35, //char px
    titleSequenceTxt: [22, 4, 11, 2, 14, 12, 4, 26, 19, 14, 26, 19, 7, 4, 26, 12, 0, 19, 17, 8, 23],
    titleComplete: false,
    fadeTitle: false
};


window.onload = init; //let's begin


function init() {
    loadSpriteSheet();
    loadHTML();
    addLiseners();

    toggleBoxes();

    canvasSetup();

    initTitleSeq();
    drawTitleSequence();
}


function drawTitleSequence() {
    var centerY = (Math.floor((global.ctx.canvas.height / 2) / global.drawHeight) * global.drawHeight);

    setTimeout(function() {
        setBackgrnd();

        for (var i = 0; i < global.cols; i++) {
            if (global.rain[i].shouldDraw) {
                if (!global.rain[i].shouldReset) {
                    global.rain[i].appendChar();
                } else {
                    global.rain[i].removeChar();
                }
            }

            if (global.rain[i].endingY >= centerY) {
                global.rain[i].shouldReset = true;
            }

            if (global.rain[i].size == 1 && global.rain[i].shouldReset) {
                global.rain[i].shouldDraw = false;

                if (!global.fadeTitle) {
                    global.rain[i].titleChar = true;
                    global.rain[i].colData[0].character = global.titleSequenceTxt[i];
                    global.rain[i].colData[0].opacity = 1;
                } else {
                    console.log(global.rain[i].colData[0].opacity)

                    if (global.rain[i].colData[0].opacity > 0.01) {
                        global.rain[i].colData[0].opacity -= .03;
                    } else {
                        setTimeout(function() {
                            global.titleComplete = true;
                        }, 1000)
                    }
                }

                setTimeout(function() {
                    global.fadeTitle = true;
                }, 5000)
            }


            global.rain[i].show();
        }

        if (!global.titleComplete) {
            requestAnimationFrame(drawTitleSequence);
        } else {
            initInfinite();
            drawInfinite();
        }
    }, 1000 / global.fpsCap);
}


function drawInfinite() {
    setTimeout(function() { //rate limit drawing
        setBackgrnd();

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
            requestAnimationFrame(drawInfinite);
        }
    }, 1000 / global.fpsCap);
}


function canvasSetup() {
    var canvas = document.getElementById('matrix-rain');
    global.ctx = canvas.getContext("2d");
    global.ctx.canvas.width = window.innerWidth;
    global.ctx.canvas.height = window.innerHeight;
    global.background = createBackground();
}


function initTitleSeq() {
    global.rain = [];
    global.cols = global.titleSequenceTxt.length;

    var offsetCenterX = (global.cols * global.drawWidth) / 2;
    var centerX = (global.ctx.canvas.width / 2) - offsetCenterX;

    for (var i = 0; i < global.titleSequenceTxt.length; i++) {
        global.rain[i] = new Column(centerX);
    }
}


function initInfinite() {
    global.rain = [];

    global.cols = Math.ceil(window.innerWidth / global.drawWidth);

    for (var i = 0; i < global.cols; i++) {
        global.rain[i] = new Column();
    }
}


function setBackgrnd() {
    global.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    global.ctx.fillStyle = global.background; //striped monitor-like background
    global.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}


function loadSpriteSheet() {
    global.spSheet.img = new Image();
    global.spSheet.img.src = "/images/sprite-sheet.png";
}


function toggleBoxes() {
    var visible = global.displayBoxes;
    var boxes = document.querySelector(".box-wrapper");
    var button = document.querySelector(".toggle-boxes .nav-button");

    if (visible) {
        boxes.style.display = "none";
        button.innerHTML = "Show boxes";
    } else {
        boxes.style.display = "";
        button.innerHTML = "Hide boxes";
    }

    global.displayBoxes = !global.displayBoxes;
}

function convertTitleTxt() {

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