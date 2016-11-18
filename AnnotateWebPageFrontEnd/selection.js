chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        sendResponse({ data: window.getSelection().toString() });
    if (request.method == "select") {
        var range = window.getSelection().getRangeAt(0);    
        var start = range.startContainer;
        var level = 0;
        var startOffset = range.startOffset;
        var startPositionJSON = { "offset" : startOffset.toString(),
                                  "elements" : []};
        startPositionJSON = getPositionJSON(start, startPositionJSON, level);

        console.log("startpos" + JSON.stringify(startPositionJSON));

        var end = range.endContainer;
        level = 0;
        var endOffset = range.endOffset;
        var endPositionJSON = { "offset" : endOffset.toString(),
                                "elements" : []};
        endPositionJSON = getPositionJSON(end, endPositionJSON, level);

        console.log("endpos" + JSON.stringify(endPositionJSON));

        styleElementsInRange(range);

        sendResponse({ "start" : startPositionJSON,
                       "end" : endPositionJSON});

    }
    if (request.method == "selectFetched"){
        var doc = document;
        rangeJSON = request.fetched;
        for (var i = 0; i < rangeJSON.length; i++){
            styleFetchedElements(rangeJSON[i]);
        }
    }
    else
        sendResponse({}); // snub them.
});

function styleFetchedElements(rangeJSON){
    console.log("fetched start" + JSON.stringify(rangeJSON.start));
    console.log("fetched end" + JSON.stringify(rangeJSON.end));

    var start = getElementByPosition(rangeJSON.start);
    var end = getElementByPosition(rangeJSON.end);
    var startOffset = rangeJSON.start.offset;
    var endOffset = rangeJSON.end.offset;

    var range = document.createRange();
    range.setStart(start, startOffset);
    range.setEnd(end, endOffset);

    styleElementsInRange(range);
}


function getElementByPosition(position){
    var root = window.document.documentElement;
    var elem = root;
    var lastIdIndex = 0;
    for (i = 1; i < position.elements.length; i++){
        if (position.elements[i].id !== ""){
            lastIdIndex = i;
        }

    }
    elem = document.getElementById(position.elements[lastIdIndex].id);
    for (i = lastIdIndex; i < position.elements.length; i++){
        if (elem.nodeType != 3) {
            if (i == position.elements.length-1){
                elem = elem.childNodes[0];
            }else {
                elem = elem.childNodes[elem.childNodes.length - position.elements[i+1].remainingSiblings - 1];
            }
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
        position = getPositionJSON(current.parentNode, position, level);
    }
    else {
        var remainingSiblingsCount = 0;
        var sibling = current;
        while (sibling.nextSibling !== null){
            remainingSiblingsCount++;
            sibling = sibling.nextSibling;
        }
        elem = {"remainingSiblings" : remainingSiblingsCount,
                "childs" : current.childElementCount,
                "id" : current.id};
        position.elements.unshift(elem);
        position = getPositionJSON(current.parentNode, position, level);
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

function surroundAndStyle(range){
    var surround = document.createElement("bdi");
    range.surroundContents(surround);
    surround.style.background = "yellow";
}

function styleStart(start, offset){
    var rangeStart = document.createRange();
    rangeStart.setStart(start, offset);
    rangeStart.setEnd(start, start.length);
    surroundAndStyle(rangeStart);
}

function styleEnd(end, offset){
    var rangeEnd = document.createRange();
    rangeEnd.setStart(end, 0);
    rangeEnd.setEnd(end, offset);
    surroundAndStyle(rangeEnd);
}

function styleElementsInRange(range) {
    var ancestor = range.commonAncestorContainer;
    var start = range.startContainer;
    var end = range.endContainer;

    var before = [];
    var after = [];
    console.log("dsgfg");
    var color = "yellow";//document.getElementById('colorpicker').style.backgroundColor;

    if (start == end){
        var surround = document.createElement("bdi");
        range.surroundContents(surround);
        surround.style.background = color;
        }
    else{
        styleStart(start, range.startOffset);
        styleEnd(end, range.endOffset);
    while (start.parentNode !== ancestor &&
           start !== ancestor) {
        var el = start;
        while (el.nextSibling){
                before.push(el = el.nextSibling);
            if (el.nodeType == 1)
                    el.style.background = color;
        }
        start = start.parentNode;
    }


    while (end.parentNode !== ancestor &&
               end !== ancestor) {
        var el = end;
        while (el.previousSibling){
                after.push(el = el.previousSibling);
            if (el.nodeType == 1)
                    el.style.background = color;
        }
        end = end.parentNode;
    }
    after.reverse();

    while ((start = start.nextSibling) !== end){
        if (start.nodeType == 1)
            start.style.background = color;
        before.push(start);
    }
        }

    return before.concat(after);
}
