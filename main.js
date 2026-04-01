/** Paste your links here (open in a new tab when they start with http). */
const REGISTER_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdTFbtbSUuYAFguAUi7UM96pLU4rC3h0-pe0CHAQIVHkDnriA/viewform?usp=publish-editor";
const BROCHURE_URL = "https://drive.google.com/file/d/1xvHf3AHm_fgFoGPl_KGBpKoFvr-QEiQL/preview";
const RULES_URL =
  "https://drive.google.com/file/d/1X8kxqBBzCgP1iAT2u55lYbFvb9taHrQP/preview";

const sectionFiles = [
  "sections/01-navbar.html",
  "sections/02-hero.html",
  "sections/03-about.html",
  "sections/04-prizes.html",
  "sections/05-schedule.html",
  "sections/06-resources.html",
  "sections/07-faq.html",
  "sections/08-contact.html",
  "sections/09-location.html",
  "sections/10-footer.html",
];

const countdownFallbackMarkup = `
  <section id="hero">
    <div class="hero-grid-bg"></div>
    <div class="hero-gradient"></div>
    <div class="hero-eyebrow">CMR Institute of Technology &nbsp;·&nbsp; Bengaluru</div>
    <h1 class="display hero-title">CODE<span class="accent">RUSH</span></h1>
    <p class="hero-subtitle">
      <strong>24 hours.</strong> Unlimited ambition. Build something the world has not seen yet - at CMRIT's flagship hackathon.
    </p>
    <div class="hero-actions">
      <a href="${REGISTER_FORM_URL}" class="btn-primary register-link">Register Your Team</a>
      <a href="#about" class="btn-secondary">Learn More</a>
    </div>
    <div class="countdown" id="countdown">
      <div class="countdown-unit">
        <div class="countdown-number" id="cd-days">00</div>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit">
        <div class="countdown-number" id="cd-hours">00</div>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit">
        <div class="countdown-number" id="cd-mins">00</div>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-sep">:</div>
      <div class="countdown-unit">
        <div class="countdown-number" id="cd-secs">00</div>
        <span class="countdown-label">Seconds</span>
      </div>
    </div>
  </section>
`;

async function loadSections() {
  const app = document.getElementById("app");
  if (!app) return;

  try {
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
  } catch (error) {
    console.warn("Section loading failed, rendering countdown fallback.", error);
    app.innerHTML = countdownFallbackMarkup;
  }
}

function wireExternalLinks() {
  document.querySelectorAll(".register-link").forEach((a) => {
    a.href = REGISTER_FORM_URL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
  document.querySelectorAll(".brochure-link").forEach((a) => {
    a.href = BROCHURE_URL;
    if (BROCHURE_URL.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  });
  document.querySelectorAll(".rules-link").forEach((a) => {
    a.href = RULES_URL;
    if (RULES_URL.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  });
}

function initCountdown() {
  const target = new Date("2026-04-29T09:30:00+05:30").getTime();
  const dEl = document.getElementById("cd-days");
  const hEl = document.getElementById("cd-hours");
  const mEl = document.getElementById("cd-mins");
  const sEl = document.getElementById("cd-secs");
  if (!dEl || !hEl || !mEl || !sEl) return;
  let timerId = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = "00";
      if (timerId) clearInterval(timerId);
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
  timerId = setInterval(tick, 1000);
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

function initNavbarScroll() {
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("navbar");
    if (!nav) return;
    nav.style.background = window.scrollY > 40 ? "rgba(10,10,9,0.97)" : "rgba(10,10,9,0.85)";
  });
}

async function bootstrap() {
  await loadSections();
  wireExternalLinks();
  initCountdown();
  initScrollReveal();
  initFaqAccordion();
  initMobileMenu();
  initNavbarScroll();
}

bootstrap().catch((error) => {
  console.error(error);
});
