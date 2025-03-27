// Dark/Light mode toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Check for saved user preference, defaulting to dark mode
const savedMode = localStorage.getItem("mode") || "dark";
if (savedMode === "light") {
  body.classList.add("light-mode");
  themeToggle.textContent = "🌙"; // Moon emoji for light mode
} else {
  body.classList.add("dark-mode");
  themeToggle.textContent = "🌞"; // Sun emoji for dark mode
}

// Toggle dark/light mode on button click
themeToggle.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    themeToggle.textContent = "🌙"; // Moon emoji for light mode
    localStorage.setItem("mode", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    themeToggle.textContent = "🌞"; // Sun emoji for dark mode
    localStorage.setItem("mode", "dark");
  }
});

// Array of random sentences
const randomSentences = [
  "Loading your experience...",
  "Preparing awesomeness...",
  "Fetching data...",
  "Almost there...",
  "Hang tight, we're working on it!",
];

// Function to display a random sentence
function displayRandomSentence() {
  const sentenceElement = document.querySelector(".random-sentence");
  if (sentenceElement) {
    const randomIndex = Math.floor(Math.random() * randomSentences.length);
    sentenceElement.textContent = randomSentences[randomIndex];
  }
}

// Set an interval to update the random sentence every 2 seconds
const sentenceInterval = setInterval(displayRandomSentence, 500);

// Hide the loader and show the webpage after the page loads
window.addEventListener("load", () => {
  console.log("Page loaded, hiding loader...");
  const loader = document.querySelector(".loader");
  const content = document.querySelector(".content");
  if (loader && content) {
    // Add a delay before hiding the loader (e.g., 2 seconds)
    setTimeout(() => {
      loader.style.display = "none"; // Hide the loader after the delay
      content.style.display = "block"; // Show the webpage content
      clearInterval(sentenceInterval); // Stop updating random sentences
    }, 2000); // 2000ms = 2 seconds
  } else {
    console.error("Loader element not found!");
  }
});
