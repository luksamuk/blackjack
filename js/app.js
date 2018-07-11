/*
 * Blackjack
 * Copyright (c) 2018 Lucas Vieira <lucasvieira@lisp.com.br>
 *
 * This project is distributed under the MIT License. See
 * LICENSE for details. 
 */


/* ========================= */
/*       GLOBAL OBJECTS      */

// The deck is actually instanced on the entry point.
// It is an array of objects, each being a card, which
// contains its suit and its number
let deck = [];

// The players' hands are contained inside an array.
// Each hand is also an array of cards retrieved from
// the deck.
let playerHands = [ [], [], [], [] ];

// Simple switch for preventing the player from taking
// cards outside of his/her turn
let myTurn = false;



/* ========================= */
/*   DECK-RELATED FUNCTIONS  */

// Creates a new deck and returns it.
// The deck is comprised of 52 different cards, grouped
// under four suits. Each suit has 13 cards, numbered in
// that order. 1 is always ace, and 11, 12, 13 are royal
// family. However, in blackjack, all royal family members
// are valued 10.
const generateDeck = () => {
    let suits = ["spades", "hearts", "diamonds", "clubs"];
    let cards = [];

    // Generate 13 cards per suit
    suits.forEach(suit => {
	for(i = 1; i <= 13; i++) {
	    // Generation of each card object
	    cards.push({
		suit:   suit,
		number:    i
	    });
	}
    });
    return cards;
};

// Shuffles a given deck.
// Uses the Fisher-Yates shuffling algorithm.
const shuffleDeck = deck => {
    let numberOfShuffles = deck.length;
    while(numberOfShuffles > 0) {
	const cardIndex = Math.floor(Math.random() * numberOfShuffles);
	numberOfShuffles--;
	let temp = deck[cardIndex];
	deck[numberOfShuffles] = deck[cardIndex];
	deck[cardIndex] = temp;
    }
};

// Creates a new card to be emplaced in HTML.
// Does not directly relate to the deck structure.
// cardType must be the card name with special formatting,
// composed of the two first characters of the suit, and
// then the card number. If the name is not provided, then
// a turned card will be rendered.
// e.g. "cl1" is an Ace of Clubs, "sp10" is a Ten of Spades.
const createCard = (cardType) => {
    // Force coercion from document element to jQuery object.
    // Unfortunately, using a jQuery object directly was being
    // problematic.
    let cardElement = $(document.createElement("div"));

    // Load external predefined card layout
    cardElement.load('card.html', () => {
	if(cardType != undefined) {
	    // Deduce name of card file directly from given
	    // cardType, then define its image source path.
	    cardElement.find('#card-image')
		       .attr('src',
			     'images/deck/' + cardType + '.png');
	}
    });
    return cardElement;
};



/* ========================= */
/* PLAYER-RELATED FUNCTIONS  */

// Sums the score for a specific player.
// Player index must be in range 0-3, where 3
// is the actual player and the others are "AI"
const playerSum = which => {
    // Loops cryptic, but it is nothing more than
    // performing a map operation over a bunch
    // of numbers, and then calculating the sum
    // of said numbers.
    return playerHands[which].map(card => {
	return (card.number > 10 ? 10 : card.number);
    }).reduce((acc, val) => acc + val, 0);
};

// Grabs a new card for a given player.
// This function also takes care of emplacing a
// visual representation for that card on whatever
// column it should appear.
// Player index is determined as in playerSum.
const grabNewCard = whichPlayer => {
    // Grab a card from top of deck.
    // Assumes a shuffled deck.
    let newCard = deck.pop();
    // Deduce current player's container.
    // The "AI" containers are named against the
    // pattern "comX-cards". Player's container
    // is exclusive
    let playerContainer = "\#" +
	 ((whichPlayer === 3) ? "player-cards" : "com" + whichPlayer + "-cards");

    // Add card to player's hand
    playerHands[whichPlayer].push(newCard);
    // Emplace new HTML element on player's container
    $(playerContainer).append(
	createCard(newCard.suit.substring(0,2)
		 + newCard.number));
};

// Performs an automated turn for an unplayable
// player, indicated by index.
// Also performs a very simple logic for buying
// new cards: if said player is three points from
// 21, then don't take any more risks.
const computerTurn = which => {
    let sum = playerSum(which);
    while(sum < 18) {
	grabNewCard(which);
	sum = playerSum(which);
    }
};

// Calculate scores for all players and show
// them on an alert box.
// After the scores are presented, reload the
// webpage.
// TODO: Show winning status.
const debriefing = () => {
    // Generate an array of final scores
    let finalScores =
	[0, 1, 2, 3].map(which => playerSum(which));

    // Build debriefing string
    let debriefing =
	"Final scores:\n";
    for(i = 0; i <= 3; i++) {
	let playerName =
	    (i == 3) ? "You" : ("Player " + i);
	debriefing += playerName;
	debriefing += ": " + finalScores[i];
	if(i < 3) debriefing += "\n";
    }

    // Show debriefing, then reload page
    alert(debriefing);
    location.reload();
};


/* ========================= */
/*      GAME ENTRY-POINT     */

// Await jQuery's availability
$(document).ready(e => {
    
    // Prepare deck
    deck = generateDeck();
    shuffleDeck(deck);

    // Distribute some cards to players.
    // Each player starts with two cards
    for(i = 0; i < 2; i++) {
	for(j = 0; j <= 3; j++) {
	    grabNewCard(j);
	}
    }

    // Show player score
    $('#player-score').text("Score: " + playerSum(3));


    // Computer-controlled players perform
    // their plays first
    for(i = 0; i < 3; i++) {
	computerTurn(i);
    }
    
    // Now it's the player's turn
    myTurn = true;

    
    // Callback for clicking the deck.
    // Lets the player grab one more card. If the player's
    // score is equal or beyond 21, then just debrief.
    $('#deck').click(function(e) {
	e.preventDefault();
	if(!myTurn) { return; }

	// Check score
	let playerScore = playerSum(3);

	// Debrief if game is over
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

    // Callback for end-turn button.
    // The player can press the button anytime
    // to end his turn, whenever he feels he cannot take
    // any more risks.
    $('#end-turn-button').click(function(e) {
	e.preventDefault();
	if(!myTurn) { return; }
	debriefing();
    });
});
