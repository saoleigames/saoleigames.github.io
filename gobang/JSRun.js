
function stoneX(loc) {
    var box = document.querySelector("#box");
    var cube = document.createElement("div");
    var stone = document.createElement("div");
    var select = document.createElement("div");
    var cubeStyle = document.createAttribute("class");
    var stoneStyle = document.createAttribute("class");
    var selectStyle = document.createAttribute("class");
    var x = loc.match(/^\d+/)[0];
    var y = loc.match(/\d+$/)[0];
    if (y === "20" && x !== "580" && x !== "20") {
        cgobang("cubeTop");
    } else if (x === "580" && y === "20") {
        cgobang("cubeTopRight");
    } else if (x === "580" && y !== "20" && y !== "580") {
        cgobang("cubeRight")
    } else if (x === "580" && y === "580") {
        cgobang("cubeRightBottom");
    } else if (y === "580" && x !== "20" && x !== "580") {
        cgobang("cubeBottom");
    } else if (x === "20" && y === "580") {
        cgobang("cubeLeftBottom");
    } else if (x === "20" && y !== "580" && y !== "20") {
        cgobang("cubeLeft");
    } else if (x === "20" && y === "20") {
        cgobang("cubeLeftTop");
    } else {
        cgobang("cube");
    }
    stone.dataset.location = loc;
    select.dataset.location = loc.replace(/:/, "-");
    function cgobang(cubeType) {
        cubeStyle.value = cubeType;
        stoneStyle.value = "stone";
        selectStyle.value = "select";
        cube.setAttributeNode(cubeStyle);
        stone.setAttributeNode(stoneStyle);
        select.setAttributeNode(selectStyle);
        cube.appendChild(stone);
        cube.appendChild(select);
        box.appendChild(cube);
    }
}

//棋盘数据
var position = {};
initPosition(true);
var goBackPosition = [];
//初始化棋盘
function initPosition(s) {
    for (var i = 20; i <= 580; i += 40) {
        for (var j = 20; j <= 580; j += 40) {
            s && stoneX(j + ":" + i);
            //棋盘棋子初始化，0代表空，1代表黑棋，2代表白棋
            position[j + ":" + i] = 0;
        }
    }
}

//初始化光标位置
var blackHand, whiteHand;
var blackLoc = {}, whiteLoc = {};
blackLoc.x = 260;
blackLoc.y = 260;
whiteLoc.x = 340;
whiteLoc.y = 340;

//document.querySelector("div[data-location='20:60']");

blackHand = document.querySelector("div[data-location='260-260']")
blackHand.style.border = "2px dashed black";
whiteHand = document.querySelector("div[data-location='340-340']")
whiteHand.style.border = "2px dashed white";
var cover = false;
var gameFirst = 0;
var gamest = false;

var clue = document.querySelector("#cluetext");
clue.innerText = "点击开始";

var gameStartChoice = document.querySelector("#gamestart");

gameStartChoice.onclick = function () {
    var sb = document.querySelector("#startbox");
    winShow("close");
    sb.style.display = "block";
    gamest = true;
    gameOverFunc();
    initPosition();
    timevalue.innerText = "00:00:00";
    document.querySelector("#blackFirst").onclick = function () {
        gameFirst = 1;
        clue.innerText = "黑棋先走";
        sb.style.display = "none";
        timer();
    };
    document.querySelector("#whiteFirst").onclick = function () {
        gameFirst = 2;
        clue.innerText = "白棋先走";
        sb.style.display = "none";
        timer();
    };
};

document.querySelector("#goBack").onclick = function () {
    if (goBackPosition.length) {
        var back = goBackPosition.pop();
        let x = back.match(/^\d+/)[0];
        let y = back.match(/\d+$/)[0];
        if (position[back] === 1) {
            document.querySelector("div[data-location='0']".replace(/'.*'/, "'" + x + ":" + y + "'")).setAttribute("style", "background-color : none");
            position[back] = 0;
            if (gamest === true) {
                gameFirst = 1;
                clue.innerText = "等待黑棋";
            }
        } else if (position[back] === 2) {
            document.querySelector("div[data-location='0']".replace(/'.*'/, "'" + x + ":" + y + "'")).setAttribute("style", "background-color : none");
            position[back] = 0;
            if (gamest === true) {
                gameFirst = 2;
                clue.innerText = "等待白棋";
            }
        }
    }
};

