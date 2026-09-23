import * as THREE from 'three';
import {
  ATMO_FRAG, CLOUD_FRAG, GAS_FRAG, MOON_FRAG, NEBULA_FRAG, NEBULA_VERT, PIXEL_VERT, PLANET_FRAG,
  RING_FRAG, RING_VERT, SPHERE_VERT, STAR_FRAG, STAR_VERT, SUN_FRAG, UV_VERT, buildPixelFrag,
} from './glsl';

// Colors are authored as raw sRGB values and quantized by hand, so
// three's linear colour workflow is switched off.
THREE.ColorManagement.enabled = false;

/** Limited palette every frame is quantized to. */
const PALETTE = [
  '#05040c', '#0d0a1f', '#181236', '#261b52', '#3a2872', '#56349a', '#8446b6', '#c552b0',
  '#ff6f91', '#ffa56b', '#ffd97a', '#fff4d6', '#f2f0ff', '#9ff3ff', '#3fd0f0', '#2388d0',
  '#18508f', '#123166', '#1f7a55', '#39c47a', '#a8f06b', '#8e8aa8', '#4d4a66', '#2a2740',
].map((h) => new THREE.Color(h));

interface Key {
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/**
 * Quality tiers. The scene starts at tier 0 (tier 1 on GPUs the browser flags as
 * slow) and steps down when frames stay slow for a few seconds.
 */
const QUALITY = [
  { px: 0, stars: 1, belt: 1 },
  { px: 1, stars: 0.6, belt: 0.7 },
  { px: 2, stars: 0.35, belt: 0.45 },
];
/** Average frame time (ms) above which the scene counts as struggling (~35 fps). */
const SLOW_FRAME_MS = 28.5;
/** Seconds of sustained slow frames before dropping a quality tier. */
const SLOW_SECONDS = 3;

const GAS_POS = v(-150, 12, 20);
const SUN_POS = v(240, 70, 40);

export class SpaceScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private rt: THREE.WebGLRenderTarget;
  private postScene = new THREE.Scene();
  private postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private postMat: THREE.ShaderMaterial;

  private last = performance.now();
  private timeUniform = { value: 0 };
  private lightDir = SUN_POS.clone().normalize();

  private planet = new THREE.Group();
  private planetMesh!: THREE.Mesh;
  private clouds!: THREE.Mesh;
  private moonPivot = new THREE.Group();
  private satPivot = new THREE.Group();
  private satLight!: THREE.Mesh;
  private belt!: THREE.InstancedMesh;
  private beltData: { r: number; a: number; y: number; s: number; rot: THREE.Euler; spin: number }[] = [];
  private gas = new THREE.Group();
  private stars!: THREE.Points;
  private shooting: { mesh: THREE.Line; vel: THREE.Vector3; life: number }[] = [];

  private pathPos!: THREE.CatmullRomCurve3;
  private pathLook!: THREE.CatmullRomCurve3;
  private progress = 0;
  private smoothProgress = 0;
  private pointer = new THREE.Vector2();
  private smoothPointer = new THREE.Vector2();
  private pixelSize = 3;
  private fade = { value: 0 };
  private fadeStart = -1;
  private fadeDuration = 1600;
  private dummy = new THREE.Object3D();
  private reduced: boolean;

  /** Pending requestAnimationFrame id (0 = no frame scheduled). */
  private raf = 0;
  /** Reasons the scene is currently not rendering (tab hidden, overlay open, context lost...). */
  private paused = new Set<string>();
  private quality = 0;
  private frameAvg = 16;
  private slowFor = 0;
  private warmup = 1;
  private starTotal = 0;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = motionQuery.matches;

