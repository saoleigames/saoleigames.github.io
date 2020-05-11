
// 如果要调整刻度，只需要修改数组数据，刻度递增量为1，默认值为数组 length 值的一半。不要忘了修改UI的范围提示。
// 1 ~ 10
const firstDelayList = [60,70,80,90,100,110,120,130,140,150]
// 1 ~ 10
const repeDelayList = [14,16,18,20,22,24,26,28,30,32]

const QSS = (name, doc) => {
    doc = doc || document;
    return doc.querySelector(name)
}

function MakeRange(name, ruler) {

    const el = QSS(name);
    el.innerHTML = `<b></b><input type='number'/><b></b>`;
    this.input = QSS('input[type="number"]', el);

    this.ruler = ruler;
    this.min = 1;
    this.max = this.ruler.length;
    
    this.getValue = function () {
        let v = +this.input.value;
        if (!(v >= this.min && v <= this.max)) {
            return false;
        } else {
            return this.ruler[this.input.value - 1];
        }
    }

    this.show = function (val) {
        this.input.value = this.ruler.indexOf(val) + 1;
        this.input.title = this.getValue() + '毫秒'
    }

    QSS('b:nth-child(1)', el).addEventListener('click', () => {
        let v = +this.input.value;
        if (v > this.min) { 
            v -= 1
            this.input.value = v
            this.input.title = this.getValue() + '毫秒'
        }
    })

    QSS('b:nth-child(3)', el).addEventListener('click', () => {
        let v = +this.input.value
        if (v < this.max) { 
            v += 1
            this.input.value = v
            this.input.title = this.getValue() + '毫秒'
        }
    })
}
//克隆数据
function clone(obj) {

    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (Array.isArray(obj)) {
        let copy = [];
        for (let i = 0; i < obj.length; i++) {
            copy[i] = clone(obj[i])
        }
        return copy;
    }

    if (typeof obj === "object") {
        let copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr])
            }
        }
        return copy;
    }
}