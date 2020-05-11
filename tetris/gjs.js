// Author : Zhang xiaolei (张晓雷)
// Email : zhangxiaolei@outlook.com
// Released under the MIT License.
//
// 方块图形样式借鉴了 https://simon.lc/tetr.js/
// 游戏界面也和人家的这个很像，虽然没有刻意模仿，但是你一旦看到一个优秀的设计，就很难不受影响。
//
// 乱序算法是大名鼎鼎的 Knuth-Shuffle，在知乎看到，实例代码是 C, 我根据自己的理解写了个 JS 版的。
//
// 7-BAG 算法是官方版的。最初我根据自己的理解写了两个算法，但最后发现还是官方的这个好用。
//
// 我最初实现了一个比较丑陋的踢墙功能，但当我理解了官方的踢墙后，又用了官方的踢墙数据实现。
// 因为人家的这个确实更好。官方没有提供180度旋转的踢墙数据，我根据自己的理解，利用官方的踢墙数据,
// 非常简单暴力的实现了一个。合不合理我很难说，因为我的游戏水平很菜。
// 
// farter 在游戏的操作细节上给了一些指导。
//
// 旋转算法最初写的时候由于对游戏规则的不理解，实现的非常不合理，但后续并没有推倒重来，而是在最初的基础上
// 加以补充。所以对于中心不规则的长条，又用单独的算法实现，这让整个实现看起来非常丑陋。
//
// debug Pro
const log = console.log;

function random(begin, end) {
  return Math.floor(Math.random() * (end - begin + 1) + begin);
}

// Knuth-Shuffle
function kShuffle(arr) {
  let ridx, end;
  for (let i = arr.length - 1; i >= 0; i--) {
      end = arr[i];
      ridx = random(0, i);
      arr[i] = arr[ridx];
      arr[ridx] = end;
  }
}
// 7-BAG
function* randGenerator () {
  let bag = [];
  while (true) {
      if (bag.length === 0) {
          bag = [1,2,3,4,5,6,7];
          kShuffle(bag);
      }
      yield bag.pop();
  }
}

document.body.oncontextmenu = function (e) {
  e.preventDefault();
}

function toNegative(n) {
  return n <= 0 ? n : -n;
}

function c4a() {
  return [[0, 0], [0, 0], [0, 0], [0, 0]]
}

function copyAtoB(a, b) {
  if (a.length === b.length) {
    let i = a.length;
    while (i--) {
      b[i][0] = a[i][0];
      b[i][1] = a[i][1];
    }
  }
}

function toLower(t) {
  return t.length === 1
    ? /^[A-Z]$/.test(t)
      ? t.toLowerCase()
      : t
    : t
}

// 每队数组最后一位是旋转的中心点，不能改变次序，第一队数组是四方块，没有中心。
const tetris = {
  1: [[3, 4], [3, 5], [4, 5], [4, 4]],  // O
  2: [[4, 3], [4, 4], [4, 5], [4, 6]],  // I
  3: [[4, 3], [4, 5], [3, 4], [4, 4]],  // T
  4: [[3, 3], [3, 4], [4, 5], [4, 4]],  // Z
  5: [[3, 4], [3, 5], [4, 3], [4, 4]],  // S
  6: [[4, 3], [4, 5], [3, 3], [4, 4]],  // L
  7: [[4, 3], [4, 5], [3, 5], [4, 4]]   // J
}

function createColor(c) {
  switch (c) {
    //case 0: return "#FFF";
    case 1: return "#EEE685";  //O
    case 2: return "#B9D3EE";  //I
    case 3: return "#DDA0DD";  //T
    case 4: return "#EE6363";  //Z
    case 5: return "#32CD32";  //S
    case 6: return "#CD9B1D";  //L
    case 7: return "#8470FF";  //J
    case 8: return "#363636";  //阴影
    case 9: return "#FFFF00";  //过渡
  }
}

// 存储所有信息数据的table
const table = [];
// 初始化
for (let i = 0; i <= 24; i++) {
  table.push([0,0,0,0,0,0,0,0,0,0])
}

let moving, old, sMov = c4a();
let rtype = [], rlist = [];
let tetrisType, tetrisStage;
let gameStart, gameOver, gameJustBegun = true;

const readyNum = 6;

const randList = randGenerator();
const rand = ()=> randList.next().value;
const QS = name => document.querySelector(name);
const QSA = name => document.querySelectorAll(name);

const canvasBox = QS('#canvas-box')

const bgLayerEl = QS('#bg-layer');
const cubeShadowLayerEl = QS('#cube-shadow-layer');

