var Javascript = document.querySelector("#js")
var Python = document.querySelector("#p")
var Java = document.querySelector("#j")


function incrementJS() {
    let currentValue = parseInt(Javascript.innerText);
    Javascript.innerText = currentValue + 1;
}

function incrementP() {
    let currentValue = parseInt(Python.innerText);
    Python.innerText = currentValue + 1;
}

function incrementJ() {
    let currentValue = parseInt(Java.innerText);
    Java.innerText = currentValue + 1;
}



setInterval(() => {
    incrementJS();
}, 2000)
    