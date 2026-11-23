// About Us page interactions. Shared nav / reveal logic lives in script.js.
(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  /* ---------- helpers ---------- */
  const onVisible = (elements, callback, threshold = 0.2) => {
    if (!("IntersectionObserver" in window)) {
      elements.forEach(callback);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );
    elements.forEach((element) => observer.observe(element));
  };

  /* ---------- split headlines into animated characters ---------- */
  const splitChars = (root) => {
    root.setAttribute(
      "aria-label",
      root.textContent.replace(/\s+/g, " ").trim(),
    );
    let index = 0;

    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          child.setAttribute("aria-hidden", "true");
          walk(child);
          return;
        }
        if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) {
          return;
        }
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.append(" ");
            return;
          }
          const word = document.createElement("span");
          word.className = "word";
          word.setAttribute("aria-hidden", "true");
          [...part].forEach((letter) => {
            const char = document.createElement("span");
            char.className = "char";
            char.textContent = letter;
            char.style.setProperty("--c", index++);
            word.append(char);
          });
          fragment.append(word);
        });
        child.replaceWith(fragment);
      });
    };
    walk(root);
  };

  const splitTargets = document.querySelectorAll("[data-split]");
  splitTargets.forEach(splitChars);
  onVisible(splitTargets, (el) => el.classList.add("is-visible"), 0.3);

  /* ---------- word-by-word quote reveal ---------- */
  const wordTargets = document.querySelectorAll("[data-words]");
  wordTargets.forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "w";
      span.style.setProperty("--w", i);
      span.textContent = word;
      el.append(span, " ");
    });
  });
  onVisible(wordTargets, (el) => el.classList.add("is-visible"), 0.4);

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const format = (value, pad) =>
    pad ? String(value).padStart(pad, "0") : value.toLocaleString("en-US");

  onVisible(
    counters,
    (el) => {
      const target = Number(el.dataset.count);
      const pad = Number(el.dataset.pad) || 0;
      if (reduceMotion) {
        el.textContent = format(target, pad);
        return;
      }
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = format(Math.round(target * eased), pad);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    0.5,
  );

  /* ---------- org chart ---------- */
  onVisible(
    document.querySelectorAll("[data-org]"),
    (el) => el.classList.add("is-visible"),
    0.15,
  );

  /* ---------- pixel mosaic that "resolves" into the logo ---------- */
  const mosaic = document.querySelector("[data-mosaic]");
  if (mosaic) {
    const grid = mosaic.querySelector(".mosaic-cells");
    const palette = ["#063322", "#0b4531", "#2d8060", "#78b895", "#b5d36b"];
    const cells = [];
    for (let i = 0; i < 144; i++) {
      const cell = document.createElement("i");
      cell.style.setProperty(
        "--cell",
        palette[Math.floor(Math.random() * palette.length)],
      );
      cell.style.setProperty("--d", `${(Math.random() * 1.6).toFixed(2)}s`);
      grid.append(cell);
      cells.push(cell);
    }

    const pct = document.querySelector(".load-pct");
    const replayMosaic = () => {
      mosaic.classList.remove("is-resolved");
      cells.forEach((cell) => cell.classList.remove("blink"));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => mosaic.classList.add("is-resolved"));
      });
    };

    window.addEventListener("cics-logo-activate", replayMosaic);

    onVisible([mosaic], () => {
      if (sessionStorage.getItem("cics-mosaic-replay") === "true") {
        sessionStorage.removeItem("cics-mosaic-replay");
        replayMosaic();
      } else {
        requestAnimationFrame(() => mosaic.classList.add("is-resolved"));
      }

      if (pct && !reduceMotion) {
        const start = performance.now();
        const step = (now) => {
          const t = Math.min((now - start) / 1800, 1);
          pct.textContent = `${Math.round(t * 100)}%`;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }

      if (!reduceMotion) {
        setTimeout(() => {
          setInterval(() => {
            if (document.hidden) return;
            for (let n = 0; n < 3; n++) {
              const cell = cells[Math.floor(Math.random() * cells.length)];
              cell.classList.remove("blink");
              void cell.offsetWidth; // restart animation
              cell.classList.add("blink");
            }
          }, 700);
        }, 2200);
      }
    });
  }

  /* ---------- hero spotlight follows the cursor ---------- */
  const hero = document.querySelector(".about-hero");
  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  }

  /* ---------- 3D tilt cards ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
        card.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
        card.style.setProperty("--gx", `${x * 100}%`);
        card.style.setProperty("--gy", `${y * 100}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- scroll-linked: progress bar + timeline ---------- */
  const root = document.documentElement;
  const timeline = document.querySelector("[data-timeline]");
  const timelineItems = timeline
    ? [...timeline.querySelectorAll(".timeline-item")]
    : [];
  let ticking = false;

  const update = () => {
    ticking = false;
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--scroll", max > 0 ? window.scrollY / max : 0);

    if (timeline) {
      const line = window.innerHeight * 0.62;
      const rect = timeline.getBoundingClientRect();
      const progress = Math.min(
        Math.max((line - rect.top) / rect.height, 0),
        1,
      );
      timeline.style.setProperty("--progress", progress.toFixed(3));
      timelineItems.forEach((item) => {
        item.classList.toggle(
          "is-active",
          item.getBoundingClientRect().top < line,
        );
      });
    }
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();
