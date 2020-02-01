//无声母
let A_Dicts = [
    'a:aa',
    'ai:ai',
    'an:an',
    'ang:ah',
    'ao:ao',
    'e:ee',
    'ei:ei',
    'en:en',
    'eng:eg',
    'er:er',
    'o:oo',
    'ou:ou'
];
//标准
let B_Dicts = [
    'iu:q',
    'ei:w',
    'e:e',
    'uan:r',
    'ue:t',
    've:t',
    'un:y',
    'sh:u',
    'u:u',
    'ch:i',
    'i:i',
    'o:o',
    'uo:o',
    'ie:p',
    'a:a',
    'iong:s',
    'ong:s',
    'ai:d',
    'en:f',
    'eng:g',
    'ang:h',
    'an:j',
    'ing:k',
    'uai:k',
    'iang:l',
    'uang:l',
    'ou:z',
    'ia:x',
    'ua:x',
    'ao:c',
    'zh:v',
    'ui:v',
    'v:v',
    'in:b',
    'iao:n',
    'ian:m'
];

function searchDicts(str, list) {
    for (let item of list) {
        if (item.split(':')[0] === str) {
            return item.split(':')[1]
        }
    }
}

function getStr(str, begin, end) {
    end = end - 1;
    let tmp = '';
    for (let i = begin; i <= end; i++) {
        tmp += str[i];
    }
    return tmp;
}

let zcs = ['zh', 'ch', 'sh'];

function seekFn(str) {
    let len = str.length, sm, ym;
    ym = searchDicts(str, A_Dicts);
    if (ym) { return ym }
    sm = getStr(str, 0, 2);
    if (zcs.includes(sm)) {
        sm = searchDicts(sm, B_Dicts);
        ym = searchDicts(getStr(str, 2, len), B_Dicts);
        return ym ? (sm + ym) : false;
    } else {
        sm = getStr(str, 0, 1);
        ym = searchDicts(getStr(str, 1, len), B_Dicts);
        if (/^[a-zA-Z]$/.test(sm) && ym) {
            return sm + ym;
        } else {
            return false;
        }
    }
}

function seekFnPlus(str) {
    let list = str.split(' ');
    if (!list.length) { return '无效输入' }
    let t, tmp = '';
    for (let item of list) {
        if (item !== '') {
            t = seekFn(item);
            tmp += (t ? (' ' + t) : ' **')
        }
    }
    return tmp;
}

let display = document.querySelector('#display');
let input = document.querySelector('#inputbox');

input.addEventListener('focus', function () {
    this.select();
})

document.querySelector('#seek').addEventListener('click', function () {
    let tmp = input.value
    if (tmp) {
        display.innerText = seekFnPlus(tmp);
    } else {
        display.innerText = "无效输入";
    }
}, false)

document.querySelector('#clear').addEventListener('click', function () {
    input.value = '';
    display.innerText = '';
}, false)
