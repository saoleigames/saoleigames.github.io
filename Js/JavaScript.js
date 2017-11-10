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
        } else {
            console.log("......")
        }
    }
    request.open("GET", addr);
    request.send();
}

new Promise(function (get) {
    getDoc("Docs/docslist.html", get);
}).then(function (text) {
    var addList = text.split(/\s*|\n*/).join("").split("</p>").map((s)=> s.slice(3));
    for (var item of addList) {
        if (item) {
            new Promise(function (get) {
                getDoc(item, get);
            }).then(function (text) {
                var textNode = document.createTextNode(text);
                content.appendChild(textNode);
            })
        }
    }
})