    // Prefer a hardware-accelerated context. If the browser reports a major
    // performance caveat (software rendering, blocklisted GPU) still render,
    // but on a fresh canvas and starting at a lower quality tier.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true,
      });
    } catch {
      const fresh = canvas.cloneNode() as HTMLCanvasElement;
      canvas.replaceWith(fresh);
      canvas = fresh;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'low-power' });
      this.quality = 1;
    }
    this.canvas = canvas;
    this.renderer = renderer;
    this.renderer.setPixelRatio(1);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);

    this.rt = new THREE.WebGLRenderTarget(4, 4, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: true,
    });

    this.postMat = new THREE.ShaderMaterial({
      vertexShader: PIXEL_VERT,
      fragmentShader: buildPixelFrag(PALETTE.length),
      uniforms: {
        tScene: { value: this.rt.texture },
        uRes: { value: new THREE.Vector2(4, 4) },
        uPalette: { value: PALETTE.map((c) => new THREE.Vector3(c.r, c.g, c.b)) },
        uDither: { value: 0.085 },
        uFade: this.fade,
      },
      depthTest: false,
      depthWrite: false,
    });
    this.postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.postMat));

    this.build();
    this.buildPath();
    this.applyQuality();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener(
      'pointermove',
      (e) => {
        this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      },
      { passive: true },
    );
    document.addEventListener('visibilitychange', () => this.setPaused('hidden', document.hidden));
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.setPaused('context-lost', true);
    });
    canvas.addEventListener('webglcontextrestored', () => {
      // three.js re-uploads geometry, textures and programs by itself.
      this.resize();
      this.setPaused('context-lost', false);
    });
    motionQuery.addEventListener('change', () => {
      this.reduced = motionQuery.matches;
      if (this.reduced) this.fade.value = 1;
      this.stop();
      this.requestRender();
    });
    if (document.hidden) this.paused.add('hidden');
    this.requestRender();
  }

  /** 0..1 over the whole page. `snap` skips the camera easing (first placement). */
  setProgress(p: number, snap = false) {
    this.progress = THREE.MathUtils.clamp(p, 0, 1);
    if (snap) this.smoothProgress = this.progress;
    if (this.reduced) this.requestRender();
  }

  fadeIn(duration = 1.6) {
    if (this.reduced) {
      this.fade.value = 1;
      this.requestRender();
      return;
    }
    this.fadeDuration = duration * 1000;
    this.fadeStart = performance.now();
    this.requestRender();
  }

  /**
   * Stops rendering while `on` for the given reason (e.g. "overlay" while a modal
   * or the mini-game covers the page). Rendering resumes once no reason is left.
   */
  setPaused(reason: string, on: boolean) {
    if (on) {
      this.paused.add(reason);
      this.stop();
    } else if (this.paused.delete(reason) && !this.paused.size) {
      this.warmup = 0.5;
      this.requestRender();
    }
  }

  /**
   * Schedules a frame unless one is already pending, so loops can never pile up.
   * With motion enabled that frame keeps the loop going; with
   * prefers-reduced-motion it draws a single still frame.
   */
  private requestRender() {
    if (this.raf || this.paused.size) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  // ------------------------------------------------------------------ build

  private sphereMat(frag: string, extra: Record<string, THREE.IUniform> = {}, opts: Partial<THREE.ShaderMaterialParameters> = {}) {
    return new THREE.ShaderMaterial({
      vertexShader: SPHERE_VERT,
      fragmentShader: frag,
      uniforms: { uTime: this.timeUniform, uLight: { value: this.lightDir }, ...extra },
      ...opts,
    });
  }

  private build() {
    const s = this.scene;

    // Nebula sky
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(900, 32, 16),
      new THREE.ShaderMaterial({
        vertexShader: NEBULA_VERT,
        fragmentShader: NEBULA_FRAG,
        uniforms: { uTime: this.timeUniform },
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    sky.rotation.set(0.35, 0, 0.5);
    s.add(sky);

    // Stars
    const N = 2600;
    const pos = new Float32Array(N * 3);
    const size = new Float32Array(N);
    const phase = new Float32Array(N);
    const col = new Float32Array(N * 3);
    const tints = [new THREE.Color('#f2f0ff'), new THREE.Color('#9ff3ff'), new THREE.Color('#ffd97a'), new THREE.Color('#ff6f91')];
    for (let i = 0; i < N; i++) {
      const r = 250 + Math.random() * 500;
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const q = Math.sqrt(1 - u * u);
      pos.set([r * q * Math.cos(th), r * u, r * q * Math.sin(th)], i * 3);
      const big = Math.random() < 0.06;
      size[i] = big ? 3 : 1;
      phase[i] = Math.random();
      const t = tints[Math.random() < 0.7 ? 0 : 1 + Math.floor(Math.random() * 3)];
      const b = big ? 1 : 0.45 + Math.random() * 0.55;
      col.set([t.r * b, t.g * b, t.b * b], i * 3);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    sg.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    sg.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    sg.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    this.stars = new THREE.Points(
      sg,
      new THREE.ShaderMaterial({
        vertexShader: STAR_VERT,
        fragmentShader: STAR_FRAG,
        uniforms: { uTime: this.timeUniform },
        depthWrite: false,
      }),
    );
    this.starTotal = N;
    s.add(this.stars);

    // Sun
    const sun = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      new THREE.ShaderMaterial({
        vertexShader: UV_VERT,
        fragmentShader: SUN_FRAG,
        uniforms: { uTime: this.timeUniform },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sun.position.copy(SUN_POS);
    sun.lookAt(0, 0, 0);
    s.add(sun);

    // Home planet
    const R = 10;
    this.planetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(R, 96, 64),
      this.sphereMat(PLANET_FRAG, { uSeed: { value: v(3.1, 1.7, 8.2) } }),
    );
    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.025, 72, 48),
      this.sphereMat(CLOUD_FRAG, {}, { transparent: true, depthWrite: false }),
    );
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.14, 64, 48),
      this.sphereMat(ATMO_FRAG, { uColor: { value: new THREE.Color('#3fd0f0') } }, {
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.planet.add(this.planetMesh, this.clouds, atmo);
    this.planet.rotation.z = 0.35;
    s.add(this.planet);

    // Orbit lines — the "tech HUD" layer of the universe
    const orbitMat = new THREE.LineDashedMaterial({ color: '#3fd0f0', dashSize: 1.2, gapSize: 1.4, transparent: true, opacity: 0.55 });
    for (const [r, tilt] of [[15, 0.45], [19, -0.3]] as const) {
      const pts = new THREE.EllipseCurve(0, 0, r, r).getPoints(160).map((p) => v(p.x, 0, p.y));
      const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), orbitMat);
      line.computeLineDistances();
      line.rotation.x = tilt;
      s.add(line);
    }

    // Moon
    const moon = new THREE.Mesh(new THREE.SphereGeometry(2.3, 40, 30), this.sphereMat(MOON_FRAG));
    moon.position.set(19, 0, 0);
    this.moonPivot.add(moon);
    this.moonPivot.rotation.x = -0.3;
    s.add(this.moonPivot);

    // Satellite
    const sat = new THREE.Group();
    const lambert = (c: string) => new THREE.MeshLambertMaterial({ color: c, emissive: c, emissiveIntensity: 0.12 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.4), lambert('#c9c4e0'));
    const panelGeo = new THREE.BoxGeometry(2.6, 0.06, 0.9);
    const p1 = new THREE.Mesh(panelGeo, lambert('#2388d0'));
    const p2 = p1.clone();
    p1.position.x = 1.9;
    p2.position.x = -1.9;
    const dish = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.4, 8), lambert('#f2f0ff'));
    dish.position.z = 0.9;
    dish.rotation.x = Math.PI / 2;
    this.satLight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), new THREE.MeshBasicMaterial({ color: '#ff6f91' }));
    this.satLight.position.y = 0.6;
    sat.add(body, p1, p2, dish, this.satLight);
    sat.position.set(15, 0, 0);
    sat.rotation.y = 0.6;
    this.satPivot.add(sat);
    this.satPivot.rotation.x = 0.45;
    s.add(this.satPivot);

    s.add(new THREE.DirectionalLight('#fff1dc', 2.2).translateOnAxis(this.lightDir, 100));
    s.add(new THREE.AmbientLight('#3a2872', 0.9));

    // Asteroid belt
    const rockGeo = new THREE.IcosahedronGeometry(1, 0);
    const rockMat = new THREE.MeshLambertMaterial({ color: '#8e8aa8', flatShading: true });
    const count = 420;
    this.belt = new THREE.InstancedMesh(rockGeo, rockMat, count);
    for (let i = 0; i < count; i++) {
      this.beltData.push({
        r: 54 + Math.random() * 12 + (Math.random() < 0.2 ? Math.random() * 12 : 0),
        a: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 2.4,
        s: 0.2 + Math.pow(Math.random(), 3) * 1.2,
        rot: new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3),
        spin: 0.2 + Math.random(),
      });
    }
    this.belt.rotation.x = 0.18;
    s.add(this.belt);

    // Gas giant with rings
    const GR = 26;
    const gasMesh = new THREE.Mesh(
      new THREE.SphereGeometry(GR, 80, 60),
      this.sphereMat(GAS_FRAG, {
        uA: { value: new THREE.Color('#c552b0') },
        uB: { value: new THREE.Color('#ffa56b') },
        uC: { value: new THREE.Color('#3a2872') },
      }),
    );
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(GR * 1.35, GR * 2.3, 128, 1),
      new THREE.ShaderMaterial({
        vertexShader: RING_VERT,
        fragmentShader: RING_FRAG,
        uniforms: {
          uInner: { value: GR * 1.35 },
          uOuter: { value: GR * 2.3 },
          uColA: { value: new THREE.Color('#ffd97a') },
          uColB: { value: new THREE.Color('#8446b6') },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ring.rotation.x = Math.PI / 2 - 0.35;
    this.gas.add(gasMesh, ring);
    this.gas.position.copy(GAS_POS);
    this.gas.rotation.z = -0.25;
    s.add(this.gas);

    // A distant small red planet for depth
    const red = new THREE.Mesh(
      new THREE.SphereGeometry(5, 40, 30),
      this.sphereMat(GAS_FRAG, {
        uA: { value: new THREE.Color('#ff6f91') },
        uB: { value: new THREE.Color('#ffd97a') },
        uC: { value: new THREE.Color('#56349a') },
      }),
    );
    red.position.set(90, -25, -120);
    s.add(red);
  }

  private buildPath() {
    const portrait = window.innerWidth / window.innerHeight < 0.85;
    const keys: Key[] = portrait
      ? [
          { pos: v(0, -8, 44), look: v(0, 7, 0) },
          { pos: v(-28, 6, 30), look: v(0, 2, 0) },
          { pos: v(10, 34, 70), look: v(0, 0, 0) },
          { pos: v(-40, 25, 90), look: GAS_POS },
          { pos: v(-20, 90, -120), look: v(-150, 0, 20) },
          { pos: v(60, 50, 110), look: v(-20, 0, -40) },
        ]
      : [
          { pos: v(0, 8, 36), look: v(-10, 1, 0) },
          { pos: v(-30, 8, 20), look: v(-6, 0, -6) },
          { pos: v(18, 30, 78), look: v(14, 0, 0) },
          { pos: v(-60, 20, 60), look: GAS_POS.clone().add(v(-12, 0, 0)) },
          { pos: v(-10, 75, -110), look: v(-120, 0, 10) },
          { pos: v(70, 45, 105), look: v(-10, 0, -50) },
        ];
    this.pathPos = new THREE.CatmullRomCurve3(keys.map((k) => k.pos), false, 'centripetal');
    this.pathLook = new THREE.CatmullRomCurve3(keys.map((k) => k.look), false, 'centripetal');
  }

  private applyQuality() {
    const q = QUALITY[this.quality];
    this.stars.geometry.setDrawRange(0, Math.round(this.starTotal * q.stars));
    this.belt.count = Math.round(this.beltData.length * q.belt);
    this.resize();
  }

  private resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.pixelSize = (w >= 1700 ? 4 : w >= 900 ? 3 : 2) + QUALITY[this.quality].px;
    const lw = Math.ceil(w / this.pixelSize);
    const lh = Math.ceil(h / this.pixelSize);
    // Both passes run at the low resolution; CSS scales the canvas up by an
    // exact integer factor with image-rendering: pixelated.
    this.renderer.setSize(lw, lh, false);
    this.canvas.style.width = `${lw * this.pixelSize}px`;
    this.canvas.style.height = `${lh * this.pixelSize}px`;
    this.rt.setSize(lw, lh);
    this.postMat.uniforms.uRes.value.set(lw, lh);
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 0.85 ? 62 : 45;
    this.camera.updateProjectionMatrix();
    this.buildPath();
    this.requestRender();
  }

  private spawnShootingStar() {
    const start = v((Math.random() - 0.5) * 400, 80 + Math.random() * 120, -200 - Math.random() * 200);
    const vel = v(-60 - Math.random() * 80, -30 - Math.random() * 40, 20);
    const geo = new THREE.BufferGeometry().setFromPoints([start, start.clone().addScaledVector(vel, -0.12)]);
    const mesh = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#f2f0ff', transparent: true }));
    this.scene.add(mesh);
    this.shooting.push({ mesh, vel, life: 1.4 });
  }

  // ------------------------------------------------------------------ loop

  /** Watches frame times and steps quality down when the GPU can't keep up. */
  private adapt(rawMs: number, dt: number) {
    if (this.warmup > 0) {
      this.warmup -= dt;
      return;
    }
    if (rawMs > 250) return; // a one-off hitch (tab switch, GC), not a trend
    this.frameAvg += (rawMs - this.frameAvg) * 0.1;
    this.slowFor = this.frameAvg > SLOW_FRAME_MS ? this.slowFor + dt : Math.max(0, this.slowFor - dt);
    if (this.slowFor > SLOW_SECONDS && this.quality < QUALITY.length - 1) {
      this.quality++;
      this.slowFor = 0;
      this.warmup = 1;
      this.frameAvg = 16;
      this.applyQuality();
    }
  }

  private tick = (now: number) => {
    this.raf = 0;
    if (this.paused.size) return;
    const rawMs = Math.max(0, now - this.last);
    const dt = this.reduced ? 0 : Math.min(rawMs / 1000, 0.05);
    this.last = now;
    if (!this.reduced) {
      this.raf = requestAnimationFrame(this.tick);
      this.adapt(rawMs, dt);
    }

    if (this.fadeStart >= 0) {
      const f = Math.min(1, (now - this.fadeStart) / this.fadeDuration);
      this.fade.value = f * f * (3 - 2 * f);
      if (f >= 1) this.fadeStart = -1;
    }

    this.timeUniform.value += dt;
    const t = this.timeUniform.value;

    // camera
    if (this.reduced) this.smoothProgress = this.progress;
    else this.smoothProgress += (this.progress - this.smoothProgress) * Math.min(1, dt * 3.5);
    this.smoothPointer.lerp(this.pointer, Math.min(1, dt * 2.5));
    const p = this.smoothProgress;
    const cp = this.pathPos.getPoint(p);
    const look = this.pathLook.getPoint(p);
    cp.x += this.smoothPointer.x * 2.2;
    cp.y -= this.smoothPointer.y * 1.4;
    this.camera.position.copy(cp);
    this.camera.lookAt(look);

    // bodies
    this.planetMesh.rotation.y += dt * 0.05;
    this.clouds.rotation.y += dt * 0.065;
    this.moonPivot.rotation.y = t * 0.08;
    this.satPivot.rotation.y = t * 0.22 + 1.5;
    (this.satLight.material as THREE.MeshBasicMaterial).color.set(Math.sin(t * 6) > 0.3 ? '#ff6f91' : '#261b52');
    this.gas.rotation.y = t * 0.02;
    this.stars.rotation.y = t * 0.003;

    for (let i = 0; i < this.belt.count; i++) {
      const b = this.beltData[i];
      const a = b.a + t * (0.9 / b.r) * 0.6;
      this.dummy.position.set(Math.cos(a) * b.r, b.y, Math.sin(a) * b.r);
      this.dummy.rotation.set(b.rot.x + t * b.spin * 0.3, b.rot.y + t * b.spin * 0.2, b.rot.z);
      this.dummy.scale.setScalar(b.s);
      this.dummy.updateMatrix();
      this.belt.setMatrixAt(i, this.dummy.matrix);
    }
    this.belt.instanceMatrix.needsUpdate = true;

    // shooting stars
    if (!this.reduced && Math.random() < dt * 0.35) this.spawnShootingStar();
    for (let i = this.shooting.length - 1; i >= 0; i--) {
      const s = this.shooting[i];
      s.life -= dt;
      s.mesh.position.addScaledVector(s.vel, dt);
      (s.mesh.material as THREE.LineBasicMaterial).opacity = Math.max(0, s.life / 1.4);
      if (s.life <= 0) {
        this.scene.remove(s.mesh);
        s.mesh.geometry.dispose();
        (s.mesh.material as THREE.Material).dispose();
        this.shooting.splice(i, 1);
      }
    }

    this.renderer.setRenderTarget(this.rt);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCam);
  };
}
