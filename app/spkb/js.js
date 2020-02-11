
let weiruan = {

    nosm : {
        'a' : 'oa',
        'ai' : 'ol',
        'an' : 'oj',
        'ang' : 'oh',
        'ao' : 'ok',
        'e' : 'oe',
        'ei' : 'oz',
        'en' : 'of',
        'eng' : 'og',
        'er' : 'or',
        'o' : 'oo',
        'ou' : 'ob'
    },

    norm : {
        'iu' : 'q',
        'ia' : 'w',
        'ua' : 'w',
        'e' : 'e',
        'er' : 'r',
        'uan' : 'r',
        'ue' : 't',
        'uai' : 'y',
        'v' : 'y',
        'sh' : 'u',
        'u' : 'u',
        'ch' : 'i',
        'i' : 'i',
        'o' : 'o',
        'uo' : 'o',
        'un' : 'p',
        'a' : 'a',
        'iong' : 's',
        'ong' : 's',
        'iang' : 'd',
        'uang' : 'd',
        'en' : 'f',
        'eng' : 'g',
        'ang' : 'h',
        'an' : 'j',
        'ao' : 'k',
        'ai' : 'l',
        'ing' : ';',
        'ei' : 'z',
        'ie' : 'x',
        'iao' : 'c',
        'zh' : 'v',
        'ui' : 'v',
        've' : 'v',
        'ou' : 'b',
        'in' : 'n',
        'ian' : 'm'
    }
}

let xiaohe = {

    nosm : {
      'a': 'aa',
      'ai': 'ai',
      'an': 'an',
      'ang': 'ah',
      'ao': 'ao',
      'e': 'ee',
      'ei': 'ei',
      'en': 'en',
      'eng': 'eg',
      'er': 'er',
      'o': 'oo',
      'ou': 'ou'
    },
  
    norm : {
      'iu': 'q',
      'ei': 'w',
      'e': 'e',
      'uan': 'r',
      'ue': 't',
      've': 't',
      'un': 'y',
      'sh': 'u',
      'u': 'u',
      'ch': 'i',
      'i': 'i',
      'o': 'o',
      'uo': 'o',
      'ie': 'p',
      'a': 'a',
      'iong': 's',
      'ong': 's',
      'ai': 'd',
      'en': 'f',
      'eng': 'g',
      'ang': 'h',
      'an': 'j',
      'ing': 'k',
      'uai': 'k',
      'iang': 'l',
      'uang': 'l',
      'ou': 'z',
      'ia': 'x',
      'ua': 'x',
      'ao': 'c',
      'zh': 'v',
      'ui': 'v',
      'v': 'v',
      'in': 'b',
      'iao': 'n',
      'ian': 'm'
    }
}

let sogou = {

    nosm : {
        'a' : 'oa',
        'e' : 'oe',
        'o' : 'oo',
        'ai' : 'ol',
        'ei' : 'oz',
        'ou' : 'ob',
        'an' : 'oj',
        'en' : 'of',
        'ang' : 'oh',
        'eng' : 'og',
        'ao' : 'ok',
        'er' : 'or'
      },
      //标准
      norm : {
        'iu' : 'q',
        'ia' : 'w',
        'ua' : 'w',
        'e' : 'e',
        'er' : 'r',
        'uan' : 'r',
        'ue' : 't',
        've' : 't',
        'uai' : 'y',
        'v' : 'y',
        'sh' : 'u',
        'u' : 'u',
        'ch' : 'i',
        'i' : 'i',
        'o' : 'o',
        'uo' : 'o',
        'un' : 'p',
        'a' : 'a',
        'iong' : 's',
        'ong' : 's',
        'iang' : 'd',
        'uang' : 'd',
        'en' : 'f',
        'eng' : 'g',
        'ang' : 'h',
        'an' : 'j',
        'ao' : 'k',
        'ai' : 'l',
        'ing' : ';',
        'ei' : 'z',
        'ie' : 'x',
        'iao' : 'c',
        'zh' : 'v',
        'ui' : 'v',
        'ou' : 'b',
        'in' : 'n',
        'ian' : 'm'
      }
}


function htmlKeyboard (id, obj, name) {

    let kele = document.querySelector(id);

    kele.innerHTML = `
        <div class="keyboard">
        <div class='k-box'>
            <div class="k-topbar">
                <span class="name"></span>
            </div>
            <div class="k-border">
                <div class="l1">
                    <span></span>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="l2">
                    <span></span>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="l3">
                    <span></span>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <table>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>
    </div>
    `
    kele.querySelector('.name').innerText = name;

    function toArray(list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret
    }

    function letKeyConvertEaseObj(obj) {
        let k_dict = {};
        for (let key in obj) {
            if (!k_dict[obj[key]]) {
                k_dict[obj[key]] = [];
            }
            k_dict[obj[key]].push(key);
        }
        return k_dict;
    }

    function letNoSM_ToArray(obj) {
        let nsm = [];
        for (let i = 0; i < z0b.length; i++) {
            nsm.push([z0b[i],obj[z0b[i]]]);
        }
        return nsm;
    }

    let zmb = 'QWERTYUIOPASDFGHJKL;ZXCVBNM';
    let z0b = 'a,ai,an,ang,ao,e,ei,en,eng,er,o,ou'.split(',')
    let smb = 'b,p,m,f,d,t,n,l,g,k,h,j,q,x,zh,ch,sh,r,z,c,s,y,w'.split(',')
    let zcs = ['ch', 'sh', 'zh'];
    let zeroSM_arr = letNoSM_ToArray(obj.nosm); //格式为数组
    let mainKeyObj = letKeyConvertEaseObj(obj.norm); //格式为对象

    let k_l1 = toArray(document.querySelectorAll(id + ' .k-border .l1>div'));
    let k_l2 = toArray(document.querySelectorAll(id + ' .k-border .l2>div'));
    let k_l3 = toArray(document.querySelectorAll(id + ' .k-border .l3>div'));
    let akb = k_l1.concat(k_l2, k_l3);
    let sms = toArray(document.querySelectorAll(id + ' table tr td'));
    
    sms.forEach(function (item,i) {
        let s = zeroSM_arr[i];
        item.innerHTML = s[0] +  '&nbsp&nbsp<b>' + s[1] + '</b>';
    })
    let t,s;
    for (let i = 0; i < akb.length; i++) {
        s = zmb[i].toLowerCase();
        if (smb.includes(s)) {
            zzz = s;
        } else {
            zzz = '';
        }
        t = mainKeyObj[s];
        if (t) {
            zcs.forEach((s, i) => {
                let ii = t.indexOf(s);
                if (ii >= 0 ) {
                    zzz = '<b style="color : orange">' + t[ii] + '</b>';
                    t.splice(ii, 1);
                }
            })
            if (t.length === 1) {
                t = '<i>' + t + '</i>';
            } else {
                t = '<i>' + t[0] + '</i><i>' + t[1] + '</i>';
            }
        }
        akb[i].innerHTML = '<div><b>' + zmb[i] + '</b><span style="color : #ccc">' + zzz + '</span></div><div>' + (t ? t : '') + '</div>';
    }   
}


htmlKeyboard('#xiaohe', xiaohe, '小鹤双拼键位图')
htmlKeyboard('#sogou', sogou, '搜狗双拼键位图')
htmlKeyboard('#weiruan', weiruan, '微软双拼键位图')


