//column == 1 column of characters
function Column() {
    this.colData = [];
    this.size = 0;
    this.hasEnded = false;
    this.shouldReset = false;
    this.x = 0;
    this.currentFadePos = 0;


    //increment x based on the last column
    if (global.rain.length > 0) {
        this.x = global.rain[global.rain.length - 1].x + global.drawWidth;
    }

    //add a char to the end of a column
    this.appendChar = function() {
        var y = rand(0, 200);
        var opacity = 1;
        var character = rand(0, global.spSheet.numSprites);

        if (this.size > 0) {
            y = this.colData[this.size - 1].y + global.drawHeight;
        }

        this.colData.push({
            "character": character,
            "y": y,
            "opacity": opacity
        });

        this.size++;
    };

    this.removeChar = function() {
        for (var i = 0; i < this.currentFadePos; i++) {
            this.colData[i].opacity -= 0.25;

            // this.colData.splice(0, 1);
            // this.size--;

            // if (this.size === 0) {
            //     this.shouldReset = false;
            //     this.reset();
            // }
        }

        if (this.colData[0].opacity <= 0) {
            this.colData.splice(0, 1);
            this.size--;
            this.currentFadePos--;

            if (this.size == 0) {
                this.shouldReset = false;
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
            this.shouldReset = true;
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

        var sw = global.spSheet.width;
        var sh = global.spSheet.height;

        var dw = global.drawWidth;
        var dh = global.drawHeight;

        var sy = 0;

        for (var i = 0; i < this.size; i++) {
            var sx = this.colData[i].character * sw;

            //use white sprite
            if (i == this.size - 1) {
                sy = global.spSheet.height;
                //sh += 15;
            }

            global.ctx.save()

            global.ctx.globalAlpha = this.colData[i].opacity;
            global.ctx.drawImage(global.spSheet.img, sx, sy, sw, sh, this.x, this.colData[i].y, dw, dh);

            global.ctx.restore();
        }
    };
}