const bgCanvas = bgLayerEl.getContext("2d");
const cuShCanvas = cubeShadowLayerEl.getContext("2d");

let isDrawBg = false;
let isNotDrawCS = false;

const scanvas = QS("#s-canvas");
const pix2 = scanvas.getContext("2d");
const hcanvas = QS('#saveCubeBox');
const hpix = hcanvas.getContext("2d")
const scoreDisplay = QS("#panel-score");
const fineshLineDisplay = QS("#panel-line");
const levalDisplay = QS("#panel-level");
const ui = Object.create(null);

ui.startAndPause = QS("#startPause");
ui.reset = QS("#reset");
ui.bg = QS('html');
ui.uiFontSize = document.querySelector('.game-border')

//tbs参数决定了所有窗口上的关联尺寸! 它主要设定主 canvas 的上下预留尺寸, tbs / 2为单边的尺寸。
let mch, mcw, tbs = 40, cs;
//确保每次窗口尺寸变动，图形都会被重回，以适应屏幕的分辨率。
function setMainCanvas() {
  let tw, th, w = window.innerHeight;
  document.body.style.height = w + 'px';
  mch = w - tbs;
  mcw = parseInt(mch / 2);
  th = mch - mcw * 2;
  cs = parseInt(mcw / 10);
  tw = mcw - cs * 10;
  hcanvas.width = cs * 9;
  hcanvas.height = cs;

  let color;

  for (let i = 0; i <= 9; i++) {

    color = createColor(i + 1);

    hpix.fillStyle = color;
    hpix.globalAlpha = 0.8;
    hpix.beginPath();
    hpix.moveTo(0, 0);
    hpix.lineTo(cs / 2, cs / 2);
    hpix.lineTo(0, cs);
    hpix.fill();

    hpix.fillStyle = color;
    hpix.globalAlpha = 0.9;
    hpix.beginPath();
    hpix.moveTo(0, 0);
    hpix.lineTo(cs / 2, cs / 2);
    hpix.lineTo(cs, 0);
    hpix.fill();

    hpix.fillStyle = color;
    hpix.globalAlpha = 1;
    hpix.beginPath();
    hpix.moveTo(cs / 2, cs / 2);
    hpix.lineTo(cs, cs);
    hpix.lineTo(cs, 0);
    hpix.fill();

    hpix.fillStyle = color;
    hpix.globalAlpha = 9;
    hpix.beginPath();
    hpix.moveTo(cs / 2, cs / 2);
    hpix.lineTo(cs, cs);
    hpix.lineTo(0, cs);
    hpix.fill();

    hpix.translate(cs, 0);
  }

  let realWidth = mcw - tw;
  let realHeight = mch - tw * 2 - th;

  canvasBox.style.width = realWidth + 'px';
  canvasBox.style.height = realHeight + 'px';

  bgLayerEl.width = cubeShadowLayerEl.width = realWidth;
  bgLayerEl.height = cubeShadowLayerEl.height = realHeight;

  scanvas.width = cs * 4;
  scanvas.height = 6 * cs * 2.6;
  ui.uiFontSize.style.fontSize = cs * 0.9 + 'px';
  //在暂停的情况下，调整尺寸后只需要绘制一次，在运行时，调整尺寸就不停的绘制。
  //暂停
  if (!gameStart && !gameJustBegun) {
    drawBg();
    drawCS();
  }
  //中途
  if (gameStart) {
    isDrawBg = true;
  }
  smallDisplay();
}

function drawBg() {
  bgCanvas.clearRect(0, 0, mcw, mch);
  for (let j = 4; j <= 24; j++) {
    for (let i = 0; i <= 9; i++) {
      t = Math.abs(table[j][i]);
      if (t !== 0) {
        drawCube(bgCanvas, i, j, t);
      }
    }
  }
}

function drawCS() {

  cuShCanvas.clearRect(0, 0, mcw, mch);

  sMov.forEach( i => {
    drawCube(cuShCanvas, i[1], i[0], 8)
  })

  old.forEach( i => {
    drawCube(cuShCanvas, i[1], i[0], tetrisType)
  })

}

setMainCanvas();

window.onresize = setMainCanvas;

function drawCube(can, x, y, c) {
  can.drawImage(hcanvas, cs * (c - 1), 0, cs, cs, x * cs, y * cs - (cs * 5), cs, cs);
}

//数据来源：https://harddrop.com/wiki/SRS