var timevalue = document.querySelector("#timebox");
var ss = 0, mm = 0, hh = 0;
var timesp;
function timer() {
    ss += 1;
    if (ss === 60) {
        mm += 1;
        ss = 0;
    }

    if (mm === 60) {
        hh += 1;
        mm = 0;
    }

    timevalue.innerText = (hh ? (hh < 10 ? "0" + hh : hh) : "00") + ":" + (mm ? (mm < 10 ? "0" + mm : mm) : "00") + ":" + (ss < 10 ? "0" + ss : ss);

    timesp = setTimeout("timer()", 1000);

}

function timeStop() {
    clearTimeout(timesp);
    ss = 0;
    mm = 0;
    hh = 0;
}




function keyPress(e) {
    var keyChar;
    keyChar = String.fromCharCode(e.keyCode);




    if (keyChar === "W") {
        if (blackLoc.y > 20) {
            blackLoc.y -= 40;
            !cover ? blackHand.style.border = "none" : whiteHand.style.border = "2px dashed white";
            cover = false;
            blackHand = document.querySelector("div[data-location='260-260']".replace(/'.*'/, "'" + blackLoc.x + "-" + blackLoc.y + "'"));
            blackHand.style.border = "2px dashed black";
        }
    } else if (keyChar === "S") {
        if (blackLoc.y < 580) {
            blackLoc.y += 40;
            !cover ? blackHand.style.border = "none" : whiteHand.style.border = "2px dashed white";
            cover = false;
            blackHand = document.querySelector("div[data-location='260-260']".replace(/'.*'/, "'" + blackLoc.x + "-" + blackLoc.y + "'"));
            blackHand.style.border = "2px dashed black";
        }
    } else if (keyChar === "A") {
        if (blackLoc.x > 20) {
            blackLoc.x -= 40;
            !cover ? blackHand.style.border = "none" : whiteHand.style.border = "2px dashed white";
            cover = false;
            blackHand = document.querySelector("div[data-location='260-260']".replace(/'.*'/, "'" + blackLoc.x + "-" + blackLoc.y + "'"));
            blackHand.style.border = "2px dashed black";
        }
    } else if (keyChar === "D") {
        if (blackLoc.x < 580) {
            blackLoc.x += 40;
            !cover ? blackHand.style.border = "none" : whiteHand.style.border = "2px dashed white";
            cover = false;
            blackHand = document.querySelector("div[data-location='260-260']".replace(/'.*'/, "'" + blackLoc.x + "-" + blackLoc.y + "'"));
            blackHand.style.border = "2px dashed black";
        }
    } else if (keyChar === "Q") {
        //开始放下黑色棋子
        if ((gameFirst === 1 || !gamest) && position[blackLoc.x + ":" + blackLoc.y] === 0) {
            document.querySelector("div[data-location='0']".replace(/'.*'/, "'" + blackLoc.x + ":" + blackLoc.y + "'")).setAttribute("style", "background-image: -webkit-linear-gradient(top,#777,#000); box-shadow : 1px 1px 1px gray;");
            position[blackLoc.x + ":" + blackLoc.y] = 1;
            goBackPosition.push(blackLoc.x + ":" + blackLoc.y);
            setTimeout("checkFive()", 100);
            gamest && (gameFirst = 2);
            gamest && (clue.innerText = "等待白棋");
        }
    }


    //白棋移动
    if (keyChar === "I") {
        if (whiteLoc.y > 20) {
            whiteLoc.y -= 40;
            !cover ? whiteHand.style.border = "none" : blackHand.style.border = "2px dashed black";
            cover = false;
            whiteHand = document.querySelector("div[data-location='340-340']".replace(/'.*'/, "'" + whiteLoc.x + "-" + whiteLoc.y + "'"));
            whiteHand.style.border = "2px dashed white";
        }
    } else if (keyChar === "K") {
        if (whiteLoc.y < 580) {
            whiteLoc.y += 40;
            !cover ? whiteHand.style.border = "none" : blackHand.style.border = "2px dashed black";
            cover = false;
            whiteHand = document.querySelector("div[data-location='340-340']".replace(/'.*'/, "'" + whiteLoc.x + "-" + whiteLoc.y + "'"));
            whiteHand.style.border = "2px dashed white";
        }
    } else if (keyChar === "J") {
        if (whiteLoc.x > 20) {
            whiteLoc.x -= 40;
            !cover ? whiteHand.style.border = "none" : blackHand.style.border = "2px dashed black";
            cover = false;
            whiteHand = document.querySelector("div[data-location='340-340']".replace(/'.*'/, "'" + whiteLoc.x + "-" + whiteLoc.y + "'"));
            whiteHand.style.border = "2px dashed white";
        }
    } else if (keyChar === "L") {
        if (whiteLoc.x < 580) {
            whiteLoc.x += 40;
            !cover ? whiteHand.style.border = "none" : blackHand.style.border = "2px dashed black";
            cover = false;
            whiteHand = document.querySelector("div[data-location='340-340']".replace(/'.*'/, "'" + whiteLoc.x + "-" + whiteLoc.y + "'"));
            whiteHand.style.border = "2px dashed white";
        }
    } else if (keyChar === "U") {
        //开始放下白色棋子
        if ((gameFirst === 2 || !gamest) && position[whiteLoc.x + ":" + whiteLoc.y] === 0) {
            document.querySelector("div[data-location='0']".replace(/'.*'/, "'" + whiteLoc.x + ":" + whiteLoc.y + "'")).setAttribute("style", "background-image: -webkit-linear-gradient(top,#fff,#ddd); box-shadow : 1px 1px 1px gray;");
            position[whiteLoc.x + ":" + whiteLoc.y] = 2;
            goBackPosition.push(whiteLoc.x + ":" + whiteLoc.y);
            setTimeout("checkFive()", 100);
            gamest && (gameFirst = 1);
            gamest && (clue.innerText = "等待黑棋");
        }
    }

    if (blackLoc.x === whiteLoc.x && blackLoc.y === whiteLoc.y) {
        cover = true;
        document.querySelector("div[data-location='0']".replace(/'.*'/, "'" + whiteLoc.x + "-" + whiteLoc.y + "'")).style.border = "2px dotted gray";
    }
}

