const body = document.body;
const header = document.querySelector(".site-header");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
const progressBar = document.querySelector(".scroll-progress span");
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");
const filterButtons = document.querySelectorAll(".project-filters button");
const projectCards = document.querySelectorAll(".project-card[data-category]");
const siteCursor = document.querySelector(".site-cursor");

function setTheme(theme) {
  const useLight = theme === "light";
  body.classList.toggle("light", useLight);
  themeIcon.textContent = useLight ? "MOON" : "SUN";
  themeToggle.setAttribute(
    "aria-label",
    useLight ? "Switch to dark theme" : "Switch to light theme"
  );
}

const savedTheme = localStorage.getItem("portfolio-theme");
setTheme(savedTheme || (prefersLight.matches ? "light" : "dark"));

window.addEventListener("pointermove", (event) => {
  siteCursor.classList.add("visible");
  siteCursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});

document.documentElement.addEventListener("mouseleave", () => {
  siteCursor.classList.remove("visible");
});

window.addEventListener("pointerdown", () => {
  siteCursor.classList.add("pressed");
});

window.addEventListener("pointerup", () => {
  siteCursor.classList.remove("pressed");
});

document.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("pointerenter", () => {
    siteCursor.classList.add("over-link");
  });
  element.addEventListener("pointerleave", () => {
    siteCursor.classList.remove("over-link");
  });
});

document.querySelectorAll(".project-feature, .project-card, .data-case-study").forEach((card) => {
  card.addEventListener("pointerenter", () => {
    siteCursor.classList.add("over-card");
  });
  card.addEventListener("pointerleave", () => {
    siteCursor.classList.remove("over-card");
  });
});

themeToggle.addEventListener("click", () => {
  const nextTheme = body.classList.contains("light") ? "dark" : "light";
  setTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("scrolled", window.scrollY > 12);

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  },
  { passive: true }
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navAnchors.forEach((anchor) => {
        anchor.classList.toggle(
          "active",
          anchor.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const shouldShow =
        selected === "all" || card.dataset.category === selected;
      card.classList.toggle("filtered-out", !shouldShow);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

document.getElementById("year").textContent = new Date().getFullYear();
