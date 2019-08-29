
let log = console.log;
let originElelist = document.querySelectorAll("#table span");
let eleList = new Array(9);

function pushNumList(index, ...rest) {
    eleList[index] = [];
    rest.forEach(function (i) {
        eleList[index].push(originElelist[i])
        originElelist[i].setAttribute("contenteditable", "true");
    })
}

pushNumList(0, 0,1,2,9,10,11,18,19,20);
pushNumList(1, 3,4,5,12,13,14,21,22,23);
pushNumList(2, 6,7,8,15,16,17,24,25,26);
pushNumList(3, 27,28,29,36,37,38,45,46,47);
pushNumList(4, 30,31,32,39,40,41,48,49,50);
pushNumList(5, 33,34,35,42,43,44,51,52,53);
pushNumList(6, 54,55,56,63,64,65,72,73,74);
pushNumList(7, 57,58,59,66,67,68,75,76,77);
pushNumList(8, 60,61,62,69,70,71,78,79,80);

let n19 = ["1","2","3","4","5","6","7","8","9"];

function createNine () {
    return ["1","2","3","4","5","6","7","8","9"];
}
//返回一个或者两个数组内数据1~9以外的数据
function comparePoint (listA, listB) {
    let n19 = createNine();
    let listAB = listB ? listA.concat(listB) : listA;
    for (let i = 0; i < listAB.length; i ++) {
        if (n19.indexOf(listAB[i]) !== -1) {
            n19.splice(n19.indexOf(listAB[i]), 1);
        }
    }
    return n19;
}
//将字符转变为数组，数组数据类型为整数


//产生每个单元的核心对象
function initCube () {
    for (let i = 0; i < 9; i++) {

        numList[i] = [];

        for (let j = 0; j < 9; j++) {

            if (j === 2 || j === 5 || j === 8) {
                eleList[i][j].style.borderRight="1px solid #BBB"
            }

            if (i === 2 || i === 5 || i === 8) {
                eleList[i][j].style.borderBottom="1px solid #BBB"
            }

            numList[i].push({
                0 : 0,
                // 候选列表
                1 : 0,
                2 : 0,
                3 : 0,
                4 : 0,
                5 : 0,
                6 : 0,
                7 : 0,
                8 : 0,
                9 : 0,
                ele : eleList[i][j],
            })
        }
    }
}

let numList = new Array(9);
//运行初始化
initCube();
//3X3交叉排除遍历坐标数组


let num3RowLIst = [];
let num3ColList = [];

testInit();

function testInit() {

    for (let i = 0; i < 9; i++) {
        let tmpc3 = [];
        let tmp3 = [];
        for (let j = 0; j < 9; j++) {
            tmpc3.push(numList[j][i]);
            tmp3.push(numList[i][j]);
            if (tmp3.length === 3) {
                num3RowLIst.push(tmp3);
                num3ColList.push(tmpc3);
                tmp3 = [];
                tmpc3 = [];
            }
        }
    }
}





//载入时初始化数据
function exchangeValue (obj, strNum, base) {
    let d = base / (base * strNum.length);
    for (let i of strNum) {
        obj[i] += d
    }
}

function onlondCube(x, y, strNum, base) {

    exchangeValue(numList[x][y], strNum, base);
}
//程序的主要计算模块
function compute() {
    let tmp, move = [];
    setZero();
    computeRowCol();
    computeNine();
    computeThree();
    computeColThree();

    for (let i = 0; i < 9; i ++) {
        for (let j = 0; j < 9; j ++) {

            tmp = onlyOne(numList[i][j]);

            if (tmp && numList[i][j][0] === 0) {
                move.push([i, j]);
                numList[i][j][0] = tmp;
            } 
        }
    }
    return move;
}