var row = ["row"];

for (let y = 20; y <= 580; y += 40) {
    for (let x = 20; x <= 580; x += 40) {
        row.push(x + ":" + y);
    }
}
var column = ["column"];
for (let x = 20; x <= 580; x += 40) {
    for (let y = 20; y <= 580; y += 40) {
        column.push(x + ":" + y);
    }
}
var leftUp = ["cross"];

for (let i = 180; i <= 580; i += 40) {
    let z = i;
    for (let j = 20; j <= i; j += 40) {
        leftUp.push(z + ":" + j);
        z -= 40;
    }
}
for (let i = 60; i <= 420; i += 40) {
    let z = i;
    for (let j = 580; j >= i; j -= 40) {
        leftUp.push(j + ":" + z);
        z += 40;
    }
}

var rightUp = ["cross"];

for (let i = 420; i >= 20; i -= 40) {
    let z = i;
    for (let j = 20; j <= (580 + 20) - i; j += 40) {
        rightUp.push(z + ":" + j);
        z += 40;
    }
}
for (let i = 60; i <= 420; i += 40) {
    let z = i;
    for (let j = 20; j <= (580 + 20) - i; j += 40) {
        rightUp.push(j + ":" + z);
        z += 40;
    }
}

function check(positionIndex) {
    var blackHave = "no", blackNum = 0;
    var whiteHave = "no", whiteNum = 0;
    if (positionIndex[0] === "cross") {
        for (let key of positionIndex.slice(1)) {
            if ((key.split(":")[0] === "20" || key.split(":")[0] === "580" || key.split(":")[1] === "20" || key.split(":")[1] === "580") && !(blackNum === 4 || whiteNum === 4)) {
                blackHave = "no";
                whiteHave = "no";
                blackNum = 0;
                whiteNum = 0;
            }
            if (position[key] === 1) {
                whiteHave = "no";
                whiteNum = 0;
                if (blackHave === "yes") {
                    blackNum += 1;
                    if (blackNum >= 5) {
                        return 1;
                    }
                } else {
                    blackHave = "yes";
                    blackNum = 1;
                }
            } else if (position[key] === 2) {
                blackHave = "no";
                blackNum = 0;
                if (whiteHave === "yes") {
                    whiteNum += 1;
                    if (whiteNum >= 5) {
                        return 2;
                    }
                } else {
                    whiteHave = "yes";
                    whiteNum = 1;
                }
            } else {
                blackHave = "no";
                whiteHave = "no";
                blackNum = 0;
                whiteNum = 0;
            }
        }
    } else {
        var oh;

        if (positionIndex[0] === "row") {
            oh = 0;
        } else if (positionIndex[0] === "column") {
            oh = 1;
        }

        for (let key of positionIndex.slice(1)) {
            if ((key.split(":")[oh] === "20" || key.split(":")[oh] === "580") && !(blackNum === 4 || whiteNum === 4)) {
                blackHave = "no";
                whiteHave = "no";
                blackNum = 0;
                whiteNum = 0;
            }
            if (position[key] === 1) {
                whiteHave = "no";
                whiteNum = 0;
                if (blackHave === "yes") {
                    blackNum += 1;
                    if (blackNum >= 5) {
                        return 1;
                    }
                } else {
                    blackHave = "yes";
                    blackNum = 1;
                }
            } else if (position[key] === 2) {
                blackHave = "no";
                blackNum = 0;
                if (whiteHave === "yes") {
                    whiteNum += 1;
                    if (whiteNum >= 5) {
                        return 2;
                    }
                } else {
                    whiteHave = "yes";
                    whiteNum = 1;
                }
            } else {
                blackHave = "no";
                whiteHave = "no";
                blackNum = 0;
                whiteNum = 0;
            }
        }
    }
    return 0;
}


