document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");

  // Dark/Light mode setup
  const savedMode = localStorage.getItem("mode") || "dark";

  if (savedMode === "light") {
    body.classList.add("light-mode");
    if (themeToggle) themeToggle.textContent = "🌙";
  } else {
    body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "🌞";
  }

  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = body.classList.contains("dark-mode");
      body.classList.toggle("dark-mode", !isDark);
      body.classList.toggle("light-mode", isDark);
      themeToggle.textContent = isDark ? "🌙" : "🌞";
      localStorage.setItem("mode", isDark ? "light" : "dark");
    });
  } else {
    console.warn("Theme toggle button not found.");
  }

  // Random sentence logic
  const randomSentences = [
    "Loading your experience...",
    "Preparing awesomeness...",
    "Fetching data...",
    "Almost there...",
    "Hang tight, we're working on it!",
  ];

  function displayRandomSentence() {
    const sentenceElement = document.querySelector(".random-sentence");
    if (sentenceElement) {
      const randomIndex = Math.floor(Math.random() * randomSentences.length);
      sentenceElement.textContent = randomSentences[randomIndex];
    }
  }

  // Update loading sentence every 0.5 seconds
  const sentenceInterval = setInterval(displayRandomSentence, 500);

  // Hide loader and show content after page loads
  window.addEventListener("load", () => {
    console.log("Page loaded, hiding loader...");
    const loader = document.querySelector(".loader");
    const content = document.querySelector(".content");

    if (loader && content) {
      setTimeout(() => {
        loader.style.display = "none";
        content.style.display = "block";
        clearInterval(sentenceInterval);
      }, 2000);
    } else {
      console.error("Loader or content element not found!");
    }
  });
});
