/*
这段代码原本是用来求解 1 ~ 10 十个数，可以在这十个数之间添加 + 号 和 - 号，最终结果必须等于100。
不添加的数字之间会变成一个整数
算法是直接暴力猜测的
*/
let bigList = [], sign = ["+", "-", "^"];

function generateItem(len) {
    let tmp;
    do {
        tmp = "";
        for (let i = 0; i < len; i++) {
            tmp += sign[parseInt(Math.random() * (2 - 0 + 1) + 0)];
        }
    } while (bigList.includes(tmp))
    bigList.push(tmp);
    return tmp;
}

function combine(s, numList) {
    let tmp = "";
    for (let i = 0; i < s.length; i++) {
        tmp += numList[i] + s[i];
    }
    tmp += numList[numList.length - 1];
    return tmp.split("^").join("");
}

function compute(str = "12345678", equal = 100) {
    console.log("running...")
    setTimeout(function () {
        let result;
        while (bigList.length < 3 ** (str.length - 1)) {
            result = combine(generateItem(str.length - 1), str);
            if (eval(result) === equal) {
                console.log(result + " = " + equal);
            }
        }
        console.log("END")
    }, 0)
}