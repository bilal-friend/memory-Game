// Selecting elements from the DOM
const cards = Array.from(document.querySelectorAll(".card"));
const imgs = Array.from(document.querySelectorAll("img"));
const flipSpan = document.querySelector(".flips span");
const timeSpan = document.querySelector(".time span");
const refreshBtn = document.querySelector("button");
const popup = document.querySelector(".popup");
const popupBtn = document.querySelector(".closeBtn");
const setting = document.querySelector("h2");
const controllPannel = document.querySelector(".controll");
const parent = document.querySelector(".parent");
const container = document.querySelector(".container");
const bodyBefore = window.getComputedStyle(document.body, "::before");

// Variables initialization
let game = "rules";
let flips = 0;
let maxFlips = 30;
let maxTime = 30;
let time = maxTime;
let timer;

// Shuffle the images
shuffle(imgs);

// Event listener for card clicks
cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (time === 0 || card.classList.contains("back-view")) return;

    if (flips >= maxFlips && game === "rules") {
      stopTimer();
      return;
    }

    flips++;
    flipSpan.textContent = flips;

    if (game === "rules" && flips === 1) {
      startTimer();
    }

    if (!card.classList.contains("found")) {
      card.classList.toggle("back-view");
    }

    let chosen = cards.filter(
      (card) =>
        card.classList.contains("back-view") &&
        !card.classList.contains("found")
    );

    if (chosen.length === 2) {
      if (
        chosen[0].children[1].children[0].src ===
        chosen[1].children[1].children[0].src
      ) {
        chosen.forEach((card) => card.classList.add("found"));
        chosen = [];
      } else {
        chosen.forEach((card) => card.classList.add("false"));
        setTimeout(() => {
          chosen.forEach((card) => card.classList.remove("false"));
          chosen.forEach((card) => card.classList.remove("back-view"));
        }, 1500);
      }

      if (cards.every((card) => card.classList.contains("found"))) {
        setTimeout(() => {
          alert("Congratulations! You win.");
          location.reload();
        }, 4000);
      }
    }
  });
});

// Function to shuffle images
function shuffle(images) {
  let array = [1, 2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4, 3, 2, 1];
  for (let i = 0; i < array.length; i++) {
    let random = Math.floor(Math.random() * array.length);
    [array[array.length - 1], array[random]] = [
      array[random],
      array[array.length - 1],
    ];
  }
  images.forEach((image, index) => {
    image.src = `Memory Card Game Images/img-${array[index]}.png`;
  });
}

// Event listener for refresh button
refreshBtn.addEventListener("click", () => {
  cards.forEach((card) => {
    card.classList.remove("back-view");
    card.classList.remove("found");
  });

  flips = 0;
  flipSpan.textContent = 0;

  time = maxTime;
  timeSpan.textContent = time;

  stopTimer();
});

// Function to start the timer
function startTimer() {
  timer = setInterval(() => {
    time--;
    timeSpan.textContent = time;

    if (time <= 0) stopTimer();
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timer);
}

// Event listener for popup button
popupBtn.addEventListener("click", () => {
  adjustingFocus();
  popup.classList.toggle("show");
});

// Event listener for settings
setting.addEventListener("click", () => {
  adjustingFocus();
  popup.classList.toggle("show");
});

// Function to adjust focus and game settings
function adjustingFocus() {
  if (bodyBefore.display === "none") {
    document.body.style.setProperty("--display--", "block");
  } else {
    document.body.style.setProperty("--display--", "none");
  }

  const name = document.querySelector('[name="mode"]:checked');

  if (name.id === "free") {
    controllPannel.style.display = "none";
    parent.style.height = "100%";
    container.style.maxHeight = "550px";
    game = "free";
  } else {
    controllPannel.style.display = "flex";
    parent.style.height = "80%";
    container.style.maxHeight = "600px";
    game = "rules";
    const level = document.querySelector('[name="level"]:checked');
    maxFlips = level.id === "hard" ? 25 : level.id === "medium" ? 3 : 50;
    maxTime = level.id === "hard" ? 30 : level.id === "medium" ? 60 : 90;
  }

  refreshBtn.click();
}