const wallKick = {

  JLSTZ: {
    '0R': [[-1, 0], [-1, +1], [0, -2], [-1, -2]],
    'R0': [[+1, 0], [+1, -1], [0, +2], [+1, +2]],
    'R2': [[+1, 0], [+1, -1], [0, +2], [+1, +2]],
    '2R': [[-1, 0], [-1, +1], [0, -2], [-1, -2]],
    '2L': [[+1, 0], [+1, +1], [0, -2], [+1, -2]],
    'L2': [[-1, 0], [-1, -1], [0, +2], [-1, +2]],
    'L0': [[-1, 0], [-1, -1], [0, +2], [-1, +2]],
    '0L': [[+1, 0], [+1, +1], [0, -2], [+1, -2]]
  },

  I: {
    '0R': [[-2, 0], [+1, 0], [-2, -1], [+1, +2]],
    'R0': [[+2, 0], [-1, 0], [+2, +1], [-1, -2]],
    'R2': [[-1, 0], [+2, 0], [-1, +2], [+2, -1]],
    '2R': [[+1, 0], [-2, 0], [+1, -2], [-2, +1]],
    '2L': [[+2, 0], [-1, 0], [+2, +1], [-1, -2]],
    'L2': [[-2, 0], [+1, 0], [-2, -1], [+1, +2]],
    'L0': [[+1, 0], [-2, 0], [+1, -2], [-2, +1]],
    '0L': [[-1, 0], [+2, 0], [-1, +2], [+2, -1]]
  },
  //根据当前状态和旋转指令，把任意旋转转换成符合数据表的key
  parse: function (origin, newdire) {

    let v, t, a = ['0', 'R', '2', 'L'], o = { '0': 0, 'R': 1, '2': 2, 'L': 3 };

    if(newdire === 'r') {
      v = 1;
    } else if (newdire === 'l') {
      v = -1;
    } else if (newdire === 'o') {
      v = 2;
    }

    t = o[origin] + v;

    if(t === 4) {
      t = 0;
    } else if (t === -1) {
      t = 3;
    } else if (t === 5) {
      t = 1;
    }

    return [origin, a[t]]
  },

  get: function (type, origin, newdire) {
    let k = this.parse(origin, newdire).join('');
    return type === 2 ? this.I[k] : this.JLSTZ[k]
  }
}

//180度的踢墙。
wallKick.JLSTZ['02'] = wallKick.JLSTZ['R2']//.concat(wallKick.JLSTZ['L2'])
wallKick.JLSTZ['RL'] = wallKick.JLSTZ['2L']//.concat(wallKick.JLSTZ['0L'])
wallKick.JLSTZ['20'] = wallKick.JLSTZ['L0']//.concat(wallKick.JLSTZ['R0'])
wallKick.JLSTZ['LR'] = wallKick.JLSTZ['0R']//.concat(wallKick.JLSTZ['2R'])
wallKick.I['02'] = wallKick.I['R2']//.concat(wallKick.I['L2'])
wallKick.I['RL'] = wallKick.I['2L']//.concat(wallKick.I['0L'])
wallKick.I['20'] = wallKick.I['L0']//.concat(wallKick.I['R0'])
wallKick.I['LR'] = wallKick.I['0R']//.concat(wallKick.I['2R'])

function digtalNumber(n, el) {
  el.innerText = n;
}

function smallDisplay() {
  let len = rlist.length;
  pix2.clearRect(0, 0, cs * 4, 6 * cs * 2.6);
  let tmpTetris, tmpType, tx, ty;
  while (len --) {
    tmpTetris = rlist[len]
    tmpType = rtype[len]
    tmpTetris.forEach(i => {
      tx = (tmpType === 1 || tmpType === 2)
        ? (i[1] - 3) * cs
        : (i[1] - 3) * cs + cs / 2;
      if (tmpType === 2) {
        ty =  (i[0] - 3) * cs + (len * cs * 2.6 - cs / 2)
      } else {
        ty =  (i[0] - 3) * cs + (len * cs * 2.6);
      }
      pix2.drawImage(hcanvas, cs * (tmpType - 1), 0, cs, cs, Math.floor(tx), Math.floor(ty), cs, cs);
    })
  }
}

{
  //初次载入，候选项就载入，让界面好看一点。
  let t;
  for (let i = 0; i < 6; i++) {
    t = rand();
    rtype.push(t);
    rlist.push(tetris[t])
  }
  smallDisplay();
}

function createNewCube() {

  let rn, f;

  while (rlist.length < readyNum + 1) {
    rn = rand();
    rtype.push(rn);
    rlist.push(tetris[rn])
  }

  tetrisType = rtype.shift();

  f = rlist.shift();

  copyAtoB(f, moving);
  copyAtoB(f, old);
  //开始cube绘制
  isNotDrawCS = false;
 
  if (tetrisType === 2) {
    straightStage = 0;
  }

  tetrisStage = '0';
  smallDisplay(rlist, rtype)
}

