//column == 1 column of characters
function Column(x) {
    this.colData = [];
    this.size = 0;
    this.hasEnded = false;
    this.shouldRemove = false;
    this.shouldDraw = true;
    this.x = x || 0; // x position of each column
    this.endingY = 0;
    this.currentFadePos = 0; //keeps track of the chars fading away
    this.numSprites = 90;

    this.isTitleChar = false; //used to distinguish 

    this.start = {
        min: -20,
        max: 3
    }

    this.spriteSize = {
        width: 43,
        height: 57
    }

    //increment x based on the last column
    if (global.rain.length > 0) {
        this.x = global.rain[global.rain.length - 1].x + global.drawWidth;
    }

    //add a char to the end of a column
    this.appendChar = function() {
        var y = rand(this.start.min, this.start.max) * global.drawHeight;
        var character = rand(0, this.numSprites);

        if (this.size > 0) {
            y = this.colData[this.size - 1].y + global.drawHeight;
        }

        this.endingY = y;

        this.colData.push({
            "character": character,
            "y": y,
            "opacity": 1
        });

        this.size++;
    };

    //fading away effect
    this.removeChar = function() {
        for (var i = 0; i < this.currentFadePos; i++) {
            this.colData[i].opacity -= 0.25;
        }

        if (this.colData[0].opacity <= 0) {
            this.colData.splice(0, 1);
            this.size--;
            this.currentFadePos--;

            if (this.size == 0) {
                this.shouldRemove = false;
                this.reset();
            }
        }

        if (this.currentFadePos < this.size) {
            this.currentFadePos++;
        }
    };

    this.getReset = function() {
        var chance = rand(0, 100);

        if (chance < 20 && this.colData[this.size - 1].y > (window.innerHeight / 1.5)) {
            this.shouldRemove = true;
        }
    };

    this.reset = function() {
        this.colData = [];
        this.size = 0;
        this.currentFadePos = 0;
        this.appendChar();
    };

    this.show = function() {
        global.ctx.fillStyle = "lime";

        var sw = this.spriteSize.width;
        var sh = this.spriteSize.height;

        var dw = global.drawWidth;
        var dh = global.drawHeight;

        var sy = 0;

        for (var i = 0; i < this.size; i++) {
            var sx = this.colData[i].character * sw;

            //use white sprite
            if (i == this.size - 1) {
                sy = this.spriteSize.height;
            }

            //use title font
            if (this.isTitleChar) {
                //use the 3rd row of sprites
                //+3 is because you can see part of the other characters without it
                sy = this.spriteSize.height * 2 + 3;
                //sh = sh + 10;
            }

            global.ctx.save()

            global.ctx.globalAlpha = this.colData[i].opacity;
            global.ctx.drawImage(global.spSheet.img, sx, sy, sw, sh, this.x, this.colData[i].y, dw, dh);

            global.ctx.restore();
        }
    };
}