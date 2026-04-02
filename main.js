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
      <strong>24 hours.</strong> Unlimited ambition.
    </p>
  </section>
`;

async function loadSections() {
  const app = document.getElementById("app");
  if (!app) return;

  try {
    const htmlParts = await Promise.all(
      sectionFiles.map(async (path) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        return response.text();
      })
    );

    app.innerHTML = htmlParts.join("\n");
  } catch (error) {
    console.warn("Fallback triggered", error);
    app.innerHTML = countdownFallbackMarkup;
  }
}

function wireExternalLinks() {
  document.querySelectorAll(".register-link").forEach((a) => {
    a.href = REGISTER_FORM_URL;
    a.target = "_blank";
  });

  document.querySelectorAll(".brochure-link").forEach((a) => {
    a.href = BROCHURE_URL;
    a.target = "_blank";
  });

  document.querySelectorAll(".rules-link").forEach((a) => {
    a.href = RULES_URL;
    a.target = "_blank";
  });
}

function initCountdown() {
  const target = new Date("2026-04-29T09:30:00+05:30").getTime();
  const dEl = document.getElementById("cd-days");
  const hEl = document.getElementById("cd-hours");
  const mEl = document.getElementById("cd-mins");
  const sEl = document.getElementById("cd-secs");
  if (!dEl) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) return;

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
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  });

  els.forEach((el) => obs.observe(el));
}

function initFaqAccordion() {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      document.querySelectorAll(".faq-item").forEach((i) =>
        i.classList.remove("open")
      );
      item.classList.toggle("open");
    });
  });
}

function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  if (!hamburger) return;

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });
}

function initNavbarScroll() {
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("navbar");
    if (!nav) return;
    nav.style.background =
      window.scrollY > 40 ? "rgba(10,10,9,0.97)" : "rgba(10,10,9,0.85)";
  });
}

/* ✅ NEW — TIMELINE LOGIC */
function initScheduleTimeline() {
  const timelineEl = document.getElementById("timeline");
  const day1Btn = document.getElementById("day1Btn");
  const day2Btn = document.getElementById("day2Btn");

  if (!timelineEl || !day1Btn || !day2Btn) return;

  const day1 = [
    { time: "09:30 AM", title: "Opening Ceremony", desc: "Kickoff" },
    { time: "11:00 AM", title: "Ideation", desc: "Brainstorm" },
    { time: "01:30 PM", title: "Lunch", desc: "Break" },
    { time: "02:30 PM", title: "Evaluation", desc: "Judging" },
    { time: "05:30 PM", title: "Development", desc: "Build" },
    { time: "10:00 PM", title: "Overnight Hack", desc: "Continue" }
  ];

  const day2 = [
    { time: "08:30 AM", title: "Breakfast", desc: "Refresh" },
    { time: "09:30 AM", title: "Final Round", desc: "Demo" },
    { time: "11:30 AM", title: "Results", desc: "Winners" }
  ];

  function render(data) {
    timelineEl.innerHTML = data.map(item => `
      <div class="timeline-item">
        <div class="timeline-time">${item.time}</div>
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-event">${item.title}</div>
          <div class="timeline-desc">${item.desc}</div>
        </div>
      </div>
    `).join('');
  }

  function setActive(btn) {
    document.querySelectorAll(".timeline-btn").forEach(b =>
      b.classList.remove("active")
    );
    btn.classList.add("active");
  }

  day1Btn.addEventListener("click", () => {
    render(day1);
    setActive(day1Btn);
  });

  day2Btn.addEventListener("click", () => {
    render(day2);
    setActive(day2Btn);
  });

  render(day1);
}

/* ✅ BOOTSTRAP */
async function bootstrap() {
  await loadSections();

  wireExternalLinks();
  initCountdown();
  initScrollReveal();
  initFaqAccordion();
  initMobileMenu();
  initNavbarScroll();

  // 🔥 critical fix
  initScheduleTimeline();
}

bootstrap();
