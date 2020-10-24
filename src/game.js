
//     function yield_x(x){
//         if(x > 9) return x - 10;
//         if(x < 0) return x + 10;
//         return x;
//     }

//     function yield_y(y){
//         if(y > 9) return y - 10;
//         if(y < 0) return y + 10;
//         return y;
//     }

//     function resize() {
//         // Lookup the size the browser is displaying the canvas.
//         var displayWidth  = canvas.clientWidth;
//         var displayHeight = canvas.clientHeight;

//         // TODO: CHECK IF THERE IS AN EVENT LISTENER FOR RESIZING (THE WINDOW)

//         //console.log("ENTERED RESIZING FUNCTION");

//         // Check if the canvas is not the same size.
//         if (canvas.width  != displayWidth ||
//             canvas.height != displayHeight) {

//             console.log("RESIZING CANVAS");

//             // Make the canvas the same size
//             canvas.width  = displayWidth;
//             canvas.height = displayHeight;

//             // video.width  = displayWidth;
//             // video.height = displayHeight;

//             // gl.bindTexture(gl.TEXTURE_2D, color1Texture);
//             // gl.texImage2D(gl.TEXTURE_2D,
//             //     0,
//             //     gl.RGBA,
//             //     canvas.width,
//             //     canvas.height,
//             //     0,
//             //     gl.RGBA,
//             //     gl.UNSIGNED_BYTE,
//             //     null
//             // );

//         }
//     }


window.onload = (event) => {
  console.log('page is fully loaded');
        'use strict';

var left_distance = 0.0;

var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

var canvas = document.getElementById('canvas'),
    fps = 60,
    interval     =    1000/fps,
    // interval     =    3000,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0;

var gl = canvas.getContext('webgl2', {
    antialias: false,
    premultipliedAlpha: false,
    alpha: true
});


var isWebGL2 = !!gl;
if (!isWebGL2) {
    document.getElementById('info').innerHTML = 'WebGL 2 is not available.  See <a href="https://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">How to get a WebGL 2 implementation</a>';
    return;
}

var DEBUG_GENERIC = true;

        // var image = new Image();
        // requestCORSIfNotSameOrigin(image, "https://webglfundamentals.org/webgl/resources/leaves.jpg")
        // image.src = "https://webglfundamentals.org/webgl/resources/leaves.jpg";



var resize = function(canvas, gl) {

    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;

    if (canvas.width != displayWidth || canvas.height != displayHeight) {

        if (DEBUG_GENERIC)
            console.log("RESIZING CANVAS");

        canvas.width = displayWidth;
        canvas.height = displayHeight;

    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    render(gl);

}

        // var shader_vs = basic_vs_source.replace(/^\s+|\s+$/g, '');
        // var basic_fs = basic_fs_text.replace(/^\s+|\s+$/g, '');
        // var shader_basic = createProgram(gl, shader_vs, basic_fs);
        var program = createProgram(gl, textured_vs_text, textured_fs_text);

        // look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(program, "a_position");
        var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

        // Create a buffer to put three 2d clip space points in
        var positionBuffer = gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Set a rectangle the same size as the image.
        // THIS NEEDS FIXING: ambiguous silly name
        // setRectangle(gl, 0, 0, canvas.width, canvas.height);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            canvas.width, 0,
            0, canvas.height,
            0, canvas.height,
            canvas.width, 0,
            canvas.width, canvas.height,
        ]), gl.STATIC_DRAW);

        // provide texture coordinates for the rectangle.
        var texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ]), gl.STATIC_DRAW);

        // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('image_data'));

        // lookup uniforms
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

        // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the position attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2; // 2 components per iteration
        var type = gl.FLOAT; // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);

        // Turn on the texcoord attribute
        gl.enableVertexAttribArray(texcoordLocation);

        // bind the texcoord buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

        // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
        var size = 2; // 2 components per iteration
        var type = gl.FLOAT; // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(
            texcoordLocation, size, type, normalize, stride, offset);

        // set the resolution
        
        

    window.addEventListener("resize", x=>resize(canvas, gl));
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);


player = {x: 0, y: 0};
var leftPressed, rightPressed, upPressed, downPressed = false;
var playerSpeed = 0.0001;

function init(){
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(gl.getUniformLocation(program, "scale"), 0.2, 0.2);
}
init();

function update(){
    if (leftPressed) player.x += playerSpeed * delta;
    if (rightPressed) player.x -= playerSpeed * delta;
    if (upPressed) player.y += playerSpeed * delta;
    if (downPressed) player.y -= playerSpeed * delta;
    gl.uniform2f(gl.getUniformLocation(program, "offset"), 0.4 - player.x, 0.4 - player.y);
}

function render(gl) {
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    currentTime = (new Date()).getTime();
    delta = (currentTime-lastTime);
    if(delta > interval) {
        update();
        render(gl);
        lastTime = currentTime - (delta % interval);
    }
}

resize(canvas, gl);
if (typeof (canvas.getContext) !== undefined) {
    gameLoop();
}


function keyDownHandler(event) {
    if(event.keyCode == 39) {
        rightPressed = true;
    }
    else if(event.keyCode == 37) {
        leftPressed = true;
    }
    if(event.keyCode == 40) {
        downPressed = true;
    }
    else if(event.keyCode == 38) {
        upPressed = true;
    }
}

function keyUpHandler(event) {
    if(event.keyCode == 39) {
        rightPressed = false;
    }
    else if(event.keyCode == 37) {
        leftPressed = false;
    }
    if(event.keyCode == 40) {
        downPressed = false;
    }
    else if(event.keyCode == 38) {
        upPressed = false;
    }
}

// main();


// This is needed if the images are not on the same domain
// NOTE: The server providing the images must give CORS permissions
// in order to be able to use the image with WebGL. Most sites
// do NOT give permission.
// See: https://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html
function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url, window.location.href)).origin !== window.location.origin) {
        img.crossOrigin = "";
    }
}

};
    // })();
// }
