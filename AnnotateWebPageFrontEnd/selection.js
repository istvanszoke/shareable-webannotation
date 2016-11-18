﻿debugger;
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        sendResponse({ data: window.getSelection().toString() });
    if (request.method == "getBlock") {
        //Get the range of a selection and find out the id of the DOM objects.
        var range = window.getSelection().getRangeAt(0);
        
        var start = range.startContainer;
        var level = 0;
        var startOffset = range.startOffset;
        var startPositionJSON = { "offset" : startOffset.toString(),
                                  "elements" : []};
        
        startPositionJSON = getPositionJSON(start, startPositionJSON, level);
        
        var end = range.endContainer;        
        level = 0;
        var endOffset = range.endOffset;
        var endPositionJSON = { "offset" : endOffset.toString(),
                                "elements" : []};
        
        endPositionJSON = getPositionJSON(end, endPositionJSON, level);
        
        //var extracted = range.extractContents();
        //extracted.appendChild(document.createElement("style"));
       
        
        if (start == end){
            var surround = document.createElement("bdi");
            range.surroundContents(surround);
            surround.style.background = "yellow";
        }
            
        else{
            var rangeStart = document.createRange();
            rangeStart.setStart(start, startOffset);
            rangeStart.setEnd(start, start.length);
            var surroundStart = document.createElement("bdi");
            rangeStart.surroundContents(surroundStart);
            surroundStart.style.background = "yellow";
            
            var rangeEnd = document.createRange();
            rangeEnd.setStart(end, 0);
            rangeEnd.setEnd(end, endOffset);
            var surroundEnd = document.createElement("bdi");
            rangeEnd.surroundContents(surroundEnd);
            surroundEnd.style.background = "yellow";

            
            
        }
        
        
        //styleElementsInRange(range);
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
    
    console.log("dsgfg");
    var color = "yellow";//document.getElementById('colorpicker').style.backgroundColor;
    start.parentNode.style.background = color;
    end.parentNode.style.background = color;
        
    
    while (start.parentNode !== ancestor &&
           start !== ancestor) {
        var el = start;
        while (el.nextSibling){
            if (el.nodeType == 1)
                el.style.background = color;
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
                el.style.background = color;
            after.push(el = el.previousSibling);
        }
        end = end.parentNode;
    }
    after.reverse();

    while ((start = start.nextSibling) !== end){
        if (start.nodeType == 1)
            start.style.background = color;
        before.push(start);
    }
    return before.concat(after);
}