function shadow() {
  //if (!moving.length) return;
  copyAtoB(moving, sMov);
  for (let x = 4; x <= 24; x++) {
    for (let i of sMov) {
      if (i[0] === 24 || table[i[0] + 1][i[1]] < 0) {
        return;
      }
    }
    moveOneStep(sMov, "down");
  }
}

let isDelay = false;

function downLoop() {

  if (gameJustBegun) {
    normalCreate();
    gameJustBegun = false;
    return;
  }

  if (!moving.length) { return }

  moveOneStep(moving, "down");

  if (checkIsTouch()) {
    copyAtoB(old, moving);
    !isDelay && deepDownControl(1);
  } else {
    copyAtoB(moving, old);
    shadow();
  }
}

function moveToLeftOrRight(to) {

  moveOneStep(moving, to);

  if (checkIsTouch()) {
    copyAtoB(old, moving);
  } else {
    copyAtoB(moving, old);
    shadow();
  }
}

function moveToDeep() {
  if (gameJustBegun) return;
  for (let x = 0; x <= 24; x++) {
    for (let i of moving) {
      if (i[0] === 24 || table[i[0] + 1][i[1]] < 0) {
        old.forEach(function (i) {
          table[i[0]][i[1]] = 0;
        })
        moving.forEach(function (i) {
          table[i[0]][i[1]] = toNegative(tetrisType);
        })
        deepDownControl(0);
        return;
      }
    }
    moveOneStep(moving, "down");
  }
}

function normalCreate() {
  isDrawBg = true;
  if(checkEnd()) return;
  stopLoop();
  createNewCube();
  shadow();
  restartLoop();
}

let gameScore = 0;

function scoreCreate(scoreList) {

  let len = scoreList.length;

  stopLoop();

  scoreList.forEach(function (i) {
    table.splice(i, 1, [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
  })
  
  //停止cube绘制，并清除。
  isNotDrawCS = true;
  cuShCanvas.clearRect(0, 0, mcw, mch);
  //绘制背景
  isDrawBg = true;
  
  setTimeout(function () {

    finishLine += len;

    switch (len) {
      case 1: gameScore += 100 * gameLevel; break
      case 2: gameScore += 400 * gameLevel; break
      case 3: gameScore += 900 * gameLevel; break
      case 4: gameScore += 1600 * gameLevel; break
    }

    scoreList.forEach(function (i) {
      table.splice(i, 1);
    })

    while (len--) {
      table.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
    //绘制背景
    isDrawBg = true;

    digtalNumber(gameScore, scoreDisplay);
    digtalNumber(finishLine, fineshLineDisplay);
    changeLevalAndDisplay(finishLine);
    if (checkEnd()) return;
    createNewCube();
    shadow();
    restartLoop();
  }, 100)
}

function checkEnd() {
  if (table[4].some(function (i) {
    return (i < 0);
  })) {
    stopLoop();
    gameOver = true;
    gameStart = false;
    ui.startAndPause.innerText = "开始";
    inTop10Check();
    return true;
  }
}
//向下试探一步，确认是否能继续下落
function checkCanMove() {
  moveOneStep(moving, "down");
  for (let i of moving) {
    if (!(i[0] <= 24 && table[i[0]][i[1]] >= 0)) {
      copyAtoB(old, moving);
      return false;
    }
  }
  copyAtoB(old, moving);
  return true;
}

//获取方块的最低点和最高点
function getTopAndLow(arr) {
  let s = arr[0][0], b = s;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i][0] < s) {
      s = arr[i][0];
    } else if (arr[i][0] > b) {
      b = arr[i][0];
    }
  }
  return [s, b];
}

function checkGetScore(arr) {

  let checkSave = [];

  let [min, max] = getTopAndLow(arr);

  //因为后边的程序频繁的连续删除得分行，所以必须从下往上记录数值。如果从上往下记录，数据由小到达，连续删除时，先删除序列小的数组，后边的序列数值必然改变，导致错误！

  for (; max >= min; max--) {

    if (table[max].every(function (n) {

      return n !== 0;

    })) {

      checkSave.push(max);
    }
  }

  return checkSave;
}

