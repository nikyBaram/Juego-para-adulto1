// Emojis para las cartas
const emojis = ['🍎','🍌','🍇','🍓','🍊','🍍','🥝','🍉'];
let cards = [...emojis, ...emojis];

// Variables de estado
let flippedCards = [];
let matched = [];
let attempts = 0;
let pairs = 0;
let timer = 0;
let timerInterval;
let gameStarted = false;

// Elementos del DOM
const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const matchDisplay = document.getElementById('matches');
const timerDisplay = document.getElementById('timer');
const bestScoreDisplay = document.getElementById('bestScore');
const winMessage = document.getElementById('winMessage');
const successSound = document.getElementById('successSound');
const errorSound = document.getElementById('errorSound');
const startButton = document.getElementById('start');

// Mezcla las cartas
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Dibuja las cartas en el tablero
function renderGrid() {
  grid.innerHTML = '';
  shuffle(cards).forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.addEventListener('click', handleFlip);
    grid.appendChild(card);
  });
}

// Voltear carta
function handleFlip(e) {
  if (!gameStarted) return;

  const card = e.target;
  const { emoji, index } = card.dataset;

  if (flippedCards.length === 2 || card.classList.contains('flipped') || matched.includes(index)) return;

  card.textContent = emoji;
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    attempts++;
    scoreDisplay.textContent = `Intentos: ${attempts}`;

    const [first, second] = flippedCards;
    if (first.dataset.emoji === second.dataset.emoji) {
      successSound.play();
      matched.push(first.dataset.index, second.dataset.index);
      first.classList.add('matched');
      second.classList.add('matched');
      flippedCards = [];
      pairs++;
      matchDisplay.textContent = `Pares encontrados: ${pairs}`;
      checkWin();
    } else {
      errorSound.play();
      setTimeout(() => {
        first.textContent = '';
        second.textContent = '';
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        flippedCards = [];
      }, 800);
    }
  }
}

// Verificar si se ganó
function checkWin() {
  if (pairs === emojis.length) {
    clearInterval(timerInterval);
    gameStarted = false;

    winMessage.textContent = '🎉 ¡Ganó, felicitaciones! 🎉';
    winMessage.classList.add('show');

    const best = localStorage.getItem('bestScore');
    if (!best || attempts < best) {
      localStorage.setItem('bestScore', attempts);
      bestScoreDisplay.textContent = `🏆 ¡Nuevo mejor puntaje!: ${attempts} intentos`;
    }

    setTimeout(() => {
      winMessage.classList.remove('show');
      resetGame();
    }, 3000); // Mostrar mensaje por 3 segundos
  }
}

// Iniciar cronómetro
function startTimer() {
  timer = 0;
  timerDisplay.textContent = `Tiempo: 0s`;
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Tiempo: ${timer}s`;
  }, 1000);
}

// Reiniciar juego
function resetGame() {
  clearInterval(timerInterval);
  attempts = 0;
  pairs = 0;
  flippedCards = [];
  matched = [];
  scoreDisplay.textContent = 'Intentos: 0';
  matchDisplay.textContent = 'Pares encontrados: 0';
  timerDisplay.textContent = 'Tiempo: 0s';
  winMessage.textContent = '';
  gameStarted = false;
  renderGrid();
}

// Iniciar juego con botón
function startGame() {
  resetGame();
  gameStarted = true;
  startTimer();
}

document.getElementById('reset').addEventListener('click', resetGame);
document.getElementById('start').addEventListener('click', startGame);

window.onload = () => {
  const best = localStorage.getItem('bestScore');
  if (best) bestScoreDisplay.textContent = `🥇 Mejor puntaje: ${best} intentos`;
  renderGrid();
};
