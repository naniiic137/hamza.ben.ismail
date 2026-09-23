// Shared GLSL chunks and shader sources for the pixel-space scene.

export const NOISE = /* glsl */ `
// Simplex 3D noise — Ashima Arts / Stefan Gustavson (MIT)
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){
  float f=0.0, a=0.5;
  for(int i=0;i<5;i++){ f+=a*snoise(p); p*=2.03; a*=0.5; }
  return f;
}
`;

/** Common vertex shader for lit spheres: passes object position, world normal, view dir. */
export const SPHERE_VERT = /* glsl */ `
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vViewW;
void main(){
  vObj = position;
  vec4 wp = modelMatrix * vec4(position,1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewW = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

/** Earth-like tech planet with glowing "cities" on the night side. */
export const PLANET_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uLight;
uniform vec3 uSeed;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vViewW;
${NOISE}
vec3 ramp(float h){
  vec3 deep  = vec3(0.07,0.13,0.36);
  vec3 ocean = vec3(0.12,0.36,0.72);
  vec3 shore = vec3(0.23,0.72,0.86);
  vec3 sand  = vec3(0.95,0.78,0.45);
  vec3 grass = vec3(0.20,0.68,0.42);
  vec3 rock  = vec3(0.36,0.28,0.52);
  vec3 snow  = vec3(0.95,0.95,1.0);
  if(h<-0.05) return mix(deep,ocean,smoothstep(-0.5,-0.05,h));
  if(h<0.02) return shore;
  if(h<0.07) return sand;
  if(h<0.30) return grass;
  if(h<0.45) return rock;
  return snow;
}
void main(){
  vec3 p = normalize(vObj);
  float h = fbm(p*1.6 + uSeed);
  vec3 n = normalize(vNormalW);
  float diff = dot(n, normalize(uLight));
  float light = clamp(diff*1.1+0.05, 0.0, 1.0);
  vec3 col = ramp(h) * (0.06 + light*1.05);
  // specular glint on oceans
  if(h < 0.0){
    vec3 r = reflect(-normalize(uLight), n);
    col += vec3(0.7,0.9,1.0) * pow(max(dot(r, normalize(vViewW)),0.0), 24.0) * 0.6;
  }
  // night-side city grid (tech civilisation)
  float night = 1.0 - smoothstep(-0.25, 0.05, diff);
  float grid = step(0.55, snoise(p*38.0 + uSeed)) * step(0.07, h) * step(h, 0.4);
  float pulse = 0.75 + 0.25*sin(uTime*2.0 + p.x*40.0);
  col += night * grid * vec3(1.0,0.72,0.35) * pulse;
  // atmospheric rim
  float rim = pow(1.0 - max(dot(n, normalize(vViewW)),0.0), 2.5);
  col += rim * vec3(0.3,0.75,1.0) * (0.15 + 0.85*clamp(diff+0.3,0.0,1.0));
  gl_FragColor = vec4(col,1.0);
}
`;

export const CLOUD_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uLight;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vViewW;
${NOISE}
void main(){
  vec3 p = normalize(vObj);
  float c = fbm(p*2.4 + vec3(uTime*0.02, 0.0, uTime*0.01));
  float a = smoothstep(0.12, 0.35, c);
  float diff = dot(normalize(vNormalW), normalize(uLight));
  float light = clamp(diff*1.2+0.1, 0.0, 1.0);
  if(a < 0.01) discard;
  gl_FragColor = vec4(vec3(0.95,0.96,1.0)*light, a*0.9);
}
`;

export const ATMO_FRAG = /* glsl */ `
uniform vec3 uLight;
uniform vec3 uColor;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vViewW;
void main(){
  vec3 n = normalize(vNormalW);
  float d = dot(n, normalize(vViewW));
  float glow = smoothstep(0.0, 0.5, -d);
  float lit = clamp(dot(-n, normalize(uLight))*0.8+0.4, 0.0, 1.0);
  gl_FragColor = vec4(uColor * glow * lit, 1.0);
}
`;

/** Banded gas giant. */
export const GAS_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uLight;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vViewW;
${NOISE}
void main(){
  vec3 p = normalize(vObj);
  float turb = fbm(p*vec3(2.0,7.0,2.0) + vec3(uTime*0.03,0.0,0.0));
  float band = sin(p.y*14.0 + turb*3.0);
  vec3 col = mix(uA, uB, smoothstep(-0.6,0.6,band));
  col = mix(col, uC, smoothstep(0.55,0.9, fbm(p*3.0 + vec3(0.0,uTime*0.02,0.0))));
  // storm eye
  float storm = 1.0 - smoothstep(0.0, 0.18, length(p - normalize(vec3(0.6,-0.35,0.7))));
  col = mix(col, vec3(1.0,0.45,0.45), storm*0.9);
  float diff = dot(normalize(vNormalW), normalize(uLight));
  col *= 0.05 + clamp(diff*1.1+0.1,0.0,1.0);
  float rim = pow(1.0 - max(dot(normalize(vNormalW), normalize(vViewW)),0.0), 3.0);
  col += rim * uB * 0.5 * clamp(diff+0.4,0.0,1.0);
  gl_FragColor = vec4(col,1.0);
}
`;

