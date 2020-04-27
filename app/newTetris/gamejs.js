

// Author : Zhang xiaolei (张晓雷)
// Released under the MIT License.
// Email : zhangxiaolei@outlook.com

// debug Pro
// log = console.log;

let canvas = document.querySelector("#canvas");
let pix = canvas.getContext("2d");
let scanvas = document.querySelector("#scanvas");
let pix2 = scanvas.getContext("2d");
let scoreDisplay = document.querySelector("#digtalNumber").children;
let fineshLineDisplay = document.querySelector("#line").children;
let levalDisplay = document.querySelector("#leval").children;
let startAndPause = document.querySelector("#startPause");
let reset = document.querySelector("#reset");
let timer = new CreateTimer();

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

    let v, t,
      a = ['0', 'R', '2', 'L'],
      o = { '0': 0, 'R': 1, '2': 2, 'L': 3 };

    if (newdire === 'right') {
      v = 1;
    } else if (newdire === 'left') {
      v = -1;
    }

    t = o[origin] + v;

    if (t === 4) {
      t = 0;
    } else if (t === -1) {
      t = 3;
    }

    return [origin, a[t]]
  },

  get: function (type, origin, newdire) {

    let k = this.parse(origin, newdire).join('');

    return type === 2 ? this.I[k] : this.JLSTZ[k]

  }
}

document.body.oncontextmenu = function (e) {
  e.preventDefault();
}

function toNegative(n) {
  return n <= 0 ? n : -n;
}

