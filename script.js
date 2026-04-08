let currentQuote = null;

const themeToggleBtn = document.getElementById("theme-toggle");

// ---------- THEME (DARK MODE) ----------

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Change icon 🌙 / ☀️
  themeToggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  applyTheme(initialTheme);
}

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
});
// ---------- QUOTE FETCH ----------
async function fetchQuote() {
  showLoader();

  try {
    const response = await fetch("https://dummyjson.com/quotes/random");

    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    currentQuote = data;
    renderQuote(data);
  } catch (error) {
    showError();
  }
}

function animateQuoteCard() {
  const card = document.getElementById("quote-card");
  if (!card) return;

  card.classList.remove("quote-animate");
  void card.offsetWidth; // restart animation
  card.classList.add("quote-animate");
}

function renderQuote(data) {
  document.getElementById("quote-text").textContent = data.quote;
  document.getElementById("quote-author").textContent = data.author;
  document.getElementById("quote-id").textContent = `Quote #${data.id}`;

  document.getElementById("loader").classList.add("hidden");
  document.getElementById("error").classList.add("hidden");
  document.getElementById("quote-card").classList.remove("hidden");

  animateQuoteCard();
}

function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("quote-card").classList.add("hidden");
  document.getElementById("error").classList.add("hidden");
}

function showError() {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("quote-card").classList.add("hidden");
  document.getElementById("error").classList.remove("hidden");
}

async function copyQuote() {
  if (!currentQuote) return;

  const text = `"${currentQuote.quote}" — ${currentQuote.author}`;
  await navigator.clipboard.writeText(text);

  const btn = document.getElementById("copy-btn");
  btn.textContent = "Copied!";
  btn.classList.add("copied");

  setTimeout(() => {
    btn.textContent = "Copy";
    btn.classList.remove("copied");
  }, 2000);
}

// Load on page open
initTheme();
fetchQuote();