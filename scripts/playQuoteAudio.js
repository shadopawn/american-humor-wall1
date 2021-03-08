let audio = new Audio();
function playQuoteAudio(fileName) {
    let path = "../assets/audio/"+fileName
    audio.pause();
    audio = new Audio(path);
    audio.play();
}