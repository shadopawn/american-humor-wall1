let flickity;

function setupCarousel(){

    let carousel = document.querySelector(".carousel");

    if(!carousel){
        return;
    }

    flickity = new Flickity(carousel, {
        wrapAround : true,
        pageDots: false,
        imagesLoaded: true
    });

    let nextName = addParagraphElement(".flickity-prev-next-button.next", "next-carousel-name");

    let previousName = addParagraphElement(".flickity-prev-next-button.previous", "previous-carousel-name");

    function addParagraphElement(parentSelector, className){
        let parent = document.querySelector(parentSelector);
        let paragraph = document.createElement("P");
        paragraph.className = className;
        parent.appendChild(paragraph);
        return paragraph;
    }

    setPreviousNextNames(0);
    flickity.on('change', index => {
        setPreviousNextNames(index);
    });

    function setPreviousNextNames(index){
        let nextCell = getNextCell(index);
        let nextCellName = nextCell.querySelector(".carousel-name");
        nextName.innerText = nextCellName.innerText;

        let previousCell = getPreviousCell(index);
        let previousCellName = previousCell.querySelector(".carousel-name");
        previousName.innerText = previousCellName.innerText;
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
}