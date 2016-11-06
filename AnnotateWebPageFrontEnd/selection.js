debugger;
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        sendResponse({ data: window.getSelection().toString() });
    if (request.method == "getBlock") {
        //Get the range of a selection and find out the id of the DOM objects.
        var range = document.getSelection().getRangeAt(0);
        
        var start = range.startContainer;
        var text = "lvl: 0 offset: " + range.startOffset.toString() + "\n";
        var level = 0;
        text = getPosition(start, text, level);

            
        
        sendResponse({ data: text});
    }
    else
        sendResponse({}); // snub them.
});

function getPosition(current, text, level){
    level++;
    text +="lvl: " + level + " ";
    if (current == null)
        return text;
    
    if (current.nodeType == 3) {
        text += " text "  + "\n";
        text = getPosition(current.parentElement, text, level);
    }
    
    else if (current.id == ""){
        var remainingSiblingsCount = 0;
        var sibling = current;
        while (current.nextElementSibling !== null){
            remainingSiblingsCount++;
            current = current.nextElementSibling;
        }
        text +=" rS: " + remainingSiblingsCount  + " class: " + current.className + "\n";
        text = getPosition(current.parentElement, text, level);
    }
    else {
        text += " id: " + current.id;
        text += " childs: " + current.childElementCount  +  " class: " + current.className + "\n";
        text = getPosition(current.parentElement, text, level);
    }
    
    return text;
        
        
}



function getElementsBetweenTree(range) {
    var ancestor = range.commonAncestorContainer;
    var start = range.startContainer;
    var end = range.endContainer;

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