function computeRowCol (move) {
    
    let tmp;
    for (let i = 0; i < 9; i++) {
        let rowList = [];
        for (let r = 0; r < 9; r ++) {
            if (numList[i][r][0] !== 0) {
                rowList.push(numList[i][r][0])
                let t = numList[i][r][0];
                allExclude(i,r);
                //t说明有数字，将t的候选项全部排出
                for (let ri = 0; ri < 9; ri ++) {
                    numList[i][ri][t] = NaN;
                }
            } 
        }

        // i 数值作为纵向深度，c为横向遍历
        for (let c = 0; c < 9; c++) {

            let colList = [];
            //横向发现为空
            if (numList[i][c][0] === 0) {

                for (let j = 0; j < 9; j++) {
                    //立即开始纵向遍历
                    if (numList[j][c][0] !== 0) {
                        //保存不为0的坐标
                        colList.push(numList[j][c][0]);
                        //同时将 t 的候选项全部排出
                        let t = numList[j][c][0];
                        //将这个数据的全部候选项排出
                        allExclude(j, c);
                        //将此列的这个数据全部排出
                        for (let ri = 0; ri < 9; ri ++) {
                            numList[ri][c][t] = NaN;
                        }
                    }
                }
                tmp = comparePoint(rowList, colList).join("");
                onlondCube(i, c, tmp, 9);
            }
        }
    }
};

function allExclude (x, y) {
    for (let i = 1; i <= 9; i++) {
        numList[x][y][i] = NaN;
    }
}

function computeNine () {
     //rowCube1
     simpleNine(0, 2, 0, 2);
     simpleNine(3, 5, 0, 2);
     simpleNine(6, 8, 0, 2);
     //rowCube2
     simpleNine(0, 2, 3, 5);
     simpleNine(3, 5, 3, 5);
     simpleNine(6, 8, 3, 5);
     //rowCube3
     simpleNine(0, 2, 6, 8);
     simpleNine(3, 5, 6, 8);
     simpleNine(6, 8, 6, 8);
 
}

function computeThree () {
    //row1
    search3(0, 4, 5, 7, 8);
    search3(1, 3, 5, 6, 8);
    search3(2, 3, 4, 6, 7);
    //row2
    search3(3, 1, 2, 7, 8);
    search3(4, 0, 2, 6, 8);
    search3(5, 0, 1, 6, 7);
    //row3
    search3(6, 1, 2, 4, 5);
    search3(7, 0, 2, 3, 5);
    search3(8, 0, 1, 3, 4);
    //row4
    search3(9, 13, 14, 16, 17);
    search3(10, 12, 14, 15, 17);
    search3(11, 12, 13, 15, 16);
    //row5
    search3(12, 10, 11, 16, 17);
    search3(13, 9, 11, 15, 17);
    search3(14, 9, 10, 15, 16);
    //row6
    search3(15, 10, 11, 13, 14);
    search3(16, 9, 11, 12, 14);
    search3(17, 9, 10, 12, 13);
    //row7
    search3(18, 22, 23, 25, 26);
    search3(19, 21, 23, 24, 26);
    search3(20, 21, 22, 24, 25);
    //row8
    search3(21, 19, 20, 25, 26);
    search3(22, 18, 20, 24, 26);
    search3(23, 18, 19, 24, 25);
    //row9
    search3(24, 19, 20, 22, 23);
    search3(25, 18, 20, 21, 23);
    search3(26, 18, 19, 21, 22);
    
}

function computeColThree () {
    //col1
    search3c(0, 4, 7, 5, 8);
    search3c(1, 3, 6, 5, 8);
    search3c(2, 3, 6, 4, 7);
    //col2
    search3c(3, 1, 7 , 2, 8);
    search3c(4, 0, 6, 2, 8);
    search3c(5, 0, 6, 1, 7);
    //col3
    search3c(6, 1, 4, 2, 5);
    search3c(7, 0, 3, 2, 5);
    search3c(8, 0, 3, 1, 4);
    //col4
    search3c(9, 13, 16, 14, 17);
    search3c(10, 12, 15, 14, 17);
    search3c(11, 12, 15, 13, 16);
    //col5
    search3c(12, 10, 16, 11, 17);
    search3c(13, 9, 15, 11, 17);
    search3c(14, 9, 15, 10, 16);
    //col6
    search3c(15, 10, 13, 11, 14);
    search3c(16, 9, 12, 11, 14);
    search3c(17, 9, 12, 10, 13);
    //col7
    search3c(18, 22, 25, 23, 26);
    search3c(19, 21, 24, 23, 26);
    search3c(20, 21, 24, 22, 25);
    //col8
    search3c(21, 19, 25, 20, 26);
    search3c(22, 18, 24, 20, 26);
    search3c(23, 18, 24, 19, 25);
    //col9
    search3c(24, 19, 22, 20, 23);
    search3c(25, 18, 21, 20, 23);
    search3c(26, 18, 21, 19,22);
}


