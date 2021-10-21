let blackjackGame = {
  'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0, 'numberOfCards': 0},
  'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0, 'numberOfCards': 0},
  'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
  'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11]},
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'isStart': true,
  'isStand': false,
  'turnsOver': false,
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']
const hitSound = new Audio('./sounds/swish.m4a');
const winSound = new Audio('./sounds/cash.mp3');
const lossSound = new Audio('./sounds/aww.mp3')

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-clear-button').addEventListener('click', blackjackClear);

function blackjackDeal() {
  if (blackjackGame['isStart'] == true) {
    blackjackHit();
    blackjackHit();
    blackjackGame['isStart'] = false;
  }
}

function blackjackHit() {
  if (blackjackGame['isStand'] == false) {
    let card = randomCard();
    showCard(card, YOU);
    YOU['numberOfCards']++;
    updateScore(card, YOU);
    showScore(YOU);
    if (YOU['score'] > 21) {
      blackjackGame['isStand'] = true;
      blackjackGame['turnsOver'] = true;
      showResult(computeWinner());
    }
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
  }
}

function blackjackClear() {
  if (blackjackGame['turnsOver'] == true) {
    blackjackGame['isStand'] = false;
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    for (i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }
    YOU['score'] = 0;
    YOU['numberOfCards'] = 0;
    DEALER['score'] = 0;
    DEALER['numberOfCards'] = 0;
    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').textContent = 0;
    document.querySelector('#your-blackjack-result').style.color = '#fff';
    document.querySelector('#dealer-blackjack-result').style.color = '#fff';
    document.querySelector('#blackjack-result').textContent = "Let's play";
    document.querySelector('#blackjack-result').style.color = 'black';
    blackjackGame['turnsOver'] = false;
    blackjackGame['isStart'] = true;
  }
}

function updateScore(card, activePlayer) {
  if (card == 'A') {
    if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
      activePlayer['score'] += blackjackGame['cardsMap'][card][1];
    } else {
      activePlayer['score'] += blackjackGame['cardsMap'][card][0]
    }
  } else {
    activePlayer['score'] += blackjackGame['cardsMap'][card];
  }
}

function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  } else {
    document.querySelector(activePlayer['scoreSpan']).textContent= activePlayer['score'];
  }
}

function dealerLogic() {
  if (blackjackGame['turnsOver'] == false && YOU['score'] > 0) {
    while (DEALER['score'] < 17) {
      blackjackGame['isStand'] = true;
      let card = randomCard();
      showCard(card, DEALER);
      DEALER['numberOfCards']++;
      updateScore(card, DEALER);
      showScore(DEALER);
    }

    blackjackGame['turnsOver'] = true;
    showResult(computeWinner());
  }
}

function computeWinner() {
  let winner;
  if (YOU['score'] <= 21) {
    if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
      blackjackGame['wins']++;
      winner = YOU;
    } else if (YOU['score'] < DEALER['score']) {
      blackjackGame['losses']++;
      winner = DEALER;
    } else if (YOU['score'] == DEALER['score']) {
      if (YOU['score'] == 21) {
        if (YOU['numberOfCards'] == 2 && DEALER['numberOfCards'] > 2) {
          blackjackGame['wins']++;
          winner = YOU;
        } else if (YOU['numberOfCards'] > 2 && DEALER['numberOfCards'] == 2) {
          blackjackGame['losses']++;
          winner = DEALER;
        } else {
          blackjackGame['draws']++;
        }
      } else {
        blackjackGame['draws']++;
      }
    }
  } else {
    blackjackGame['losses']++;
    winner = DEALER;
  }
  return winner;
}

function showResult(winner) {
  let message, messageColor;
  if (blackjackGame['turnsOver'] == true) {
    if (winner == YOU) {
      document.querySelector('#wins').textContent = blackjackGame['wins'];
      message = 'You won!';
      messageColor = 'green';
      winSound.play();
    } else if (winner == DEALER) {
      document.querySelector('#losses').textContent = blackjackGame['losses'];
      message = 'You lost!';
      messageColor = 'red';
      lossSound.play();
    } else {
      document.querySelector('#draws').textContent = blackjackGame['draws'];
      message = 'You drew!';
      messageColor = 'black';
    }
    document.querySelector('#blackJack-result').textContent = message;
    document.querySelector('#blackJack-result').style.color = messageColor;
  }
}
