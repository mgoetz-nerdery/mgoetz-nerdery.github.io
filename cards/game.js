// Utility to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const form = document.querySelector('[data-form]');
const layout = document.querySelector('[data-layout]');
let cards = [];
let flippedCards = [];
let lockBoard = false;
let score = 0;

function renderCards(cardValues) {
  layout.innerHTML = '';
  cardValues.forEach((value, idx) => {
    const card = document.createElement('flippable-card');
    card.setAttribute('data-index', idx);
    card.setAttribute('data-value', value);
    card.appendChild(document.createTextNode(value));
    // Cards start face down (no 'flipped' attribute)
    layout.appendChild(card);
  });
}

function resetGame(cardValues) {
  score = 0;
  flippedCards = [];
  lockBoard = false;
  renderCards(cardValues);
  // Attach event listeners to new cards
  layout.querySelectorAll('flippable-card').forEach(card => {
    card.addEventListener('card-flip', onCardFlip);
  });
}

function onCardFlip(e) {
  if (lockBoard) return;
  const card = e.currentTarget;
  if (flippedCards.includes(card)) return; // Already flipped

  card.setAttribute('data-flipped', 'true');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    const [card1, card2] = flippedCards;
    if (card1.getAttribute('data-value') === card2.getAttribute('data-value')) {
      // Match found
      score++;
      flippedCards = [];
      lockBoard = false;
    } else {
      // Not a match, flip back after delay
      setTimeout(() => {
        card1.removeAttribute('data-flipped');
        card2.removeAttribute('data-flipped');
        flippedCards = [];
        lockBoard = false;
      }, 1500);
    }
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const textarea = form.querySelector('textarea');
  let values = textarea.value
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean);

  // For memory game, duplicate and shuffle
  values = shuffle([...values, ...values]);
  resetGame(values);
});

// Optionally, initialize with default cards