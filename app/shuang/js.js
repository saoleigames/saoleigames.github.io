
'use strict';

const log = console.log;

function simpleClone(arr) {
  let cloneArr = [];
  for (let item of arr) {
      if (!Array.isArray(item)) {
          cloneArr.push(item);
      } else {
          cloneArr.push(simpleClone(item))
      }
  }
  return cloneArr
}

new Vue({

  el: '#shuangApp',

  data: {
    uiWenzi: '双',
    uiPinyin: 'shuang',
    uiInput: '',
    selected: '小鹤双拼',
    selectPy: '有拼音',
    tipsMsg: '提示键位 (单击这里)',
    isShow: true,
    fSize : 1
  },

  created() {
    //this.dict = shuangDict;
    this.nowKeyboard = keyboard.xiaohe;
    this.init();
    this.workDict.splice(this.shuangIndex, 1);
    this.zcs = ['zh', 'ch', 'sh'];
    this.shuangResult = this.seekShuangpinKey('shuang');
    this.tipsOn = false;
  },

  watch: {

    selected: function () {
      switch (this.selected) {
        case '小鹤双拼': (this.nowKeyboard = keyboard.xiaohe); break
        case '搜狗双拼': (this.nowKeyboard = keyboard.sogou); break
      }
      this.shuangResult = this.seekShuangpinKey(this.uiPinyin)
    },

    selectPy: function () {
      if (this.selectPy === '有拼音') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },

    uiInput: function () {
      if (this.uiInput.toLowerCase() === this.shuangResult) {
        setTimeout(() => {
          this.uiInput = '';
          this.ready();
        }, 60)
      } else if (this.uiInput.length >= 2) {
        setTimeout(() => {
          this.uiInput = '';
        }, 180);
      }
    }
  },

  methods: {

    ready: function () {
      let pyAndWenzi = this.randSelectedWordAndRemove();
      this.uiPinyin = pyAndWenzi[0];
      this.uiWenzi = pyAndWenzi[1];
      this.shuangResult = this.seekShuangpinKey(pyAndWenzi[0]);
      this.tipsMsg = '提示键位 (单击这里)';
      this.tipsOn = false;
    },

    randSelectedWordAndRemove: function () {
      let len = this.workDict.length - 1;
      if (len === 0) { this.resetDict() }
      return this.workDict.splice(this.randInt(0, len), 1)[0];
    },

    tipsFunc: function () {
      if (!this.tipsOn) {
        this.tipsMsg = this.uiWenzi + '[' + this.uiPinyin + ']' + ' : ' + this.shuangResult;
        this.tipsOn = true;
      } else {
        this.tipsMsg = '提示键位 (单击这里)';
        this.tipsOn = false;
      }
    },

    resetDict: function () {
      this.workDict = simpleClone(this.dict)
    },
    
    init: function () {
      this.dict = [];
      let smList, tmp;
      //外部变量shuangDict
      for (let sm in shuangDict) {
        smList = shuangDict[sm]
        for (let ym in smList) {
          tmp = smList[ym]
          this.dict.push([sm + ym, Array.isArray(tmp) ? tmp[0] : tmp])
          if (tmp === '双') {
            this.shuangIndex = this.dict.length - 1
          }
        }
      }
      this.workDict = simpleClone(this.dict);
    },

    searchDict: function (str, isNorm) {
      return isNorm ? this.nowKeyboard.norm[str] : this.nowKeyboard.nosm[str]
    },

    seekShuangpinKey: function (str) {
      let sm, ym;
      ym = this.searchDict(str, false);
      if (ym) { return ym }
      sm = str.slice(0, 2);
      if (this.zcs.includes(sm)) {
        sm = this.searchDict(sm, true);
        ym = this.searchDict(str.slice(2), true);
      } else {
        sm = str.slice(0, 1);
        ym = this.searchDict(str.slice(1), true);
      }
      return sm + ym;
    },

    randInt: function (b, e) {
      return Math.floor(Math.random() * (e - b + 1) + b);
    },

    clearFunc: function () {
      this.uiInput = '';
    },
  }
})
