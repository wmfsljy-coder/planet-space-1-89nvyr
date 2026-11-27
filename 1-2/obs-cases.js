/* 행성우주과학1 Ⅰ-2 태양계 천체와 외계 행성 — '실제 자료' 탭 (2026-11-27)
   o1 화성의 1년 — 10일마다의 태양 거리·공전 속력으로 이심률, 면적 속도, 공전 주기(케플러 1·2·3법칙)
   o2 소행성대의 빈 줄 — 소행성 6만 3천여 개의 궤도 긴반지름 분포에서 커크우드 간극 찾기(목성과의 궤도 공명)
   o3 일곱 행성으로 별의 질량 달기 — TRAPPIST-1 행성 7개의 주기·궤도 반지름으로 케플러 3법칙
   자료: data/obs-mars.js (NASA JPL Horizons), data/obs-asteroids.js (NASA JPL SBDB), data/obs-trappist.js (NASA Exoplanet Archive) — 받은 날 2026-11-27
   이야기 탭 안의 '📊 실제 자료'(real-cases.js, 외계 행성 발견 방법·공전 주기 분포)와 겹치지 않는 자료만 쓴다. */
(function () {
"use strict";
var K = window.sthKit, LT = K.LT;
var MS = (window.OBS_MARS || { rows: [] }).rows;
var KW = window.OBS_KIRK || { a0: 1.8, da: 0.01, counts: [], n: 0, jupiter: 5.2026 };
var TR = window.OBS_TRAP || { star: { mass: 0.09, dist: 12.4 }, rows: [] };

function card(ctx, x, W, CH, title, rows, tip, good) {
  K.card(ctx, x, 8, W - x - 8, CH - 16, null);
  K.t(ctx, title, x + 16, 50, { s: 12, w: "800", c: LT.mute });
  rows.forEach(function (r, i) { K.row(ctx, r[0], r[1], x + 16, W - 24, 80 + i * 27, r[2]); });
  if (tip) K.tip(ctx, tip, x + 12, CH - 56, W - x - 32, good);
}
function vline(ctx, g, x, col, dash) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash(dash || [5, 4]);
  ctx.beginPath(); ctx.moveTo(g.X(x), g.T); ctx.lineTo(g.X(x), g.B); ctx.stroke(); ctx.restore();
}
function src(s) { return "<small>출처: " + s + " · 받은 날 2026-11-27 · 사본은 이 단원의 data/ 폴더.</small>"; }
var MON = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
function kd(s) { return s.slice(0, 4) + "년 " + MON[s.slice(5, 8)] + "월 " + (+s.slice(9, 11)) + "일"; }

/* ---- o1 계산값 ---- */
var IMIN = 0, IMAX = 0; MS.forEach(function (r, i) { if (r[1] < MS[IMIN][1]) IMIN = i; if (r[1] > MS[IMAX][1]) IMAX = i; });
var RP = MS.length ? MS[IMIN][1] : 1.381, RA = MS.length ? MS[IMAX][1] : 1.666;
var E_TRUE = (RA - RP) / (RA + RP), A_TRUE = (RA + RP) / 2, T_TRUE = Math.pow(A_TRUE, 1.5) * 365.25;

/* ---- o2 계산값 ---- */
var CN = KW.counts;
var NKW = CN.reduce(function (s, c) { return s + c; }, 0);   /* 그래프에 든 소행성 수(1.80~3.60 AU) */
function aOf(i) { return KW.a0 + KW.da * i; }
var GAP = (function () { var b = -1; for (var i = 0; i < CN.length; i++) { var a = aOf(i); if (a >= 2.3 && a <= 2.7 && (b < 0 || CN[i] < CN[b])) b = i; } return b < 0 ? 70 : b; })();
var A_GAP = aOf(GAP) + KW.da / 2, TJ = Math.pow(KW.jupiter, 1.5), RAT = TJ / Math.pow(A_GAP, 1.5);
var CMAX = Math.max.apply(null, CN.concat([1]));

/* ---- o3 계산값 ---- */
var TP = TR.rows.map(function (r) { var P = r[1] / 365.25; return { n: r[0], P: r[1], a: r[2], R: r[3], S: r[4], T: r[5], m: Math.pow(r[2], 3) / (P * P) }; });
var M_TRUE = TP.length ? TP.reduce(function (s, p) { return s + p.m; }, 0) / TP.length : 0.09;
var NEAR = TP.reduce(function (b, p) { return !b || Math.abs(Math.log(p.S)) < Math.abs(Math.log(b.S)) ? p : b; }, null) || { n: "d", S: 1.1 };
function lg(x) { return Math.log(x) / Math.LN10; }

window.sthLab({
  mount: "obs", key: "obs", result: "rObs", label: "실제 자료",
  doneNote: "정리하기 탭에서, 실제 관측값이 케플러 법칙과 소천체·외계 행성 이야기와 어디까지 맞았는지 한 문장으로 적어 보세요.",
  cases: [
  {
    id: "o1", tag: "실제 자료 · 케플러 법칙", title: "화성의 1년, 거리와 속력", short: "화성 궤도",
    kind: "obs calc", kindPos: "tr",
    who: "🔴", name: "화성 탐사 궤도 설계팀",
    say: "“NASA 제트추진연구소의 궤도 계산(Horizons)으로 뽑은 <b>화성의 위치와 속도</b>입니다. 2025년 1월부터 10일마다, 태양까지의 거리와 공전 속력이 들어 있어요. 화성 탐사선을 언제 보낼지 정하려면 화성 궤도가 얼마나 찌그러져 있는지 알아야 합니다. 가장 가까울 때와 가장 멀 때를 찾아 <b>이심률</b>과 <b>공전 주기</b>를 구해 주세요.”",
    predict: {
      q: "화성이 태양에 가장 가까울 때(근일점)와 가장 멀 때(원일점), 공전 속력은 어떨까요?",
      options: ["㉠ 언제나 같다", "㉡ 가까울 때 더 빠르다", "㉢ 멀 때 더 빠르다"],
      answer: 1
    },
    task: "날짜 슬라이더로 <b>가장 가까운 거리</b>와 <b>가장 먼 거리</b>를 찾아 ① <b>이심률</b> e = (원일점 거리 − 근일점 거리) ÷ (두 거리의 합)을 맞추고(± 0.005) ② 긴반지름 a = (두 거리의 합) ÷ 2 로 케플러 3법칙(T² = a³, T는 년, a는 AU)에 넣어 <b>공전 주기</b>를 일 단위로 구하세요(± 8일).",
    build: function (stage, api) {
      var cv = api.canvas(310), ctx = cv.ctx, W = cv.W, k = 0, e = 0.05, T = 600;
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        /* 왼쪽: 위에서 본 궤도 */
        var cx = 150, cy = 172, S = 72;
        ctx.save(); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.roundRect(8, 52, 284, cv.H - 60, 12); ctx.fill(); ctx.restore();
        ctx.strokeStyle = "rgba(28,126,214,.35)"; ctx.lineWidth = 1.5; ctx.beginPath();
        MS.forEach(function (r, i) { var th = r[3] * Math.PI / 180, x = cx + S * r[1] * Math.cos(th), y = cy - S * r[1] * Math.sin(th); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke();
        MS.forEach(function (r) { var th = r[3] * Math.PI / 180; ctx.fillStyle = "rgba(28,126,214,.55)"; ctx.beginPath(); ctx.arc(cx + S * r[1] * Math.cos(th), cy - S * r[1] * Math.sin(th), 2, 0, 6.2832); ctx.fill(); });
        ctx.strokeStyle = "rgba(92,112,134,.35)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(cx, cy, S, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = LT.yellow; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, 6.2832); ctx.fill();
        var r = MS[k], th = r[3] * Math.PI / 180, mx = cx + S * r[1] * Math.cos(th), my = cy - S * r[1] * Math.sin(th);
        ctx.strokeStyle = LT.red; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(mx, my); ctx.stroke();
        ctx.fillStyle = LT.red; ctx.beginPath(); ctx.arc(mx, my, 6, 0, 6.2832); ctx.fill();
        K.t(ctx, "점선: 지구 궤도(1 AU)", 18, cv.H - 16, { s: 10.5, w: "700", c: LT.mute });
        /* 가운데: 거리-날짜 그래프 */
        var g = K.chart(ctx, { x: 296, y: 52, w: 386, h: cv.H - 56, pl: 52, x0: 0, x1: MS.length - 1, y0: 1.35, y1: 1.7, xt: 4, yt: 7, light: true,
          xf: function (x) { var s = MS[Math.round(x)]; return s ? s[0].slice(0, 4) + "." + MON[s[0].slice(5, 8)] : ""; }, yf: function (y) { return y.toFixed(2) + " AU"; } });
        K.plot(ctx, g, MS.map(function (q, i) { return [i, q[1]]; }), LT.blue, { light: true, w: 2.4, dots: 2 });
        vline(ctx, g, k, LT.red);
        K.bigText(ctx, kd(r[0]) + " · " + r[1].toFixed(3) + " AU", 16, 38, 21, "#ffffff");
        card(ctx, 690, W, cv.H, "화성 · 태양 중심", [
          ["날짜", kd(r[0])], ["태양 거리", r[1].toFixed(3) + " AU", LT.blue], ["공전 속력", r[2].toFixed(2) + " km/s", LT.red],
          ["거리 × 속력", (r[1] * r[2]).toFixed(1)], ["내 답: 이심률", e.toFixed(3), LT.blue], ["내 답: 주기", T + " 일", LT.blue]
        ], "a = (근일점 + 원일점) ÷ 2", null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "날짜(10일 간격)", min: 0, max: MS.length - 1, step: 1, value: 0, fmt: function (x) { return MS[x] ? kd(MS[x][0]) : ""; }, onInput: function (x) { k = x; draw(); } });
      api.slider({ label: "① 이심률 e", min: 0, max: 0.3, step: 0.001, value: 0.05, fmt: function (x) { return x.toFixed(3); }, onInput: function (x) { e = x; api.changed(); draw(); } });
      api.slider({ label: "② 공전 주기", min: 365, max: 1000, step: 1, value: 600, fmt: function (x) { return x + " 일"; }, onInput: function (x) { T = x; api.changed(); draw(); } });
      api.info("10일 간격이라 가장 가깝거나 먼 순간을 며칠 비켜 갈 수 있지만, 거리는 그 근처에서 아주 천천히 변하므로 결과에는 거의 영향이 없습니다. 카드의 ‘거리 × 속력’도 근일점과 원일점에서 견주어 보세요. "
        + src("미국 항공우주국 제트추진연구소(NASA JPL) Horizons 천체력, 화성의 태양 중심 위치·속도 벡터, 2025년 1월 1일 ~ 2027년 2월, 10일 간격"));
      draw();
      return {
        judge: function () {
          var okE = Math.abs(e - E_TRUE) <= 0.005 + 1e-9, okT = Math.abs(T - T_TRUE) <= 8;
          if (okE && okT) return { ok: true, msg: "근일점 " + RP.toFixed(3) + " AU(" + kd(MS[IMIN][0]) + "), 원일점 " + RA.toFixed(3) + " AU(" + kd(MS[IMAX][0]) + ") → e ≈ " + E_TRUE.toFixed(3) + ", a ≈ " + A_TRUE.toFixed(3) + " AU, T = a^1.5 ≈ " + Math.pow(A_TRUE, 1.5).toFixed(3) + "년 ≈ " + Math.round(T_TRUE) + "일." };
          if (!okE) return { ok: false, msg: "이심률 " + e.toFixed(3) + "은 " + (e < E_TRUE ? "작습니다" : "큽니다") + ". 그래프의 가장 낮은 점과 가장 높은 점의 거리를 읽어 (먼 거리 − 가까운 거리) ÷ (두 거리의 합)을 계산하세요." };
          return { ok: false, msg: "이심률은 맞았습니다. 주기 " + T + "일은 " + (T < T_TRUE ? "짧습니다" : "깁니다") + ". a를 구해 a × √a 로 년을 얻고, 365.25를 곱하세요." };
        }
      };
    },
    hints: ["가장 가까운 거리는 1.38 AU 대, 가장 먼 거리는 1.66 AU 대입니다.", "a ≈ 1.52 AU 라면 1.52 × √1.52 ≈ 1.87년 ≈ 685일."],
    solution: "이심률 약 <b>" + E_TRUE.toFixed(3) + "</b>, 긴반지름 약 <b>" + A_TRUE.toFixed(3) + " AU</b>, 공전 주기 약 <b>" + Math.round(T_TRUE) + "일</b>(실제 화성의 공전 주기 약 687일).",
    why: "화성 궤도는 이심률이 약 0.09인 타원이라(케플러 1법칙), 태양과의 거리가 1.38 AU에서 1.67 AU까지 20% 넘게 달라집니다. 가까울 때 속력이 " + (MS.length ? MS[IMIN][2].toFixed(1) : "26.5") + " km/s, 멀 때 " + (MS.length ? MS[IMAX][2].toFixed(1) : "22.0") + " km/s로, 근일점에서 더 빠릅니다. ‘거리 × 속력’이 " + (MS.length ? "근일점(" + (RP * MS[IMIN][2]).toFixed(1) + ")과 원일점(" + (RA * MS[IMAX][2]).toFixed(1) + ")에서" : "두 곳에서") + " 같은 것은, 같은 시간 동안 태양과 화성을 이은 선이 쓸고 지나가는 넓이가 같다는 케플러 2법칙(면적 속도 일정)을 보여 줍니다.<br>"
      + "가장 가까운 거리와 가장 먼 거리만으로 구한 긴반지름을 T² = a³에 넣으면, 실제로 관측된 공전 주기(약 687일)가 거의 그대로 나옵니다(케플러 3법칙). 화성 탐사선은 지구와 화성의 위치가 알맞게 맞는 약 26개월마다 발사하는데, 이 계산도 바로 이 궤도 요소들로 합니다."
  },
  {
    id: "o2", tag: "실제 자료 · 소행성", title: "소행성대의 빈 줄", short: "커크우드 간극",
    kind: "obs calc", kindPos: "tr",
    who: "🪨", name: "소행성 목록 관리팀",
    say: "“NASA 소천체 자료에서, 번호가 붙은 소행성 가운데 지름이 대략 수 km보다 큰(H < 15) 것 중, 궤도 긴반지름(a)이 " + KW.a0.toFixed(1) + "~" + (KW.a0 + KW.da * CN.length).toFixed(1) + " AU인 <b>" + NKW.toLocaleString() + "개</b>를 0.01 AU 간격으로 세었습니다. 소행성들은 화성과 목성 사이에 고르게 퍼져 있을까요? 빈 곳이 있다면, 그 거리에서 공전하는 소행성과 목성(a = " + KW.jupiter.toFixed(2) + " AU)의 <b>공전 주기 비</b>를 구해 주세요.”",
    predict: {
      q: "소행성들의 궤도 긴반지름은 어떻게 분포할까요?",
      options: ["㉠ 2~3.5 AU 사이에 고르게 퍼져 있다", "㉡ 특정 거리마다 소행성이 거의 없는 빈 줄(틈)이 있다", "㉢ 한 거리(약 2.8 AU)에 거의 모두 몰려 있다"],
      answer: 1
    },
    task: "① 거리 슬라이더로 <b>2.3 ~ 2.7 AU 사이에서 가장 깊은 틈</b>을 찾아 맞추세요(± 0.02 AU). ② 그 틈에서 공전하는 소행성과 목성의 <b>공전 주기 비</b>(목성 : 소행성)를 고르세요. 공전 주기는 T = a^1.5 (년)입니다.",
    build: function (stage, api) {
      var cv = api.canvas(300), ctx = cv.ctx, W = cv.W, a = 2.2, pick = "";
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var g = K.chart(ctx, { x: 4, y: 52, w: 676, h: cv.H - 56, pl: 52, x0: 1.8, x1: 3.6, y0: 0, y1: Math.ceil(CMAX / 400) * 400, xt: 9, yt: 4, light: true,
          xf: function (x) { return x.toFixed(1) + " AU"; }, yf: function (y) { return y.toFixed(0) + "개"; } });
        var bw = (g.R - g.L) / 180;
        CN.forEach(function (c, i) { var x = g.X(aOf(i)); ctx.fillStyle = "rgba(28,126,214,.7)"; ctx.fillRect(x, g.Y(c), Math.max(1, bw - 0.5), g.B - g.Y(c)); });
        vline(ctx, g, a, LT.red);
        var i = Math.round((a - KW.a0) / KW.da), c = CN[i] || 0, T = Math.pow(a + KW.da / 2, 1.5);
        K.t(ctx, "막대 하나: 0.01 AU 안에 있는 소행성 수", g.R - 4, g.T + 14, { s: 11, w: "800", a: "right", c: LT.mute });
        K.bigText(ctx, "a = " + a.toFixed(2) + " AU · " + c + "개", 16, 38, 22, "#ffffff");
        card(ctx, 690, W, cv.H, "소행성 " + NKW.toLocaleString() + "개", [
          ["긴반지름", a.toFixed(2) + "~" + (a + KW.da).toFixed(2) + " AU"], ["소행성 수", c + " 개", LT.blue],
          ["공전 주기", T.toFixed(2) + " 년", LT.blue], ["목성 공전 주기", TJ.toFixed(2) + " 년", LT.orange], ["목성 ÷ 소행성", (TJ / T).toFixed(2), LT.red],
          ["내 답: 주기 비", pick || "–", LT.blue]
        ], "주기 비가 정수 비가 되는 곳?", null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "① 궤도 긴반지름(가장 깊은 틈에 맞추기)", min: 1.8, max: 3.59, step: 0.01, value: 2.2, fmt: function (x) { return x.toFixed(2) + " AU"; }, onInput: function (x) { a = x; api.changed(); draw(); } });
      api.seg({ label: "② 그 틈의 공전 주기 비(목성 : 소행성)", value: "", options: [{ v: "2 : 1", t: "2 : 1" }, { v: "5 : 2", t: "5 : 2" }, { v: "3 : 1", t: "3 : 1" }], onPick: function (x) { pick = x; api.changed(); draw(); } });
      api.info("2.06 AU 아래쪽과 3.3 AU 바깥쪽에도 소행성이 적은 곳이 있습니다. 여러 틈을 찾아 카드의 ‘목성 ÷ 소행성’ 값을 읽어 보세요. "
        + src("미국 항공우주국 제트추진연구소(NASA JPL) 소천체 자료(SBDB Query API), 번호 붙은 소행성 중 H < 15, a 1.7~4.2 AU, 0.01 AU 간격으로 셈"));
      draw();
      return {
        judge: function () {
          var okA = Math.abs(a + KW.da / 2 - A_GAP) <= 0.02 + 1e-9, okP = pick === "3 : 1";
          if (okA && okP) return { ok: true, msg: "가장 깊은 틈은 " + aOf(GAP).toFixed(2) + "~" + aOf(GAP + 1).toFixed(2) + " AU(소행성 " + CN[GAP] + "개, 옆 칸들은 수백 개). 이곳 공전 주기 " + Math.pow(A_GAP, 1.5).toFixed(2) + "년, 목성 " + TJ.toFixed(2) + "년 → 비 " + RAT.toFixed(2) + " ≈ 3 : 1." };
          if (!okA) return { ok: false, msg: a.toFixed(2) + " AU에는 소행성이 " + (CN[Math.round((a - KW.a0) / KW.da)] || 0) + "개 있습니다. 2.3~2.7 AU 사이에서 막대가 거의 바닥까지 꺼진 곳을 찾으세요." };
          return { ok: false, msg: "틈의 위치는 맞았습니다. 카드의 ‘목성 ÷ 소행성’ 값이 어떤 정수 비에 가장 가까운가요?" };
        }
      };
    },
    hints: ["2.5 AU 바로 근처에서 막대가 10개 아래로 꺼집니다.", "목성 주기 11.87년 ÷ 소행성 주기 약 3.95년 ≈ 3."],
    solution: "가장 깊은 틈 약 <b>" + A_GAP.toFixed(2) + " AU</b>, 목성과의 공전 주기 비 <b>3 : 1</b>.",
    why: "소행성대에는 소행성이 거의 없는 빈 줄이 몇 개 있습니다(커크우드 간극). 2.50 AU 틈에서 공전하는 소행성은 목성이 한 바퀴 돌 때 정확히 세 바퀴를 돕니다. 그러면 소행성과 목성이 늘 같은 자리에서 가장 가까워져, 목성의 중력이 같은 방향으로 되풀이해 당깁니다(궤도 공명). 작은 힘도 쌓이면 궤도가 점점 찌그러져, 그 소행성은 결국 다른 곳으로 밀려나거나 화성·지구 궤도를 가로지르게 됩니다.<br>"
      + "자료에서 2.82 AU(5 : 2), 2.95 AU 근처(7 : 3), 3.27 AU(2 : 1)에도 틈이 보입니다. 이렇게 목성의 중력은 소행성대의 모양을 만들고, 일부 소행성을 지구 근처로 보내는 통로가 되기도 합니다. 이 그래프는 궤도 긴반지름만 센 것이어서, 실제 하늘에서 소행성대에 빈 고리가 눈에 보이는 것은 아닙니다."
  },
  {
    id: "o3", tag: "실제 자료 · 외계 행성계", title: "일곱 행성으로 별의 질량 달기", short: "TRAPPIST-1",
    kind: "obs calc", kindPos: "tr",
    who: "🔭", name: "외계 행성 연구실",
    say: "“지구에서 약 " + TR.star.dist.toFixed(1) + " pc(약 40광년) 떨어진 어두운 붉은 별 <b>TRAPPIST-1</b>에는 지구만 한 행성이 <b>일곱 개</b>나 돕니다. NASA 외계 행성 자료 보관소의 공전 주기와 궤도 긴반지름이에요. 케플러 3법칙을 태양이 아닌 별에 쓰면 a³ ÷ T² 가 그 별의 <b>질량</b>(태양 = 1)이 됩니다(a는 AU, T는 년). 이 별은 태양보다 얼마나 가벼울까요?”",
    predict: {
      q: "별의 질량이 태양의 1/10이라면, 같은 궤도 반지름을 도는 행성의 공전 주기는 태양계에서와 비교해 어떨까요?",
      options: ["㉠ 더 짧다", "㉡ 더 길다", "㉢ 같다(주기는 궤도 반지름만으로 정해진다)"],
      answer: 1
    },
    task: "① 별 질량 슬라이더를 움직여 <b>직선이 일곱 점을 지나게</b> 맞추세요(± 0.008). ② 받는 복사 에너지(지구 = 1)가 <b>지구와 가장 비슷한 행성</b>을 고르세요.",
    build: function (stage, api) {
      var cv = api.canvas(310), ctx = cv.ctx, W = cv.W, M = 0.3, pick = "";
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var g = K.chart(ctx, { x: 4, y: 52, w: 676, h: cv.H - 56, pl: 64, x0: -5, x1: -2.5, y0: -6.5, y1: -3, xt: 5, yt: 7, light: true,
          xf: function (x) { return "10^" + x.toFixed(1); }, yf: function (y) { return "10^" + y.toFixed(1); } });
        function seg(c) { var xa = Math.max(-5, -6.5 - c), xb = Math.min(-2.5, -3 - c); return xa < xb ? [[xa, xa + c], [xb, xb + c]] : []; }
        K.plot(ctx, g, seg(0), LT.mute, { light: true, w: 1.6, dash: [6, 5], glow: false });
        K.plot(ctx, g, seg(lg(M)), LT.red, { light: true, w: 2.4 });
        TP.forEach(function (p) {
          var x = g.X(lg(Math.pow(p.P / 365.25, 2))), y = g.Y(lg(Math.pow(p.a, 3)));
          ctx.fillStyle = Math.abs(Math.log(p.S)) < 0.5 ? LT.green : LT.blue; ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.2832); ctx.fill();
          K.t(ctx, p.n, x + 9, y + 4, { s: 12, w: "900", c: LT.ink });
        });
        K.t(ctx, "가로: T²(년²)  세로: a³(AU³)  — 회색 점선: 태양(질량 1)이라면", g.L + 6, g.T + 14, { s: 11, w: "800", c: LT.mute });
        K.bigText(ctx, "별 질량 " + M.toFixed(3) + " (태양 = 1)", 16, 38, 22, "#ffffff");
        var rows = TP.map(function (p) { return [p.n + " · " + p.P.toFixed(2) + "일 · " + p.a.toFixed(4) + " AU", "S " + p.S.toFixed(2), Math.abs(Math.log(p.S)) < 0.5 ? LT.green : LT.ink]; });
        K.card(ctx, 690, 8, W - 698, cv.H - 16, null);
        K.t(ctx, "주기 · 긴반지름 · 받는 에너지(S)", 706, 34, { s: 11, w: "800", c: LT.mute });
        rows.forEach(function (r, i) { K.t(ctx, r[0], 706, 58 + i * 25, { s: 10.5, w: "700", c: LT.mute }); K.t(ctx, r[1], W - 22, 58 + i * 25, { s: 12, w: "900", a: "right", c: r[2] }); });
        K.row(ctx, "내 답: 질량", M.toFixed(3), 706, W - 22, 58 + rows.length * 25 + 6, LT.red);
        K.row(ctx, "내 답: 행성", pick || "–", 706, W - 22, 58 + rows.length * 25 + 32, LT.blue);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "① 별의 질량(태양 = 1)", min: 0.02, max: 0.5, step: 0.001, value: 0.3, fmt: function (x) { return x.toFixed(3); }, onInput: function (x) { M = x; api.changed(); draw(); } });
      api.seg({ label: "② 받는 에너지가 지구와 가장 비슷한 행성", value: "", options: TP.map(function (p) { return { v: p.n, t: p.n }; }), onPick: function (x) { pick = x; api.changed(); draw(); } });
      api.info("축은 10의 거듭제곱 눈금(로그 눈금)입니다. 로그 눈금에서 a³ = M × T² 는 기울기가 1인 직선이고, M이 커지면 직선이 위로 평행 이동합니다. "
        + src("미국 항공우주국 외계 행성 자료 보관소(NASA Exoplanet Archive) TAP, pscomppars 표의 TRAPPIST-1 행성 b~h"));
      draw();
      return {
        judge: function () {
          var okM = Math.abs(M - M_TRUE) <= 0.008 + 1e-9, okP = pick === NEAR.n;
          if (okM && okP) return { ok: true, msg: "일곱 행성 모두 a³ ÷ T² ≈ " + M_TRUE.toFixed(3) + " → 별의 질량은 태양의 약 " + M_TRUE.toFixed(2) + "배(약 1/" + Math.round(1 / M_TRUE) + "). 받는 에너지가 지구와 가장 비슷한 행성은 " + NEAR.n + "(S = " + NEAR.S.toFixed(2) + ")." };
          if (!okM) return { ok: false, msg: "질량 " + M.toFixed(3) + "의 직선은 점들보다 " + (M < M_TRUE ? "아래" : "위") + "에 있습니다. 직선이 일곱 점 한가운데를 지나게 옮기세요." };
          return { ok: false, msg: "질량은 맞았습니다. 카드의 S 값이 1에 가장 가까운 행성은 어느 것인가요?" };
        }
      };
    },
    hints: ["태양(질량 1)의 회색 점선보다 점들이 한참 아래에 있습니다. 0.1 근처부터 맞춰 보세요.", "예: e 행성은 a = 0.0293 AU, T = 6.10일 = 0.0167년 → 0.0293³ ÷ 0.0167² ≈ 0.09."],
    solution: "별의 질량 약 <b>" + M_TRUE.toFixed(3) + "</b>(태양 = 1), 받는 에너지가 지구와 가장 비슷한 행성 <b>" + NEAR.n + "</b>.",
    why: "케플러 3법칙을 뉴턴의 만유인력으로 넓히면 a³ / T² 는 가운데 별의 질량에 비례합니다(행성 질량은 아주 작아 무시). TRAPPIST-1의 일곱 행성은 모두 같은 직선 위에 놓여, 한 별의 중력이 일곱 행성을 함께 붙잡고 있음을 보여 줍니다. 그 값이 약 " + M_TRUE.toFixed(2) + "이므로 이 별은 태양 질량의 1/" + Math.round(1 / M_TRUE) + " 남짓인 가벼운 적색 왜성입니다. 별이 가벼우니 같은 거리라도 행성이 더 천천히 돌고, 행성들이 모두 수성 궤도(0.39 AU)보다 훨씬 안쪽에 몰려 있는데도 주기가 1.5~19일입니다.<br>"
      + "이 별은 아주 어두워서, 0.02~0.05 AU처럼 가까운 곳의 행성이 지구와 비슷한 양의 에너지를 받습니다. 받는 에너지만 보면 " + NEAR.n + "가 지구와 가장 비슷하고 e·f도 생명 가능 지대 후보로 꼽히지만, 대기가 있는지·물이 있는지는 제임스 웹 우주 망원경 등으로 아직 조사하고 있습니다. 보관소의 궤도 긴반지름도 이 법칙과 별의 질량을 함께 써서 정한 값이라, 이 활동은 ‘법칙이 일곱 행성 모두에 들어맞는지’를 확인하는 것으로 보아야 합니다."
  }
  ]
});
})();
