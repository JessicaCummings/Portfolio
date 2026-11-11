/* The intro animation: draws the subway map, then dives onto the rail. render(t) draws the whole scene for any time t. */

/* ============================================================
   HOW THIS WORKS (for when you rebuild it yourself)
   1. Every line starts at an "origin" dot, then draws in two
      directions (forward + back) like an etch-a-sketch.
   2. render(t) draws the WHOLE scene for any time t. Play calls it
      every frame; the scrubber calls it with the slider value.
   3. A line "draws" with stroke-dasharray / stroke-dashoffset (same
      trick as the DC Metro pen). The dot sits at the tip via
      path.getPointAtLength().
   4. The camera is the SVG viewBox: it pulls back over the map,
      then dives down the 3-track rail and pins it near the left edge.
   5. After the intro, the page scrolls. The camera moves down the
      rail 1:1 with the scroll, so each project's station on the rail
      lines up with its section. The pearl stays put on screen and
      the stations ride up to meet it; the one it reaches lights up.
   ============================================================ */

/* Scene clock (all t: values) plays at PACE scene-seconds per real second. */
const SCENE_LENGTH = 11.4, PACE = 1.25, DURATION = SCENE_LENGTH / PACE;   // 9.1 real seconds
const T_SIGN = 6.2;
const CAM = { x: 800, y: 450, w0: 1600, w1: 3200, t0: 1.6, t1: 6.2 };
const DIVE = { t0: 7.2, t1: 9.4, W: 1200, railX: 358, railAt: 0.07, cy: 2700 };
const T_PEARL = 9.5, T_HOME = 9.9;
const IS_PHONE = matchMedia("(max-width: 720px)").matches;
const PEARL_AT = IS_PHONE ? 0.4 : 0.26;      // pearl height on screen (share of screen height); lower on phones so stations light up nearer the middle
const TRAIN_SPEED = 380;
const BEATS = [
  [0,    "A dot appears"],
  [1.2,  "The dot draws a line"],
  [2.0,  "More dots, more lines"],
  [5.4,  "Lines become a system"],
  [6.0,  "Trains start running"],
  [7.2,  "Dive down the rail"],
  [9.5,  "The pearl lands on its track"],
  [9.9,  "Home (now scroll)"]
];
const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/* The composed map: corner points with 90/45 degree turns; every end runs off screen.
   oi = the origin point; pair = a twin track `gap` px away that bends with it. */
const LINES = [
  { c: "Y", t: 0.8, speed: 300, bDelay: 1.0, oi: 3, rail: true,
    pts: [[1190,-560],[1190,300],[1040,450],[800,450],[520,450],[380,590],[380,1460]] },
  { c: "O", pair: "O", t: 2.6, speed: 720, oi: 1, pts: [[-920,60],[200,60],[1500,60],[1900,460],[2520,460]] },
  { c: "G", pair: "B", t: 3.0, speed: 720, oi: 3, pts: [[-920,1150],[200,1150],[700,650],[1100,650],[1500,650],[2300,-150],[2300,-560]] },
  { c: "B",  t: 3.4, speed: 700, oi: 1, pts: [[1400,-560],[1400,-100],[1400,250],[1600,450],[1600,1460]] },
  { c: "R",  t: 3.6, speed: 700, oi: 1, pts: [[2000,-560],[2000,100],[2000,500],[2200,700],[2200,1460]] },
  { c: "P",  t: 3.8, speed: 700, oi: 1, pts: [[-920,900],[600,900],[1100,900],[1300,1100],[2520,1100]] },
  { c: "BR", t: 4.0, speed: 700, oi: 1, pts: [[1500,1460],[1500,1200],[1500,1060],[1800,760],[2520,760]] },
  { c: "GR", t: 4.2, speed: 700, oi: 1, pts: [[-920,-300],[-500,-300],[-300,-300],[-50,-550],[-60,-560]] },
  { c: "R", pair: "R", t: 3.2, speed: 720, oi: 1, pts: [[2520,320],[2100,320],[1800,320],[1550,70],[1550,-560]] },
  { c: "P", pair: "R", t: 3.5, speed: 720, oi: 1, pts: [[-920,550],[-500,550],[-200,550],[150,200],[150,-560]] },
  { c: "G",  t: 3.9, speed: 700, oi: 1, pts: [[1000,1460],[1000,1250],[1000,1200],[1400,800],[2520,800]] },
  { c: "Y",  t: 4.3, speed: 700, oi: 1, pts: [[-920,-120],[-600,-120],[-400,-120],[-100,180],[-100,1460]] },
  { c: "O",  t: 4.5, speed: 700, oi: 1, pts: [[-920,1320],[200,1320],[700,1320],[840,1460]] }
];

