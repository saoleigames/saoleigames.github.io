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
    console.log(addList);
    for (var item of addList) {

        if (item) {
            console.log(item);
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

