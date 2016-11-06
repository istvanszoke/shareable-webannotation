debugger;
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        sendResponse({ data: window.getSelection().toString() });
    if (request.method == "getBlock") {
        //Get the range of a selection and find out the id of the DOM objects.
        var range = document.getSelection().getRangeAt();

        sendResponse({ data: "bumm sakalaka" });
    }
    else
        sendResponse({}); // snub them.
});


function getElementsBetweenTree(start, end) {
    var ancestor = getCommonAncestor(start, end);

    var before = [];
    while (start.parentNode !== ancestor) {
        var el = start;
        while (el.nextSibling)
            before.push(el = el.nextSibling);
        start = start.parentNode;
    }

    var after = [];
    while (end.parentNode !== ancestor) {
        var el = end;
        while (el.previousSibling)
            after.push(el = el.previousSibling);
        end = end.parentNode;
    }
    after.reverse();

    while ((start = start.nextSibling) !== end)
        before.push(start);
    return before.concat(after);
}