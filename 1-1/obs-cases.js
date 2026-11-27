/* 행성우주과학1 Ⅰ-1 우주 탐사와 태양 활동 — '실제 자료' 탭 (2026-11-27)
   o1 49년째 날아가는 보이저 1호 — 해마다의 태양 거리로 속력, 지금의 태양 거리로 어림한 전파가 닿는 시간
   o2 2024년 5월, 태양풍이 지구를 때린 날 — 태양풍 속력이 뛴 시각, L1 위성이 주는 경보 시간, Dst 지수
   o3 아포피스는 정말 가까이 올까 — 2016~2025년 1 LD 안으로 지나간 소행성 1,144번과 2029년 아포피스
   자료: data/obs-voyager.js (NASA JPL Horizons), data/obs-storm.js (NASA GSFC OMNI), data/obs-neo.js (NASA JPL SBDB 근접 통과) — 받은 날 2026-11-27
   이야기 탭 안의 '📊 실제 자료'(real-cases.js, 연평균 흑점 수·창원 기온)와 겹치지 않는 자료만 쓴다. */
(function () {
"use strict";
var K = window.sthKit, LT = K.LT;
var VY = (window.OBS_VOY || { rows: [] }).rows;
var SW = (window.OBS_STORM || { rows: [] }).rows;
var NEO = window.OBS_NEO || { rows: [], apophis: { au: 0.000254, h: 19.1, v: 7.4, date: "2029-04-13" } };
var AU = 149597870.7, LS = 299792.458;

/* ---- 공용: 밝은 스튜디오 그래프 + 오른쪽 흰 카드 ---- */
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
function n0(v) { return Math.round(v).toLocaleString(); }

/* ---- o1 계산값 ---- */
function vrow(y) { for (var i = 0; i < VY.length; i++) if (VY[i][0] === y) return VY[i]; return null; }
var Y0 = VY.length ? VY[0][0] : 1980, Y1 = VY.length ? VY[VY.length - 1][0] : 2026;
var R90 = vrow(1990) || [1990, 40.2], RL = vrow(Y1) || [2026, 169.2, 16.9, 23.6];
var VAU = (RL[1] - R90[1]) / (Y1 - 1990);                     /* AU/년 */
var VKM = VAU * AU / (365.25 * 86400);                         /* km/s */
var LT_TRUE = RL[1] * 499.005 / 3600;                          /* 화면 카드의 태양 거리로 어림한 한쪽 전파 시간(시간) — 학생이 계산하는 값 */
var LT_HZ = RL[3];                                             /* Horizons가 지구 위치까지 넣어 계산한 실제 한쪽 전파 시간(시간), 설명용 */

/* ---- o2 계산값 ---- */
var ARR = (function () { for (var i = 1; i < SW.length; i++) if (SW[i][3] != null && SW[i - 1][3] != null && SW[i][3] - SW[i - 1][3] >= 80) return i; return 41; })();
var VPOST = (function () { var s = 0, n = 0; for (var i = ARR; i < Math.min(SW.length, ARR + 6); i++) if (SW[i][3] != null) { s += SW[i][3]; n++; } return n ? s / n : 700; })();
function segs(a) { /* null(관측이 빠진 시각)에서 끊어 그리기 */
  var out = [], cur = [];
  a.forEach(function (p) { if (p[1] == null) { if (cur.length) out.push(cur); cur = []; } else cur.push(p); });
  if (cur.length) out.push(cur); return out;
}
function f1(v, u) { return v == null ? "–" : v.toFixed(1) + (u || ""); }
var L1 = 1.5e6, LEAD = L1 / VPOST / 60;                        /* 분 */
var DMIN = SW.reduce(function (b, r, i) { return r[5] != null && r[5] < b[1] ? [i, r[5]] : b; }, [0, 0]);
var KMAX = SW.reduce(function (m, r) { return r[4] == null ? m : Math.max(m, r[4]); }, 0);
var DMAXP = SW.reduce(function (m, r) { return r[5] == null ? m : Math.max(m, r[5]); }, 0);
function hl(i) { var r = SW[i]; return r ? (+r[0].slice(0, 2)) + "/" + (+r[0].slice(3, 5)) + " " + (+r[0].slice(6, 8)) + "시" : ""; }

/* ---- o3 계산값 ---- */
var AP_KM = NEO.apophis.au * AU, GEO = 42164, MOON = 384400;
var NR = NEO.rows;
var IN_GEO = NR.filter(function (r) { return r[1] < GEO; }).length;
var IN_AP = NR.filter(function (r) { return r[1] < AP_KM; });
var BIG_AP = IN_AP.filter(function (r) { return r[2] <= 20; }).length;
var HMIN_AP = IN_AP.reduce(function (m, r) { return Math.min(m, r[2]); }, 99);
var HMIN_ALL = NR.reduce(function (m, r) { return Math.min(m, r[2]); }, 99);
var HMIN_GEO = NR.filter(function (r) { return r[1] < GEO; }).reduce(function (m, r) { return Math.min(m, r[2]); }, 99);
var CLOSEST = NR.reduce(function (b, r) { return r[1] < b[1] ? r : b; }, [0, 1e9, 0, 0]);

window.sthLab({
  mount: "obs", key: "obs", result: "rObs", label: "실제 자료",
  doneNote: "정리하기 탭에서, 실제 관측값이 이야기 속 생각(탐사선의 속력과 통신, 태양풍 경보, 근접 천체 감시)과 어디까지 맞았는지 한 문장으로 적어 보세요.",
  cases: [
  {
    id: "o1", tag: "실제 자료 · 태양계 탐사선", title: "49년째 날아가는 보이저 1호", short: "보이저 1호",
    kind: "obs calc", kindPos: "tr",
    who: "🛰️", name: "심우주 통신망 관제실",
    say: "“1977년에 떠난 <b>보이저 1호</b>는 지금 사람이 만든 물체 가운데 가장 멀리 있습니다. NASA 제트추진연구소의 궤도 계산(Horizons)으로 뽑은, 해마다 1월 1일의 <b>태양까지 거리</b>(AU)예요. 1 AU는 지구와 태양 사이 평균 거리인 약 1억 5천만 km입니다. 이 탐사선은 얼마나 빨리 멀어지고 있고, 우리가 보낸 명령은 몇 시간 뒤에야 닿을까요?”",
    predict: {
      q: "목성과 토성을 지나 태양계 바깥으로 나가는 보이저 1호의 빠르기는 지금 어떻게 변하고 있을까요?",
      options: ["㉠ 엔진을 계속 켜고 있어서 점점 빨라진다", "㉡ 거의 같은 빠르기로 멀어진다(태양 중력 때문에 아주 조금씩만 느려진다)", "㉢ 태양 중력에 붙잡혀 곧 멈췄다가 되돌아온다"],
      answer: 1
    },
    task: "① <b>처음 해</b>와 <b>나중 해</b>를 골라 1년에 몇 AU씩 멀어지는지 읽고, <b>km/s</b>로 바꿔 맞추세요(± 0.5 km/s, 1 AU/년 ≈ 4.74 km/s). ② " + Y1 + "년 1월의 <b>태양 거리</b>로 전파가 탐사선에 닿는 <b>시간</b>을 어림하세요(± 0.5 시간, 빛은 1 AU를 약 499초에 갑니다).",
    build: function (stage, api) {
      var cv = api.canvas(300), ctx = cv.ctx, W = cv.W, ya = 2000, yb = Y1, v = 10, h = 10;
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var g = K.chart(ctx, { x: 4, y: 52, w: 676, h: cv.H - 56, pl: 56, x0: Y0, x1: Y1, y0: 0, y1: 180, xt: 6, yt: 6, light: true,
          xf: function (x) { return Math.round(x) + ""; }, yf: function (y) { return y.toFixed(0) + " AU"; } });
        K.plot(ctx, g, VY.map(function (r) { return [r[0], r[1]]; }), LT.blue, { light: true, w: 2.6, dots: 2.6 });
        vline(ctx, g, ya, LT.orange); vline(ctx, g, yb, LT.red);
        var A = vrow(ya), B = vrow(yb), sp = (B[1] - A[1]) / Math.max(1, yb - ya);
        [[A, LT.orange], [B, LT.red]].forEach(function (p) { ctx.fillStyle = "#fff"; ctx.strokeStyle = p[1]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(g.X(p[0][0]), g.Y(p[0][1]), 5, 0, 6.2832); ctx.fill(); ctx.stroke(); });
        K.bigText(ctx, "속력 " + v.toFixed(1) + " km/s · 전파 " + h.toFixed(1) + " 시간", 16, 38, 22, "#ffffff");
        card(ctx, 690, W, cv.H, "보이저 1호 · 매년 1월 1일", [
          [ya + "년 거리", A[1].toFixed(1) + " AU", LT.orange], [yb + "년 거리", B[1].toFixed(1) + " AU", LT.red],
          ["1년에", (ya === yb ? "–" : sp.toFixed(2) + " AU"), LT.blue], ["내 답: 속력", v.toFixed(1) + " km/s", LT.blue],
          ["내 답: 전파 시간", h.toFixed(1) + " 시간", LT.blue]
        ], "1 AU/년 ≈ 4.74 km/s", null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "처음 해", min: Y0, max: Y1 - 1, step: 1, value: 2000, fmt: function (x) { return x + "년"; }, onInput: function (x) { ya = x; if (yb <= ya) yb = ya + 1; draw(); } });
      api.slider({ label: "나중 해", min: Y0 + 1, max: Y1, step: 1, value: Y1, fmt: function (x) { return x + "년"; }, onInput: function (x) { yb = Math.max(x, ya + 1); draw(); } });
      api.slider({ label: "① 멀어지는 속력", min: 5, max: 30, step: 0.1, value: 10, fmt: function (x) { return x.toFixed(1) + " km/s"; }, onInput: function (x) { v = x; api.changed(); draw(); } });
      api.slider({ label: "② " + Y1 + "년 1월, 전파가 닿는 시간", min: 1, max: 40, step: 0.1, value: 10, fmt: function (x) { return x.toFixed(1) + " 시간"; }, onInput: function (x) { h = x; api.changed(); draw(); } });
      api.info("1980년 무렵에 그래프가 가팔라지는 것은 1979년 목성, 1980년 토성 곁을 지나며 행성의 중력으로 속력을 얻었기(스윙바이) 때문입니다. 그 뒤로는 엔진을 쓰지 않고 관성으로 날아갑니다. "
        + src("미국 항공우주국 제트추진연구소(NASA JPL) Horizons 천체력, 보이저 1호의 태양 거리·지구 거리·전파 도달 시간, 1980~" + Y1 + "년 매년 1월 1일"));
      draw();
      return {
        judge: function () {
          var okV = Math.abs(v - VKM) <= 0.5 + 1e-9, okH = Math.abs(h - LT_TRUE) <= 0.5 + 1e-9;
          if (okV && okH) return { ok: true, msg: "1990년 " + R90[1].toFixed(1) + " AU → " + Y1 + "년 " + RL[1].toFixed(1) + " AU, 1년에 약 " + VAU.toFixed(2) + " AU ≈ " + VKM.toFixed(1) + " km/s. " + Y1 + "년 1월 태양 거리 " + RL[1].toFixed(1) + " AU × 499초 ÷ 3600 ≈ " + LT_TRUE.toFixed(1) + " 시간이면 전파가 닿습니다(Horizons가 지구 위치까지 넣어 계산한 실제 전파 시간은 " + LT_HZ.toFixed(2) + "시간)." };
          if (!okV) return { ok: false, msg: "속력 " + v.toFixed(1) + " km/s는 " + (v < VKM ? "느립니다" : "빠릅니다") + ". 1990년 이후 두 해를 골라 카드의 ‘1년에 □ AU’를 읽고 4.74를 곱하세요." };
          return { ok: false, msg: "속력은 맞았습니다. 전파 시간 " + h.toFixed(1) + " 시간은 " + (h < LT_TRUE ? "짧습니다" : "깁니다") + ". 거리(AU) × 499초를 3600으로 나누어 시간으로 바꾸세요." };
        }
      };
    },
    hints: ["2000년과 " + Y1 + "년을 골라 보세요. 두 거리의 차이를 햇수로 나누면 1년에 몇 AU인지 나옵니다.", "예: 170 AU × 499초 ≈ 84,800초 ≈ 23.6 시간. 명령을 보내고 답을 받으려면 그 두 배가 걸립니다."],
    solution: "멀어지는 속력 약 <b>" + VKM.toFixed(1) + " km/s</b>(1년에 약 " + VAU.toFixed(2) + " AU), " + Y1 + "년 1월 태양 거리로 어림한 전파 시간 약 <b>" + LT_TRUE.toFixed(1) + " 시간</b>. (Horizons가 지구 위치까지 넣어 계산한 실제 전파 시간은 " + LT_HZ.toFixed(2) + "시간입니다.)",
    why: "보이저 1호는 목성·토성의 중력 도움(스윙바이)으로 태양의 중력을 벗어날 만큼 빨라진 뒤, 엔진 없이 거의 같은 빠르기(약 17 km/s, 1년에 3.6 AU)로 멀어지고 있습니다. Horizons 자료의 ‘태양에서 멀어지는 속력’도 1988년 " + (vrow(1988) || [0, 0, 17.2])[2].toFixed(1) + " km/s에서 " + Y1 + "년 " + RL[2].toFixed(1) + " km/s로 아주 조금씩만 줄었어요. 태양 중력이 멀리 갈수록 약해지기 때문입니다.<br>"
      + "거리가 멀어질수록 통신이 어려워집니다. 빛의 속력으로도 한쪽에 약 " + LT_TRUE.toFixed(1) + "시간, 명령을 보내고 답을 받기까지 이틀 가까이 걸리므로, 탐사선은 지구의 지시를 기다리지 않고 스스로 판단하는 장치를 갖추어야 합니다. 신호도 거리의 제곱에 반비례해 약해지므로 지름 70 m짜리 거대한 안테나(심우주 통신망)로 받습니다."
  },
  {
    id: "o2", tag: "실제 자료 · 태양 활동 감시", title: "2024년 5월, 태양풍이 지구를 때린 날", short: "태양풍과 자기 폭풍",
    kind: "obs calc", kindPos: "tr",
    who: "🧲", name: "우주 전파 센터 예보관",
    say: "“2024년 5월 8~9일, 큰 흑점 무리에서 강한 폭발이 잇달아 일어나 플라스마 구름(코로나 질량 방출)이 여러 개 지구로 날아왔습니다. 위 그래프는 지구 바로 앞의 <b>태양풍 속력</b>, 아래는 지구 자기장이 얼마나 흐트러졌는지 보여 주는 <b>Dst 지수</b>(음수로 클수록 강한 자기 폭풍)예요. 구름이 <b>언제 도착했는지</b> 찾고, 지구에서 150만 km 앞(L1 지점)에 있는 감시 위성이 <b>몇 분 먼저</b> 경보를 줄 수 있었는지 구해 주세요.”",
    predict: {
      q: "빠른 태양풍(플라스마 구름)이 지구에 닿으면 지구 자기장(Dst 지수)은 어떻게 될까요?",
      options: ["㉠ 태양풍은 자기장과 관계없어 거의 그대로다", "㉡ 크게 흐트러져 Dst 지수가 수백 nT나 음수로 떨어진다(자기 폭풍)", "㉢ 자기장이 더 세져 Dst 지수가 계속 커지기만 한다"],
      answer: 1
    },
    task: "① 시각 슬라이더로 <b>태양풍 속력이 갑자기 뛴 시각</b>을 맞추세요(± 1시간). ② 도착 뒤 몇 시간 동안의 속력을 읽어, L1 위성(지구에서 150만 km)이 주는 <b>경보 시간</b>을 분으로 구하세요(± 7분).",
    build: function (stage, api) {
      var cv = api.canvas(330), ctx = cv.ctx, W = cv.W, k = 30, m = 60, n = SW.length;
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var xf = function (x) { return hl(Math.round(x)); };
        var g1 = K.chart(ctx, { x: 4, y: 48, w: 676, h: 140, pl: 62, pb: 8, x0: 0, x1: n, y0: 300, y1: 1100, xt: 8, yt: 4, light: true, xf: function () { return ""; }, yf: function (y) { return y.toFixed(0) + " km/s"; } });
        segs(SW.map(function (r, i) { return [i, r[3]]; })).forEach(function (s) { K.plot(ctx, g1, s, LT.blue, { light: true, w: 2.4 }); });
        var g2 = K.chart(ctx, { x: 4, y: 188, w: 676, h: cv.H - 192, pl: 62, x0: 0, x1: n, y0: -450, y1: 50, xt: 8, yt: 5, light: true, xf: xf, yf: function (y) { return y.toFixed(0) + " nT"; } });
        segs(SW.map(function (r, i) { return [i, r[5]]; })).forEach(function (s) { K.plot(ctx, g2, s, LT.violet, { light: true, w: 2.4 }); });
        vline(ctx, g1, k, LT.red); vline(ctx, g2, k, LT.red);
        K.t(ctx, "태양풍 속력", g1.L + 6, g1.T + 14, { s: 11, w: "800", c: LT.blue });
        K.t(ctx, "Dst 지수(지구 자기장의 흐트러짐)", g2.L + 6, g2.B - 8, { s: 11, w: "800", c: LT.violet });
        var r = SW[k];
        K.bigText(ctx, hl(k) + " · " + (r[3] == null ? "관측 없음" : r[3] + " km/s"), 16, 36, 21, "#ffffff");
        card(ctx, 690, W, cv.H, "OMNI 1시간 평균 · 세계시", [
          ["시각", hl(k) + "~"], ["태양풍 속력", r[3] == null ? "–" : r[3] + " km/s", LT.blue], ["양성자 밀도", f1(r[2], " 개/cm³")],
          ["자기장 남북 성분 Bz", f1(r[1], " nT"), r[1] != null && r[1] < -10 ? LT.red : LT.ink], ["Kp 지수", f1(r[4])], ["Dst 지수", r[5] == null ? "–" : r[5] + " nT", LT.violet],
          ["내 답: 경보 시간", m + " 분", LT.blue]
        ], "경보 시간 = 150만 km ÷ 속력", null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "① 시각(세계시) — 태양풍이 도착한 때에 맞추기", min: 0, max: n - 1, step: 1, value: 30, fmt: function (x) { return hl(x); }, onInput: function (x) { k = x; api.changed(); draw(); } });
      api.slider({ label: "② L1 위성이 주는 경보 시간", min: 5, max: 120, step: 1, value: 60, fmt: function (x) { return x + " 분"; }, onInput: function (x) { m = x; api.changed(); draw(); } });
      api.info("OMNI 자료는 L1 지점 위성(ACE·Wind 등)이 잰 태양풍을 지구 앞 충격파 위치에 닿는 시각으로 옮겨 1시간씩 평균한 것입니다. Bz가 음수(남쪽)로 크면 태양풍의 자기장이 지구 자기장과 이어져 에너지가 많이 들어옵니다. Kp 지수는 0~9, 9에 가까울수록 강한 폭풍입니다. "
        + src("미국 항공우주국 고다드 우주비행센터(NASA GSFC) OMNI2 1시간 자료(CDAWeb), 2024년 5월 9일 0시 ~ 13일 0시(세계시)"));
      draw();
      return {
        judge: function () {
          var okA = Math.abs(k - ARR) <= 1, okM = Math.abs(m - LEAD) <= 7;
          if (okA && okM) return { ok: true, msg: "태양풍 속력은 " + hl(ARR - 1) + " " + SW[ARR - 1][3] + " km/s → " + hl(ARR) + " " + SW[ARR][3] + " km/s로 뛰었고, 도착 뒤 6시간 평균은 약 " + Math.round(VPOST) + " km/s입니다. 150만 km ÷ " + Math.round(VPOST) + " km/s ≈ " + Math.round(L1 / VPOST) + "초 ≈ " + Math.round(LEAD) + "분." };
          if (!okA) return { ok: false, msg: hl(k) + "는 " + (k < ARR ? "너무 이릅니다. 그때 태양풍은 아직 400 km/s 안팎으로 느립니다." : "너무 늦습니다. 이미 빠른 태양풍이 불고 있어요. 속력이 계단처럼 뛰어오르는 첫 시각을 찾으세요.") };
          return { ok: false, msg: "도착 시각은 맞았습니다. 경보 시간 " + m + "분은 " + (m < LEAD ? "짧습니다" : "깁니다") + ". 도착 뒤 속력(약 700 km/s)으로 1,500,000 km를 나누면 초가 나옵니다. 60으로 나누어 분으로 바꾸세요." };
        }
      };
    },
    hints: ["5월 10일 오후(세계시)를 보세요. 속력이 450 km/s 안팎에서 한 시간 만에 100 km/s 넘게 뛰는 곳입니다.", "예: 750 km/s 라면 1,500,000 ÷ 750 = 2,000초 ≈ 33분."],
    solution: "도착 <b>" + hl(ARR) + "</b>(세계시) 무렵, 경보 시간 약 <b>" + Math.round(LEAD) + "분</b>.",
    why: "태양에서 터져 나온 플라스마 구름은 1~3일 만에 지구까지 1억 5천만 km를 건너옵니다. 구름 앞의 충격파가 닿는 순간 태양풍의 속력·밀도가 계단처럼 뛰고, 지구 자기권이 눌려 Dst가 잠깐 +" + DMAXP + " nT까지 올랐습니다. 이어 자기장 남북 성분(Bz)이 크게 남쪽을 향하자 에너지가 자기권으로 쏟아져 들어와 Dst가 " + hl(DMIN[0]) + "에 " + DMIN[1] + " nT까지 떨어지고, Kp 지수는 가장 높은 단계인 " + KMAX.toFixed(0) + "에 이르렀습니다. 이번 폭풍은 2003년 이후 가장 강해, 평소보다 훨씬 낮은 위도에서도 오로라가 보였습니다.<br>"
      + "L1 지점의 위성이 미리 알려 주는 시간은 " + Math.round(LEAD) + "분 남짓뿐입니다. 그래서 우주 기상 예보는 태양 표면을 늘 지켜보며 폭발과 구름의 출발을 먼저 잡아내고(1~3일 전 예보), L1 위성의 측정으로 도착 직전에 최종 경보를 냅니다. 위성·전력망·항공 통신 운영자는 이 경보에 맞춰 대비합니다."
  },
  {
    id: "o3", tag: "실제 자료 · 지구 접근 천체", title: "아포피스는 정말 가까이 올까", short: "지구 접근 소행성",
    kind: "obs calc", kindPos: "tr",
    who: "☄️", name: "지구 방위 조정실",
    say: "“소행성 <b>아포피스</b>(지름 약 340 m)는 2029년 4월 13일 지구 곁을 지납니다. NASA 제트추진연구소의 근접 통과 목록에 따르면 지구 중심에서 <b>" + NEO.apophis.au.toFixed(6) + " AU</b> 거리예요. 이것이 몇 km인지, 그리고 2016~2025년 10년 동안 달 거리(1 LD) 안으로 지나간 소행성 <b>" + NR.length.toLocaleString() + "번</b>의 기록과 견주어 주세요. 점 하나가 근접 한 번이고, 위로 갈수록 큰(절대 등급 H가 작은) 천체입니다.”",
    predict: {
      q: "지름 수백 m 소행성이 정지 위성 궤도(지구 중심에서 약 42,000 km)보다 가까이 지나가는 일은 얼마나 흔할까요?",
      options: ["㉠ 해마다 여러 번 있다", "㉡ 아주 드물다(작은 소행성은 자주 오지만, 큰 것은 드물다)", "㉢ 작든 크든 그렇게 가까이 오는 소행성은 없다"],
      answer: 1
    },
    task: "① 아포피스의 근접 거리 " + NEO.apophis.au.toFixed(6) + " AU를 <b>km</b>로 바꿔 맞추세요(± 400 km, 1 AU = 149,597,871 km). ② <b>거리 기준</b> 슬라이더를 움직여 보고, 10년 동안 아포피스보다 가까이 지나간 소행성 가운데 <b>아포피스만 한 것(H 20 이하)</b>이 몇 개였는지 고르세요.",
    build: function (stage, api) {
      var cv = api.canvas(310), ctx = cv.ctx, W = cv.W, th = 100, km = 30000, pick = "";
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var g = K.chart(ctx, { x: 4, y: 52, w: 676, h: cv.H - 56, pl: 46, x0: 0, x1: 400, y0: 34.5, y1: 18, xt: 8, yt: 6, light: true,
          xf: function (x) { return x ? (x / 10) + "만 km" : "0"; }, yf: function (y) { return "H " + y.toFixed(0); } });
        ctx.fillStyle = "rgba(28,126,214,.45)";
        NR.forEach(function (r) { ctx.beginPath(); ctx.arc(g.X(r[1] / 1000), g.Y(Math.min(34.4, r[2])), 2.2, 0, 6.2832); ctx.fill(); });
        vline(ctx, g, GEO / 1000, LT.green, [3, 3]); vline(ctx, g, MOON / 1000, LT.mute, [3, 3]); vline(ctx, g, th, LT.red);
        K.t(ctx, "정지 위성 궤도", g.X(GEO / 1000) + 4, g.T + 14, { s: 10.5, w: "800", c: LT.green });
        K.t(ctx, "달", g.X(MOON / 1000) - 4, g.T + 14, { s: 10.5, w: "800", a: "right", c: LT.mute });
        var ax = g.X(AP_KM / 1000), ay = g.Y(NEO.apophis.h);
        ctx.fillStyle = LT.orange; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ax, ay, 7, 0, 6.2832); ctx.fill(); ctx.stroke();
        K.t(ctx, "아포피스(2029)", ax + 10, ay + 22, { s: 11, w: "800", c: LT.orange });
        K.t(ctx, "가로: 지구 중심에서 거리(km)  세로: 절대 등급(위가 큼)", g.R - 4, g.B - 8, { s: 10.5, w: "700", a: "right", c: LT.mute });
        var inn = NR.filter(function (r) { return r[1] < th * 1000; }), big = inn.reduce(function (m, r) { return Math.min(m, r[2]); }, 99);
        K.bigText(ctx, "아포피스 " + n0(km) + " km?", 16, 38, 22, "#ffffff");
        card(ctx, 690, W, cv.H, "2016~2025년 · 1 LD 안 근접", [
          ["거리 기준", n0(th * 1000) + " km", LT.red], ["그보다 가까이", inn.length + " 번", LT.blue], ["그중 가장 큰 것", inn.length ? "H " + big.toFixed(1) : "–"],
          ["아포피스", "H " + NEO.apophis.h.toFixed(1), LT.orange], ["내 답: 거리", n0(km) + " km", LT.blue], ["내 답: H ≤ 20", pick || "–", LT.blue]
        ], "H가 5 작으면 지름 약 10배", null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "거리 기준(지구 중심에서)", min: 5, max: 390, step: 1, value: 100, fmt: function (x) { return n0(x * 1000) + " km"; }, onInput: function (x) { th = x; draw(); } });
      api.slider({ label: "① 아포피스의 근접 거리", min: 10000, max: 80000, step: 100, value: 30000, fmt: function (x) { return n0(x) + " km"; }, onInput: function (x) { km = x; api.changed(); draw(); } });
      api.seg({ label: "② 아포피스보다 가까이 지난 것 중 H 20 이하", value: "", options: [{ v: "없음", t: "하나도 없다" }, { v: "1~5개", t: "1~5개" }, { v: "수십 개", t: "수십 개" }], onPick: function (x) { pick = x; api.changed(); draw(); } });
      api.info("절대 등급 H는 소행성의 크기를 알려 주는 밝기입니다. 반사율이 같다면 H가 5 작을 때 지름이 10배 큽니다. 아포피스(H 약 19)는 지름 약 340 m, H 25~26이면 지름 수십 m 남짓입니다. 거리는 지구 중심에서 잰 값이라 지구 반지름(6,371 km)이 들어 있습니다. "
        + src("미국 항공우주국 제트추진연구소(NASA JPL) 소천체 근접 통과 자료(SBDB Close-Approach Data API), 2016~2025년 1 LD 안 근접 " + NR.length.toLocaleString() + "건과 아포피스 2029년 근접"));
      draw();
      return {
        judge: function () {
          var okK = Math.abs(km - AP_KM) <= 400, okP = pick === (BIG_AP ? (BIG_AP <= 5 ? "1~5개" : "수십 개") : "없음");
          if (okK && okP) return { ok: true, msg: NEO.apophis.au.toFixed(6) + " AU × 149,597,871 km ≈ " + n0(AP_KM) + " km — 정지 위성 궤도(" + n0(GEO) + " km)보다 안쪽입니다. 10년 동안 이보다 가까이 지난 소행성은 " + IN_AP.length + "번이었지만 가장 큰 것도 H " + HMIN_AP.toFixed(1) + "(지름이 아포피스의 약 1/" + Math.round(Math.pow(10, (HMIN_AP - NEO.apophis.h) / 5)) + ")였습니다." };
          if (!okK) return { ok: false, msg: n0(km) + " km는 " + (km < AP_KM ? "가깝습니다" : "멉니다") + ". 0.000254 × 149,597,871을 계산해 보세요(약 0.00025 × 1억 5천만)." };
          return { ok: false, msg: "거리는 맞았습니다. 거리 기준을 " + n0(AP_KM) + " km 쯤에 두고, 카드의 ‘그중 가장 큰 것’ H 값이 20보다 작은지 보세요." };
        }
      };
    },
    hints: ["0.000254 AU × 150,000,000 km ≈ 38,000 km. 소수점 자리에 조심하세요.", "거리 기준을 38(천 km)에 두면, 그보다 가까이 지난 것들의 가장 작은 H 값이 카드에 나옵니다."],
    solution: "아포피스 근접 거리 약 <b>" + n0(AP_KM) + " km</b>, 10년 동안 그보다 가까이 지난 소행성 가운데 H 20 이하는 <b>" + (BIG_AP ? BIG_AP + "개" : "하나도 없음") + "</b>.",
    why: "지구 곁을 스치는 소행성은 생각보다 많습니다. 2016~2025년 10년 동안만 달 거리 안으로 " + NR.length.toLocaleString() + "번, 정지 위성 궤도 안쪽으로도 " + IN_GEO + "번 지나갔어요(가장 가까운 것은 " + CLOSEST[0].slice(0, 4) + "년의 " + n0(CLOSEST[1]) + " km). 그러나 정지 위성 궤도 안쪽으로 온 " + IN_GEO + "번은 모두 H가 " + HMIN_GEO.toFixed(1) + " 이상인 지름 수 m~수십 m짜리였고, 달 거리 안에서 가장 큰 것(H " + HMIN_ALL.toFixed(1) + ")도 지름 100~200 m 정도로 아포피스보다 작았습니다. 작은 소행성은 아주 많고 큰 소행성은 드물기 때문입니다.<br>"
      + "아포피스처럼 지름 수백 m인 천체가 정지 위성보다 가까이 오는 일은 아주 드물어, 2029년에는 전 세계 망원경과 탐사선이 함께 지켜볼 계획입니다. 궤도를 오랫동안 정밀하게 추적한 덕분에 이번 근접에서 지구와 부딪힐 가능성은 없다고 확인되었습니다. 지구 접근 천체 감시는 이렇게 ‘얼마나 큰 것이, 얼마나 가까이, 언제’ 오는지를 미리 알아내는 일입니다. 다만 작은 천체는 지구 가까이 와서야 발견되는 경우가 많아, 이 목록도 해마다 늘어납니다."
  }
  ]
});
})();
