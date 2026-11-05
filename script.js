const root = document.documentElement;
const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("primaryNav");
const themeToggle = document.getElementById("themeToggle");
const printButton = document.getElementById("printResume");
const toast = document.getElementById("toast");
const yearLabel = document.getElementById("year");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {}
}

setTheme(root.dataset.theme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function closeMenu() {
  header.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (header.classList.contains("nav-open") && !header.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});

const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => spy.observe(section));
}

const revealElements = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-stagger]").forEach((group) => {
  group.querySelectorAll(":scope > .reveal").forEach((item, index) => {
    if (!item.style.getPropertyValue("--d")) {
      item.style.setProperty("--d", `${Math.min(index * 0.08, 0.4)}s`);
    }
  });
});

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const revealer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => revealer.observe(element));
}

if (printButton) {
  printButton.addEventListener("click", () => {
    window.print();
  });
}

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (finePointer && !reduceMotion) {
  document.querySelectorAll("[data-tilt]").forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      target.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
    });

    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });

  document.querySelectorAll("[data-spotlight]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

const progressFill = document.getElementById("scrollProgress");
const timeline = document.querySelector(".timeline");
let scrollTicking = false;

function updateScrollFx() {
  scrollTicking = false;
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const progress = max > 0 ? Math.min(Math.max(doc.scrollTop / max, 0), 1) : 0;

  if (progressFill) {
    progressFill.style.setProperty("--p", progress.toFixed(4));
  }

  if (timeline) {
    const rect = timeline.getBoundingClientRect();
    const viewport = window.innerHeight;
    const fill = Math.min(Math.max((viewport * 0.8 - rect.top) / Math.max(rect.height, 1), 0), 1);
    timeline.style.setProperty("--line-progress", fill.toFixed(4));
  }
}

function requestScrollFx() {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateScrollFx);
}

window.addEventListener("scroll", requestScrollFx, { passive: true });
window.addEventListener("resize", requestScrollFx);
window.addEventListener("load", requestScrollFx);
updateScrollFx();

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (fallbackError) {
      copied = false;
    }
    document.body.removeChild(field);
    return copied;
  }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const copied = await copyText(button.dataset.copy);
    showToast(copied ? "Email copied to clipboard" : "Could not copy — please select the email manually");
  });
});

document.querySelectorAll(".avatar-photo").forEach((photo) => {
  const removePhoto = () => photo.remove();
  photo.addEventListener("error", removePhoto);
  if (photo.complete && photo.naturalWidth === 0) {
    removePhoto();
  }
});

if (yearLabel) {
  yearLabel.textContent = String(new Date().getFullYear());
}
