const sectionFiles = [
  "sections/01-navbar.html",
  "sections/02-hero.html",
  "sections/03-about.html",
  "sections/04-prizes.html",
  "sections/05-schedule.html",
  "sections/06-sponsors.html",
  "sections/07-faq.html",
  "sections/08-location.html",
  "sections/09-register.html",
  "sections/10-footer.html",
];

async function loadSections() {
  const app = document.getElementById("app");
  if (!app) return;

  const htmlParts = await Promise.all(
    sectionFiles.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load section: ${path}`);
      }
      return response.text();
    })
  );

  app.innerHTML = htmlParts.join("\n");
}

function initCountdown() {
  const target = new Date("2025-04-29T08:00:00+05:30").getTime();
  const dEl = document.getElementById("cd-days");
  const hEl = document.getElementById("cd-hours");
  const mEl = document.getElementById("cd-mins");
  const sEl = document.getElementById("cd-secs");
  if (!dEl || !hEl || !mEl || !sEl) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = "00";
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    dEl.textContent = pad(d);
    hEl.textContent = pad(h);
    mEl.textContent = pad(m);
    sEl.textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
}

function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => obs.observe(el));
}

function initFaqAccordion() {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (!item) return;
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });

  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobileNav.classList.remove("open"));
  });
}

function initFormSubmit() {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", () => {
    const form = document.getElementById("regForm");
    const success = document.getElementById("formSuccess");
    if (!form || !success) return;
    form.style.display = "none";
    success.classList.add("show");
  });
}

function initNavbarScroll() {
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("navbar");
    if (!nav) return;
    nav.style.background = window.scrollY > 40 ? "rgba(10,10,9,0.97)" : "rgba(10,10,9,0.85)";
  });
}

async function bootstrap() {
  await loadSections();
  initCountdown();
  initScrollReveal();
  initFaqAccordion();
  initMobileMenu();
  initFormSubmit();
  initNavbarScroll();
}

bootstrap().catch((error) => {
  console.error(error);
});