function tetrisLock(arr) {
  arr.forEach(function (i) {
    table[i[0]][i[1]] = toNegative(tetrisType);
  })
}
//dd (0 : deep 1 : down)
function deepDownControl(dd) {

  let scoreList = checkGetScore(moving);

  if (dd === 0) {

    scoreList.length ? scoreCreate(scoreList) : normalCreate()

  } else if (dd === 1) {

    isDelay = true;

    setTimeout(function () {

      if (!checkCanMove()) {
        tetrisLock(old);
        let sl = checkGetScore(old)
        sl.length ? scoreCreate(sl) : normalCreate()
      }

      isDelay = false;
      
    }, 300);
  }
}

function offset(m, a) {
  let [x, y] = a;
  if (x < 0) {
    moveOneStep(m, 'left', -x)
  } else if (x > 0) {
    moveOneStep(m, 'right', x)
  }
  if (y < 0) {
    moveOneStep(m, 'down', -y);
  } else if (y > 0) {
    moveOneStep(m, 'up', y);
  }
}

function moveOneStep(m, to, s) {
  let len = 4;
  s = s || 1;
  if (m.length === 4) {
    if (to === "left") {
      while (len--) { m[len][1] -= s }
    } else if (to === "right") {
      while (len--) { m[len][1] += s }
    } else if (to === "down") {
      while (len--) { m[len][0] += s }
    } else if (to === "up") {
      while (len--) { m[len][0] -= s }
    }
  }
}

let straightStage = 1;

function straightRotate(m) {

  let sm = (a, y, x) => {
    y && (a[0] += y)
    x && (a[1] += x)
  }

  if (straightStage === 0) {
    sm(m[0], -1, +2);
    sm(m[1], 0, +1);
    sm(m[2], 1, 0);
    sm(m[3], +2, -1);
    straightStage = 1;
  } else if (straightStage === 1) {
    sm(m[0], +2, +1);
    sm(m[1], +1, 0);
    sm(m[2], 0, -1);
    sm(m[3], -1, -2);
    straightStage = 2;
  } else if (straightStage === 2) {
    sm(m[0], 1, -2);
    sm(m[1], 0, -1);
    sm(m[2], -1, 0);
    sm(m[3], -2, 1);
    straightStage = 3;
  } else if (straightStage === 3) {
    sm(m[0], -2, -1);
    sm(m[1], -1, 0);
    sm(m[2], 0, 1);
    sm(m[3], 1, 2);
    straightStage = 0;
  }
}
//true 有接触 false 没接触
function checkIsTouch() {
  for (let i of moving) {
    if (!(i[1] >= 0 && i[1] <= 9 && i[0] <= 24 && table[i[0]][i[1]] >= 0)) {
      return true;
    }
  }
  return false;
}

function rotate(d) {

  if (tetrisType === 1) return;

  let tmpSave = straightStage;

  let step;

  if (d === 'r') {
    step = 1
  } else if (d === 'l') {
    step = 3
  } else if (d === 'o') {
    step = 2
  }

  if (tetrisType === 2) {
    while (step--) {
      straightRotate(moving);
    }
  } else {
    let c = moving[3], tmp = c4a();
    while (step--) {
      copyAtoB(moving, tmp);
      for (let i, m, idx = 0; idx < 3; idx++) {
        i = tmp[idx];
        m = moving[idx];
        if (i[0] > c[0] && i[1] === c[1]) { m[0] -= 1; m[1] -= 1 }
        if (i[0] === c[0] && i[1] > c[1]) { m[0] += 1; m[1] -= 1 }
        if (i[0] < c[0] && i[1] < c[1]) { m[1] += 2 }
        if (i[0] < c[0] && i[1] === c[1]) { m[0] += 1; m[1] += 1 }
        if (i[0] < c[0] && i[1] > c[1]) { m[0] += 2 }
        if (i[0] > c[0] && i[1] > c[1]) { m[1] -= 2 }
        if (i[0] > c[0] && i[1] < c[1]) { m[0] -= 2 }
        if (i[0] === c[0] && i[1] < c[1]) { m[0] -= 1; m[1] += 1 }
      }
    }
  }

  let kicktmp = c4a();

  copyAtoB(moving, kicktmp);

  if (checkIsTouch()) {

    let kickData = wallKick.get(tetrisType, tetrisStage, d)

    for (let item of kickData) {
      offset(moving, item)
      if (!checkIsTouch()) {
        copyAtoB(moving, old);
        shadow();
        tetrisStage = wallKick.parse(tetrisStage, d)[1]
        return;
      } else {
        copyAtoB(kicktmp, moving);
      }
    }
  } else {
    tetrisStage = wallKick.parse(tetrisStage, d)[1]
    copyAtoB(moving, old);
    shadow();
    return
  }
  straightStage = tmpSave;
  copyAtoB(old, moving);
  shadow();
};

