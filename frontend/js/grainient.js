function initGrainient(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var settings = opts || {};
    var color1 = hexToRgb(settings.color1 || "#159A8C");
    var color2 = hexToRgb(settings.color2 || "#171817");
    var color3 = hexToRgb(settings.color3 || "#687078");
    var timeSpeed = settings.timeSpeed !== undefined ? settings.timeSpeed : 0.15;
    var warpStrength = settings.warpStrength !== undefined ? settings.warpStrength : 1.0;
    var warpFrequency = settings.warpFrequency !== undefined ? settings.warpFrequency : 5.0;
    var warpSpeed = settings.warpSpeed !== undefined ? settings.warpSpeed : 2.0;
    var warpAmplitude = settings.warpAmplitude !== undefined ? settings.warpAmplitude : 50.0;
    var blendAngle = settings.blendAngle !== undefined ? settings.blendAngle : 0.0;
    var blendSoftness = settings.blendSoftness !== undefined ? settings.blendSoftness : 0.05;
    var rotationAmount = settings.rotationAmount !== undefined ? settings.rotationAmount : 500.0;
    var noiseScale = settings.noiseScale !== undefined ? settings.noiseScale : 2.0;
    var grainAmount = settings.grainAmount !== undefined ? settings.grainAmount : 0.08;
    var grainScale = settings.grainScale !== undefined ? settings.grainScale : 2.0;
    var contrast = settings.contrast !== undefined ? settings.contrast : 1.4;
    var gamma = settings.gamma !== undefined ? settings.gamma : 1.0;
    var saturation = settings.saturation !== undefined ? settings.saturation : 1.1;
    var centerX = settings.centerX || 0.0;
    var centerY = settings.centerY || 0.0;
    var zoom = settings.zoom !== undefined ? settings.zoom : 0.9;

    function hexToRgb(hex) {
        var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!r) return [1, 1, 1];
        return [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255];
    }

    var canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    var gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) return;

    var vertexSrc = "#version 300 es\nin vec2 position;\nvoid main(){gl_Position=vec4(position,0.0,1.0);}";

    var fragmentSrc = [
        "#version 300 es",
        "precision highp float;",
        "uniform vec2 iResolution;",
        "uniform float iTime;",
        "uniform float uTimeSpeed;",
        "uniform float uWarpStrength;",
        "uniform float uWarpFrequency;",
        "uniform float uWarpSpeed;",
        "uniform float uWarpAmplitude;",
        "uniform float uBlendAngle;",
        "uniform float uBlendSoftness;",
        "uniform float uRotationAmount;",
        "uniform float uNoiseScale;",
        "uniform float uGrainAmount;",
        "uniform float uGrainScale;",
        "uniform float uContrast;",
        "uniform float uGamma;",
        "uniform float uSaturation;",
        "uniform vec2 uCenterOffset;",
        "uniform float uZoom;",
        "uniform vec3 uColor1;",
        "uniform vec3 uColor2;",
        "uniform vec3 uColor3;",
        "out vec4 fragColor;",
        "#define S(a,b,t) smoothstep(a,b,t)",
        "mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}",
        "vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}",
        "float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return 0.5+0.5*mix(mix(dot(-1.0+2.0*hash(i+vec2(0,0)),f-vec2(0,0)),dot(-1.0+2.0*hash(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0,1)),f-vec2(0,1)),dot(-1.0+2.0*hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}",
        "void mainImage(out vec4 o,vec2 C){",
        "float t=iTime*uTimeSpeed;",
        "vec2 uv=C/iResolution.xy;",
        "float ratio=iResolution.x/iResolution.y;",
        "vec2 tuv=uv-0.5+uCenterOffset;",
        "tuv/=max(uZoom,0.001);",
        "float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);",
        "tuv.y*=1.0/ratio;",
        "tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));",
        "tuv.y*=ratio;",
        "float ws=max(uWarpStrength,0.001);",
        "float amplitude=uWarpAmplitude/ws;",
        "float warpTime=t*uWarpSpeed;",
        "tuv.x+=sin(tuv.y*uWarpFrequency+warpTime)/amplitude;",
        "tuv.y+=sin(tuv.x*(uWarpFrequency*1.5)+warpTime)/(amplitude*0.5);",
        "float s=max(uBlendSoftness,0.0);",
        "mat2 blendRot=Rot(radians(uBlendAngle));",
        "float blendX=(tuv*blendRot).x;",
        "float edge0=-0.3-s;",
        "float edge1=0.2+s;",
        "float v0=0.5+s;",
        "float v1=-0.3-s;",
        "vec3 layer1=mix(uColor3,uColor2,S(edge0,edge1,blendX));",
        "vec3 layer2=mix(uColor2,uColor1,S(edge0,edge1,blendX));",
        "vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));",
        "vec2 grainUv=uv*max(uGrainScale,0.001);",
        "float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);",
        "col+=(grain-0.5)*uGrainAmount;",
        "col=(col-0.5)*uContrast+0.5;",
        "float luma=dot(col,vec3(0.2126,0.7152,0.0722));",
        "col=mix(vec3(luma),col,uSaturation);",
        "col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));",
        "col=clamp(col,0.0,1.0);",
        "o=vec4(col,1.0);",
        "}",
        "void main(){vec4 o=vec4(0.0);mainImage(o,gl_FragCoord.xy);fragColor=o;}"
    ].join("\n");

    function compileShader(type, src) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        return shader;
    }

    var vs = compileShader(gl.VERTEX_SHADER, vertexSrc);
    var fs = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    var verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var uniforms = {};
    var uNames = [
        "iResolution", "iTime", "uTimeSpeed", "uWarpStrength", "uWarpFrequency",
        "uWarpSpeed", "uWarpAmplitude", "uBlendAngle", "uBlendSoftness",
        "uRotationAmount", "uNoiseScale", "uGrainAmount", "uGrainScale",
        "uContrast", "uGamma", "uSaturation", "uCenterOffset", "uZoom",
        "uColor1", "uColor2", "uColor3"
    ];
    uNames.forEach(function(name) {
        uniforms[name] = gl.getUniformLocation(program, name);
    });

    function resize() {
        var w = container.clientWidth || window.innerWidth;
        var h = container.clientHeight || window.innerHeight;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener("resize", resize);

    var t0 = performance.now();
    var raf = 0;
    var isVisible = true;
    var isPageVisible = !document.hidden;

    function render(t) {
        gl.uniform1f(uniforms.iTime, (t - t0) * 0.001);
        gl.uniform1f(uniforms.uTimeSpeed, timeSpeed);
        gl.uniform1f(uniforms.uWarpStrength, warpStrength);
        gl.uniform1f(uniforms.uWarpFrequency, warpFrequency);
        gl.uniform1f(uniforms.uWarpSpeed, warpSpeed);
        gl.uniform1f(uniforms.uWarpAmplitude, warpAmplitude);
        gl.uniform1f(uniforms.uBlendAngle, blendAngle);
        gl.uniform1f(uniforms.uBlendSoftness, blendSoftness);
        gl.uniform1f(uniforms.uRotationAmount, rotationAmount);
        gl.uniform1f(uniforms.uNoiseScale, noiseScale);
        gl.uniform1f(uniforms.uGrainAmount, grainAmount);
        gl.uniform1f(uniforms.uGrainScale, grainScale);
        gl.uniform1f(uniforms.uContrast, contrast);
        gl.uniform1f(uniforms.uGamma, gamma);
        gl.uniform1f(uniforms.uSaturation, saturation);
        gl.uniform2f(uniforms.uCenterOffset, centerX, centerY);
        gl.uniform1f(uniforms.uZoom, zoom);
        gl.uniform3fv(uniforms.uColor1, color1);
        gl.uniform3fv(uniforms.uColor2, color2);
        gl.uniform3fv(uniforms.uColor3, color3);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(render);
    }

    function tryStart() {
        if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(render);
    }

    function tryStop() {
        if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; }
    }

    var io = new IntersectionObserver(function(entries) {
        isVisible = entries[0].isIntersecting;
        isVisible ? tryStart() : tryStop();
    }, { threshold: 0 });
    io.observe(container);

    document.addEventListener("visibilitychange", function() {
        isPageVisible = !document.hidden;
        isPageVisible ? tryStart() : tryStop();
    });

    tryStart();
}
