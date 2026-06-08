(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;
  let current = 0;

  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const sectionIndicator = document.getElementById("sectionIndicator");
  const slideDots = document.getElementById("slideDots");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  const arabicNums = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

  function toArabicNum(n) {
    return String(n)
      .split("")
      .map((d) => arabicNums[parseInt(d, 10)] ?? d)
      .join("");
  }

  function buildDots() {
    slideDots.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot" + (i === current ? " active" : "");
      dot.setAttribute("aria-label", "الشريحة " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      slideDots.appendChild(dot);
    });
  }

  function updateUI() {
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "prev");
      if (i === current) slide.classList.add("active");
      else if (i < current) slide.classList.add("prev");
    });

    const pct = ((current + 1) / total) * 100;
    progressBar.style.setProperty("--progress", pct + "%");
    progressText.textContent =
      toArabicNum(current + 1) + " / " + toArabicNum(total);

    const section = slides[current].dataset.section;
    if (section) {
      sectionIndicator.textContent = section;
      sectionIndicator.classList.add("visible");
    } else {
      sectionIndicator.classList.remove("visible");
    }

    slideDots.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  function goTo(index) {
    if (index < 0 || index >= total) return;
    current = index;
    updateUI();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowRight" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      goTo(0);
    } else if (e.key === "End") {
      goTo(total - 1);
    }
  });

  let touchStartX = 0;
  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) < 50) return;
      if (diff > 0) next();
      else prev();
    },
    { passive: true }
  );

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  buildDots();
  updateUI();
})();
