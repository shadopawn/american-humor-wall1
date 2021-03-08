let audio = new Audio();
function playQuoteAudio(fileName) {
    let url = "https://raw.shadopawn.github.io/assets/audio/"+fileName
    audio.pause();
    audio.src = url;
    audio.play();
}