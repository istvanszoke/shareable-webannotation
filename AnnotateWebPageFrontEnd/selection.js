debugger;
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        sendResponse({ data: window.getSelection().toString() });
    if (request.method == "getBlock") {
        //Get the range of a selection and find out the id of the DOM objects.
        var range = document.getSelection().getRangeAt(0);
        
        var start = range.startContainer;
        var startPosition = "o" + range.startOffset.toString() + ";";
        var level = 0;
        startPosition = getPosition(start, startPosition, level);
        
        var end = range.endContainer;
        var endPosition = "o" + range.endOffset.toString() + ";";
        var level = 0;
        endPosition = getPosition(end, endPosition, level);
        
        
        
        
        sendResponse({ data: "start" + startPosition + "end" + endPosition});
        styleElementsInRange(range);
    }
    if (request.method == "select")
    {
        
    }
    else
        sendResponse({}); // snub them.
});

function getPosition(current, text, level){
    level++;
    if (current == null)
        return text;
    
    if (current.nodeType == 3) {
        text = getPosition(current.parentElement, text, level);
    }
    else {
        var remainingSiblingsCount = 0;
        var sibling = current;
        while (sibling.nextElementSibling !== null){
            remainingSiblingsCount++;
            sibling = sibling.nextElementSibling;
        }
        text +="rS" + remainingSiblingsCount + "c" + current.childElementCount + ";";
        text = getPosition(current.parentElement, text, level);
    }
    
    return text;        
}



function styleElementsInRange(range) {
    var ancestor = range.commonAncestorContainer;
    var start = range.startContainer;
    var end = range.endContainer;

    var before = [];
    while (start.parentNode !== ancestor) {
        var el = start;
        while (el.nextSibling){
            if (el.nodeType == 1)
                el.style.background = "yellow";
            before.push(el = el.nextSibling);
        }
        start = start.parentNode;
    }

    var after = [];
    while (end.parentNode !== ancestor) {
        var el = end;
        while (el.previousSibling){
            if (el.nodeType == 1)
                el.style.background = "yellow";
            after.push(el = el.previousSibling);
        }
        end = end.parentNode;
    }
    after.reverse();

    while ((start = start.nextSibling) !== end){
        if (el.nodeType == 1)
            start.style.background = "yellow";
        before.push(start);
    }
    return before.concat(after);
}