let flickity;

let nextName;
let previousName;

function setupCarousel(){
    let carousel = document.querySelector(".carousel");

    if(carousel == null){
        return;
    }

    flickity = new Flickity(carousel, {
        wrapAround : true,
        pageDots: false,
        imagesLoaded: true
    });

    nextName = addParagraphElement(".flickity-prev-next-button.next", "next-carousel-name");

    previousName = addParagraphElement(".flickity-prev-next-button.previous", "previous-carousel-name");

    initializeNames();
    flickity.on('change', index => {
        setPreviousNextNames(index);
    });
}

function initializeNames(){
    setPreviousNextNames(0);
}

function setPreviousNextNames(index){
    setNextName(index);
    setPreviousName(index);
}

function setNextName(index) {
    let nextCell = getNextCell(index);
    setElementNameFromCell(nextName, nextCell);
}

function setPreviousName(index) {
    let previousCell = getPreviousCell(index);
    setElementNameFromCell(previousName, previousCell);
}

function setElementNameFromCell(elementToSetNameOf, cellElement){
    let cellName = cellElement.querySelector(".carousel-name");
    elementToSetNameOf.innerText = cellName.innerText;
}

function addParagraphElement(parentSelector, className){
    let parent = document.querySelector(parentSelector);
    let paragraph = document.createElement("P");
    paragraph.className = className;
    parent.appendChild(paragraph);
    return paragraph;
}

function getPreviousCell(index){
    let previousIndex = index - 1;
    if(previousIndex < 0){
        previousIndex = flickity.cells.length - 1;
    }
    return flickity.cells[previousIndex].element;
}

function getNextCell(index){
    let nextIndex = index + 1;
    if(nextIndex > flickity.cells.length - 1){
        nextIndex = 0;
    }
    return flickity.cells[nextIndex].element;
}