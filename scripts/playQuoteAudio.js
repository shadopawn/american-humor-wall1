function playQuoteAudio(fileName) {
    let path = "../assets/audio/"+fileName
    new Audio(path).play();
  }