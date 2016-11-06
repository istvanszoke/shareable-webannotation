$(function () {
    $('#paste').click(function () { pasteSelection(); });
    $('#block').click(function () { pasteParentBlock(); });
});
function pasteSelection() {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { method: "getSelection" },
        function (response) {
            var text = document.getElementById('text');
            text.innerHTML = response.data;
        });
    });
}

function pasteParentBlock() {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { method: "getBlock" },
        function (response) {
            var text = document.getElementById('text');
            text.innerHTML = response.data;
        });
    });
}

chrome.identity.getAuthToken({
    interactive: true
}, function (token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }
    var get = new XMLHttpRequest();
    get.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
    get.onload = function () {
        var id = JSON.parse(get.response).id;
        var name = JSON.parse(get.response).name;
    
        var post = new XMLHttpRequest();
        post.open('POST', 'http://localhost:5066/api/Users');
        post.setRequestHeader('Content-type', 'application/json');
        var user = new Object();
        user.id = id;
        user.name = name;
        var jsonUser = JSON.stringify(user);
        console.log(jsonUser);
        post.onreadystatechange = function () {
            console.log(post.responseText);
        }
        post.send(jsonUser);
    };
    get.send();
});


