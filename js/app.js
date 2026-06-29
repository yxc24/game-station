/* ============================================
   GAME STATION — App Shell
   ============================================ */

/**
 * games: array of game objects to register.
 * Shape: { id, title, genre, color, path, playtime }
 *
 * Add entries here when you drop in a new game.
 * The home page will populate itself automatically.
 */
const games = [
  {
    id: "neon-dragon",
    title: "Neon Dragon",
    genre: "Arcade",
    color: "#050505",
    path: "games/neon-dragon/index.html",
    playtime: "5–15 min"
  }
];

/* ---- DOM references ---- */
const gameGrid   = document.getElementById('game-grid');
const gameCount  = document.getElementById('game-count');
const featCard   = document.getElementById('featured-card');

/* ---- Bootstrap ---- */
function init() {
  updateCount();

  if (games.length > 0) {
    renderFeatured(games[0]);
    renderGrid();
  }

  // Smooth active nav on scroll
  initScrollSpy();
}

/* ---- Count ---- */
function updateCount() {
  const n = games.length;
  gameCount.textContent = n === 0 ? '0 games' : `${n} game${n !== 1 ? 's' : ''}`;
}

/* ---- Featured card ---- */
function renderFeatured(game) {
  featCard.innerHTML = `
    <div class="featured-card-art" style="background-color: ${game.color}22;">
      <div class="art-grid" aria-hidden="true">
        ${Array(9).fill('<span></span>').join('')}
      </div>
    </div>
    <div class="featured-card-info">
      <span class="card-genre-tag">${escHtml(game.genre)}</span>
      <h3 class="featured-title">${escHtml(game.title)}</h3>
      <div class="featured-meta">
        <span class="meta-item">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M8 5v3.5l2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          ${escHtml(game.playtime)}
        </span>
      </div>
      <a href="${escAttr(game.path)}" class="play-btn">
        <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 4l9 6-9 6V4z"/>
        </svg>
        Play
      </a>
    </div>
  `;
}

/* ---- Game grid ---- */
function renderGrid() {
  // Remove placeholder empty slots
  gameGrid.innerHTML = '';

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card game-card--active';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Play ${game.title}`);

    card.innerHTML = `
      <div class="card-art" style="background-color: ${game.color}18;">
        <div class="art-dot-grid" aria-hidden="true"></div>
      </div>
      <div class="card-body">
        <span class="card-title">${escHtml(game.title)}</span>
        <span class="card-genre">${escHtml(game.genre)}</span>
        <div class="card-footer">
          <span class="meta-item" style="font-size:0.75rem">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/>
              <path d="M8 5v3.5l2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            ${escHtml(game.playtime)}
          </span>
          <span class="card-play-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 4l9 6-9 6V4z"/>
            </svg>
          </span>
        </div>
      </div>
    `;

    // Navigate on click or Enter/Space
    const navigate = () => { window.location.href = game.path; };
    card.addEventListener('click', navigate);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(); }
    });

    gameGrid.appendChild(card);
  });

  // Pad to at least 6 slots with empty cards
  const empties = Math.max(0, 6 - games.length);
  for (let i = 0; i < empties; i++) {
    gameGrid.innerHTML += `
      <div class="game-card game-card--empty" aria-label="Empty slot">
        <div class="card-art placeholder-art">
          <div class="art-dot-grid" aria-hidden="true"></div>
        </div>
        <div class="card-body">
          <span class="card-empty-label">Open slot</span>
        </div>
      </div>
    `;
  }
}

/* ---- Scroll spy ---- */
function initScrollSpy() {
  const links = document.querySelectorAll('.nav-link');
  const sections = [...links]
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

/* ---- Helpers ---- */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}

/* ---- Run ---- */
document.addEventListener('DOMContentLoaded', init);
