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
        toggleBoxes();
    });
}