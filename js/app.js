// Blackjack


$(document).ready(e => {
    console.log("jQuery is ready");
    /*window.setTimeout(() => {
	$('#thing').hide(250, () => {
	    $('#thing').show(250);
	});
       }, 2000);*/

    /* Card creation test */

    let createCard = () => {
	let cardElement = $(document.createElement("div"));
	cardElement.load('card.html', () => {
	    cardElement.find('#card-image').attr('src', 'images/sample-1.jpg');
	    console.log("Card loaded");
	});
	return cardElement;
    };


    for(i = 0; i < 17; i++) {
	$('#cards-holder').append(createCard());
    }

    $('#new-card-btn').click(e => {
	e.preventDefault();
	console.log("Okay");
    });
});
