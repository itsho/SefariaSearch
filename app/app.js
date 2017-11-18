'use strict';

angular.module("app", ["ngSanitize"]);

var textFromUserSelection = "";
chrome.tabs.executeScript(null, {
    code: "window.getSelection().toString();"
}, function (selection) {
    //document.getElementById("txtFromUser").innerHTML = selection[0];
    textFromUserSelection = selection[0];
});

var pasteToActiveWhatever = function (text) {

    chrome.tabs.executeScript(null, {
        code: "var tempTextToPaste ='" + text + "';"
    }, function () {
        chrome.tabs.executeScript(null, { file: 'app/pasteToActiveTab.js' });
    });
}

 