/*
  stone = 0
scissor = 1 
  cloth = 2 
*/
function random(begin, end) {
    return parseInt(Math.random() * (end - begin + 1) + begin);
}

function createPlayer(name) {
    this.name = name;
}

createPlayer.prototype.AI = function () {
    return random(0, 2);
}

hands = ['石头', '剪刀', '布'];

let stShow = document.querySelector(".topbar span");

function displayResult(result, player1, output1, player2, output2) {

    let tmp;

    if (result === 0) {
        console.log(tmp = (player1.name + "赢 " + player1.name + ":" + hands[output1] + " >> " + player2.name + ":" + hands[output2]));
    } else if (result === 1) {
        console.log(tmp = (player2.name + "赢 " + player1.name + ":" + hands[output1] + " << " + player2.name + ":" + hands[output2]));
    } else if (result === -1) {
        console.log(tmp = ("平局了 " + player1.name + ":" + hands[output1] + " >< " + player2.name + ":" + hands[output2]));
    }

    stShow.innerText = tmp + " '" + database.length + "'";

}

let database = [];

let statisEle = document.querySelectorAll(".statis li span")

function statisDisplay() {
    let len = database.length;
    statisEle[0].innerText = len;
    let P1win = 0, P2win = 0;
    for (let iten of database) {
        if (iten[0] === 0) {
            P1win += 1;
        } else if (iten[0] === 1) {
            P2win += 1;
        }
    }
    statisEle[1].innerText = _int(P1win / len * 100) + "%";
    statisEle[2].innerText = _int(P2win / len * 100) + "%";
    statisEle[3].innerText = _int(100 - ((P1win / len * 100) + (P2win / len * 100))) + "%";
}

function VS(player1, player2) {

    let output1 = player1.AI();
    let output2 = player2.AI();

    let result;

    switch ('' + output1 + output2) {
        case "01": result = 0; break;
        case "02": result = 1; break;
        case "10": result = 1; break;
        case "12": result = 0; break;
        case "20": result = 0; break;
        case "21": result = 1; break;
        default: result = -1;
    }

    database.unshift([result, output1, output2]);

    displayResult(result, player1, output1, player2, output2);

}

function _int(val) {
    return parseInt(val);
}

function proba(a, b, c) {
    let base = a + b + c,
        rand = random(1, 100);
    a = _int(a / base * 100);
    b = _int(b / base * 100);
    c = _int(c / base * 100);
    if (rand <= a) {
        return 0;
    } else if (rand > a && rand <= a + b) {
        return 1;
    } else {
        return 2;
    }
}

let p1 = new createPlayer("玩家");

let p2 = new createPlayer("电脑");
p2.st = 0;
p2.ss = 0;
p2.cl = 0;

p2.AI = function () {
    if (database[0] && database[0][0] === 0) {
        if (database[0][1] === 0) {
            this.st += 1;
        } else if (database[0][1] === 1) {
            this.ss += 1;
        } else {
            this.cl += 1;
        }
    }
    if (database.length > 2) {
        return proba(this.ss, this.cl, this.st);
    } else {
        return random(0, 2);
    }
}

function handTest(h) {

    p1.AI = function () {
        return h;
    }

    VS(p1, p2);

    statisDisplay();
}


document.querySelector("#showOrNot").addEventListener("click", function () {
    let ele = document.querySelector(".statis");
    if (!this._show) {
        this.innerText = "关闭信息";
        ele.style.display = "block";
        this._show = true;
    } else {
        this.innerText = "展开信息";
        ele.style.display = "none";
        this._show = false;
    }
}, false)

document.querySelector("#clearH").addEventListener("click", function () {
    if (!confirm("清除历史数据？")) { return }
    database = [];
    stShow.innerText = "记录清除！";
    statisEle[0].innerText = "0";
    statisEle[1].innerText = "0%";
    statisEle[2].innerText = "0%";
    statisEle[3].innerText = "0%";
    p2.st = 0;
    p2.ss = 0;
    p2.cl = 0;
}, false)
