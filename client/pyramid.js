if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

let resultsDiv = document.getElementsByClassName("output");

function ready() {
    let buttons = document.getElementsByClassName("btnWord");
    for (let button of buttons) {
        button.addEventListener('click', breakdownWord)
    }

    resultsDiv[0].style.visibility = "hidden";

    let inputField = document.getElementById("checkInput");
    inputField.addEventListener("keyup", (event) => {
        // Execute a function when the user releases a key on the keyboard
        // Number 13 is the "Enter" key on the keyboard
        if (event.key === 'Enter') {
            event.preventDefault(); // cancel the default action
            document.getElementById("checkBtn").click(); // trigger the button element with a click
        }
    });
}

let baseUrl = "http://localhost:8000/api/v1/pyramid";
function invokeRestCall(word) {
    let http = new XMLHttpRequest();
    http.open("POST", baseUrl + "/word", true);
    http.setRequestHeader('Content-type', 'text/plain');
    http.timeout = 15000; // timeout in ms, 15 seconds
    http.ontimeout = () => {
        errorText = "The request for " + url + " with '" + word + "' timed out.";
        console.error(errorText);
        requestFailed(errorText);
    };
    http.onerror = () => { // only triggers if the request couldn't be made at all
        errorText = "The request for " + url + " with '" + word + "' failed.";
        console.error(errorText);
        requestFailed(errorText);
    };
    http.onload = () => {
        if (http.readyState == 4 /*DONE*/ && http.status == 200) {
            requestSucceeded(word, http.responseText);
        }
    };
    http.send(word);
}

function requestFailed(responseText) {
    let rowString = "<div class='result'>" + responseText + "</div>";
    document.getElementsByClassName("output")[0].innerHTML += rowString;
}

function requestSucceeded(word, responseText) {
    let resultString = internalBreakdown(...word);
    let adjustedText = responseText.replace("not ", "<b style='color: red'>not</b> ");
    if (adjustedText == responseText) {
        adjustedText = responseText.replace("is ", "<b style='color: green'>is</b> ");
    }
    let rowString = "<div class='result'>" + adjustedText + " [" + resultString + "]</div>";
    document.getElementsByClassName("output")[0].innerHTML += rowString;
}

let internalBreakdown = (...word) => {
    console.log(word);
    let wordMap = new Map();
    for (let letter of word) {
        if (wordMap.has(letter)) {
            wordMap.set(letter, wordMap.get(letter) + 1);
        } else {
            wordMap.set(letter, 1);
        }
    }
    let index = 0;
    let outputString = "";
    for (let entry of wordMap.entries()) {
        if (index++ > 0)
            outputString += ", ";
        outputString += `${entry[0]}:${entry[1]}`;
    }
    console.log(outputString);
    return outputString;
}

function breakdownWord(event) {
    let button = event.target;
    let word = document.getElementsByClassName("inputWord")[0].value;
    invokeRestCall(word);
    let inputField = document.getElementsByClassName("inputWord")[0];
    inputField.value = "";
    inputField.focus();
    resultsDiv[0].style.visibility = "visible";
}
