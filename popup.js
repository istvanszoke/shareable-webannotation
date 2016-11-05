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