/* ---------- helpers ---------- */
const NS = "http://www.w3.org/2000/svg";
const el = (tag, a) => { const n = document.createElementNS(NS, tag); for (const k in a) n.setAttribute(k, a[k]); return n; };
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, k) => a + (b - a) * k;
const easeOut = x => 1 - Math.pow(1 - x, 3);
const pop = x => { x = clamp(x); return x < .6 ? easeOut(x / .6) * 1.25 : 1.25 - .25 * easeOut((x - .6) / .4); };
function offsetLine(pts, d) {
  const n = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
  return pts.map((p, i) => {
    const n1 = i > 0 ? n(pts[i - 1], p) : null, n2 = i < pts.length - 1 ? n(p, pts[i + 1]) : null;
    const a = n1 || n2, b = n2 || n1; let mx = a[0] + b[0], my = a[1] + b[1]; const ml = Math.hypot(mx, my) || 1;
    mx /= ml; my /= ml; const s = d / (mx * a[0] + my * a[1]);
    return [p[0] + mx * s, p[1] + my * s];
  });
}
const toD = pts => "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L");

/* ---------- build the scene once ---------- */
const svg = document.getElementById("map"), trailsG = document.getElementById("trails"),
      stationsG = document.getElementById("stations"), trainsG = document.getElementById("trains"),
      headsG = document.getElementById("heads"), railStopsG = document.getElementById("railStops");
const segs = [], origins = [], placed = [];
const R_DOT = 15;
const VIEW = { x0: -760, x1: 2360, y0: -420, y1: 1320 };

function addSeg(d, color, start, speed, opts = {}) {
  const path = el("path", { d, class: "trail", stroke: `var(--${color})` });
  trailsG.appendChild(path);
  const len = path.getTotalLength();
  path.setAttribute("stroke-dasharray", len);
  const head = el("circle", { r: R_DOT, fill: `var(--${color})` });
  headsG.appendChild(head);
  const seg = { path, len, start, speed, head, stops: [], done: start + len / speed };
  if (!opts.noStations) for (let dd = 150; dd < len; dd += 210) {
    const p = path.getPointAtLength(dd);
    if (p.x < VIEW.x0 || p.x > VIEW.x1 || p.y < VIEW.y0 || p.y > VIEW.y1) continue;
    if (placed.some(q => Math.hypot(q[0] - p.x, q[1] - p.y) < 30)) continue;
    placed.push([p.x, p.y]);
    const c = el("circle", { cx: p.x, cy: p.y, r: 7, fill: "#111" });   // black station dot on the line, like the real map
    stationsG.appendChild(c); seg.stops.push({ d: dd, c });
  }
  if (len > 600 && !opts.noTrain) {
    const g = el("g", {});
    g.appendChild(el("rect", { x: -22, y: -8, width: 44, height: 16, rx: 8, fill: "var(--fg)", stroke: "var(--bg)", "stroke-width": 3 }));
    trainsG.appendChild(g);
    seg.train = { g, phase: (segs.length * 0.618) % 2 };
  }
  segs.push(seg);
  return seg;
}
function addOrigin(x, y, color, t) {
  const dot = el("circle", { cx: x, cy: y, r: R_DOT, fill: `var(--${color})` });
  headsG.appendChild(dot); origins.push({ dot, x, y, t });
}

