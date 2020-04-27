//产生随机数的对象，功能参考Python。
var random = {
    //产生0-1之间的随机数
    random: function () {
        return Math.random();
    },
    //产生n - m之间的随机浮点数
    uniform: function (begin, end) {
        if (begin > end) {
            [begin, end] = [end, begin];
        }
        return Math.random() * (end - begin) + begin;
    },
    //产生n - m之间的整数
    randint: function (begin, end) {
        if (begin > end) {
            [begin, end] = [end, begin];
        }
        return Math.floor(Math.random() * (end - begin + 1) + begin);
    },
    //从数组里随机选择一个数据
    choice: function (arr) {
        return arr[this.randint(0, arr.length - 1)];
    },
    //打乱数组里的元素排列顺序，返回的是一个新的数组
    shuffle : function (arr) {
        let index, tmp = [], len = arr.length;
        for (let i = 0; i < len; i ++) {
            index = this.randint(0, arr.length - 1);
            tmp.push(arr[index]);
            arr.splice(index, 1);
        }
        return tmp;
    },

    //获得一个递增的序列
    getAscendingList: function (begin, end, step) {
        let list = [];
        for (let i = begin; i <= end; i += step) {
            list.push(i);
        }
        return list;
    },
    //从递增序列里选择一个数据
    randrange: function (begin, end, step) {
        return this.choice(this.getAscendingList(begin, end, step));
    },
    //从数组里随机获得N个元素。
    sample: function (arr, num) {
        if (arr.length >= num) {
            return this.shuffle(arr).slice(0, num);
        } else {
            console.error("数组长度小于随机数个数")
        }
    }
};

//一个简单的定时器构造函数

function CreateTimer() {

    let second = 0, timerStop;

    let loop = function () {
        second += 1;
    };

    this.start = function () {
        timerStop = setInterval(loop.bind(this), 1000);
    };

    this.pause = function () {
        clearInterval(timerStop);
    };

    this.reset = function () {
        clearInterval(timerStop);
        second = 0;
    };

    this.getTime = function () {

        if (second < 60) {
            return second + "s"
        } else {
            return parseInt(second / 60) + ":" + (second % 60) + "s"
        }
    }
}

//--------------7-bag---------------------

function* randGenerator () {

    let bag = [];

    while (true) {

        if (bag.length === 0) {

            bag = [1,2,3,4,5,6,7];

            bag = random.shuffle(bag);
        }

        yield bag.pop();
    }
}

let randList = randGenerator();

function rand() {
    return randList.next().value;
}

function $(selector, context) {

    let core = Object.create(null);

    core.element = Object.create(null);

    if (typeof selector === "string") {
        core.element = (context || document).querySelector(selector);
    } else {
        core.element = selector;
    }

    core.ele = function () {
        return this.element;
    }

    core.hide = function () {
        this.element.style.display = "none";
    };

    core.show = function () {
        this.element.style.display = "block";
    };

    core.click = function (fn) {
        this.element.addEventListener("click", fn, false);
    };

    core.css = function (val) {

        let tmp;
        if (typeof val === "string") {
            val = val.split(" ").join("");
            tmp = val.split(":");
            this.element.style[tmp[0]] = tmp[1];
        } else {
            for (let key in val) {
                this.element.style[key] = val[key];
            }
        }
    }

    core.text = function (val) {
        this.element.innerText = val;
    };

    core.empty = function () {
        this.element.innerHTML = "";
    }

    return core;

}

function isPc() {
    let userAgentInfo = navigator.userAgent;
    let mobileDevice = 'Android,iPhone,SymbianOS,Windows Phone,iPad,iPod'.split(',');
    for (let item of mobileDevice) {
      if (userAgentInfo.indexOf(item) > -1) {
        return false;
      }
    }
    return true;
}
