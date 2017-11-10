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