let stopAnimation;
/*
屏蔽系统连续触发锁。因为所有的移动都是由函数定时循环驱动的，所以要屏蔽系统的连续触发，以避免作用交错在一起。
每次按下按键，只会执行一次移动函数（函数内定时，连续触发），松开按键，锁开启，移动函数停止运行。
*/
let leftLock = false;
let rightLock = false;
let downLock = false;
let deepLock = false;

// 第二级采用 setTimeInterval 进行连续触发
let leftStop;
let rightStop;
let donwStop;

// 第一级采用 setTimeout 延时
let left1stStop;
let right1stStop;
let down1stStop;

//确保每次按下旋转只能旋转一次，不会进入连续触发
let rotateLock = false;
let rotateLock1 = false;
let rotateLock2 = false;

window.addEventListener('keydown', (k) => {

  if (!gameStart) return;

  let key = toLower(k.key)

  if (key === keyboard.left) {

    if (!leftLock) {
      clearTimeout(right1stStop);
      clearInterval(rightStop);
      moveToLeftOrRight("left");
      moveLeftPlus("left");
      leftLock = true;
    }

  } else if (key === keyboard.right) {

    if (!rightLock) {
      clearTimeout(left1stStop);
      clearInterval(leftStop);
      moveToLeftOrRight("right");
      moveRightPlus("right");
      rightLock = true;
    }

  } else if (key === keyboard.down) {

    if (!downLock) {
      stopLoop();  //防止downLoop循环和向下按钮的动作相互重合
      downLoop();
      moveDownPlus();
      downLock = true;
    }

  } else if (key === keyboard.deep) {

    if (!deepLock) {
      moveToDeep();
      deepLock = true;
    }

  } else if (key === keyboard.rotate) {
    //顺时针旋转
    if (!rotateLock) {
      rotate('r');
      rotateLock = true;
    }

  } else if (key === keyboard.rotate1) {
    //逆时针旋转
    if (!rotateLock1) {
      rotate('l');
      rotateLock1 = true;
    }
  } else if (key === keyboard.rotate2) {
    if (!rotateLock2) {
      rotate('o');
      rotateLock2 = true;
    }
  }
}, false)

// 解除连续触发
window.addEventListener('keyup', (k) => {

  let key = toLower(k.key)

  if (key === keyboard.deep) {
    deepLock = false;
  } else if (key === keyboard.left) {
    clearTimeout(left1stStop);
    clearInterval(leftStop);
    leftLock = false;
  } else if (key === keyboard.right) {
    clearTimeout(right1stStop);
    clearInterval(rightStop);
    rightLock = false;
  } else if (key === keyboard.down) {
    clearTimeout(down1stStop);
    clearInterval(donwStop);
    gameStart && restartLoop();
    downLock = false;
  } else if (key === keyboard.rotate) {
    rotateLock = false;
  } else if (key === keyboard.rotate1) {
    rotateLock1 = false;
  } else if (key === keyboard.rotate2) {
    rotateLock2 = false;
  }
}, false)

function moveLeftPlus(val) {
  left1stStop = setTimeout(() => {
    leftStop = setInterval(() => {
      moveToLeftOrRight(val)
    }, keyboard.repeDelay)
  }, keyboard.firstDelay)
}

function moveRightPlus(val) {
  right1stStop = setTimeout(() => {
    rightStop = setInterval(() => {
      moveToLeftOrRight(val)
    }, keyboard.repeDelay)
  }, keyboard.firstDelay)
}

function moveDownPlus() {
  down1stStop = setTimeout(() => {
    donwStop = setInterval(() => {
      downLoop();
    }, keyboard.repeDelay)
  }, keyboard.firstDelay);
}

let finishLine = 0;

function resetGame() {
  for (let row = 0; row <= 24; row++) {
    for (let col = 0; col <= 9; col++) {
      table[row][col] = 0;
    }
  }
  stopLoop();
  moving = c4a();
  old = c4a();
  sMov = c4a();
  finishLine = 0;
  timeSpeed = 1000;
  gameScore = 0;
  digtalNumber(0, scoreDisplay);
  digtalNumber(0, fineshLineDisplay);
  digtalNumber(0, levalDisplay);
  lockStop = false;
  gameStart = false;
  gameOver = true;
  gameJustBegun = true;
  ui.startAndPause.style.backgroundColor = '#FFF';
  ui.startAndPause.innerText = "开始";
  drawBg();
  drawCS();
}

let timeSpeed, stopGame;

let lockStop = false;

