debugger;
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        sendResponse({ data: window.getSelection().toString() });
    if (request.method == "getBlock") {
        //Get the range of a selection and find out the id of the DOM objects.
        var range = document.getSelection().getRangeAt(0);
        
        var start = range.startContainer;
        var level = 0;
        var startPositionJSON = { "offset" : range.startOffset.toString(),
                                  "elements" : []};
        
        startPositionJSON = getPositionJSON(start, startPositionJSON, level);
        
        var end = range.endContainer;        
        level = 0;
        var endPositionJSON = { "offset" : range.endOffset.toString(),
                                "elements" : []};
        
        endPositionJSON = getPositionJSON(end, endPositionJSON, level);
        
        styleElementsInRange(start, end);
        /*var startElem = getElementByPosition(startPositionJSON);
        var endElem = getElementByPosition(endPositionJSON);
        
        var range2 = document.createRange();
        range2.setStart(startElem, 0);
        range2.setEnd(endElem, 0);*/
        
        sendResponse({ "start" : startPositionJSON,
                       "end" : endPositionJSON});
  
    }
    if (request.method == "select") 
    {
        
    }
    else
        sendResponse({}); // snub them.
});




function getElementByPosition(position){
    var root = document.documentElement;
    var elem = root;
    for (i = 1; i < position.elements.length; i++){
        if (elem.nodeType != 3) {
            elem = elem.children[elem.childElementCount - position.elements[i].remainingSiblings - 1];
        }
    }
    
    return elem;
}

// this function returns the position of current in the DOM
function getPositionJSON(current, position, level){
    level++;
    if (current == null)
        return position;
    
    if (current.nodeType == 3) {
        position = getPositionJSON(current.parentElement, position, level);
    }
    else {
        var remainingSiblingsCount = 0;
        var sibling = current;
        while (sibling.nextElementSibling !== null){
            remainingSiblingsCount++;
            sibling = sibling.nextElementSibling;
        }
        elem = {"remainingSiblings" : remainingSiblingsCount, 
                "childs" : current.childElementCount};
        position.elements.unshift(elem);
        position = getPositionJSON(current.parentElement, position, level);
    }
    
    return position;        
}


// this function returns the position of current in the DOM
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
    
    
    start.parentNode.style.background = "yellow";
    end.parentNode.style.background = "yellow";
        
    
    while (start.parentNode !== ancestor &&
           start !== ancestor) {
        var el = start;
        while (el.nextSibling){
            if (el.nodeType == 1)
                el.style.background = "yellow";
            before.push(el = el.nextSibling);
        }
        start = start.parentNode;
    }

    var after = [];
    while (end.parentNode !== ancestor &&
           start !== ancestor) {
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
        if (start.nodeType == 1)
            start.style.background = "yellow";
        before.push(start);
    }
    return before.concat(after);
}