//判断对象内打分是否唯一，如果是，返回唯一的值，如果不是，返回false
function onlyOne(objList) {
    let s = 0, index;
    for (let i = 1; i <= 9; i++) {
        if (!(isNaN(objList[i]))) {
            s += 1;
            index = i;
        }
        if (s > 1) { break }
    }
    return s === 1 ? index : false;
}


//检查结果是否合法，是true，否false
function checkResult() {

    let indexR, indexC, rowa, cola, count = 0;

    for (let i = 0; i < 9; i++) {

        rowa = [1,2,3,4,5,6,7,8,9];

        cola = [1,2,3,4,5,6,7,8,9];
       
        for (let j = 0; j < 9; j++) {
            indexR = rowa.indexOf(numList[i][j][0]);
            if (indexR === -1) {
                return false;
            } else {
                if (indexR > -1) {
                    rowa.splice(indexR, 1, undefined);
                }
            }
            indexC = cola.indexOf(numList[j][i][0]);
            if (indexC === -1) {
                return false;
            } else {
                if (indexC > -1) {
                    cola.splice(indexC, 1, undefined);
                }
            }
        }
        if (rowa.every((n) => n === undefined) && cola.every((n) => n === undefined)) {
            count += 1;
        } else {
            return false;
        }
    }
    return count === 9 ? true : false;
}


let list9 = [];
//通过这个函数获取一个9宫格的列表，为isOk函数用。。。这很傻逼，我知道。

function simpleNine (rowStart, rowEnd, colStart, colEnd) {

    let nineList = [];
    let L9 = [];

    for (let i = rowStart; i <= rowEnd; i++) {
        for (let j = colStart; j <= colEnd; j++) {
            if (numList[j][i][0] !== 0) {
                nineList.push(numList[j][i][0])
            }
            //么么哒
            list9.length !== 9 && L9.push([i, j]);
        }
    }

    if (list9.length !== 9) {
        list9.push(L9);
    }

    let tmp = nineList.length ? comparePoint(nineList).join("") : false;

    if(tmp) {

        for (let i = rowStart; i <= rowEnd; i++) {
            for (let j = colStart; j <= colEnd; j++) {
                if (numList[j][i][0] === 0) {
                    onlondCube(j, i, tmp, 9);
                } else {
                    //有数字
                    let t = numList[j][i][0];
                    allExclude(j, i);
                    for (let i = rowStart; i <= rowEnd; i++) {
                        for (let j = colStart; j <= colEnd; j++) {
                            numList[j][i][t] = NaN;
                        }
                    }
                }
            }
        }
    }
}


//test
function foo(rowStart, rowEnd, colStart, colEnd) {
    for (let i = rowStart; i <= rowEnd; i++) {
        for (let j = colStart; j <= colEnd; j++) {
            log(j + " : " + i)
        }
    }
}

//读取模版并保存模版
document.querySelector("#onloadAndSaveTemplate").onclick = function () {
    let tmp = new Array(9);
    for (let i = 0; i < eleList.length; i++) {
        tmp[i] = [];
        for (let j = 0; j < eleList[i].length; j++) {
            numList[i][j][0] = +(eleList[i][j].innerText);
            tmp[i].push(eleList[i][j].innerText);
        }
    }
    let fileId = document.querySelector("#fileId").value;
    if (templateData.data[fileId]) {
        alert("文件ID已存在")
    } else {
        templateData.data[fileId] = tmp;
        saveData(templateData);
        alert("保存文件成功")
    }
}

function saveData() {
    if (window.localStorage) {
        localStorage.setItem("templateData", JSON.stringify(templateData))
    } else {
        console.error("存储数据失败 程序未找到 window.localStorage")
    }
}

let templateData = JSON.parse(localStorage.getItem("templateData"));

if (templateData === null) {
    templateData = {
        data : {}
    }
}

//读取模版
function onloadTemplate() {
    let fileId = document.querySelector("#fileId").value;
    let tmpfile = templateData.data[fileId];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            numList[i][j][0] = tmpfile[i][j];
            if (numList[i][j][0] !== undefined) {
                eleList[i][j].innerText = numList[i][j][0];
            }
        }
    }

    readTable();
}

//读入模版
document.querySelector("#onload").onclick = function () {
    onloadTemplate();
}

function readTable () {
    let ept = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            numList[i][j][0] = +(eleList[i][j].innerText);
            if (ept) {
                if (numList[i][j][0] > 0) {
                    ept = false;
                }
            }
        }
    }
    //isOk的方块坐标是计算时产生的，而第一次执行readTable函数计算并未开始，所以在在合法计算上，是有问题滴！
    return isOk() && !ept;
}