var winInfo = document.querySelector("#winbox");
var winText = document.querySelector("#winInfo");
var winClose = document.querySelector("#close");

function winShow(c) {
    if (c === "bw") {
        winInfo.style.display = "block";
        winText.innerText = "黑棋获胜";
        clue.innerText = "黑棋获胜";
    } else if (c === "ww") {
        winInfo.style.display = "block";
        winText.innerText = "白棋获胜";
        clue.innerText = "白棋获胜";
    } else if (c === "close") {
        winInfo.style.display = "none";
    }
    timeStop();
}

winClose.onclick = function () {
    winShow("close");
};

var gameOver = document.querySelector("#gameover");
gameOver.onclick = function () {
    var sb = document.querySelector("#startbox");
    sb.style.display = "none";
    winShow("close");
    gameOverFunc();
    gamest = false;
}

function gameOverFunc() {
    for (let key of row.slice(1)) {
        let x = key.match(/^\d+/)[0];
        let y = key.match(/\d+$/)[0];
        document.querySelector("div[data-location='0']".replace(/'.*'/, "'" + x + ":" + y + "'")).setAttribute("style", "background-color : none");
        gameFirst = 0;
        initPosition();
        clue.innerText = "点击开始";
    }
    timeStop();
}

function checkFive() {
    var r, c, lt, rt;
    r = check(row);
    c = check(column);
    lt = check(leftUp);
    rt = check(rightUp);
    r === 1 && winShow("bw");
    r === 2 && winShow("ww");
    c === 1 && winShow("bw");
    c === 2 && winShow("ww");
    lt === 1 && winShow("bw");
    lt === 2 && winShow("ww");
    rt === 1 && winShow("bw");
    rt === 2 && winShow("ww");
}
