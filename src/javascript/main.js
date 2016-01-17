//simply put, each column (an array of information) of text is constantly getting letters added and removed from it 

(function() {

    var options = {
        matrixLetters: ['!', '"', '#', '$', '%', '&', '(', ')', '*', '+', ',', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', ']', '^', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~'],
        textSize: 30,
        useTextShadows: false, //shadows cause major performance problems
        fps: 20
    };

    addEventListeners();
    var columnData = columnDataInit();
    var ctx = canvasInit();
    var pattern = createPattern();

    var animLoop = setInterval(draw, 1000 / options.fps);

    function canvasInit() {
        var canvas = document.getElementById('matrix-rain');
        var ctx = canvas.getContext("2d");
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        ctx.font = options.textSize + "px  matrix-font";

        if (options.useTextShadows) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "lime";
        }

        return ctx;
    }

    function columnDataInit() {
        var numColumns = Math.ceil(window.innerWidth / options.textSize), //multiply by two to fill the other half of the page
            columnData = [],
            xPos;

        for (var i = 0; i < numColumns; i++) {
            //init the xposition of each column
            if (typeof columnData[i - 1] === 'undefined') {
                xPos = 0;
            } else {
                xPos = (columnData[i - 1].xPos + options.textSize); //divide by two since we doubled it above. this pushes the columns closer together (to be honest, I don't know why...)
            }

            //have a random starting position so they don't fall at the same time
            var yPos = randomInt(0, 200);

            columnData[i] = {
                xPos: xPos, //x position of the column
                yPos: yPos, //y position of the last character
                charData: [], //character and character position. is generated later with addCharToColumn()
                hasEnded: false
            };
        }

        return columnData;
    }

    function draw() {
        document.getElementById("fps-counter").innerHTML = "FPS: " + calculateFPS() + "/" + options.fps;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        //fill background for fade effect
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fill();
        //fill for text
        ctx.fillStyle = "lime";

        for (var i = 0; i < columnData.length; i++) {
            //add a random letter to the bottom of each column if it hasn't ended yet
            if (!columnData[i].hasEnded) {
                addCharToColumn(i);
            }

            for (var j = 0; j < columnData[i].charData.length; j++) {
                //color the last character white, otherwise color it green
                if (j == columnData[i].charData.length - 1) {
                    ctx.fillStyle = "white";
                } else {
                    ctx.fillStyle = "lime";
                }
                ctx.fillText(columnData[i].charData[j].character, columnData[i].xPos, columnData[i].charData[j].charPosition);
            }

            //increment the height of textSize
            columnData[i].yPos += options.textSize;

            var randomChance = randomInt(0, 1000);

            //40% chance
            if (randomChance <= 400) {
                var randomColumn = randomInt(0, columnData.length);
                var randomCharData = randomInt(0, columnData[randomColumn].charData.length);
                var randomReplacementChar = getRandomChar();

                //sometimes randomCharData can be 0 which = undefined (I couldn't be bothered to figure out why)
                if (randomCharData !== 0) {
                    columnData[randomColumn].charData[randomCharData].character = randomReplacementChar;
                }
            }

            //5% chance and 20% chance
            if (randomChance < 50 && columnData[i].yPos > (window.innerHeight / 2) ||
                randomChance < 200 && columnData[i].yPos > (window.innerHeight / 1.5)) {

                columnData[i].hasEnded = true;
            }

            //once ia column has ended, start remove the first letter
            if (columnData[i].hasEnded) {
                columnData[i].charData.shift();

                if (columnData[i].charData.length === 0) {
                    //when the column has nothing left, reset hasEnded and reset the yPos
                    columnData[i].hasEnded = false;
                    columnData[i].yPos = randomInt(0, 200);
                }
            }
        }
    }

    var lastLoop = new Date();

    function calculateFPS() {
        //fps, thanks to http://stackoverflow.com/questions/4787431/check-fps-in-js
        var thisLoop = new Date();
        var fps = Math.floor(1000 / (thisLoop - lastLoop));
        lastLoop = thisLoop;
        return fps;
    }

    //add a character to the end of a cloumn
    function addCharToColumn(column, reset) {
        var character = getRandomChar(),
            charPosition,
            lastChar = columnData[column].charData.length - 1;

        if (typeof columnData[column].charData[lastChar - 1] === 'undefined') {
            charPosition = columnData[column].yPos;
        } else {
            charPosition = columnData[column].charData[lastChar].charPosition + options.textSize;
        }

        columnData[column].charData.push({
            character: character,
            charPosition: charPosition
        });
    }


    function createPattern() {
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

        return ctx.createPattern(pattern, "repeat");
    }

    function addEventListeners() {
        window.onresize = function(event) {
            //re-init everything on resize to prevent stretching
            ctx = canvasInit();
            columnData = columnDataInit();
        };

        document.getElementById("stop-anim").addEventListener("click", function() {
            if (animLoop) {
                clearInterval(animLoop);
                animLoop = false;
                document.getElementById("stop-anim").text = "Start animation";
            } else {
                animLoop = setInterval(draw, 1000 / options.fps);
                document.getElementById("stop-anim").text = "Stop animation";
            }
        });

        document.getElementById("toggle-shadows").addEventListener("change", function() {
            options.useTextShadows = !options.useTextShadows;
            ctx = canvasInit();
        });

    }

    function getRandomChar() {
        return options.matrixLetters[randomInt(0, options.matrixLetters.length)];
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

})();
