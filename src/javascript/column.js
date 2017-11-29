//column == 1 column of characters
function Column() {
    this.spriteData = [];
    this.size = 0;
    this.hasEnded = false;
    this.shouldReset = 0;
    this.x = 0;

    //increment x based on the last column
    if (global.rain.length > 0) {
        this.x = global.rain[global.rain.length - 1].x + global.drawWidth;
    }

    //add a char to the end of a column
    this.appendChar = function() {
        var y = rand(0, 200);
        var spriteNum = rand(0, global.spSheet.numSprites);

        if (this.size > 0) {
            y = this.spriteData[this.size - 1].y + global.drawHeight;
        }

        this.spriteData.push({
            "spriteNum": spriteNum,
            "y": y
        });

        this.size++;
    };

    this.removeChar = function() {
        this.spriteData.splice(0, 1);
        this.size--;

        if (this.size === 0) {
            this.shouldReset = false;
            this.reset();
        }
    };

    this.getReset = function() {
        var chance = rand(0, 100);

        if (chance < 20 && this.spriteData[this.size - 1].y > (window.innerHeight / 1.5)) {
            this.shouldReset = true;
        }
    };

    this.reset = function() {
        this.spriteData = [];
        this.size = 0;
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
            var sx = this.spriteData[i].spriteNum * sw;

            //use white sprite
            if (i == this.size - 1) {
                sy = global.spSheet.height;
                //sh += 15;
            }

            global.ctx.drawImage(global.spSheet.img, sx, sy, sw, sh, this.x, this.spriteData[i].y, dw, dh);
        }
    };
}