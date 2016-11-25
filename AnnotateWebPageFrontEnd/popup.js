$(function () {
    $('#document').ready(pageOnload);
    $('#register').click(function () { handleUser('register'); });
    $('#login').click(function () { handleUser('login'); });
    $('#logout').click(function () { logoutUser(); });
    //$('#paste').click(function () { pasteSelection(); });
    $('#select').click(function () { selectHighlight(); });
    $('#send').click(function () { sendComment(); });
    $('#modify').click(function () { modifyComment(); });
    $('#delete').click(function () { deleteComment(); });
    $('#getmyannotations').click(function () { getAnnotation(); });
    $('#generatelinkbutton').click(function () { generateLink(); });
    $('#getlinkbutton').click(function () { getLink(); });
    //$('#getmycomments').click(function () { getComments(); });
    //$('#add').click(function () { addTextAreas(); });
});

var url = 'http://localhost:5066/api/';
var userId = null;
var userName = null;
var defaultWelcomeText = 'Welcome to WebAnnotator!';
function pageOnload() {
    var welcome = document.getElementById('welcome');
    //var logindiv = document.getElementById('logindiv');
    if (localStorage.getItem('userId') !== null && localStorage.getItem('userId') !== 'null') {
        userId = localStorage.getItem('userId');
        userName = localStorage.getItem('userName');

        //logindiv.style.visibility = 'visible';
        welcome.innerHTML = 'Welcome' + ' ' + userName + ' !';
        getComments();
    }
    else {
        welcome.innerHTML = defaultWelcomeText;
        //logindiv.style.visibility = 'collapse';
    }
}

function logoutUser() {
    localStorage.setItem('userId', null);
    localStorage.setItem('userName', null);
    userId = userName = null;
    welcome.innerHTML = defaultWelcomeText;
    //var logindiv = document.getElementById('logindiv');
    //logindiv.style.visibility = 'collapse';
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
            //console.log(getToken.response);
            userId = JSON.parse(getToken.response).id;
            userName = JSON.parse(getToken.response).name;

            if (localStorage.getItem('userId') === null || localStorage.getItem('userId') === 'null') {
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', userName);
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
        welcome.innerHTML = text + ' ' + name + ' !';
        //var logindiv = document.getElementById('logindiv');
        //logindiv.style.visibility = 'visible';
    }
    else welcome.innerHTML = errorText;
}

function sendComment() {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tab) {
        var post = new XMLHttpRequest();
        post.open('POST', url + 'Comments');
        post.setRequestHeader('Content-type', 'application/json');
        var comment = new Object();
        comment.text = document.getElementById('text').value;
        comment.color = document.getElementById('colorpicker').style.backgroundColor;
        comment.user_id = userId;
        comment.web_page = encodeURI(tab[0].url);
        console.log(encodeURI(tab[0].url));
        console.log(comment.text);
        var jsonComment = JSON.stringify(comment);
        post.onload = function () {
            console.log(post.response.statusCode);
            if (post.status == 201) {
                getComments();
            }
        };

        post.send(jsonComment);
    });

}

function getComments(urlAddress) {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tab) {
        var getComments = new XMLHttpRequest();
        if (typeof (urlAddress) === 'undefined') urlAddress = url + 'Comments/byUserAndUrl?userId=' + userId + '&url=' + tab[0].url;
        console.log(urlAddress);
        getComments.open('GET', urlAddress);
        getComments.onload = function () {
            var commentsArray = JSON.parse(getComments.response);
            console.log(commentsArray);
            var label = document.getElementById('clickcomments');
            label.style.visibility = 'visible';
            var div = document.getElementById('annotations');
            while (div.firstChild) {
                div.removeChild(div.firstChild);
            }
            for (i = 0; i < commentsArray.length; i++) {
                addTextAreas(commentsArray[i].id, commentsArray[i].text, commentsArray[i].color);
            }
        }
        getComments.send();
    });
}

function modifyComment() {

    if (commentId != null) {
        var updateComment = new XMLHttpRequest();
        updateComment.open('PUT', url + 'Comments/' + commentId);
        updateComment.setRequestHeader('Content-type', 'application/json');
        var comment = new Object();
        comment.text = document.getElementById('text').value;
        var jsonComment = JSON.stringify(comment);
        updateComment.onload = function () {
            if (updateComment.status == 200) {
                commentId = null;
                getComments();
            }
        }
        updateComment.send(jsonComment);
    }
}

function deleteComment() {

    if (commentId != null) {
        var deleteComment = new XMLHttpRequest();
        deleteComment.open('DELETE', url + 'Comments/' + commentId);
        deleteComment.onload = function () {
            if (deleteComment.status == 200) {
                commentId = null;
                getComments();
            }
        }
        deleteComment.send();
    }
}