//-----------------------------------------------

function tmpFunc (val, arr) {
    for (let i = 1; i <=9; i++) {
        if (i != val) {
            arr[i] = NaN;
        }
    }
}
//交叉对比
function seekThree(val, alt, art, alb, arb) {

    let lt = false, rt = false, lb = false, rb = false;

    let vlt = 0, vrt = 0, vlb = 0, vrb = 0;

    for (let i = 0; i < 3; i++) {
        //左上
        if (alt[i][0] === val) {
            lt = true;
        } else if (alt[i][0] === 0) {
            vlt += 1;
        }
        //右上
        if (art[i][0] === val) {
            rt = true;
        } else if (art[i][0] === 0) {
            vrt += 1;
        }
        //左下
        if (alb[i][0] === val) {
            lb = true;
        } else if (alb[i][0] === 0) {
            vlb += 1;
        }
        //右下
        if (arb[i][0] === val) {
            rb = true;
        } else if (arb[i][0] === 0) {
            vrb += 1;
        }
    }

    if (lt || rt || lb || rb) {
        //左上对右下
        if (lt === true && rb === false) {
            for (let i = 0; i < 3; i++) {
                if (arb[i][0] === 0 && vrb === 1) {
                    tmpFunc(val, arb[i]);
                } else if (arb[i][0] === 0) {
                    arb[i][val] += 3 / (3 * vrb);
                }
            }
        }
        //右上对左下
        if (rt === true && lb === false) {
            for (let i = 0; i < 3; i++) {
                if (alb[i][0] === 0 && vlb === 1) {
                    tmpFunc(val, alb[i]);
                } else if (alb[i][0] === 0) {
                    alb[i][val] += 3 / (3 * vlb);
                }
            }
        }
        //左下对右上
        if (lb === true && rt === false) {
            for (let i = 0; i < 3; i++) {
                if (art[i][0] === 0 && vrt === 1) {
                    tmpFunc(val, art[i]);
                } else if (art[i][0] === 0) {
                    art[i][val] += 3 / (3 * vrt);
                }
            }
        }
        //右下对左上
        if (rb === true && lt === false) {
            for (let i = 0; i < 3; i++) {
                if (alt[i][0] === 0 && vlt === 1) {
                    tmpFunc(val, alt[i]);
                } else if (alt[i][0] === 0) {
                    alt[i][val] += 3 / (3 * vlt);
                }
            }
        }

    } else {
        search3_s(val, alt, vlt);
        search3_s(val, art, vrt);
        search3_s(val, alb, vlb);
        search3_s(val, arb, vrb);
    }
}

//交叉对比，全部为false
function search3_s (val, arr, empty) {
    arr.forEach(function (obj) {
        if (obj[0] === 0) {
            obj[val] += 6 / (6 * empty);
        }
    })
}
//横向交叉入口
function search3 (arrId, ilt, irt, ilb, irb) {
    num3RowLIst[arrId].forEach(function (obj) {
        if (obj[0] !== 0) {
            seekThree(obj[0], num3RowLIst[ilt], num3RowLIst[irt], num3RowLIst[ilb], num3RowLIst[irb])
        }      
    })
}
//总线交叉入口
function search3c (arrId, ilt, irt, ilb, irb) {
    num3ColList[arrId].forEach(function (obj) {
        if (obj[0] !== 0) {
            seekThree(obj[0], num3ColList[ilt], num3ColList[irt], num3ColList[ilb], num3ColList[irb])
        }      
    })
}


let maxList = [];


document.querySelector("#gogogo").onclick = testGuess2;

let getRange;

function testGuess2() {

    getRange = +(document.querySelector("#getRange").value);

    if (!readTable()) {
        alert("输入错误！")
        return;
    }

    try { 

        while (!checkResult()) {
            if (!compute().length) {
                if (haveEmpty()) {
                    getMax();
                }
                setItem();
            }
        }

    } catch {

        maxList = [];
        initCube();
        num3ColList = [];
        num3RowLIst = [];
        testInit();
        alert("哈哈，算不出来，将范围数值加 1 再试试！");
        return;
    }

    alert("吼吼！算出来了！");

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            eleList[i][j].innerText = numList[i][j][0];
        }
    }
}

