let totalTypedCharacters = 0;
let time = 0;
let timerInterval;
let testRunning = false;
let typingBox = document.querySelector("#typingBox");
const paragraphBox = document.querySelector(".para_box p");

const sentenceFragments = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
  "Programming can be done using a variety of computer programming languages, such as JavaScript, Python, and C++.",
  "Typing speed is an important skill for programmers and writers.",
  "JavaScript is one of the most widely-used programming languages in the world.",
  "The future belongs to those who prepare for it today.",
  "A computer does what you tell it to do, not what you want it to do.",
  "Practice makes a man perfect in the art of coding.",
  "Clear syntax and logic are key to writing efficient programs.",
  "Focus and consistency improve both typing and thinking speed."
];

// Generate paragraph under a specific character limit
function generateParagraphByCharLimit(maxLength = 285) {
  const shuffled = sentenceFragments.sort(() => 0.5 - Math.random());
  let paragraph = "";
  
  for (let sentence of shuffled) {
      if ((paragraph + " " + sentence).trim().length <= maxLength) {
          paragraph += " " + sentence;
      } else {
          break;
      }
  }

  return paragraph.trim();
}

// Example usage
const paragraphText = generateParagraphByCharLimit(285);
// console.log(paragraphText);



// Replace paragraph with colored spans
function renderParagraph() {
    paragraphBox.innerHTML = "";
    for (let char of paragraphText) {
        const span = document.createElement("span");
        span.textContent = char;
        paragraphBox.appendChild(span);
    }
}

renderParagraph();

let btn = document.getElementById("startBtn").addEventListener("click", () => {
    testRunning = true;
    startTimer();
    typingBox.disabled = false;
    typingBox.focus();
    const btn = document.getElementById("startBtn");
    btn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> Reset`;
    btn.onclick = () => location.reload();
});

function startTimer() {
    clearInterval(timerInterval); // Avoid duplicate timers
    time = 0;

    updateTimerDisplay();

    timerInterval = setInterval(() => {
        time++;
        updateTimerDisplay();
        if (testRunning) updateWPM();
    }, 1000);
}

function updateWPM() {
    if (!testRunning) return;

    const words = totalTypedCharacters / 5;
    const minutes = time / 60;

    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
    document.querySelector(".wpm p").textContent = `${wpm} WPM`;
}

function updateTimerDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timerText = `${minutes > 0 ? minutes + "m " : ""}${seconds}s`;
    document.getElementById("timerDisplay").textContent = `Time: ${timerText}`;
}

// Typing logic
typingBox.addEventListener("input", () => {
    totalTypedCharacters = typingBox.value.trim().length;

    updateWPM();
    const input = typingBox.value;
    const spans = paragraphBox.querySelectorAll("span");

    let correctChars = 0;

    input.split("").forEach((char, index) => {
        const span = spans[index];
        if (!span) return;

        if (char === paragraphText[index]) {
            span.style.backgroundColor = "lightgreen";
            correctChars++;
        } else {
            span.style.backgroundColor = "lightcoral";
        }
    });

    // Reset extra span colors
    for (let i = input.length; i < spans.length; i++) {
        spans[i].style.backgroundColor = "transparent";
    }
    // Optional: if all cleared
    if (input.length === 0) {
        spans.forEach((span) => {
            span.style.backgroundColor = "transparent";
        });
    }

    // ✅ Stop timer & show reset if complete
    if (input.length === paragraphText.length) {
        testRunning = false;
        clearInterval(timerInterval);
        typingBox.disabled = true;

        const btn = document.getElementById("startBtn");
        btn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> Reset`;
        btn.onclick = () => location.reload();
    }

    // WPM and Accuracy
    const wordsTyped = input.trim().split(/\s+/).length;
    const timeInMinutes = time / 60 || 1;
    const wpm = Math.round(wordsTyped / timeInMinutes);
    const accuracy = Math.round((correctChars / input.length) * 100) || 0;

    document.getElementById("wpm").textContent = `${wpm} WPM`;
    document.getElementById("accuracy").textContent = `Accuracy: ${accuracy}%`;
});
