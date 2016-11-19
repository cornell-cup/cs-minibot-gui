var radius = 10;
var left_motor = 0;
var right_motor = 0;

/*
var sensors = [
    [radius, radius],
    [-radius, radius],
    [0, radius * 1.6]
];*/

// list of sensors and their relative sizes to the robot
var sensors = [
    [radius, -radius *0.5],
    [radius, radius * 0.5],
    [radius*1.5, -radius*0.3],
    [radius*1.5, radius*0.3],
    [radius*2, 0]
];

// starting position of the robot
var px = 400;
var py = 400;
var rot = 0;

// the javascript code loaded from the text area
var code = new Function();
var state = {};

var canvas;
var ctx, itx;
var floor;

var paused = false;

// height and width of the canvas
var width = 800;
var height = 800;

// read in javascript from script file in same directory and loads into the text area
function readTextFile()
{
    // document.getElementById("code").value = "Hello";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", '/script.txt');
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                document.getElementById("code").value = allText;
            }
        }
    }
    rawFile.send();
}

// the drawing loop of the html canvas 
function frame() {

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, 800, 800);
    // Draw the floor
    ctx.drawImage(floor, 0, 0);

    ctx.globalCompositeOperation = "multiply";
    ctx.strokeStyle = "light gray";
    var squareSize = 40;
    for (x = 0; x <= width; x += squareSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        for (y = 0; y <= height; y += squareSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
    }   
    ctx.stroke();

    ctx.globalCompositeOperation = "source-over";

    // Update sensor readings
    var readings = [];
    for (var i = 0; i < sensors.length; i++) {
        var x = ~~(px + Math.cos(rot) * sensors[i][0] - Math.sin(rot) * sensors[i][1]);
        var y = ~~(py + Math.sin(rot) * sensors[i][0] + Math.cos(rot) * sensors[i][1]);
        if (x >= 0 && y >= 0 && x < 800 && y < 800) {
            var color = itx.getImageData(x, y, 1, 1).data;
            ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            ctx.fillRect(20 + 60 * i, 20, 40, 40);
            ctx.strokeStyle = "black";
            ctx.strokeRect(20 + 60 * i, 20, 40, 40);
            readings.push((color[0] + color[1] + color[2]) / 3);
        }
        ctx.fillStyle = "teal"; 
        ctx.fillText("Sensor " + i, 20 + 60 * i, 15);
    }
    
    // Draw the bot
    ctx.save();
    // Transform
    ctx.translate(px, py);

    ctx.rotate(rot);
    // Draw the body
    ctx.lineWidth = 3;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    // Draw sensors
    ctx.strokeStyle = "red";
    for (var i = 0; i < sensors.length; i++) {
        ctx.beginPath();
        ctx.arc(sensors[i][0], sensors[i][1], radius / 5, 0, 2 * Math.PI);
        ctx.stroke();
    }
    ctx.restore();
    
    // Run the code

    if(!paused){
        var controls = code(state, readings);
        if (controls && controls.length == 2) {
            left_motor = controls[1];
            right_motor = controls[0];
        }
        // Update position and rotation
        var new_px = px;
        var new_py = py;
        var new_rot = rot;
        if (Math.abs(left_motor - right_motor) < 1.0e-6) { // basically going straight
            new_px = px + left_motor  * Math.cos(rot);
            new_py = py + right_motor * Math.sin(rot);
            new_rot = rot;
        }
        else {
            var r = (radius * 2) * (left_motor + right_motor) / (2 * (right_motor - left_motor));
            var wd = (right_motor - left_motor) / (radius * 2);

            new_px = px + r * Math.sin(wd + rot) - r * Math.sin(rot);
            new_py = py - r * Math.cos(wd + rot) + r * Math.cos(rot);
            new_rot = (rot + wd) % (2 * Math.PI);
        }
        px = new_px;
        py = new_py;
        rot = new_rot;
        //console.log(rot);
    }
    
    
    

}

function xLocation(canvas,event){    
    return (event.clientX - canvas.offsetLeft)/canvas.offsetWidth * 800;
}

function yLocation(canvas,event){
    return (event.clientY - canvas.offsetTop)/(canvas.offsetHeight)*800;
}

window.addEventListener("load", function() {

    canvas = document.getElementById("sc");
    ctx = canvas.getContext("2d");
    floor = document.getElementById("floor");

    var icanvas = document.getElementById("ic");
    itx = icanvas.getContext("2d");
    itx.drawImage(floor, 0, 0);

    readTextFile();

    canvas.addEventListener("click", function(event){
        px = xLocation(canvas,event);
        py = yLocation(canvas,event);
        console.log(px + " " + py);

    });
            

    document.getElementById("run").addEventListener("click", function() {
        // px = 400;
        // py = 400;
        // rot = 0;
        // left_motor = 0;
        // right_motor = 0;
        
        state = {};
        code = new Function('state', 'sensor', document.getElementById("code").value);
    });

    document.getElementById("pause").addEventListener("click", function() {
        if(paused){
            console.log("unpaused");
            document.getElementById("pause").innerHTML= "Unpaused";
            paused = false;
        }
        else{
            document.getElementById("pause").innerHTML= "Paused";
            paused = true;
        }
    })
    setInterval(frame, 4);
});