const railDrops = [];
LINES.forEach(ln => {
  const tracks = ln.pair ? [[ln.c, 0, 0], [ln.pair, ln.gap ?? 26, 0.15]] : [[ln.c, 0, 0]];
  tracks.forEach(([c, d, dt]) => {
    const line = d ? offsetLine(ln.pts, d) : ln.pts, oi = ln.oi, t = ln.t + dt;
    addSeg(toD(line.slice(oi)), c, t + 0.35, ln.speed);
    const back = addSeg(toD(line.slice(0, oi + 1).reverse()), c, t + 0.35 + (ln.bDelay ?? 0), ln.speed);
    if (ln.rail && !d) railDrops.push([380, "Y", back]);
    addOrigin(line[oi][0], line[oi][1], c, t);
  });
});
// red + blue run beside the yellow's left-side drop: the 3-track rail
[["R", 358, 2.2], ["B", 336, 2.35]].forEach(([c, x, t]) => {
  const down = addSeg(`M${x} 300 V1460`, c, t + 0.35, 520);
  addSeg(`M${x} 300 V-560`, c, t + 0.35, 520);
  railDrops.push([x, c, down]);
  addOrigin(x, 300, c, t);
});
// the rail continues far below the map, so the dive and the whole scroll only ever see the rail
const YELLOW_DROP = railDrops.find(d => d[1] === "Y")[2];
const ext = {};   // the below-the-map part of each rail track, reshaped once the page is laid out (see buildEnd)
railDrops.forEach(([x, c, seg]) => { ext[c] = addSeg(`M${x} 1460 V14000`, c, seg.done, 2600, { noTrain: true, noStations: true }); });

/* ---------- page elements ---------- */
// "Page in a frame" (review option): adds the rounded frame around the whole page

const frameBox = document.getElementById("frameBox");
const setFrame = () => document.documentElement.classList.toggle("framed", frameBox.checked);
frameBox.addEventListener("change", setFrame); setFrame();
let smoothY = 0;
const LAG = 0.2;   // how quickly the pearl catches up with the scroll: lower = more lag, 1 = none
const page = document.getElementById("page"), nav = document.getElementById("nav"), pearl = document.getElementById("pearl"),
      mapSign = document.getElementById("mapSign"), mapCard = document.getElementById("mapCard"),
      stops = [...document.querySelectorAll(".stop")];
// one station per project on the rail: a black stop dot on each of the three tracks
stops.forEach(s => {
  const g = el("g", {});
  [336, 358, 380].forEach(x => g.appendChild(el("circle", { cx: x, cy: 0, r: 7, fill: "#111" })));
  railStopsG.appendChild(g); s.marker = g;
});

/* Named stations on the map, styled after the subway map: bold white names, black stop dots,
   route letters printed on the tracks, and little signage icons. Names are Detroit neighborhoods. */
const labelsG = document.getElementById("labels");
const LABELS = [
  { name: ["Campus", "Martius"], x: 660, y: 360, anchor: "end", dots: [[680,450]], icons: [["acc", 634, 404]] },
  { name: ["Eastern Market"], x: 600, y: 26, anchor: "middle", dots: [[600,60],[600,86]],
    letters: [["B",540,60,"#fff"],["D",540,86,"#fff"]], icons: [["acc", 716, 2],["warn", 746, 2]] },
  { name: ["Midtown"], x: 1300, y: 728, anchor: "middle", dots: [[1300,650],[1300,676]],
    letters: [["4",1240,650,"#fff"],["A",1240,676,"#fff"]], icons: [["warn", 1287, 740]] },
  { name: ["Corktown"], x: 0, y: 950, anchor: "middle", dots: [[0,900]], icons: [["acc", -13, 962]] },
  { name: ["New Center"], x: 1975, y: 192, anchor: "end", dots: [[2000,200]], icons: [["acc", 1949, 206]] },
  { name: ["Greektown"], x: 1428, y: -212, anchor: "start", dots: [[1400,-220]], icons: [["walk", 1428, -198],["acc", 1458, -198]] },
  { name: ["Rivertown"], x: 2200, y: 258, anchor: "middle", dots: [[2200,320],[2200,294]],
    letters: [["2",2300,320,"#fff"],["3",2300,294,"#fff"]], icons: [["acc", 2290, 236]] },
  { name: ["Mexicantown"], x: -400, y: 512, anchor: "middle", dots: [[-400,550],[-400,576]],
    letters: [["7",-600,550,"#fff"],["1",-600,576,"#fff"]], icons: [["acc", -300, 490]] }
];
LABELS.forEach((L, i) => {
  const g = el("g", {});
  L.dots.forEach(([x, y]) => g.appendChild(el("circle", { cx: x, cy: y, r: 8, fill: "#111" })));
  (L.letters || []).forEach(([ch, x, y, col]) => {
    const tx = el("text", { x, y, fill: col, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 19, "font-weight": 800, "font-family": "var(--sans)" });
    tx.textContent = ch; g.appendChild(tx);
  });
  const tx = el("text", { x: L.x, y: L.y, fill: "var(--fg)", "text-anchor": L.anchor, "font-size": 30, "font-weight": 800, "font-family": "var(--sans)", "letter-spacing": "-0.5" });
  L.name.forEach((line, j) => { const ts = el("tspan", { x: L.x, dy: j ? 32 : 0 }); ts.textContent = line; tx.appendChild(ts); });
  g.appendChild(tx);
  L.icons.forEach(([id, x, y]) => g.appendChild(el("use", { href: `#i-${id}`, x, y, width: 26, height: 26 })));
  labelsG.appendChild(g); L.g = g; L.t = 6.0 + i * 0.12;
});

