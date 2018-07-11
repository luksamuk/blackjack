// Blackjack

// Deck definitions, generated programmatically
const generateDeck = () => {
    let suits = ["spades", "hearts", "diamonds", "clubs"];
    let cards = [];
    // Cards range from 1-13, where
    //  1 = ace
    // 11 = jack
    // 12 = queen
    // 13 = king
    // HOWEVER, any card > 13 is counted as a 10.
    // The game uses a single deck, so all we need to do is
    // generate the 52 cards.
    suits.forEach(suit => {
	for(i = 1; i <= 13; i++) {
	    cards.push({
		suit:   suit,
		number: i
	    });
	}
    });
    return cards;
};

const shuffleDeck = deck => {
    // Use Fisher-Yates shuffling algorithm
    let numberOfShuffles = deck.length;
    while(numberOfShuffles > 0) {
	const cardIndex = Math.floor(Math.random() * numberOfShuffles);
	numberOfShuffles--;
	let temp = deck[cardIndex];
	deck[numberOfShuffles] = deck[cardIndex];
	deck[cardIndex] = temp;
    }
};

let deck = {};

let playerHands = [
    [],
    [],
    [],
    []
];

const createCard = (cardType) => {
	let cardElement = $(document.createElement("div"));
	cardElement.load('card.html', () => {
	    if(cardType != undefined) {
		cardElement.find('#card-image')
			   .attr('src',
				 'images/deck/' + cardType + '.png');
	    }
	});
	return cardElement;
    };

const playerSum = which => {
    return playerHands[which].map(card => {
	return (card.number > 10 ? 10 : card.number);
    }).reduce((acc, val) => acc + val, 0);
};

const grabNewCard = whichPlayer => {
    let newCard = deck.pop();
    let playerContainer = "\#" +
	 ((whichPlayer === 3) ? "player-cards" : "com" + whichPlayer + "-cards");
    
    playerHands[whichPlayer].push(newCard);
    console.log(playerContainer);

    
    $(playerContainer).append(
	createCard(newCard.suit.substring(0,2)
		 + newCard.number));
};

const computerTurn = which => {
    let sum = playerSum(which);

    // Simple AI. Will not risk if greater or equal 18
    while(sum < 18) {
	// Grab a new card
	grabNewCard(which);
	sum = playerSum(which);

	// TODO: delay?
    }
};


const debriefing = () => {
    let finalScores =
	[0, 1, 2, 3].map(which => playerSum(which));
    let debriefing =
	"Final scores:\n";

    for(i = 0; i <= 3; i++) {
	let playerName =
	    (i == 3) ? "You" : ("Player " + i);
	debriefing += playerName;
	debriefing += ": " + finalScores[i];
	if(i < 3) debriefing += "\n";
    }
    alert(debriefing);
    location.reload();
};


$(document).ready(e => {
    console.log("jQuery is ready");
    /*window.setTimeout(() => {
	$('#thing').hide(250, () => {
	    $('#thing').show(250);
	});
       }, 2000);*/

    /* Card creation test */


    // Prepare deck
    deck = generateDeck();
    shuffleDeck(deck);

    // Distribute some cards to players
    for(i = 0; i < 2; i++) {
	for(j = 0; j <= 3; j++) {
	    grabNewCard(j);
	}
    }

    console.log(playerHands);


    $('#player-score').text("Score: " + playerSum(3));


    // Make AI play
    let myTurn = false;
    for(i = 0; i < 3; i++) {
	computerTurn(i);
    }
    myTurn = true;

    

    $('#deck').click(function(e) {
	e.preventDefault();
	if(!myTurn) return;

	// Check score
	let playerScore = playerSum(3);

	if(playerScore >= 21) {
	    debriefing();
	    return;
	}

	// Grab a new card
	grabNewCard(3);
	// Update score
	playerScore = playerSum(3);
	$('#player-score').text("Score: " + playerScore);
    });

    $('#end-turn-button').click(function(e) {
	e.preventDefault();
	debriefing();
    });
});
