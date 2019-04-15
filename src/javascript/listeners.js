function addLiseners() {
    window.onresize = function(event) {
        //re-init everything on resize to prevent stretching
        global.ctx.canvas.width = window.innerWidth;
        global.ctx.canvas.height = window.innerHeight;

        if (global.title.complete) {
            initInfinite();
        }
    };
}