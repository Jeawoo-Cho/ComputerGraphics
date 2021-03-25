var gl;
var points, colors;
var count;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl )
    {
        alert("WebGL isn't available!");
    }

    points = [];
    colors = [];
    count = 0;

    var redraw = false;

    var colorArray = [
        vec4(0, 0, 0, 1),
        vec4(1, 0, 0, 1),
        vec4(1, 1, 0, 1),
        vec4(0, 1, 0, 1),
        vec4(0, 0, 1, 1),
        vec4(1, 0, 1, 1),
        vec4(0, 1, 1, 1)
    ];
    var cIndex = 0;

    document.getElementById("colors").onclick = function (event) {
        cIndex = event.target.value;
    }

    canvas.addEventListener("mousedown", function(event) {
        
        var p = vec2(2*event.clientX/canvas.width - 1,
        2*(canvas.height-event.clientY)/canvas.height -1);
        points.push(p);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

        var c = colorArray[cIndex];
        colors.push(c);
        gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
        
        count = count + 1;
    });

    canvas.addEventListener("mouseup", function(event) {

        if(count<2)
        {
            render();
            count = 0;
        }
    });


    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //
    //
    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    //var fColor = gl.getUniformLocation(program, "fColor");
    //gl.uniform4f(fColor, 1.0, 0.0, 0.0, 1.0);

    var locPointSize = gl.getUniformLocation(program, "pointSize");
    gl.uniform1f(locPointSize, 5.0);

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);

}
