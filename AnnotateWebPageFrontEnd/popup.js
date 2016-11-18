$(function () {
    $('#document').ready(pageOnload);
    $('#register').click(function () { handleUser('register'); });
    $('#login').click(function () { handleUser('login'); });
    $('#paste').click(function () { pasteSelection(); });
    $('#select').click(function () { selectHighlight(); });
    $('#getmyannotations').click(function () { getAnnotation(); });
});

var url = 'http://localhost:5066/api/';
var userId = '';
var userName = '';
function pageOnload() {
    console.log(localStorage.getItem("userId"));
    var welcome = document.getElementById('welcome');
    if (localStorage.getItem("userId") != null)
    {
        userId = localStorage.getItem("userId");
        userName = localStorage.getItem("userName");
        welcome.innerHTML = 'Welcome' + ' ' + userName + ' !';
    }
    else
    {

        welcome.innerHTML = 'Welcome to WebAnnotator!';
    }
}
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
            userId = userId = JSON.parse(getToken.response).id;
            userName = JSON.parse(getToken.response).name;

            if (localStorage.getItem("userId") === null) {
                localStorage.setItem("userId", userId);
                localStorage.setItem("userName", userName);
            }

            switch (action) {
                case 'register':
                    var post = new XMLHttpRequest();
                    post.open('POST', url + 'Users');
                    post.setRequestHeader('Content-type', 'application/json');
                    var user = new Object();
                    user.id = userId;
                    user.name = userName;
                    var jsonUser = JSON.stringify(user);

                    post.onload = function () {
                        welcomeUser(post, 201, 'Registration successful. Please log in', 'Error: User already exists.');
                    }
                    post.send(jsonUser);
                    break;
                case 'login':
                    var getUserById = new XMLHttpRequest();
                    getUserById.open('GET', url + 'Users/' + userId);
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
        var name = JSON.parse(request.response);
        welcome.innerHTML = text + ' '+ name + ' !';
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
            /*
            chrome.tabs.sendMessage(tab[0].id,
                                    {method: "select",
                                     start: respone.start,
                                     end: respone.end},
                                    function (response2){

                                    }
                                    )
            */
        });
    });
}

function highlightInsertionCallback(request, statusCode, text, errorText){
    var text = document.getElementById('text');
    text.innerHtml = "status: " + statusCode;
}

function selectHighlight() {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tab) {
        chrome.tabs.sendMessage(tab[0].id, { method: "getBlock" },
        function (response) {
            if (userId !== ''){
                var post = new XMLHttpRequest();
                post.open('POST', url + 'Highlights');
                post.setRequestHeader('Content-type', 'application/json');

                console.log(response);
                var highlight = new Object();
                highlight.id = 0;
                highlight.user_id = userId;
                highlight.web_page = tab[0].url;
                highlight.start = JSON.stringify(response.start);
                highlight.end = JSON.stringify(response.end);
                var jsonHighlight = JSON.stringify(highlight);
                post.onload = function () {}
                console.log(jsonHighlight);
                post.send(jsonHighlight);
            }
            else
            {
                var welcome = document.getElementById('welcome');
                welcome.innerHTML = 'To use this function, please login first!';
            }
        });
    });
}

function getAnnotation(){
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tab) {
        var post = new XMLHttpRequest();
        post.open('POST', url + 'Highlights');
        post.setRequestHeader('Content-type', 'application/json');

        var highlight = new Object();
        highlight.id = -1; //query
        highlight.user_id = userId;
        highlight.web_page = tab[0].url;
        highlight.start = null;
        highlight.end = null;
        var jsonHighlight = JSON.stringify(highlight);

        post.onreadystatechange = function () {
            var resp = post.response;
            var obj = JSON.parse(resp);
            obj = JSON.parse(obj);
            for (i = 0; i < obj.length; i++){
                obj[i].start = JSON.parse(obj[i].start);
                obj[i].end = JSON.parse(obj[i].end);
            }
            //select and list

            console.log(post.response)
        }

        post.send(jsonHighlight);
    });
}
