// starfield in header: stars drift slowly down; each fades out and a new one glows into place elsewhere
const cv = document.querySelector<HTMLCanvasElement>(".stars");
const cx = cv?.getContext("2d");
if (cv && cx) {
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  let W = 0, H = 0;
  type Star = { x: number; y: number; r: number; a: number; vy: number; life: number; age: number };
  let field: Star[] = [];
  const star = (age = 0): Star => ({
    x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.25, a: 0.3 + Math.random() * 0.6,
    vy: 2 + Math.random() * 5, life: 9 + Math.random() * 10, age,
  });
  function sizeField() {
    const r = cv!.getBoundingClientRect(), d = devicePixelRatio || 1;
    W = r.width; H = r.height;
    cv!.width = W * d; cv!.height = H * d;
    cx!.setTransform(d, 0, 0, d, 0, 0);
    field = Array.from({ length: Math.round(W / 9) }, () => {
      const s = star();
      s.age = Math.random() * s.life;
      return s;
    });
  }
  function draw() {
    cx!.clearRect(0, 0, W, H);
    for (const s of field) {
      const t = s.age, fadeIn = Math.min(1, t / 1.6), fadeOut = Math.min(1, (s.life - t) / 2.2);
      const k = still.matches ? 1 : Math.max(0, Math.min(fadeIn, fadeOut));
      if (!still.matches && t < 1.6) {
        const g = cx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7);
        g.addColorStop(0, `rgba(255,226,150,${0.45 * (1 - t / 1.6)})`);
        g.addColorStop(1, "rgba(255,226,150,0)");
        cx!.fillStyle = g;
        cx!.beginPath(); cx!.arc(s.x, s.y, s.r * 7, 0, 7); cx!.fill();
      }
      cx!.fillStyle = `rgba(238,240,251,${s.a * k})`;
      cx!.beginPath(); cx!.arc(s.x, s.y, s.r, 0, 7); cx!.fill();
    }
  }
  let last = 0, raf = 0;
  function tick(now: number) {
    const dt = Math.min(0.1, (now - (last || now)) / 1000);
    last = now;
    field.forEach((s, i) => {
      s.age += dt; s.y += s.vy * dt;
      if (s.age >= s.life || s.y > H + 4) field[i] = star();
    });
    draw();
    raf = requestAnimationFrame(tick);
  }
  function start() { if (!raf && !still.matches && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  sizeField();
  draw();
  start();
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  // reduced motion switched on: freeze on a static frame; switched off: drift again
  still.addEventListener("change", () => { if (still.matches) { stop(); draw(); } else start(); });
  addEventListener("resize", () => { sizeField(); draw(); });
}
