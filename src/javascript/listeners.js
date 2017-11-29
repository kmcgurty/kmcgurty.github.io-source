function loadHTML() {
    $.getJSON("./javascript/links.json", function(result) {
        var data = result.d;
        var toAppend = document.querySelector(".nav-box-wrapper .nav-box");
        var html = "";

        for (var i = 0; i < data.length; i++) {
            html += '<div class="button-wrapper"><div class="nav-button"><a href="' + data[i].link + '">' + data[i].title + '</a></div></div';
        }

        toAppend.innerHTML = html;
    });
}


function addLiseners() {
    window.onresize = function(event) {
        //re-init everything on resize to prevent stretching
        canvasSetup();
    };

    document.getElementById("stop-anim").addEventListener("click", function() {
        global.pause = !global.pause;
        draw();
    });

    document.getElementById("toggle-fps").addEventListener("change", function() {
        global.displayFps = !global.displayFps;
        document.getElementById("fps-counter").innerHTML = "";
    });

    document.getElementById("change-fps").addEventListener("input", function(event) {
        console.log("im gay");


        var fps = event.target.valueAsNumber;

        if (isNaN(fps)) {
            fps = 20;
        }

        global.fpsCap = fps;
    });

    document.getElementById("hide-show-controls").addEventListener("click", function() {
        var controlBox = document.getElementsByClassName("control-box")[0];
        var isExpanded = controlBox.className.indexOf("expanded") !== -1;
        var hideShowControls = document.querySelector("#hide-show-controls .box-title");

        if (isExpanded) {
            controlBox.className = "control-box collapsed";
            hideShowControls.innerHTML = "Controls ▶";
        } else {
            controlBox.className = "control-box expanded";
            hideShowControls.innerHTML = "Controls ▼";
        }
    });

    document.getElementById("toggle-cat").addEventListener("click", function() {
        global.fillPattern = !global.fillPattern;
    });

    document.querySelector(".toggle-boxes").addEventListener("click", function() {
        var areShown = global.displayBoxes;
        var boxes = document.querySelector(".box-wrapper");
        var button = document.querySelector(".toggle-boxes .nav-button");

        global.displayBoxes = !global.displayBoxes;

        if (areShown) {
            boxes.style.display = "none";
            button.innerHTML = "Show boxes";
        } else {
            boxes.style.display = "";
            button.innerHTML = "Hide boxes";
        }
    });

    window.onLoad = function() {
        document.getElementById("change-fps").value = global.fps;

        if (!global.displayBoxes) {
            document.querySelector(".box-wrapper").style.display = "none";
            document.querySelector(".toggle-boxes .nav-button").innerHTML = "Show boxes";
        }
    };
}