function haveEmpty() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (numList[i][j][0] === 0) {
                return true;
            }
        }
    }
    return false;
}

function setItem() {
    deleteLine();    
    let one = maxList[maxList.length - 1][0].shift();
    deleteLine();
    numList[one[0]][one[1]][0] = one[2];
}


function deleteLine() {
    if (maxList[maxList.length - 1][0].length === 0) {
        maxList.pop()
    } else {
        numList = clone(maxList[maxList.length - 1][1]);
    }
}

function getOneMin (arr) {

    if (arr.length === 1) { return [0, arr[0]] }

    let tmp = arr[0];

    let t = 0;
    
    for (let i = 1; i < arr.length; i++) {

        if (tmp[3] < arr[i][3]) {

            tmp[0] = arr[i][0];
            tmp[1] = arr[i][1];
            tmp[2] = arr[i][2];
            tmp[3] = arr[i][3];

            t = i;
        }
    }

    return [t, tmp];
}

function getOneMax(arr) {

    let t = 0, index;

    for (let i = 1; i <= 9; i++) {
        if (!isNaN(arr[i]) && arr[i] > t) {
            t = arr[i];
            index = i;
        }
    }
    //      序列  数值

    return index ? [index, t] : false;
}

//求最大的五个值。。。
function getMax() {

    let t, obj = Object.create(null);

    obj[0] = [];

    let tmp = [];

    for (let i = 0; i < 9; i++) {

        for (let j = 0; j < 9; j++) {

            t = getOneMax(numList[i][j]);

            if (tmp.length < getRange) {

                if (t.length) {
                    tmp.push([i, j, t[0], t[1]]);
                }

            } else {

                let m = getOneMin(tmp);

                if (t[1]  > m[1][3]) {
                    tmp.splice(m[0], 1, [i, j, t[0], t[1]])
                }
            } 
        }
    }

    tmp.sort((a, b) => b[3] - a[3])

    if (tmp.length) {
        obj[0] = tmp;
        obj[1] = clone(numList);
        maxList.push([obj[0], obj[1]])
    } 
}

function isOk() {

    let row, col, rc, cr;

    for (let i = 0; i < 9; i++) {
        row = [], col = [];
        for (let j = 0; j < 9; j ++) {
            rc = numList[i][j][0];
            cr = numList[j][i][0];
            if (rc !== 0 && row.includes(rc)) {
                return false;
            } else {
                row.push(rc);
            }

            if (cr !== 0 && col.includes(cr)) {
                return false;
            } else {
                col.push(cr);
            }
        }
    }

    let t9, nine;

    for (let L9 of list9) {
        nine = [];
        for (let i of L9) {
            t9 = numList[i[0]][i[1]][0];
            if (t9 !== 0 && nine.includes(t9)) {
                return false;
            } else {
                nine.push(t9);
            }
        }  
    }

    return true;

}

/*
function isOk() {
    let rowCount, colCount, nineCount;
    let rc, cr;
    for (let i = 0; i < 9; i++) {
        rowCount = undefined;
        colCount = undefined;
        for (let j = 0; j < 9; j++) {

            rc = numList[i][j][0];
            cr = numList[j][i][0];

            if (rc !== 0 && rc === rowCount) {
                return false;
            } else if ( rc !== 0 ) {
                rowCount = rc;
            }

            if (cr !== 0 && cr === colCount) {
                return false;
            } else if ( cr !== 0 ) {
                colCount = cr;
            }
        }
    }

    let t9;

    for (let l9 of list9) {
        nineCount = undefined;
        for (let i of l9) {
            t9 = numList[i[0]][i[1]][0];
            if (t9 !== 0 && t9 === nineCount) {
                return false;
            } else if ( t9 !== 0) {
                nineCount = t9;
            }
        }  
    }

    return true;
}
*/

function setZero() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            for (let k = 1; k <= 9; k++) {
                numList[i][j][k] = 0;
            }
        }
    }
}

function clone(obj) {

    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }


    if (Array.isArray(obj)) {
        var copy = [],
            len = obj.length;
        for (var i = 0; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }


    if (typeof obj === "object") {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }
    console.error("有不支持的格式")
}

document.querySelector("#clearTable").addEventListener("click", function () {

    maxList = [];
    initCube();
    num3ColList = [];
    num3RowLIst = [];
    testInit();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            eleList[i][j].innerText = "";
        }
    }

}, false)