export const MOON_FRAG = /* glsl */ `
uniform vec3 uLight;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vViewW;
${NOISE}
void main(){
  vec3 p = normalize(vObj);
  float n = fbm(p*3.0);
  float crater = smoothstep(0.35, 0.6, abs(snoise(p*6.0)));
  vec3 col = mix(vec3(0.55,0.52,0.66), vec3(0.85,0.82,0.92), n*0.5+0.5);
  col *= 1.0 - crater*0.35;
  float diff = dot(normalize(vNormalW), normalize(uLight));
  col *= 0.04 + clamp(diff,0.0,1.0);
  gl_FragColor = vec4(col,1.0);
}
`;

export const RING_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vPos;
void main(){
  vUv = uv;
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

export const RING_FRAG = /* glsl */ `
uniform float uInner;
uniform float uOuter;
uniform vec3 uColA;
uniform vec3 uColB;
varying vec3 vPos;
void main(){
  float r = (length(vPos.xy) - uInner) / (uOuter - uInner);
  float bands = 0.5 + 0.5*sin(r*60.0) * sin(r*17.0 + 1.3);
  float gap = smoothstep(0.52,0.55,r) * (1.0 - smoothstep(0.58,0.61,r));
  float a = (0.35 + 0.65*bands) * (1.0 - gap) * smoothstep(0.0,0.05,r) * (1.0 - smoothstep(0.92,1.0,r));
  vec3 col = mix(uColA, uColB, r);
  gl_FragColor = vec4(col, a*0.85);
}
`;

export const NEBULA_VERT = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  gl_Position = p.xyww; // push to far plane
}
`;

export const NEBULA_FRAG = /* glsl */ `
uniform float uTime;
varying vec3 vDir;
${NOISE}
void main(){
  vec3 d = normalize(vDir);
  float n1 = fbm(d*2.2 + vec3(0.0, uTime*0.004, 0.0));
  float n2 = fbm(d*4.5 + vec3(7.3,1.1,uTime*0.006));
  float band = exp(-pow(d.y*2.2 + n1*0.9, 2.0));      // galactic band
  vec3 col = vec3(0.012,0.01,0.035);
  col += vec3(0.30,0.10,0.45) * smoothstep(0.0,0.9,n1+0.35) * 0.55;
  col += vec3(0.06,0.25,0.50) * smoothstep(0.1,0.8,n2) * 0.45;
  col += vec3(0.85,0.30,0.55) * smoothstep(0.45,0.95,n1*n2*3.0+0.2) * 0.25 * band;
  col *= 0.35 + band*0.9;
  gl_FragColor = vec4(col,1.0);
}
`;

export const STAR_VERT = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
varying vec3 vColor;
varying float vTw;
void main(){
  vColor = aColor;
  vTw = 0.55 + 0.45*sin(uTime*(1.0+aPhase*2.0) + aPhase*50.0);
  vec4 mv = modelViewMatrix * vec4(position,1.0);
  gl_PointSize = aSize;
  gl_Position = projectionMatrix * mv;
}
`;

export const STAR_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vTw;
void main(){
  // crisp pixel "plus" shape for the larger stars
  vec2 c = gl_PointCoord - 0.5;
  float plus = step(abs(c.x),0.17) + step(abs(c.y),0.17);
  if(plus < 0.5) discard;
  gl_FragColor = vec4(vColor * vTw * 1.3, 1.0);
}
`;

export const SUN_FRAG = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 c = vUv - 0.5;
  float r = length(c);
  float core = smoothstep(0.12, 0.10, r);
  float glow = exp(-r*9.0);
  float rays = pow(max(0.0, 1.0 - abs(c.x*c.y)*260.0), 6.0) * exp(-r*5.0);
  vec3 col = vec3(1.0,0.95,0.8)*core + vec3(1.0,0.62,0.35)*glow*1.2 + vec3(1.0,0.8,0.55)*rays*0.6;
  float a = clamp(core + glow + rays, 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;

export const UV_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

/**
 * Final pass: nearest-neighbour upscale of the low-res frame + 4x4 Bayer
 * ordered dithering + quantization to a fixed palette. This is what turns
 * the 3D scene into "real" pixel art.
 */
export const PIXEL_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const buildPixelFrag = (paletteSize: number) => /* glsl */ `
uniform sampler2D tScene;
uniform vec2 uRes;
uniform vec3 uPalette[${paletteSize}];
uniform float uDither;
uniform float uFade;
varying vec2 vUv;
float bayer4(vec2 p){
  int x = int(mod(p.x,4.0));
  int y = int(mod(p.y,4.0));
  int i = x + y*4;
  float m[16];
  m[0]=0.0; m[1]=8.0; m[2]=2.0; m[3]=10.0;
  m[4]=12.0; m[5]=4.0; m[6]=14.0; m[7]=6.0;
  m[8]=3.0; m[9]=11.0; m[10]=1.0; m[11]=9.0;
  m[12]=15.0; m[13]=7.0; m[14]=13.0; m[15]=5.0;
  for(int k=0;k<16;k++){ if(k==i) return m[k]/16.0; }
  return 0.0;
}
void main(){
  vec2 px = floor(vUv * uRes);
  vec3 c = texture2D(tScene, (px + 0.5) / uRes).rgb;
  c = pow(c, vec3(0.92));
  c += (bayer4(px) - 0.5) * uDither;
  vec3 best = uPalette[0];
  float bd = 1e9;
  for(int i=0;i<${paletteSize};i++){
    vec3 d = c - uPalette[i];
    float dist = dot(d*d, vec3(0.30,0.59,0.25));
    if(dist < bd){ bd = dist; best = uPalette[i]; }
  }
  gl_FragColor = vec4(best * uFade, 1.0);
}
`;
