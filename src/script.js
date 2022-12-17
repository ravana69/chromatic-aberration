let canvas = null;
let gl = null;
let lastUpdate = null;
let timer = 0.0;
let time = null;
let resolutionLocation = null;

let vertexShader = null;
let fragmentShader = null;

const stats = new Stats();

const initialize = () => {
     //initializeStats();
    	initialize3DCanvas();
     initializeShaders();
     initializeProgram();
    	initializeModel();
     initializeResize();
    	animate();
}

const initializeStats = () => {
     stats.showPanel( 0 );
     document.body.appendChild( stats.domElement );
}

const initialize3DCanvas = () => {
     canvas = document.getElementById("canvas");
     gl = canvas.getContext("webgl") || canvas.getContext('experimental-webgl');
     if(gl)
     {
          gl.viewport(0,0,canvas.width,canvas.height);
          gl.enable(gl.DEPTH_TEST);
          gl.depthFunc(gl.LEQUAL); 
          gl.clearColor(1.0,1.0,1.0,1.0);
          gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
     }
}

const initializeModel = () => {
     // create rectangle
     let buffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
     gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
               -1.0, -1.0,
               1.0, -1.0,
               -1.0,  1.0,
               -1.0,  1.0,
               1.0, -1.0,
               1.0,  1.0]),
          gl.STATIC_DRAW);

     // vertex data
     let positionLocation = gl.getAttribLocation(program, "a_position");
     gl.enableVertexAttribArray(positionLocation);
     gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
     
     // passing resolution to the shader
     resolutionLocation = gl.getUniformLocation(program, "u_resolution");
     gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
     
     //init time
     time = gl.getUniformLocation(program, "time");
     lastUpdate = new Date().getTime();
}

const createShader = (gl,source,type) => {
  let shader = gl.createShader(type);
  source = document.getElementById(source).text;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  return shader;
}

const initializeShaders = () => {
     vertexShader = createShader(gl, 'vert-shader', gl.VERTEX_SHADER);
     fragmentShader = createShader(gl, 'frag-shader', gl.FRAGMENT_SHADER);
}

let program = null;

const initializeProgram = () => {
     program = gl.createProgram();
     gl.attachShader(program, vertexShader);
     gl.attachShader(program, fragmentShader);

     gl.linkProgram(program);
     gl.useProgram(program); 
     
     if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
          let info = gl.getProgramInfoLog(program); 
          throw "Could not compile WebGL program. \n\n" + info;
     } else {
          gl.useProgram(program); 
     }
}

const animate = () => {
     stats.begin();
     
     let currentTime = new Date().getTime();
     let timeSinceLastUpdate = currentTime - lastUpdate;
     lastUpdate = currentTime;

     render(timeSinceLastUpdate);
     
     stats.end();
     
     window.requestAnimationFrame(animate);
}

const render = (timeDelta) => {
     timer += (timeDelta ? timeDelta / 1000 : 0.05);
     gl.uniform1fv(time, [timer]); 
     
     gl.drawArrays(gl.TRIANGLES, 0, 6);
}

const initializeResize = () => {
     const height = document.body.clientHeight;
     const width = document.body.clientWidth;

     canvas.width = width * window.devicePixelRatio;
     canvas.height = height * window.devicePixelRatio;

     canvas.style.width = `${width}px`;
     canvas.style.height = `${height}px`;
     
     gl.viewport(0,0,canvas.width,canvas.height);
     gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
}

window.onresize = () => {
     initializeResize();
}

initialize();