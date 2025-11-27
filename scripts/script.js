const game = {
  word: "",
  hint: "",
  guessedLetters: [],
  wrongGuesses: 0,
  maxGuesses: 6
};

fetch("../json/words.json")
  .then(res => res.json())
  .then(data => startGame(data));

function startGame(words) {
  const random = words[Math.floor(Math.random() * words.length)];

  game.word = random.word.toLowerCase();
  game.hint = random.hint;
  game.guessedLetters = [];
  game.wrongGuesses = 0;

  
  document.getElementById("hint").textContent = "Hint: " + game.hint;
  document.getElementById("guess-counter").textContent = "Incorrect guesses: 0/6";
  document.getElementById("hangman-image").src = "../images/C01-100.jpg";

  document.getElementById("modal").classList.add("hidden");

  displayWord();
  createLetterButtons();
}


function displayWord() {
  const div = document.getElementById("word-display");
  div.textContent = game.word
    .split("")
    .map(l => (game.guessedLetters.includes(l) ? l : "_"))
    .join(" ");
}


function createLetterButtons() {
  const container = document.getElementById("letters-container");
  container.innerHTML = "";

  "abcdefghijklmnopqrstuvwxyz".split("").forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.classList.add("letter-btn");

    btn.addEventListener("click", () => handleGuess(letter, btn));

    container.appendChild(btn);
  });
}


function handleGuess(letter, btn) {
  btn.disabled = true;

  if (game.word.includes(letter)) {
    game.guessedLetters.push(letter);
    displayWord();
    checkWin();
  } else {
    game.wrongGuesses++;
    updateHangmanImage();
    updateCounter();
    checkLose();
  }
}


function updateHangmanImage() {
  let stage = game.wrongGuesses;
  if (stage < 1) stage = 1;
  if (stage > 6) stage = 6;

  document.getElementById("hangman-image").src =
    `../images/C0${stage}-100.jpg`;
}


function updateCounter() {
  document.getElementById("guess-counter").textContent =
    `Incorrect guesses: ${game.wrongGuesses}/6`;
}


function checkWin() {
  const won = game.word.split("").every(letter =>
    game.guessedLetters.includes(letter)
  );

  if (won) showModal(`🎉 You Won!`, true);
}


function checkLose() {
  if (game.wrongGuesses >= game.maxGuesses) {
    showModal(`💀 You Lost! The word was: ${game.word}`);
  }
}


function showModal(message, isWin) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const modalImage = document.getElementById("modal-image");

  modalMessage.textContent = message;

  if (isWin) {
    modalImage.src = "../images/1-Pass-100.jpg";
    modalImage.className = "win-img";
    modalImage.style.display = "block";
  } else {
    modalImage.src = "../images/1-Fail-100.jpg";
    modalImage.className = "fail-img";
    modalImage.style.display = "block";
  }

  modal.classList.remove("hidden");
  modal.classList.add("show");

  document.querySelectorAll(".letter-btn").forEach(btn => btn.disabled = true);
}


document.getElementById("play-again").addEventListener("click", () => {
  fetch("../json/words.json")
    .then(res => res.json())
    .then(data => startGame(data));
});
