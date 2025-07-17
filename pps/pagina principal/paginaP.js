const searchInput = document.getElementById('searchInput');
const gameCards = document.querySelectorAll('.game-card');

searchInput.addEventListener('input', () => {
  const value = searchInput.value.toLowerCase();
  gameCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = title.includes(value) ? 'block' : 'none';
  });
});