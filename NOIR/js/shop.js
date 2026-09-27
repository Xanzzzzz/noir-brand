/* ==========================================================================
   NOIR CLOTHING CO. — shop.js
   Filtering, sorting and rendering for shop.html
   ========================================================================== */

(function () {
  const NOIR = window.NOIR || {};
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return; // Not the shop page

  const CATEGORY_LABELS = {
    all: "All Pieces",
    sweatpants: "Sweatpants",
    tops: "Tops",
    hoodies: "Hoodies",
    outerwear: "Outerwear",
    shorts: "Shorts",
  };

  const state = {
    category: NOIR.getQueryParam("category") || "all",
    sizes: [],
    colors: [],
    priceMax: 700000,
    sort: "featured",
  };

  function matches(product) {
    if (state.category !== "all" && product.category !== state.category) return false;
    if (state.sizes.length && !state.sizes.some((s) => (product.stock[s] || 0) > 0)) return false;
    if (state.colors.length && !product.colors.some((c) => state.colors.includes(c.name))) return false;
    if (product.price > state.priceMax) return false;
    return true;
  }

  function sortList(list) {
    const arr = [...list];
    switch (state.sort) {
      case "price-asc":
        return arr.sort((a, b) => a.price - b.price);
      case "price-desc":
        return arr.sort((a, b) => b.price - a.price);
      case "newest":
        return arr.sort((a, b) => (b.tags.includes("new") ? 1 : 0) - (a.tags.includes("new") ? 1 : 0));
      default:
        return arr;
    }
  }

  function render() {
    const filtered = sortList(window.NOIR_PRODUCTS.filter(matches));
    const countEl = document.querySelector("[data-result-count]");
    if (countEl) countEl.textContent = `${filtered.length} PIECE${filtered.length === 1 ? "" : "S"}`;

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-magnifying-glass" style="font-size:22px;color:var(--text-faint);margin-bottom:16px;display:block;"></i>
          <p>Nothing matches those filters yet.</p>
          <button class="link-arrow" data-clear-filters style="margin-top:16px;">CLEAR FILTERS <i class="fa-solid fa-arrow-rotate-left"></i></button>
        </div>`;
      const clearBtn = grid.querySelector("[data-clear-filters]");
      if (clearBtn) clearBtn.addEventListener("click", clearAll);
      return;
    }

    grid.innerHTML = filtered.map((p) => NOIR.renderProductCard(p)).join("");
    NOIR.wireProductCards(grid);
    NOIR.observeReveal(grid);
    renderPills();
  }

  function renderPills() {
    const wrap = document.querySelector("[data-active-filters]");
    if (!wrap) return;
    const pills = [];
    state.sizes.forEach((s) => pills.push({ label: `Size ${s}`, clear: () => toggleSize(s) }));
    state.colors.forEach((c) => pills.push({ label: c, clear: () => toggleColor(c) }));
    if (state.priceMax < 700000)
      pills.push({ label: `Under ${NOIR.formatPrice(state.priceMax)}`, clear: () => setPriceMax(700000) });

    if (!pills.length) {
      wrap.innerHTML = "";
      return;
    }
    wrap.innerHTML =
      pills
        .map(
          (p, i) => `<span class="filter-pill" data-pill="${i}">${p.label} <button aria-label="Remove filter">✕</button></span>`
        )
        .join("") + `<button class="filter-clear" data-clear-filters>CLEAR ALL</button>`;

    wrap.querySelectorAll("[data-pill]").forEach((el, i) => {
      el.querySelector("button").addEventListener("click", () => {
        pills[i].clear();
      });
    });
    const clear = wrap.querySelector("[data-clear-filters]");
    if (clear) clear.addEventListener("click", clearAll);
  }

  function clearAll() {
    state.sizes = [];
    state.colors = [];
    state.priceMax = 700000;
    document.querySelectorAll(".filter-body input[type=checkbox]").forEach((i) => (i.checked = false));
    const range = document.querySelector("[data-price-range]");
    if (range) range.value = 700000;
    const rangeLabel = document.querySelector("[data-price-value]");
    if (rangeLabel) rangeLabel.textContent = NOIR.formatPrice(700000);
    render();
  }

  function toggleSize(size) {
    const idx = state.sizes.indexOf(size);
    if (idx > -1) state.sizes.splice(idx, 1);
    else state.sizes.push(size);
    document.querySelectorAll(`[data-filter-size="${size}"]`).forEach((cb) => (cb.checked = state.sizes.includes(size)));
    render();
  }

  function toggleColor(color) {
    const idx = state.colors.indexOf(color);
    if (idx > -1) state.colors.splice(idx, 1);
    else state.colors.push(color);
    document
      .querySelectorAll(`[data-filter-color="${color}"]`)
      .forEach((cb) => (cb.checked = state.colors.includes(color)));
    render();
  }

  function setPriceMax(val) {
    state.priceMax = Number(val);
    render();
  }

  /* -------------------- Tabs -------------------- */
  function initTabs() {
    const tabs = document.querySelectorAll("[data-shop-tab]");
    tabs.forEach((tab) => {
      const cat = tab.getAttribute("data-shop-tab");
      tab.classList.toggle("is-active", cat === state.category);
      tab.addEventListener("click", () => {
        state.category = cat;
        tabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        const heading = document.querySelector("[data-shop-heading]");
        if (heading) heading.textContent = CATEGORY_LABELS[cat] || "Shop";
        render();
      });
    });
    const heading = document.querySelector("[data-shop-heading]");
    if (heading) heading.textContent = CATEGORY_LABELS[state.category] || "Shop";
  }

  /* -------------------- Sort -------------------- */
  function initSort() {
    const select = document.querySelector("[data-sort-select]");
    if (!select) return;
    select.addEventListener("change", () => {
      state.sort = select.value;
      render();
    });
  }

  /* -------------------- Filter drawer -------------------- */
  function initFilterDrawer() {
    const drawer = document.querySelector("[data-filter-drawer]");
    const scrim = document.querySelector("[data-scrim]");
    const openBtn = document.querySelector("[data-filter-open]");
    const closeBtn = document.querySelector("[data-filter-close]");
    if (!drawer) return;

    NOIR.closeFilterDrawer = function () {
      drawer.classList.remove("is-open");
      const cartDrawer = document.querySelector("[data-cart-drawer]");
      if (scrim && !(cartDrawer && cartDrawer.classList.contains("is-open"))) {
        scrim.classList.remove("is-visible");
      }
    };

    if (openBtn)
      openBtn.addEventListener("click", () => {
        drawer.classList.add("is-open");
        if (scrim) scrim.classList.add("is-visible");
      });
    if (closeBtn) closeBtn.addEventListener("click", NOIR.closeFilterDrawer);

    drawer.querySelectorAll("[data-filter-size]").forEach((cb) =>
      cb.addEventListener("change", () => toggleSize(cb.getAttribute("data-filter-size")))
    );
    drawer.querySelectorAll("[data-filter-color]").forEach((cb) =>
      cb.addEventListener("change", () => toggleColor(cb.getAttribute("data-filter-color")))
    );
    const range = drawer.querySelector("[data-price-range]");
    const rangeLabel = drawer.querySelector("[data-price-value]");
    if (range) {
      range.addEventListener("input", () => {
        if (rangeLabel) rangeLabel.textContent = NOIR.formatPrice(Number(range.value));
      });
      range.addEventListener("change", () => setPriceMax(range.value));
    }
    const clearBtn = drawer.querySelector("[data-filter-clear-all]");
    if (clearBtn) clearBtn.addEventListener("click", clearAll);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initSort();
    initFilterDrawer();
    render();
  });
})();
