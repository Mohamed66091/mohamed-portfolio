function toggleTheme() {
    document.body.classList.toggle("dark");
  }
  
  // Initialize AOS animations
  document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
      duration: 800,
      once: true,
    });
  });
  