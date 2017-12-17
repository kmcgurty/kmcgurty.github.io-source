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
    title: {
        txt: "Belcome To The Matrix",
        complete: false,
        shouldFade: false,
        timeToFade: 3000,
        fadeRate: 0.5
    }
};

const MIN_TITLE_CHAR = 32; //minimum character in the ascii table, needed to offset the sprite sheet coords


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

            //initial rain down
            if (global.rain[i].shouldDraw) {
                if (!global.rain[i].shouldRemove) {
                    global.rain[i].appendChar();
                } else {
                    global.rain[i].removeChar();
                }
            }

            //once halfway down the page
            if (global.rain[i].endingY >= centerY) {
                global.rain[i].shouldRemove = true;
            }

            //once halfway and once the column is one char tall
            if (global.rain[i].size == 1 && global.rain[i].shouldRemove) {
                global.rain[i].shouldDraw = false;

                //start fading after x ms
                setTimeout(function() {
                    global.title.shouldFade = true;
                }, global.title.timeToFade);

                //after time has passed, start fading
                if (!global.title.shouldFade) {
                    global.rain[i].isTitleChar = true;

                    //due to how the spritesheet is setup, it's easy to translate the charchode
                    //to the position on the sprite sheet, just subtract MIN_TITLE_CHAR
                    global.rain[i].colData[0].character = global.title.txt[i].charCodeAt(0) - MIN_TITLE_CHAR;
                    global.rain[i].colData[0].opacity = 1;
                } else {
                    //start fading away here, once faded we are done
                    if (global.rain[i].colData[0].opacity > 0) {
                        global.rain[i].colData[0].opacity = (global.rain[i].colData[0].opacity - .05).toFixed(5);
                    } else {
                        setTimeout(function() {
                            global.title.complete = true;
                        }, 1000)
                    }
                }
            }


            global.rain[i].show();
        }

        //if title has faded away completely, draw infinitely
        if (!global.title.complete) {
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
            if (!global.rain[i].shouldRemove) {
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
    global.cols = global.title.txt.length;

    var offsetCenterX = (global.cols * global.drawWidth) / 2;
    var centerX = (global.ctx.canvas.width / 2) - offsetCenterX;

    for (var i = 0; i < global.title.txt.length; i++) {
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