function mainLoop() {
  stopGame = setInterval(function () {
    !lockStop && downLoop();
  }, timeSpeed);
}
//lockStop的目的是为了直接终止mainLoop循环内的所有内容
function stopLoop() {
  clearInterval(stopGame);
  lockStop = true;
}

function changeLoopSpeed(t) {
  clearInterval(stopGame);
  timeSpeed = t;
  mainLoop();
}

function restartLoop() {
  lockStop = false;
  clearInterval(stopGame);
  mainLoop();
}

let gameLevel = 0;

let timeList = "1000,850,722,613,521,442,375,318,270,229,194,164,139,118,100,85,72,61,51,43,36,30,25,21,17".split(",");

function changeLevalAndDisplay(line) {
  line = (line === 0 ? 0 : line -= 1);
  let level = (line < 10 ? 0 : parseInt(line / 10)) + 1;
  let time = +timeList[level - 1];
  if (time === NaN) {
    gameLevel = 666666;
    time = 1000;
  }
  gameLevel = level;
  changeLoopSpeed(time);
  digtalNumber(gameLevel, levalDisplay);
}

let distanceTop10 = QS("#u-distancetop10");

function inTop10Check() {
  if (localData.data.length < 10 || gameScore > localData.data[9][1]) {
    ui.enterTop10.style.display = "block";
    QS('#u-enterName').focus();
    QS("#u-score").innerText = gameScore;
    QS("#u-level").innerText = gameLevel;
    QS("#u-lines").innerText = finishLine;
  } else {
    ui.gameover.style.display = "block";
    distanceTop10.innerText = localData.data[9][1] - gameScore;
  }
}

ui.startAndPause.addEventListener("click", function () {
  //游戏开始
  if (!gameStart) {
    gameOver && resetGame();
    gameStart = true;
    window.requestAnimationFrame(tableAnimation);
    gameOver = false;
    this.innerText = "暂停";
    this.style.backgroundColor = '#FFF';
    changeLevalAndDisplay(finishLine);
    restartLoop();
  } else {
    //游戏暂停
    window.cancelAnimationFrame(stopAnimation);
    stopLoop();
    gameStart = false;
    this.innerText = "继续";
    this.style.backgroundColor = 'gold'
  }
}, false);

ui.reset.addEventListener("click", function () {
  if (!gameOver) {
    if (confirm('游戏已经开始，确定重新开始？')) {
      resetGame();
    }
  } else {
    resetGame();
  }
}, false);

//初始游戏网格界面
resetGame();

ui.gameover = QS("#u-gameOver");
ui.enterTop10 = QS("#u-enterTop10");
ui.info = QS("#u-info");

//.t-close
QSA((".w-border")).forEach(function (item) {
  item.querySelectorAll(".t-close").forEach(function (i) {
    i.addEventListener("click", function () {
      item.style.display = "none";
    }, false);
  })
})

const bgColor = {
  //绿
  0: 'rgb(46, 104, 59)',
  //蓝
  1: 'rgb(75, 93, 143)',
  //黑
  2: 'rgb(30, 30, 30)',
  //紫
  3: 'rgb(110, 14, 73)'
}

//初始数据
let initGameDate = {
  data: [],
  bg: 'rgb(30, 30, 30)',
  keyboard: {
    deep: "w",
    left: "a",
    right: "d",
    down: "s",
    rotate: "k", //顺时针
    rotate1: "j", //逆时针
    rotate2: 'l',
    firstDelay: firstDelayList[Math.floor(firstDelayList.length / 2)],
    repeDelay: repeDelayList[Math.floor(repeDelayList.length / 2)]
  }
}
//载入数据

let localData = JSON.parse(localStorage.getItem("TetrisGameData"));

if (!localData) {
  localData = clone(initGameDate);
}

let keyboard = localData.keyboard;

ui.bg.style.backgroundColor = localData.bg;

//将比赛记录保存到浏览器
function saveData() {
  if (window.localStorage) {
    localStorage.setItem("TetrisGameData", JSON.stringify(localData))
  } else {
    console.error("未能完成存储！")
  }
}

function checkDataAndSave(data) {

  let len = localData.data.length;

  let local = localData.data;

  if (len < 10) {

    local.push(data);
    local.sort(function (a, b) {
      return b[1] - a[1];
    })

  } else {

    for (let i = 0; i < len; i++) {
      if (data[1] > local[i][1]) {
        local.splice(i, 0, data);
        local.pop();
        break;
      }
    }
  }
  saveData();
}

ui.trList = QSA("#table-list tr");

//展示前清空
function clearInfo() {
  let len = ui.trList.length;
  for (let j = 1; j < len; j++) {
    for (let i = 0; i < ui.trList[j].children.length; i++) {
      ui.trList[j].children[i].innerText = "";
    }
  }
}

