$(function () {
    $('#register').click(function () { handleUser('register'); });
    $('#login').click(function () { handleUser('login'); });
    $('#paste').click(function () { pasteSelection(); });
    $('#block').click(function () { pasteParentBlock(); });
});

var url = 'http://localhost:5066/api/';
function handleUser(action) {
    chrome.identity.getAuthToken({
        interactive: true
    }, function (token) {
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            return;
        }
        var getToken = new XMLHttpRequest();
        getToken.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
        getToken.onload = function () {
            console.log(getToken.response);
            var id = JSON.parse(getToken.response).id;
            var name = JSON.parse(getToken.response).name;

            switch (action) {
                case 'register':
                    var post = new XMLHttpRequest();
                    post.open('POST', url + 'Users');
                    post.setRequestHeader('Content-type', 'application/json');
                    var user = new Object();
                    user.id = id;
                    user.name = name;
                    var jsonUser = JSON.stringify(user);

                    post.onload = function () {
                        welcomeUser(post, 201, 'Registration successful. Please log in', 'Error: User already exists.');
                    }
                    post.send(jsonUser);
                    break;
                case 'login':
                    var getUserById = new XMLHttpRequest();
                    getUserById.open('GET', url + 'Users/' + id);
                    getUserById.onload = function () {                       
                        welcomeUser(getUserById, 200, 'Welcome', 'Error: User does not exist.');
                    };
                    getUserById.send();
                    break;
            }
        };
        getToken.send();
    });
}

function welcomeUser(request, statusCode, text, errorText) {
    var welcome = document.getElementById('welcome');
    if (request.status == statusCode) {
        var name = JSON.parse(request.response).name;
        welcome.innerHTML = text + ' '+ name + ' !';;
    }
    else welcome.innerHTML = errorText;
}
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