/* THE END OF THE LINE. Laid out from the real page, so it's rebuilt when the window changes size.
   1) After the last project, blue and red peel off down-left into their own lanes; yellow carries on.
   2) At the footer, every line comes back as a tangle of noodles wound around a fork.
   Noodles are smooth curves (the only non-transit-angle lines on the site, on purpose). */
const tangleG = document.getElementById("tangle");
function smoothPath(pts) {   // Catmull-Rom through the points, written as cubic Beziers
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
function roundPath(pts, r) {   // straight runs with rounded corners, like the lines in your poster refs
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], [cx2, cy2] = pts[i + 1];
    const l1 = Math.hypot(bx - ax, by - ay) || 1, l2 = Math.hypot(cx2 - bx, cy2 - by) || 1, rr = Math.min(r, l1 / 2, l2 / 2);
    const p1 = [bx - (bx - ax) / l1 * rr, by - (by - ay) / l1 * rr], p2 = [bx + (cx2 - bx) / l2 * rr, by + (cy2 - by) / l2 * rr];
    d += ` L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Q${bx.toFixed(1)} ${by.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  const z = pts[pts.length - 1]; return d + ` L${z[0].toFixed(1)} ${z[1].toFixed(1)}`;
}
/* THE END OF THE LINE: the three rail tracks themselves become the noodles. They turn right in a
   tidy bundle, drop down past a fork that skewers them, then wind into neat loops and run off the
   bottom. Laid out from the real page (rebuilt when the window size changes). */
let endKey = "", endPearlS = 1e9, endTurnY = 1e9, endRestY = 1e9;
const forkLayer = el("g", {}); svg.insertBefore(forkLayer, trailsG);   // the fork sits behind the lines
const branchG = el("g", { "stroke-width": 20 }); svg.insertBefore(branchG, trailsG.nextSibling);   // the split-off tracks
function buildEnd(w, k, baseTop, camLeft) {
  const key = [innerWidth, innerHeight, page.scrollHeight].join("x");
  if (key === endKey) return; endKey = key;
  const footer = document.getElementById("contact");
  const toWorld = docY => baseTop + docY * k;
  const narrow = innerWidth <= 720;
  const H = innerHeight * k, u = H / 100 * (narrow ? 0.72 : 1), v = w / 100;   // u = 1% of screen height (tighter on phones), v = 1% of width
  // desktop: the tangle fills the last screen. Phones: it starts right under the contact text, so the fork sits close to it.
  const copy = footer.querySelector(".footer-copy");
  const T = narrow ? toWorld(footer.offsetTop + copy.getBoundingClientRect().bottom - footer.getBoundingClientRect().top + 24) - 5 * u
                   : toWorld(footer.offsetTop + footer.offsetHeight) - H;   // top of the last screen
  const S = narrow ? 24 : 32, R = narrow ? 20 : 30;                        // track spacing, corner radius
  // five tracks on the fork: red splits off an orange, blue splits off a purple, on the run across the top
  const cB = camLeft + w * (narrow ? 0.34 : 0.58), cP = cB + S, cR = cB + 2 * S, cO = cB + 3 * S, cY = cB + 4 * S;
  const yY = T + 5 * u, yO = yY + S, yR = yY + 2 * S, yP = yY + 3 * S, yB = yY + 4 * S;   // yellow on top, blue at the bottom
  const Y0 = T + 60 * u, out = T + (narrow ? 110 : 140) * u;                                // the loops start below the fork
  const paths = narrow ? {   // phones: a calmer plate, each track makes one gentle jog after the fork
    Y: [[380,1460],[380,yY],[cY,yY],[cY,Y0+18*u],[cY+12*v,Y0+18*u],[cY+12*v,out]],
    R: [[358,1460],[358,yR],[cR,yR],[cR,out]],
    B: [[336,1460],[336,yB],[cB,yB],[cB,Y0+8*u],[cB-12*v,Y0+8*u],[cB-12*v,out]]
  } : {
    Y: [[380,1460],[380,yY],[cY,yY],[cY,Y0+15*u],[cB+5*v,Y0+15*u],[cB+5*v,Y0+34*u],[cY+22*v,Y0+34*u],[cY+22*v,out]],
    R: [[358,1460],[358,yR],[cR,yR],[cR,Y0+7*u],[cY+13*v,Y0+7*u],[cY+13*v,Y0+27*u],[cB-9*v,Y0+27*u],[cB-9*v,out]],
    B: [[336,1460],[336,yB],[cB,yB],[cB,Y0],[cB-15*v,Y0],[cB-15*v,Y0+21*u],[cR+4*v,Y0+21*u],[cR+4*v,out]]
  };
  // the branches: each leaves its parent's horizontal run on a 45-degree split, then runs alongside it
  const bxO = 380 + (narrow ? 40 : 90), bxP = 380 + (narrow ? 80 : 170);
  paths.O = [[bxO, yR], [bxO + S, yO], [cO, yO], [cO, out]];
  paths.P = [[bxP, yB], [bxP + S, yP], [cP, yP], [cP, Y0 + 10 * u], [cP - 6 * v, Y0 + 10 * u], [cP - 6 * v, out]];
  branchG.innerHTML = "";
  if (!narrow)   // phones skip the split-off orange and purple tracks
  // each branch keeps its parent's color: the orange slot splits off red, the purple slot splits off blue
  [["O", "R"], ["P", "B"]].forEach(([c, parent]) => branchG.appendChild(el("path", { d: roundPath(paths[c], R), class: "trail", stroke: `var(--${parent})` })));
  ["Y", "R", "B"].forEach(c => {
    const s = ext[c]; s.path.setAttribute("d", roundPath(paths[c], R));
    s.len = s.path.getTotalLength(); s.path.setAttribute("stroke-dasharray", s.len);
  });
  // the pearl follows the yellow into the noodles and rests at a stop just above the fork
  { const yp = ext.Y.path, stopY = T + 40 * u - (narrow ? 18 : 30) - 46; let L = yY - 1460 - R;
    while (L < ext.Y.len) { const q = yp.getPointAtLength(L); if (q.x > cY - 2 && q.y >= stopY) break; L += 4; }
    endPearlS = L; endTurnY = yY - R; endRestY = T + H * PEARL_AT; }

  // the fork comes in from the right edge; its three tines skewer the bundle
  forkLayer.innerHTML = "";
  const fk = T + 40 * u, sp = narrow ? 18 : 30, th = narrow ? 9 : 13, tl = cB - 7 * v, tr = cY + 7 * v;
  const g = el("g", { fill: "var(--GR)" });
  [-sp, 0, sp].forEach(dy => g.appendChild(el("rect", { x: tl, y: fk + dy - th / 2, width: tr - tl, height: th, rx: th / 2 })));
  g.appendChild(el("path", { d: `M${tr - 4} ${fk - sp - th / 2} H${tr + 40} Q${tr + 92} ${fk} ${tr + 40} ${fk + sp + th / 2} H${tr - 4} Z` }));
  g.appendChild(el("rect", { x: tr + 60, y: fk - (narrow ? 9 : 13), width: 3000, height: narrow ? 18 : 26, rx: 13 }));
  forkLayer.appendChild(g);
}
// split each project description into word spans once, for the scroll-reveal
const reveals = [...document.querySelectorAll(".stop .desc")].map(p => {
  const words = p.textContent.trim().split(/\s+/); p.textContent = "";
  const spans = words.map((w, i) => { const sp = document.createElement("span"); sp.className = "w"; sp.textContent = w + (i < words.length - 1 ? " " : ""); p.appendChild(sp); return sp; });
  return { p, spans, lit: -1 };
});
function pillCenter(s) { const p = s.querySelector(".pill"); return p.offsetTop + p.offsetHeight / 2; }
function visible(W) {   // camera of reference width W (16:9), matched to the real screen shape
  const a = innerWidth / innerHeight, A = 16 / 9;
  return a >= A ? [W, W / a] : [W * 9 / 16 * a, W * 9 / 16];
}

/* ---------- draw everything for intro time `clock` (+ the current scroll) ---------- */
function render(clock) {
  const realT = Math.min(clock, DURATION);
  const t = realT * PACE, tt = clock * PACE;

  // camera: pull back, then dive onto the rail, then follow the scroll
  const z = easeInOut(clamp((t - CAM.t0) / (CAM.t1 - CAM.t0)));
  let W = CAM.w0 * Math.pow(CAM.w1 / CAM.w0, z), cx = CAM.x, cy = CAM.y;
  const z2 = easeInOut(clamp((t - DIVE.t0) / (DIVE.t1 - DIVE.t0)));
  if (z2 > 0) {
    const [wT] = visible(DIVE.W);
    const railAt = Math.max(DIVE.railAt, 52 / innerWidth);   // on phones, nudge the rail in so the outer track isn't cut off
    W = W * Math.pow(DIVE.W / W, z2);
    cx = lerp(cx, DIVE.railX + wT * (0.5 - railAt), z2); cy = lerp(cy, DIVE.cy, z2);
  }
  const [w, h] = visible(W), k = h / innerHeight;          // world units per screen pixel
  const homeOn = t >= T_HOME;
  // the rail and its stations move 1:1 with the scroll; the pearl trails behind with a little lag
  const scrollY = homeOn ? page.scrollTop : 0;
  smoothY = reduce || !homeOn ? scrollY : smoothY + (scrollY - smoothY) * LAG;
  if (Math.abs(scrollY - smoothY) < 0.3) smoothY = scrollY;
  cy += scrollY * k;
  svg.setAttribute("viewBox", `${cx - w / 2} ${cy - h / 2} ${w} ${h}`);
  const top = cy - h / 2;

  // the end of the line: the rail tracks become the noodles (static geometry, revealed by scrolling)
  if (homeOn) buildEnd(w, k, DIVE.cy - h / 2, cx - w / 2);
  forkLayer.style.opacity = homeOn ? 1 : 0;

  origins.forEach(o => { const p = pop((t - o.t) / 0.35); o.dot.setAttribute("r", R_DOT * p); o.dot.style.opacity = t < o.t ? 0 : 1; });
  segs.forEach(s => {
    const drawn = clamp((t - s.start) * s.speed, 0, s.len);
    s.path.setAttribute("stroke-dashoffset", s.len - drawn);
    s.path.style.opacity = drawn > 0 ? 1 : 0;
    const moving = drawn > 0 && drawn < s.len;
    s.head.style.opacity = moving ? 1 : 0;
    if (moving) { const tip = s.path.getPointAtLength(drawn); s.head.setAttribute("cx", tip.x); s.head.setAttribute("cy", tip.y); }
    s.stops.forEach(({ d, c }) => { const p = pop((drawn - d) / 90); c.setAttribute("r", 7 * p); c.style.opacity = drawn >= d ? 1 : 0; });
    if (s.train) {
      const run = tt - s.done;
      s.train.g.style.opacity = run > 0 ? clamp(run / 0.4) : 0;
      if (run > 0) {
        const u = ((run * TRAIN_SPEED / s.len) + s.train.phase) % 2, pos = (u < 1 ? u : 2 - u) * s.len;
        const a = s.path.getPointAtLength(Math.max(0, pos - 2)), b = s.path.getPointAtLength(Math.min(s.len, pos + 2));
        s.train.g.setAttribute("transform", `translate(${(a.x + b.x) / 2} ${(a.y + b.y) / 2}) rotate(${Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI})`);
      }
    }
  });

  LABELS.forEach(L => { L.g.style.opacity = easeOut(clamp((t - L.t) / 0.4)); });

  // the pearl is already out riding: once the yellow's left-side drop is built it rolls along it like a
  // train, and when the camera dives it glides to its spot on screen, so it's waiting when scrolling unlocks
  const yb = YELLOW_DROP, ride = (t - yb.done) * 260;
  let px = 380, py;
  if (ride <= yb.len) { const q = yb.path.getPointAtLength(Math.max(0, ride)); px = q.x; py = q.y; } else py = 1460 + (ride - yb.len);
  const lagOff = clamp(scrollY - smoothY, -innerHeight * .08, innerHeight * .08) * k;
  let restX = 380, restY = top + h * PEARL_AT - lagOff;
  // near the bottom the yellow turns into a noodle: the pearl follows the track instead of floating off it,
  // measured as distance along the line, and stops at its last station by the fork
  if (homeOn && restY > endTurnY) {
    // from the turn to the bottom of the page, it travels from the corner to its last stop, arriving as you hit the end
    const f = clamp((restY - endTurnY) / (endRestY - endTurnY));
    const q = ext.Y.path.getPointAtLength(lerp(endTurnY - 1460, endPearlS, f)); restX = q.x; restY = q.y;
  }
  // during the dive it keeps riding the same track: straight down the yellow to its spot, never off the line
  const settle = easeInOut(clamp((t - DIVE.t0) / (T_HOME - DIVE.t0)));
  if (t >= DIVE.t0) {
    const r0 = (DIVE.t0 - yb.done) * 260;
    const y0 = r0 <= yb.len ? yb.path.getPointAtLength(Math.max(0, r0)).y : 1460 + (r0 - yb.len);
    px = restX; py = Math.max(y0, lerp(y0, restY, settle));   // only ever rolls forward (down), never back up
  }
  pearl.setAttribute("cx", px); pearl.setAttribute("cy", py);
  pearl.setAttribute("r", 20); pearl.setAttribute("opacity", clamp((t - yb.done) / 0.4));

  // stations: each project's marker sits on the rail level with its section's station pill
  const baseTop = DIVE.cy - h / 2;                       // camera top when the page is at scroll 0
  const pearlScreen = innerHeight * PEARL_AT;
  let active = -1;
  stops.forEach((s, i) => {
    const docY = pillCenter(s);                           // middle of the station-name pill
    s.marker.setAttribute("transform", `translate(0 ${baseTop + docY * k})`);
    s.marker.style.opacity = homeOn ? 1 : 0;
    if (homeOn && docY - scrollY <= pearlScreen + 30) active = i;
  });
  stops.forEach((s, i) => s.classList.toggle("active", i === active));
  // light the words: 0 when the description sits low on screen, all of them by the time it's a bit above the middle
  reveals.forEach(r => {
    const y = r.p.getBoundingClientRect().top;
    const pr = reduce || !homeOn ? (homeOn ? 1 : 0) : (IS_PHONE ? clamp((innerHeight * 0.95 - y) / (innerHeight * 0.33)) : clamp((innerHeight * 0.88 - y) / (innerHeight * 0.42)));
    const n = Math.round(pr * r.spans.length);
    if (n !== r.lit) { r.spans.forEach((sp, i) => sp.classList.toggle("on", i < n)); r.lit = n; }
  });


  // home arrives: nav + page fade in, scrolling unlocks
  const hk = easeOut(clamp((t - T_HOME) / 0.8));
  page.style.opacity = hk; nav.style.opacity = hk;
  page.style.visibility = nav.style.visibility = hk > 0 ? "visible" : "hidden";
  page.style.overflowY = homeOn ? "auto" : "hidden";
  if (!homeOn && page.scrollTop) page.scrollTop = 0;

  const sp = easeOut(clamp((t - T_SIGN) / 0.7)) * (mapCard.checked ? 1 : 0) * (1 - z2);
  mapSign.style.opacity = sp; mapSign.style.visibility = sp > 0 ? "visible" : "hidden";

  scrub.value = realT; timeEl.textContent = realT.toFixed(1) + "s";
  let b = 0; BEATS.forEach(([bt], i) => { if (t >= bt) b = i; });
  beatNum.textContent = b + 1; beatText.textContent = BEATS[b][1];
}
