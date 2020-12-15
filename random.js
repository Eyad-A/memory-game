const rankDivs = document.querySelectorAll(".flip-card-inner");
const ranks = Array.from(rankDivs);
let lastGuess;
let numOfFaceUpCards = 0;
let matchedCards = [];
let turns = 0;
let in_progress = false;

function checkIfFirstOrSecondGuess() {
    for (let i = 0; i < rankDivs.length; i++) {
        if (rankDivs[i].classList[1] == "faceup") {
            numOfFaceUpCards++;
        }
    }
    if (numOfFaceUpCards %2 === 0) {
        numOfFaceUpCards = 0;
        return true;
    } else {
        numOfFaceUpCards = 0;
        return false;
    }
};

for (let i = 0; i < rankDivs.length; i++) {
    rankDivs[i].addEventListener('click', letsgo);
};

// Create an array of all cards to be shuffled later
const rankPics = ranks.map(rank => {
    let image = rank.lastElementChild.lastElementChild.getAttribute("src");
    let alt = rank.lastElementChild.lastElementChild.getAttribute("alt");
    return pair = [image, alt];
})

// Shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    for (let i = 0; i < rankDivs.length; i++) {
        rankDivs[i].lastElementChild.lastElementChild.setAttribute("src", rankPics[i][0]);
        rankDivs[i].lastElementChild.lastElementChild.setAttribute("alt", rankPics[i][1]);
    }
}

// Shuffle on first page load
shuffle(rankPics);

function flip(cardContainer) {
    if (in_progress == true) {
        return false;
    }
    if (cardContainer.classList[1] !== 'faceup' && in_progress == false) {
        cardContainer.style.transform = "rotatey(180deg)";
        cardContainer.style.transitionDuration = "0.5s";
        cardContainer.classList.toggle("faceup");
    }
}

function flipBack(currentGuess) {
    currentGuess.parentNode.parentNode.style.transform = "rotatey(360deg)";
    currentGuess.parentNode.parentNode.classList.toggle("faceup");
    lastGuess.parentNode.parentNode.style.transform = "rotatey(360deg)";
    lastGuess.parentNode.parentNode.classList.toggle("faceup");
}

function letsgo(event) {
    if (event.target.nodeName == "DIV") {
        return false;
    }
    if (in_progress == true) {
        return false;
    }
    let card = event.target.parentNode.nextElementSibling.lastElementChild;
    let cardContainer = card.parentNode.parentNode;
    if (checkIfFirstOrSecondGuess() === true && in_progress == false) {
        flip(cardContainer);
        lastGuess = card;
    } else {
        let currentGuess = card;
        flip(cardContainer);
        in_progress = true;
        turns++;
        if (checkForMatch(currentGuess) === false) {
            setTimeout(() => {
                flipBack(currentGuess);
            }, 1000);
            setTimeout(() => {
                in_progress = false;
            }, 1000);
        }
        setTimeout(checkForWin, 200);
    }
}

function checkForMatch(currentGuess) {
    if (currentGuess.getAttribute("alt").slice(0,-1) == lastGuess.getAttribute("alt").slice(0,-1) && currentGuess.getAttribute("alt").slice(-1) !== lastGuess.getAttribute("alt").slice(-1)) {
        in_progress = false;
        matchedCards.push(currentGuess, lastGuess);
        console.log('WE HAVE A MATCH!!');
    } else {
        console.log('NO MATCH!!');
        return false;
    }
}

function checkForWin() {
    if (matchedCards.length == 12) {
        alert('You win! Good job!');
    }
}