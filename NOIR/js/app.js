/* ==========================================================================
   NOIR CLOTHING CO. — app.js
   Global functionality shared by every page.
   ========================================================================== */

(function () {
  const NOIR = window.NOIR || {};

  /* ------------------------------------------------------------------
     Announcement bar
     ------------------------------------------------------------------ */
  function initAnnounce() {
    const bar = document.querySelector("[data-announce]");
    if (!bar) return;
    if (sessionStorage.getItem("noir_announce_dismissed") === "1") {
      bar.classList.add("is-hidden");
    }
    const closeBtn = bar.querySelector("[data-announce-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        bar.classList.add("is-hidden");
        sessionStorage.setItem("noir_announce_dismissed", "1");
      });
    }
  }

  /* ------------------------------------------------------------------
     Navbar scroll state
     ------------------------------------------------------------------ */
  function initNavbarScroll() {
    const nav = document.querySelector("[data-navbar]");
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  function initMobileMenu() {
    const burger = document.querySelector("[data-burger]");
    const menu = document.querySelector("[data-mobile-menu]");
    const closeBtn = document.querySelector("[data-mobile-menu-close]");
    if (!burger || !menu) return;
    const open = () => menu.classList.add("is-open");
    const close = () => menu.classList.remove("is-open");
    burger.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* ------------------------------------------------------------------
     Search overlay
     ------------------------------------------------------------------ */
  function initSearch() {
    const triggers = document.querySelectorAll("[data-search-open]");
    const overlay = document.querySelector("[data-search-overlay]");
    if (!overlay) return;
    const closeBtn = overlay.querySelector("[data-search-close]");
    const input = overlay.querySelector("input");
    const resultsEl = overlay.querySelector("[data-search-results]");

    const open = () => {
      overlay.classList.add("is-open");
      setTimeout(() => input && input.focus(), 250);
    };
    const close = () => {
      overlay.classList.remove("is-open");
      if (input) input.value = "";
      renderResults("");
    };

    triggers.forEach((t) => t.addEventListener("click", open));
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    function renderResults(query) {
      if (!resultsEl) return;
      const q = query.trim().toLowerCase();
      if (!q) {
        resultsEl.innerHTML = "";
        return;
      }
      const matches = (window.NOIR_PRODUCTS || []).filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
      if (!matches.length) {
        resultsEl.innerHTML = `<p class="search-empty">No pieces found for "${escapeHtml(
          query
        )}".</p>`;
        return;
      }
      resultsEl.innerHTML = matches
        .map(
          (p) => `
        <a href="product.html?slug=${p.slug}">
          <span>${p.name}</span>
          <span class="meta-text">${NOIR.formatPrice(p.price)}</span>
        </a>`
        )
        .join("");
    }

    if (input) {
      input.addEventListener("input", (e) => renderResults(e.target.value));
    }
  }

  /* ------------------------------------------------------------------
     Newsletter form
     ------------------------------------------------------------------ */
  function initNewsletter() {
    document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
      const field = form.querySelector(".newsletter-field");
      const input = form.querySelector("input");
      const msg = form.querySelector("[data-newsletter-msg]");
      if (input && field) {
        input.addEventListener("focus", () => field.classList.add("is-focused"));
        input.addEventListener("blur", () => {
          if (!input.value) field.classList.remove("is-focused");
        });
      }
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = input ? input.value.trim() : "";
        if (!val || !val.includes("@")) {
          if (msg) msg.textContent = "Enter a valid email address.";
          return;
        }
        if (msg) msg.textContent = "You're on the list. Welcome to NOIR.";
        if (input) input.value = "";
        if (field) field.classList.remove("is-focused");
      });
    });
  }

  /* ------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------ */
  let toastTimer;
  NOIR.showToast = function (message, icon = "fa-solid fa-check") {
    let toast = document.querySelector("[data-toast]");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("data-toast", "");
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  };

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }
  NOIR.escapeHtml = escapeHtml;

  NOIR.getQueryParam = function (name) {
    return new URLSearchParams(window.location.search).get(name);
  };

  /* Shared product card markup, used on home, shop, related, recently viewed */
  NOIR.renderProductCard = function (product) {
    const wishlisted = NOIR.isWishlisted ? NOIR.isWishlisted(product.sku) : false;
    const colorNames = product.colors.map((c) => c.name).join(" / ");
    return `
      <article class="product-card reveal" data-sku="${product.sku}">
        <div class="product-media">
          <a href="product.html?slug=${product.slug}" data-cursor="VIEW">
            <img class="img-a" src="${product.images[0]}" alt="${product.name}" loading="lazy" />
            <img class="img-b" src="${product.images[1] || product.images[0]}" alt="" loading="lazy" />
          </a>
          <button class="wishlist-toggle ${wishlisted ? "is-active" : ""}" data-wishlist-toggle="${product.sku}" aria-label="Save to wishlist">
            <i class="${wishlisted ? "fa-solid" : "fa-regular"} fa-heart"></i>
          </button>
          <button class="quick-add" data-quick-add="${product.sku}">
            QUICK ADD <i class="fa-solid fa-plus"></i>
          </button>
        </div>
        <div class="product-info">
          <div>
            <span class="product-sku">${product.sku}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-colors">${colorNames}</div>
          </div>
          <div class="product-price">${NOIR.formatPrice(product.price)}</div>
        </div>
      </article>`;
  };

  /* Wishlist heart wiring for any grid of rendered cards */
  NOIR.wireProductCards = function (root = document) {
    root.querySelectorAll("[data-wishlist-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sku = btn.getAttribute("data-wishlist-toggle");
        NOIR.toggleWishlist(sku);
        const active = NOIR.isWishlisted(sku);
        btn.classList.toggle("is-active", active);
        const icon = btn.querySelector("i");
        icon.className = active ? "fa-solid fa-heart" : "fa-regular fa-heart";
        btn.classList.remove("pulse");
        void btn.offsetWidth;
        btn.classList.add("pulse");
        NOIR.showToast(
          active ? "Saved to wishlist" : "Removed from wishlist",
          active ? "fa-solid fa-heart" : "fa-regular fa-heart"
        );
      });
    });

    root.querySelectorAll("[data-quick-add]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sku = btn.getAttribute("data-quick-add");
        const product = NOIR.getProductBySku(sku);
        if (!product) return;
        const color = product.colors[0].name;
        const size = product.sizes.find((s) => (product.stock[s] || 0) > 0) || product.sizes[0];
        NOIR.addToCart(product, color, size, 1);
        NOIR.openCartDrawer();
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initAnnounce();
    initNavbarScroll();
    initMobileMenu();
    initSearch();
    initNewsletter();
  });

  window.NOIR = NOIR;
})();
