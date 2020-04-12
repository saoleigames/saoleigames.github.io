
"use strict";

function select (s) {
    return new select.fn.init(s);
}

select.fn = select.prototype;

select.fn.init = function (s) {
    var nodeList = document.querySelectorAll(s)
    this.length = nodeList.length;
    for (var i = 0; i < this.length; i++) {
        this[i] = nodeList[i];
    }
}

select.fn.init.prototype = select.prototype;

select.fn.each = function (fn) {
    var length = this.length;
    if (length === 1) {
        fn.call(this[0]);
    } else {
        for (var i = 0; i < length; i++) {
            fn.call(this[i]);
        }
    }
}

select.fn.hide = function () {
    this.each(function () {
        this.style.display = "none";
    })
    return this;
}

select.fn.show = function () {
    this.each(function () {
        this.style.display = "block";
    })
    return this;
}

select.fn.css = function (css) {
  
    var cssList = css.split(/\s*/).join("").split(",");

    cssList = cssList.map(function (c) {
        return c.split(":");
    })

    this.each(function () {
        for (var item of cssList) {
            this.style[item[0]] = item[1];
        }
    })

    return this;
}

select.fn.eq = function (n) {

    var newObject = {};

    if (this[n]) {
        newObject[0] = this[n];
    }

    Object.setPrototypeOf(newObject, Object.getPrototypeOf(this));

    newObject.length = 1;

    return newObject;
}

select.fn.click = function (fn) {
    this.each(function () {
        this.addEventListener("click", fn.bind(this), false);
    })
    return this;
}

"use strict";

var content = document.querySelector(".content .article");

function getDoc(addr, get) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                get(request.responseText);
            } else {
                console.log(request.status);
            }
        }
    }
    request.open("GET", addr);
    request.send();
}

new Promise(function (get) {
    getDoc("Docs/docslist.html", get);
}).then(function (text) {
    var addrList = text.split(/\s*|\n*/).join("").split("</p>").map((s)=> s.slice(3));    
    for (var item of addrList) {
        if (item) {
            new Promise(function (get) {
                getDoc(item, get);
            }).then(function (text) {
                var doc = document.createElement("div");
                doc.setAttribute("class", "doc");
                doc.innerHTML = text;
                content.appendChild(doc);
            })
        }
    }
})
