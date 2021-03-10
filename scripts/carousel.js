let flickity;

function setupCarousel(){

    let carousel = document.querySelector(".carousel");

    if(!carousel){
        return;
    }

    flickity = new Flickity( carousel, {
        wrapAround : true,
        pageDots: false,
        imagesLoaded: true
    });

    let nextButton = document.querySelector(".flickity-prev-next-button.next");

    let nextName = document.createElement("P");
    nextName.innerText = "Test Name";
    nextName.className = "next-carousel-name";
    nextButton.appendChild(nextName);

    let previousButton = document.querySelector(".flickity-prev-next-button.previous");

    let previousName = document.createElement("P");
    previousName.innerText = "Test Name";
    previousName.className = "previous-carousel-name";
    previousButton.appendChild(previousName);

    setPreviousNextNames(0);
    flickity.on( 'change', function( index ) {
        setPreviousNextNames(index);
    });

    function setPreviousNextNames(index){
        let previousCell = getPreviousCell(index);
        let previousCellName= previousCell.querySelector(".carousel-name");
        previousName.innerText = previousCellName.innerText;

        let nextCell = getNextCell(index);
        let nextCellName = nextCell.querySelector(".carousel-name");
        nextName.innerText = nextCellName.innerText;
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