function create4Arr() {
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

function createColor(c) {
  switch (c) {

    //case 0: return "#FFF";
    //方块类型看下边的对象
    case 1: return "#EEE685";  //O
    case 2: return "#B9D3EE";  //I
    case 3: return "#DDA0DD";  //T
    case 4: return "#EE6363";  //Z
    case 5: return "#32CD32";  //S
    case 6: return "#CD9B1D";  //L
    case 7: return "#8470FF";  //J
    case 8: return "#363636";  //阴影
    case 9: return "#FFFF00";  //过渡色
  }
}

// 每队数组最后一位是旋转的中心点，不能改变次序
// 第一队数组是四方块，没有中心
const tetris = {
  1: [[3, 4], [3, 5], [4, 5], [4, 4]],  // O
  2: [[4, 3], [4, 4], [4, 5], [4, 6]],  // I
  3: [[4, 3], [4, 5], [3, 4], [4, 4]],  // T
  4: [[3, 3], [3, 4], [4, 5], [4, 4]],  // Z
  5: [[3, 4], [3, 5], [4, 3], [4, 4]],  // S
  6: [[4, 3], [4, 5], [3, 3], [4, 4]],  // L
  7: [[4, 3], [4, 5], [3, 5], [4, 4]]   // J
}


function digtalNumber(n, el) {

  n = n.toString().split("");

  let len = n.length;

  let arr = [];

  for (let i = 0; i < 6 - len; i++) {
    arr[i] = "s";
  }

  arr = arr.concat(n);

  arr.forEach(function (n, i) {
    el[i].setAttribute("class", "n" + n);
  })
}


function smallDisplay(t, c) {
  let tmp = create4Arr();
  copyAtoB(t, tmp);
  tmp = tmp.map(function (n) {
    return [n[0], Math.abs(n[1]) - 3];
  })
  pix2.clearRect(0, 0, 80, 40);
  tmp.forEach(function (n) {
    pix2.beginPath();
    pix2.lineWidth = 1;
    pix2.fillStyle = createColor(c);
    pix2.rect(c === 1 || c === 2 ? n[1] * 20 + 1 : n[1] * 20 + 11, (n[0] - 2) * 20 - 20 + 1, 19, 19);
    pix2.fill();
  })
}

// 存储所有信息数据的table

const table = [];

function initTable() {
  for (let i = 0; i <= 24; i++) {
    table.push([0,0,0,0,0,0,0,0,0,0])
  }
}

initTable();

// canvas 宽度等于 20 * 10 + (10 + 1) = 211px
// canvas 高度等于 20 * 20 + (20 + 1) = 421px
// 为了解决在贴近顶部转动方块，因为向上便宜导致的索引出界问题，将table数组的范围由原来的 0 - 22 (23)调整为 0-24 (25格);
// 用来绘图的表格区域必须变更，由原来的偏移 [60px] (23-20) * 20 增加到 [100px + 5 * 1 = 105px] (25 - 20) * 20。

function drawSquare(x, y, c) {
  pix.fillStyle = c;
  pix.fillRect(x * 21 + 1, y * 21 + 1 - 105, 20, 20);
}

function drawTable() {
  let t;
  pix.clearRect(0, 0, 211, 421);
  for (let j = 4; j <= 24; j++) {
    for (let i = 0; i <= 9; i++) {
      t = Math.abs(table[j][i]);
      if (t !== 0) {
        drawSquare(i, j, createColor(t));
      }
    }
  }
  for (let i of sMov) {
    if (table[i[0]][i[1]] === 0) {
      drawSquare(i[1], i[0], createColor(8))
    }
  }
  sMov = create4Arr();
}

let moving = [];
let old = [];
let line = [];
let colorId = [];
let tetrisType;
let tetrisStage;

function createNewCube() {

  colorId.push(rand());

  line.push(tetris[colorId[colorId.length - 1]]);

  if (line.length < 2) {
    colorId.push(rand());
    line.push(tetris[colorId[1]])
  }

  smallDisplay(line[1], colorId[1]);

  tetrisType = colorId[0];

  for (let i of line.shift()) {
    table[i[0]][i[1]] = colorId[0];
    moving.push([i[0], i[1]]);
    old.push([i[0], i[1]]);
  }

  tetrisStage = '0';

  if (tetrisType === 2) {
    straightStage = 0;
  }

  colorId.shift();

}


let sMov = create4Arr();

function shadow() {

  if (!moving.length) return;

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


let createLock = false;

let gameJustBegun = true;

function downLoop() {

  if (!gameStart) { return };

  if (gameJustBegun) {
    normalCreate();
    gameJustBegun = false;
    return;
  }

  if (!moving.length) { return }

  moveOneStep(moving, "down");

  if (checkIsTouch()) {

    copyAtoB(old, moving);

    mainMoveControl("down");

    return;

  } else {

    refreshData();

    copyAtoB(moving, old);

  }

}

function moveToLeftOrRight(to) {

  if (!gameStart && !moving.length) { return };

  if (to === "left") {

    moveOneStep(moving, "left");

  } else if (to === "right") {

    moveOneStep(moving, "right");
  }

  if (checkIsTouch()) {

    copyAtoB(old, moving);

    return;

  } else {

    refreshData();

    copyAtoB(moving, old);
  }
}


let deepLock = false;

function movoToDeep() {

  if (!gameStart && !moving.length) { return };

  for (let x = 0; x <= 24; x++) {

    for (let i of moving) {

      if (i[0] === 24 || table[i[0] + 1][i[1]] < 0) {

        old.forEach(function (i) {
          table[i[0]][i[1]] = 0;
        })

        moving.forEach(function (i) {
          table[i[0]][i[1]] = toNegative(tetrisType);
        })

        mainMoveControl("deep");

        return;
      }
    }
    moveOneStep(moving, "down");
  }
}

function normalCreate() {
  checkEnd();
  moving = [];
  old = [];
  stopLoop();
  createNewCube();
  restartLoop();
}

let gameScore = 0;

function scoreCreate(scoreList) {

  let len = scoreList.length;

  stopLoop();

  scoreList.forEach(function (i) {
    table.splice(i, 1, [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
  })

  moving = [];

  old = [];

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

    digtalNumber(gameScore, scoreDisplay);

    digtalNumber(finishLine, fineshLineDisplay);

    changeLevalAndDisplay(finishLine);

    checkEnd();

    createNewCube();

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
    startAndPause.innerText = "开始";
    inTop10Check();
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
  if (!arr.length) { return }
  let s, b;
  s = arr[0][0];
  b = s;
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

function mainMoveControl(deepOrDown) {

  let scoreList = checkGetScore(moving);

  if (deepOrDown === "deep") {

    scoreList.length ? scoreCreate(scoreList) : normalCreate()

  } else if (deepOrDown === "down") {

    setTimeout(function () {

      if (checkCanMove()) {

        return;

      } else {

        tetrisLock(old);

        let sl = checkGetScore(old)

        sl.length ? scoreCreate(sl) : normalCreate()
      }
    }, 300);
  }
}

function refreshData() {

  old.forEach(function (i) {
    table[i[0]][i[1]] = 0;
  })

  moving.forEach(function (i) {
    table[i[0]][i[1]] = tetrisType;
  })

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

  function sm(a, y, x) {
    if (y < 0) {
      a[0] += y
    } else if (y > 0) {
      a[0] += y
    }
    if (x < 0) {
      a[1] += x
    } else if (x > 0) {
      a[1] += x
    }
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

  if (!gameStart || !moving.length || tetrisType === 1) { return }

  let tmpSave = straightStage;

  let step = (d === 'right' ? 1 : 3)

  if (tetrisType === 2) {
    while (step--) {
      straightRotate(moving);
    }
  } else {

    let a = [], c = moving.pop();

    while (step--) {
      for (let i of moving) {
        (i[0] > c[0] && i[1] === c[1]) && a.push([i[0] - 1, i[1] - 1]);
        (i[0] === c[0] && i[1] > c[1]) && a.push([i[0] + 1, i[1] - 1]);
        (i[0] < c[0] && i[1] < c[1]) && a.push([i[0], i[1] + 2]);
        (i[0] < c[0] && i[1] === c[1]) && a.push([i[0] + 1, i[1] + 1]);
        (i[0] < c[0] && i[1] > c[1]) && a.push([i[0] + 2, i[1]]);
        (i[0] > c[0] && i[1] > c[1]) && a.push([i[0], i[1] - 2]);
        (i[0] > c[0] && i[1] < c[1]) && a.push([i[0] - 2, i[1]]);
        (i[0] === c[0] && i[1] < c[1]) && a.push([i[0] - 1, i[1] + 1]);
      }
      if (step > 0) {
        copyAtoB(a, moving);
        a = [];
      }
    }
    copyAtoB(a, moving);
    moving.push(c);
  }

  let kicktmp = create4Arr();

  copyAtoB(moving, kicktmp);

  if (checkIsTouch()) {

    let kickData = wallKick.get(tetrisType, tetrisStage, d)

    for (let item of kickData) {
      offset(moving, item)
      if (!checkIsTouch()) {
        refreshData();
        copyAtoB(moving, old);
        tetrisStage = wallKick.parse(tetrisStage, d)[1]
        return;
      } else {
        copyAtoB(kicktmp, moving);
      }
    }
  } else {
    tetrisStage = wallKick.parse(tetrisStage, d)[1]
    refreshData();
    copyAtoB(moving, old);
    return
  }
  straightStage = tmpSave;
  copyAtoB(old, moving);
  refreshData();
};

let stopAnimation;
let gameStart = false;
let gameOver = true;
/*
屏蔽系统连续触发锁。因为所有的移动都是由函数定时循环驱动的，所以要屏蔽系统的连续触发，以避免作用交错在一起。
每次按下按键，只会执行一次移动函数（函数内定时，连续触发），松开按键，锁开启，移动函数停止运行。
*/
let leftLock = false;
let rightLock = false;
let downLock = false;

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

//

if (isPc()) {
  document.addEventListener('keydown', controlOnkeyDown, false)
  document.addEventListener('keyup', controlOnkeyUp, false)
} else {
  //在非电脑端，关闭键位设置,默认选择第一个元素
  document.querySelector('.opt-item').style.display = 'none';
}

function controlOnkeyDown(k) {

  let key = (typeof k === 'string' ? k : toLower(k.key))

  if (key === keyboard.left) {

    if (!leftLock) {
      clearTimeout(right1stStop);
      clearInterval(rightStop);
      moveToLeftOrRight("left");
      moveLeftPlus("left");
      keyColorSwitch(key, true);
      leftLock = true;
    }

  } else if (key === keyboard.right) {

    if (!rightLock) {
      clearTimeout(left1stStop);
      clearInterval(leftStop);
      moveToLeftOrRight("right");
      moveRightPlus("right");
      keyColorSwitch(key, true);
      rightLock = true;
    }

  } else if (key === keyboard.down) {

    if (!downLock) {
      stopLoop();  //防止downloop循环和向下按钮的动作相互重合
      downLoop();
      moveDownPlus();
      keyColorSwitch(key, true);
      downLock = true;
    }

  } else if (key === keyboard.deep) {

    if (!deepLock) {
      movoToDeep();
      keyColorSwitch(key, true);
      deepLock = true;
    }

  } else if (key === keyboard.rotate) {
    //顺时针旋转
    if (!rotateLock) {
      rotate("right");
      keyColorSwitch(key, true);
      rotateLock = true;
    }

  } else if (key === keyboard.rotate1) {
    //逆时针旋转
    if (!rotateLock1) {
      rotate("left");
      keyColorSwitch(key, true);
      rotateLock1 = true;
    }
  }
}

// 解除连续触发

function controlOnkeyUp(k) {

  let key = (typeof k === 'string' ? k : toLower(k.key))

  keyColorSwitch(key, false);

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
    restartLoop();
    downLock = false;
  } else if (key === keyboard.rotate) {
    rotateLock = false;
  } else if (key === keyboard.rotate1) {
    rotateLock1 = false;
  }
}


function moveLeftPlus(val) {
  left1stStop = setTimeout(function () {
    leftStop = setInterval(function () {
      moveToLeftOrRight(val)
    }, keyboard.repeDelay)
  }, keyboard.firstDelay)
}

function moveRightPlus(val) {
  right1stStop = setTimeout(function () {
    rightStop = setInterval(function () {
      moveToLeftOrRight(val)
    }, keyboard.repeDelay)
  }, keyboard.firstDelay)
}

function moveDownPlus() {
  down1stStop = setTimeout(function () {
    donwStop = setInterval(function () {
      downLoop();
    }, keyboard.repeDelay)
  }, keyboard.firstDelay);
}

function resetGame() {
  for (let row = 0; row <= 24; row++) {
    for (let col = 0; col <= 9; col++) {
      table[row][col] = 0;
    }
  }
  drawTable();
  moving = [];
  old = [];
  line = [];
  colorId = [];
  finishLine = 0;
  digtalNumber(0, scoreDisplay);
  digtalNumber(0, fineshLineDisplay);
  digtalNumber(0, levalDisplay);
  smallDisplay(create4Arr(), 0);
  stopLoop();
  timeSpeed = 1000;
  gameScore = 0;
  lockStop = false;
  gameStart = false;
  gameOver = true;
  gameJustBegun = true;
}

let finishLine = 0;

let timeSpeed;

let stopGame;

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

let distanceTop10 = document.querySelector("#u-distancetop10");

function inTop10Check() {
  if (localData.data.length < 10 || gameScore > localData.data[9][1]) {
    ui.enterTop10.style.display = "block";
    document.querySelector('#u-enterName').focus();
    $("#u-score").text(gameScore);
    $("#u-level").text(gameLevel);
    $("#u-lines").text(finishLine);
    screenCover("open");
  } else {
    ui.gameover.style.display = "block";
    distanceTop10.innerText = localData.data[9][1] - gameScore;
    screenCover("open");
  }
}

startAndPause.addEventListener("click", function () {
  //游戏开始
  if (!gameStart) {
    gameOver && resetGame();
    gameStart = true;
    window.requestAnimationFrame(tableAnimation);
    gameOver = false;
    this.innerText = "暂停";
    this.setAttribute("style", "background-color : white");
    changeLevalAndDisplay(finishLine);
    restartLoop();
  } else {
    //游戏暂停
    window.cancelAnimationFrame(stopAnimation);
    clearInterval(stopGame);
    gameStart = false;
    this.innerText = "继续";
    this.setAttribute("style", "background-color : gold");
  }
}, false);

reset.addEventListener("click", function () {

  if (!gameOver) {
    ui.reset.style.display = "block";
    screenCover("open");

  } else {
    resetGame();
    startAndPause.innerText = "开始";
  }

}, false);


//初始游戏网格界面
resetGame();

function screenCover(c) {
  let w = document.innerWidth - 80 + "px";
  let h = document.innerHeight - 80 + "px";
  if (c === "open") {
    $("#backGroundCover").css({
      display: "block",
      width: w,
      height: h
    })
  } else if (c === "close") {
    $("#backGroundCover").css({
      display: "none",
      width: "0px",
      height: "0px"
    })
  }
}

//----------------------------------窗口DOM对应的变量存储-------------------------------------

let ui = Object.create(null);
ui.reset = document.querySelector("#u-reset");
ui.gameover = document.querySelector("#u-gameOver");
ui.enterTop10 = document.querySelector("#u-enterTop10");
ui.info = document.querySelector("#u-info");


//------------------------------点击t-close标签，关闭窗口-------------------------------------

document.querySelectorAll((".t-win")).forEach(function (item) {
  item.querySelectorAll(".t-close").forEach(function (i) {
    i.addEventListener("click", function () {
      item.style.display = "none";
      screenCover("close");
    }, false);
  })
})


//"确认" 按钮事件
document.querySelector("#u-resetBT").addEventListener("click", function () {
  resetGame();
  startAndPause.innerText = "开始";
  startAndPause.style.backgroundColor = "white";
  ui.reset.style.display = "none";
  screenCover("close");
})


//-----------------------------------------信息板区域----------------------------------------------


//初始数据
let initGameDate = {
  data: [],
  keyboard: {
    deep: "w",
    left: "a",
    right: "d",
    down: "s",
    rotate: "k", //顺时针
    rotate1: "j", //逆时针
    firstDelay: 100,
    repeDelay: 65
  }
}
//载入数据


let localData = JSON.parse(localStorage.getItem("TetrisGameData"));

if (!localData) {
  localData = initGameDate;
}

let keyboard = localData.keyboard;

//将比赛记录保存到浏览器
function saveData() {
  if (window.localStorage) {
    localStorage.setItem("TetrisGameData", JSON.stringify(localData))
  } else {
    console.error("存储数据失败 程序未找到 window.localStorage")
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

ui.trList = document.querySelectorAll("#table-list tr");
//清除比赛记录板Element里的数据
function clearInfo() {
  let len = ui.trList.length;
  for (let j = 1; j < len; j++) {
    for (let i = 0; i < ui.trList[j].children.length; i++) {
      ui.trList[j].children[i].innerText = "";
    }
  }
}
//将localData的数据展示到记录板
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


$("#infotest").click(function () {
  displayinfoFunc(localData.data);
  ui.info.style.display = "block";
  screenCover("open");
})

ui.deep = document.querySelector("#opt-deep");
ui.left = document.querySelector("#opt-left");
ui.down = document.querySelector("#opt-down");
ui.right = document.querySelector("#opt-right");
ui.rotate = document.querySelector("#opt-rotate");
ui.rotate1 = document.querySelector("#opt-rotate1");
ui.firstDelay = document.querySelector("#opt-firstdelay");
ui.repeDelay = document.querySelector("#opt-repedelay");


document.querySelector("#optiontest").addEventListener("click", function () {
  document.querySelector("#option").style.display = "block";
  ui.deep.value = keyboard.deep;
  ui.left.value = keyboard.left;
  ui.down.value = keyboard.down;
  ui.right.value = keyboard.right;
  ui.rotate.value = keyboard.rotate;
  ui.rotate1.value = keyboard.rotate1;
  ui.firstDelay.value = keyboard.firstDelay;
  ui.repeDelay.value = keyboard.repeDelay;
  screenCover("open");
})

document.querySelector("#clearData").addEventListener("click", function () {
  if (confirm("清除所有数据 ?")) {
    localData.data = [];
    localStorage.clear();
    clearInfo();
  }
}, false)


//------------------------top10 录入区域------------------------


document.querySelector("#u-enterNameBT").addEventListener("click", function () {
  let name = document.querySelector("#u-enterName").value;
  checkDataAndSave([name || "忍者！", gameScore, gameLevel, finishLine]);
  screenCover("close");
  ui.enterTop10.style.display = "none";
}, false);

//-----------------------关于-------------------------------

ui.about = document.querySelector("#about-win");
document.querySelector("#aboutme").addEventListener("click", function () {
  ui.about.style.display = "block";
  screenCover("open");
}, false)


let inputTmp = "";

//按键录入，主要目的是能够支持方向键录入
document.querySelectorAll(".opt-i").forEach(function (item) {
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

document.querySelectorAll(".opt-i").forEach(function (item) {
  item.onblur = function () {
    if (this.value === "") {
      this.value = inputTmp;
    }
  }
})

document.querySelector("#opt-bt-yes").addEventListener("click", function () {
  if (keyboard.deep !== ui.deep.value ||
    keyboard.left !== ui.left.value ||
    keyboard.down !== ui.down.value ||
    keyboard.right !== ui.right.value ||
    keyboard.rotate !== ui.rotate.value ||
    keyboard.rotate1 !== ui.rotate1.value ||
    keyboard.firstDelay !== +ui.firstDelay.value ||
    keyboard.repeDelay !== +ui.repeDelay.value) {
    if (confirm("确定设置更改？")) {
      keyboard.deep = toLower(ui.deep.value);
      keyboard.left = toLower(ui.left.value);
      keyboard.down = toLower(ui.down.value);
      keyboard.right = toLower(ui.right.value);
      keyboard.rotate = toLower(ui.rotate.value);
      keyboard.rotate1 = toLower(ui.rotate1.value);
      keyboard.firstDelay = parseInt(ui.firstDelay.value);
      keyboard.repeDelay = parseInt(ui.repeDelay.value);
      document.querySelector("#option").style.display = "none";
      saveData();
      screenCover("close");
    } else {
      document.querySelector("#option").style.display = "none";
      screenCover("close");
    }
  } else {
    document.querySelector("#option").style.display = "none";
    screenCover("close");
  }
})

let keyColor = [];

keyColor.push(document.querySelector("#c-up"))
keyColor.push(document.querySelector("#c-left"))
keyColor.push(document.querySelector("#c-right"))
keyColor.push(document.querySelector("#c-down"))
keyColor.push(document.querySelector("#r-right"))
keyColor.push(document.querySelector("#r-left"))

let kkl = ['deep', 'left', 'right', 'down', 'rotate', 'rotate1'];

for (let i = 0; i < 6; i++) {
  keyColor[i].addEventListener('touchstart', function () {
    controlOnkeyDown(keyboard[kkl[i]])
  }, false)
  keyColor[i].addEventListener('touchend', function () {
    controlOnkeyUp(keyboard[kkl[i]])
  }, false)
}

function setAttr(ele, val) {
  let cl = ele.firstElementChild ? ele.firstElementChild.classList : ele.classList;
  ele = ele.firstElementChild ? ele.firstElementChild : ele;
  //如果cl[1]为空，说明里面只有一个属性，就再添加一个，否则，就重新设置第一个属性，覆盖第二个属性。
  if (!cl[1]) {
    ele.setAttribute("class", cl.value + ' ' + val);
  } else {
    t = cl.value.split(' ')[0];
    ele.setAttribute('class', t);
  }
}

function keyColorSwitch(s, b) {

  let styleClass = b ? 'game-bt-style-tap' : 'game-bt-style'

  switch (s) {
    case keyboard.deep: setAttr(keyColor[0], styleClass); break
    case keyboard.left: setAttr(keyColor[1], styleClass); break
    case keyboard.right: setAttr(keyColor[2], styleClass); break
    case keyboard.down: setAttr(keyColor[3], styleClass); break
    case keyboard.rotate: setAttr(keyColor[4], styleClass); break
    case keyboard.rotate1: setAttr(keyColor[5], styleClass); break
  }
}

//动画函数

function tableAnimation() {
  if (!gameStart) {
    window.cancelAnimationFrame(stopAnimation)
  }
  shadow();
  drawTable();
  stopAnimation = window.requestAnimationFrame(tableAnimation)
}
