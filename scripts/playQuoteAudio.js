let audio = new Audio();
function playQuoteAudio(fileName) {
    let url = "https://shadopawn.github.io/assets/audio/"+fileName +"?raw=true"
    audio.pause();
    audio.src = url;
    audio.play();
}