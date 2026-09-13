var toggle = document.getElementById("themeToggle");
var isEn = document.documentElement.lang === "en";

function updateButton(theme) {
  toggle.textContent = isEn
    ? theme === "dark" ? "Light theme" : "Dark theme"
    : theme === "dark" ? "Светлая тема" : "Тёмная тема";
}

updateButton(document.documentElement.getAttribute("data-theme"));

toggle.addEventListener("click", function () {
  var theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateButton(theme);
});

var langToggle = document.getElementById("langToggle");

if (langToggle) {
  langToggle.addEventListener("click", function () {
    var target = langToggle.getAttribute("data-target");
    document.body.style.transition = "opacity 0.25s ease";
    document.body.style.opacity = "0";
    setTimeout(function () {
      window.location.href = target;
    }, 250);
  });
}

var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
var tabs = Array.prototype.slice.call(document.querySelectorAll(".formats-tabs button"));
var index = 0;

var slideState = {};

function applySlideState() {
  slides.forEach(function (el) {
    var key = el.getAttribute("data-format");
    if (!key) return;
    var done = slideState[key] === true;
    el.classList.toggle("is-done", done);
    var badge = el.querySelector(".slide-badge");
    if (badge) {
      badge.textContent = (done ? "\u2713 " : "") + (isEn ? (done ? "Done" : "In progress") : (done ? "Сделано" : "В работе"));
    }
  });
}

function setSlideStatus(key, done) {
  slideState[key] = !!done;
  applySlideState();
}

slides.forEach(function (el) {
  var key = el.getAttribute("data-format");
  if (key) slideState[key] = el.getAttribute("data-done") === "true";
});

applySlideState();

function setSlide(next, dir) {
  if (next === index) return;
  slides[index].classList.remove("active");
  slides[next].classList.remove("left");
  if (dir < 0) slides[next].classList.add("left");
  void slides[next].offsetWidth;
  slides[next].classList.add("active");
  tabs[index].classList.remove("active");
  tabs[next].classList.add("active");
  index = next;
}

var autoplay = null;
var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function stopAutoplay() {
  if (autoplay !== null) {
    clearInterval(autoplay);
    autoplay = null;
  }
}

function startAutoplay() {
  stopAutoplay();
  if (reducedMotion) return;
  autoplay = setInterval(function () {
    setSlide(index === slides.length - 1 ? 0 : index + 1, 1);
  }, 4000);
}

document.querySelectorAll(".formats-tabs button").forEach(function (btn, i) {
  btn.addEventListener("click", function () {
    setSlide(i, i > index ? 1 : -1);
    startAutoplay();
  });
});

document.getElementById("prevFormat").addEventListener("click", function () {
  setSlide(index === 0 ? slides.length - 1 : index - 1, -1);
  startAutoplay();
});

document.getElementById("nextFormat").addEventListener("click", function () {
  setSlide(index === slides.length - 1 ? 0 : index + 1, 1);
  startAutoplay();
});

var formatsBox = document.querySelector(".formats");

if (formatsBox) {
  formatsBox.addEventListener("mouseenter", stopAutoplay);
  formatsBox.addEventListener("mouseleave", startAutoplay);
}

startAutoplay();

var hero = document.querySelector(".hero");
var download = document.querySelector(".download");
var about = document.getElementById("about");
var goal = document.getElementById("goal");
var why = document.getElementById("why");

function centerBetweenLines(topLine, bottomLine, block) {
  if (!block) return;
  var wrap = block.querySelector(".wrapper");
  if (!wrap) return;
  var blockRect = block.getBoundingClientRect();
  var baseCenter = blockRect.top + wrap.offsetTop + wrap.offsetHeight / 2;
  var mid = (topLine + bottomLine) / 2;
  var delta = Math.round(mid - baseCenter);
  wrap.style.transform = "translateY(" + delta + "px)";
}

function onScroll() {
  var vh = window.innerHeight;

  if (hero) {
    var p = Math.min(1, window.scrollY / vh);
    var fade = Math.max(0, 1 - p);
    hero.style.opacity = String(Math.max(0.5, fade));
    hero.style.transform = "translateY(" + -p * vh * 0.12 + "px)";
    var heroWrap = hero.querySelector(".wrapper");
    if (heroWrap) heroWrap.style.opacity = String(fade);
  }

  if (download) {
    var delay = vh * 0.55;
    var p2 = (window.scrollY + vh - download.offsetTop - delay) / (vh - delay);
    p2 = Math.min(1, Math.max(0, p2));
    download.style.opacity = String(0.3 + 0.7 * p2);
    download.style.transform = "translateY(" + (1 - p2) * vh * 0.15 + "px)";
  }

  if (hero && goal && about) {
    centerBetweenLines(
      hero.getBoundingClientRect().bottom,
      goal.getBoundingClientRect().top,
      about
    );
  }

  if (why && download) {
    centerBetweenLines(
      why.getBoundingClientRect().top,
      download.getBoundingClientRect().top,
      why
    );
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();