"use strict";

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
    getDoc("doclist.html", get);
}).then(function (text) {
    console.log(text);
})