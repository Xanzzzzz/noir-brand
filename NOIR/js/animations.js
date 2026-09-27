/* ==========================================================================
   NOIR CLOTHING CO. — animations.js
   Load sequence, custom cursor, scroll reveal, hero parallax.
   ========================================================================== */

(function () {
  const NOIR = window.NOIR || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Loader / intro sequence (home page only, once per session)
     ------------------------------------------------------------------ */
  function initLoader() {
    const loader = document.querySelector("[data-loader]");
    const hero = document.querySelector("[data-hero]");
    if (!loader) {
      if (hero) hero.classList.add("is-loaded");
      return;
    }

    const seen = sessionStorage.getItem("noir_intro_seen") === "1";
    if (seen || reduceMotion) {
      loader.remove();
      if (hero) hero.classList.add("is-loaded");
      return;
    }

    requestAnimationFrame(() => loader.classList.add("is-visible"));

    setTimeout(() => {
      loader.classList.add("is-leaving");
      if (hero) hero.classList.add("is-loaded");
      sessionStorage.setItem("noir_intro_seen", "1");
      setTimeout(() => loader.remove(), 800);
    }, 900);
  }

  /* ------------------------------------------------------------------
     Custom cursor (desktop / fine-pointer only)
     ------------------------------------------------------------------ */
  function initCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    }
    loop();

    const expandables = "a, button, .product-card, [data-cursor]";
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest(expandables);
      if (!target) return;
      ring.classList.add("is-expanded");
      ring.textContent = target.getAttribute("data-cursor") || "";
    });
    document.addEventListener("mouseout", (e) => {
      const target = e.target.closest(expandables);
      if (!target) return;
      ring.classList.remove("is-expanded");
      ring.textContent = "";
    });
    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* Re-observe dynamically injected cards (shop grid, related products, etc.) */
  NOIR.observeReveal = function (root = document) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      root.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    root.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
  };

  /* ------------------------------------------------------------------
     Hero parallax on scroll
     ------------------------------------------------------------------ */
  function initHeroParallax() {
    const hero = document.querySelector("[data-hero]");
    if (!hero || reduceMotion) return;
    const media = hero.querySelector(".hero-media img");
    const copy = hero.querySelector(".hero-copy");
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const progress = Math.min(y / window.innerHeight, 1);
      if (media) media.style.transform = `scale(${1 + progress * 0.08})`;
      if (copy) {
        copy.style.transform = `translateY(${progress * 40}px)`;
        copy.style.opacity = String(1 - progress * 1.1);
      }
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------
     Marquee: duplicate content for seamless loop
     ------------------------------------------------------------------ */
  function initMarquee() {
    document.querySelectorAll("[data-marquee]").forEach((track) => {
      track.innerHTML = track.innerHTML + track.innerHTML;
    });
  }

  /* ------------------------------------------------------------------
     Horizontal rail: wheel + drag + arrow controls
     ------------------------------------------------------------------ */
  function initRails() {
    document.querySelectorAll("[data-rail]").forEach((rail) => {
      rail.addEventListener(
        "wheel",
        (e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            rail.scrollLeft += e.deltaY;
            e.preventDefault();
          }
        },
        { passive: false }
      );

      let isDown = false, startX, scrollLeft;
      rail.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX;
        scrollLeft = rail.scrollLeft;
        rail.style.cursor = "grabbing";
      });
      ["mouseleave", "mouseup"].forEach((evt) =>
        rail.addEventListener(evt, () => {
          isDown = false;
          rail.style.cursor = "";
        })
      );
      rail.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        rail.scrollLeft = scrollLeft - (e.pageX - startX);
      });

      const wrap = rail.closest(".rail-wrap");
      if (wrap) {
        const prev = wrap.querySelector("[data-rail-prev]");
        const next = wrap.querySelector("[data-rail-next]");
        const step = () => rail.querySelector(".product-card")?.offsetWidth + 22 || 320;
        if (prev) prev.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
        if (next) next.addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initCursor();
    initReveal();
    initHeroParallax();
    initMarquee();
    initRails();
  });

  window.NOIR = NOIR;
})();
