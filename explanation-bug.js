

function shortExplanation(explanation) {
    let shortened = [];
    let sentence = explanation.split('.');
    shortened.push(sentence[0]+'.');
    shortened.push(sentence[1]+'.');
    console.log(shortened.join(''));
    apodDescriptionElement.textContent = shortened.join('');
    return shortened.join('');

}