//展示Top10
function displayinfoFunc(data) {
  let len = data.length + 1;
  for (let j = 1; j < len; j++) {
    for (let i = 0; i < ui.trList[j].children.length; i++) {
      if (i === 0) {
        ui.trList[j].children[i].innerText = j;
      } else {
        ui.trList[j].children[i].innerText = data[j - 1][i - 1];
      }
    }
  }
}

QS("#infotest").addEventListener('click', function () {
  displayinfoFunc(localData.data);
  ui.info.style.display = "block";
})

ui.deep = QS("#opt-deep");
ui.left = QS("#opt-left");
ui.down = QS("#opt-down");
ui.right = QS("#opt-right");
ui.rotate = QS("#opt-rotate");
ui.rotate1 = QS("#opt-rotate1");
ui.rotate2 = QS('#opt-rotate2')

function displayOptKey() {
  ui.deep.value = keyboard.deep;
  ui.left.value = keyboard.left;
  ui.down.value = keyboard.down;
  ui.right.value = keyboard.right;
  ui.rotate.value = keyboard.rotate;
  ui.rotate1.value = keyboard.rotate1;
  ui.rotate2.value = keyboard.rotate2;
  firstDelayTime.show(keyboard.firstDelay);
  repeDelayTime.show(keyboard.repeDelay);
}

QS("#optiontest").addEventListener("click", function () {
  QS("#option").style.display = "block";
  displayOptKey();
})

QS("#clearData").addEventListener("click", function () {
  if (confirm("清除所有游戏数据 (英雄榜、键位设置) ?")) {
    localData.data = [];
    localStorage.clear();
    clearInfo();
    document.location.reload();
  }
}, false)

//top10 录入区域

QS("#u-enterNameBT").addEventListener("click", function () {
  let name = QS("#u-enterName").value;
  checkDataAndSave([name || "忍者！", gameScore, gameLevel, finishLine]);
  ui.enterTop10.style.display = "none";
});

let inputTmp = "";

//按键录入，主要目的是能够支持方向键录入
QSA(".opt-i").forEach(function (item) {
  item.addEventListener("click", function () {
    inputTmp = this.value;
    this.value = "";
    this.onkeydown = function (k) {
      if (k.key.length === 1) {
        this.value = "";
      } else {
        this.value = k.key;
      }
    }
  })
})

QSA(".opt-i").forEach(function (item) {
  item.onblur = function () {
    if (this.value === "") {
      this.value = inputTmp;
    }
  }
})

const firstDelayTime = new MakeRange('.first-range', firstDelayList)

const repeDelayTime = new MakeRange('.repe-range', repeDelayList)

QS("#opt-bt-yes").addEventListener("click", function () {
  keyboard.deep = toLower(ui.deep.value);
  keyboard.left = toLower(ui.left.value);
  keyboard.down = toLower(ui.down.value);
  keyboard.right = toLower(ui.right.value);
  keyboard.rotate = toLower(ui.rotate.value);
  keyboard.rotate1 = toLower(ui.rotate1.value);
  keyboard.rotate2 = toLower(ui.rotate2.value);
  const first = firstDelayTime.getValue();
  const repe = repeDelayTime.getValue();
  if (first && repe) {
    keyboard.firstDelay = first;
    keyboard.repeDelay = repe;
    saveData();
    QS("#option").style.display = "none";
  } else {
    alert('DAS & ARR 输入超出范围！')
  }
})

// 图形用 ‘背景’ 和 ‘方块与阴影’ 两层 canvas 实现，背景层和方块层分开绘制，避免每刷新一次都需要绘制全部的方块。
// 在绘制得分延时的过度效果时，方块层也会停止绘制，直到新的方块产生。
function tableAnimation() {

  if (!gameStart) {
    window.cancelAnimationFrame(stopAnimation)
  }

  if (!isNotDrawCS) {
    drawCS();
  }

  if (isDrawBg) {
    drawBg();
    isDrawBg = false;
  }

  stopAnimation = window.requestAnimationFrame(tableAnimation);

}

QSA('.bg-select span').forEach((item, index) => {
  item.addEventListener('click', function () {
    ui.bg.style.backgroundColor = bgColor[index];
    localData.bg = bgColor[index];
  })
})

QS('#rst-key').addEventListener('click', function () {
  if(confirm('重置键位？')){
    keyboard = clone(initGameDate.keyboard);
    localData.keyboard = keyboard;
    displayOptKey();
    saveData();
    alert('已恢复默认键位')
  }
})