//function pasteSelection() {
//    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
//    function (tab) {
//        chrome.tabs.sendMessage(tab[0].id, { method: 'getSelection' },
//        function (response) {
//            var text = document.getElementById('text');
//            text.innerHTML = response.data;
//        });
//    });
//}


function highlightInsertionCallback(request, statusCode, text, errorText) {
    var text = document.getElementById('text');
    text.innerHtml = 'status: ' + statusCode;
}

function selectHighlight() {
    if (userId !== null) {
        chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
        function (tab) {
            chrome.tabs.sendMessage(tab[0].id, { method: 'select' },
            function (response) {
                var post = new XMLHttpRequest();
                post.open('POST', url + 'Highlights');
                post.setRequestHeader('Content-type', 'application/json');
                var highlight = new Object();
                highlight.id = 0;
                highlight.user_id = userId;
                highlight.web_page = tab[0].url;
                highlight.start = JSON.stringify(response.start);
                highlight.end = JSON.stringify(response.end);
                var jsonHighlight = JSON.stringify(highlight);
                post.onload = function () {
                    if (post.status === 201){
                        var resp = JSON.parse(post.response);
                        addHighlightArea(resp.id);
                    }
                }
                console.log(jsonHighlight);
                post.send(jsonHighlight);
            });
        });
    }
    else {
        var welcome = document.getElementById('welcome');
        welcome.innerHTML = 'To use this function, please login first!';
    }
}

function getAnnotation(urlAddress) {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tab) {
        var get = new XMLHttpRequest();
        if (typeof (urlAddress) === 'undefined') urlAddress = url + 'Highlights/byUserAndUrl?userId=' + userId + '&url=' + tab[0].url;
        console.log(urlAddress);
        get.open('GET', urlAddress);
        //remove all gighlight boxes
        var div = document.getElementById('highlights');
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        get.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                var obj = JSON.parse(get.response);
                console.log(get.response)
                for (i = 0; i < obj.length; i++) {
                    obj[i].start = JSON.parse(obj[i].start);
                    obj[i].end = JSON.parse(obj[i].end);
                    addHighlightArea(obj[i].id);
                }
                chrome.tabs.sendMessage(tab[0].id, { method: 'selectFetched', fetched: obj },
                function (response) { });

            }
        }

        get.send();
    });
}

var reloadStarted = false;

function addHighlightArea(id){
    var hgdiv = document.createElement('div');
    hgdiv.id = "hg" + id.toString();
    var textarea = document.createElement('textarea');
    textarea.value = "Highlight " + id.toString();
    textarea.readOnly = true;
    var button = document.createElement('button');
    button.textContent = "X";
    button.onclick = function() {
        var deleteHighlight = new XMLHttpRequest();
        deleteHighlight.open('DELETE', url + "Highlights/" + id);
        deleteHighlight.onload = function () {
            if (deleteHighlight.status == 200) {
                hgdiv.parentNode.removeChild(hgdiv);
            }

            //reload the active tab
            chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
            function (tab) {
                reloadStarted = true;
                chrome.tabs.reload(tab[0].id);
                } );
            }
        deleteHighlight.send();
        }

    hgdiv.appendChild(textarea);
    hgdiv.appendChild(button);
    document.getElementById('highlights').appendChild(hgdiv);
}

var commentId = null;
function addTextAreas(id, text, color) {
    var textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.value = text;
    textarea.readOnly = true;
    textarea.style.backgroundColor = color;
    textarea.onclick = function () {
        var commentwritertextarea = document.getElementById('text');
        commentwritertextarea.value = textarea.value;
        commentId = textarea.id;
    }
    console.log(textarea.id);
    document.getElementById('annotations').appendChild(textarea);
}

function generateLink() {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tab) {
        var linktextarea = document.getElementById('linktextarea');
        //http://localhost:5066/api/Comments/byUserAndUrl?userId=117891975809840147555&url=http://localhost:5066/
        linktextarea.value = url + 'Comments/byUserAndUrl?userId=' + userId + '&url=' + encodeURI(tab[0].url);
    });
}

function getLink() {
    var linktextarea = document.getElementById('linktextarea');


    var link = linktextarea.value;
    var array = link.split('url=');
    var urlAddress = array[1];
    console.log(urlAddress);

    chrome.tabs.update(null, { url: urlAddress }, function (tab) {
        chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
            console.log(info.status)
            if (info.status == "complete") {
                getComments(link);
                var res = link.replace('Comments', 'Highlights');
                getAnnotation(res);
            }
        });

    });



}
