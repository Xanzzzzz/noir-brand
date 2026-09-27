/* ==========================================================================
   NOIR CLOTHING CO. — product.js
   Renders a single product from ?slug= and wires all detail-page interactions.
   ========================================================================== */

(function () {
  const NOIR = window.NOIR || {};
  const root = document.querySelector("[data-product-root]");
  if (!root) return; // Not the product page

  const slug = NOIR.getQueryParam("slug");
  const product = slug ? NOIR.getProductBySlug(slug) : null;

  if (!product) {
    root.innerHTML = `
      <div class="state-empty container">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p class="display-md" style="margin-bottom:14px;">We couldn't find that piece.</p>
        <p style="color:var(--text-muted);margin-bottom:26px;">The product may have sold out of the catalog or the link is broken.</p>
        <a class="btn btn-outline" href="shop.html">BACK TO SHOP</a>
      </div>`;
    return;
  }

  document.title = `${product.name} — NOIR CLOTHING CO.`;

  const state = {
    colorIndex: 0,
    size: null,
    imageIndex: 0,
  };

  function render() {
    root.innerHTML = `
      <div class="product-detail container">
        <div class="product-gallery" data-gallery>
          <div class="gallery-main" data-gallery-main data-cursor="ZOOM">
            <img src="${product.images[0]}" alt="${product.name}" />
          </div>
          ${product.images
            .map(
              (img, i) => `
            <div class="gallery-thumb" data-gallery-thumb="${i}">
              <img src="${img}" alt="${product.name} view ${i + 1}" />
            </div>`
            )
            .join("")}
        </div>

        <div class="product-panel">
          <span class="product-sku">${product.sku} · ${CATEGORY_LABEL(product.category)}</span>
          <h1>${product.name}</h1>
          <div class="price-row">
            <span>${NOIR.formatPrice(product.price)}</span>
            <span class="selected-color-name" data-color-name>${product.colors[0].name}</span>
          </div>

          <div class="option-group">
            <div class="option-label"><span>COLOR</span></div>
            <div class="color-options" data-color-options>
              ${product.colors
                .map(
                  (c, i) => `
                <button class="color-option ${i === 0 ? "is-selected" : ""}" style="background:${c.hex}" data-color-index="${i}" aria-label="${c.name}"></button>`
                )
                .join("")}
            </div>
          </div>

          <div class="option-group">
            <div class="option-label">
              <span>SELECT SIZE</span>
              <button data-size-guide>FIND YOUR SIZE</button>
            </div>
            <div class="size-options" data-size-options>
              ${product.sizes
                .map((s) => {
                  const stock = product.stock[s] || 0;
                  return `<button class="size-option" data-size="${s}" ${stock === 0 ? "disabled" : ""}>${s}</button>`;
                })
                .join("")}
            </div>
          </div>

          <div class="product-actions">
            <button class="btn btn-primary" data-add-to-bag>ADD TO BAG</button>
            <button class="icon-btn wishlist-toggle ${NOIR.isWishlisted(product.sku) ? "is-active" : ""}" data-wishlist-toggle="${product.sku}" aria-label="Save to wishlist">
              <i class="${NOIR.isWishlisted(product.sku) ? "fa-solid" : "fa-regular"} fa-heart"></i>
            </button>
          </div>
          <div class="stock-msg" data-stock-msg></div>

          <div class="accordion" data-accordion>
            ${accordionItem("DESCRIPTION", `<p>${product.description}</p>`)}
            ${accordionItem("MATERIAL", `<p>${product.material}</p>`)}
            ${accordionItem("FIT", `<p>${product.fit}</p>`)}
            ${accordionItem("DETAILS", `<ul>${product.details.map((d) => `<li>${d}</li>`).join("")}</ul>`)}
            ${accordionItem("CARE", `<p>${product.care}</p>`)}
            ${accordionItem("SHIPPING", `<p>Standard delivery in 2–4 business days. Free on orders over Rp500.000.</p>`)}
            ${accordionItem("RETURNS", `<p>Unworn pieces can be returned within 14 days of delivery.</p>`)}
          </div>
        </div>
      </div>

      <div class="fullscreen-viewer" data-fullscreen>
        <button class="fullscreen-close" data-fullscreen-close><i class="fa-solid fa-xmark"></i></button>
        <img src="${product.images[0]}" alt="${product.name}" data-fullscreen-img />
      </div>
    `;

    wireGallery();
    wireColors();
    wireSizes();
    wireAddToBag();
    wireAccordion();
    wireFullscreen();
    NOIR.wireProductCards(root);
  }

  function CATEGORY_LABEL(cat) {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  function accordionItem(title, content) {
    return `
      <div class="accordion-item" data-accordion-item>
        <button class="accordion-trigger" data-accordion-trigger>
          <span>${title}</span>
          <i class="fa-solid fa-plus"></i>
        </button>
        <div class="accordion-panel" data-accordion-panel>
          <div class="accordion-panel-inner">${content}</div>
        </div>
      </div>`;
  }

  function wireGallery() {
    const mainImg = root.querySelector("[data-gallery-main] img");
    root.querySelectorAll("[data-gallery-thumb]").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const i = Number(thumb.getAttribute("data-gallery-thumb"));
        state.imageIndex = i;
        mainImg.src = product.images[i];
      });
    });
  }

  function wireColors() {
    root.querySelectorAll("[data-color-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.colorIndex = Number(btn.getAttribute("data-color-index"));
        root.querySelectorAll("[data-color-index]").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        root.querySelector("[data-color-name]").textContent = product.colors[state.colorIndex].name;
      });
    });
  }

  function wireSizes() {
    root.querySelectorAll("[data-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        state.size = btn.getAttribute("data-size");
        root.querySelectorAll("[data-size]").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        const stock = product.stock[state.size] || 0;
        const msg = root.querySelector("[data-stock-msg]");
        msg.textContent = stock <= 4 ? `Only ${stock} left in size ${state.size}.` : "";
      });
    });
    const sizeGuideBtn = root.querySelector("[data-size-guide]");
    if (sizeGuideBtn)
      sizeGuideBtn.addEventListener("click", () =>
        NOIR.showToast("Size guide: this fit runs true to size.", "fa-solid fa-ruler")
      );
  }

  function wireAddToBag() {
    const btn = root.querySelector("[data-add-to-bag]");
    btn.addEventListener("click", () => {
      if (!state.size) {
        NOIR.showToast("Select a size first.", "fa-solid fa-circle-exclamation");
        return;
      }
      const stock = product.stock[state.size] || 0;
      if (stock <= 0) {
        NOIR.showToast("That size is sold out.", "fa-solid fa-circle-exclamation");
        return;
      }
      NOIR.addToCart(product, product.colors[state.colorIndex].name, state.size, 1);

      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> ADDED`;
      btn.classList.add("btn-added");
      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.classList.remove("btn-added");
      }, 1600);

      NOIR.openCartDrawer();
    });
  }

  function wireAccordion() {
    root.querySelectorAll("[data-accordion-item]").forEach((item, i) => {
      const trigger = item.querySelector("[data-accordion-trigger]");
      const panel = item.querySelector("[data-accordion-panel]");
      if (i === 0) {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        root.querySelectorAll("[data-accordion-item]").forEach((other) => {
          other.classList.remove("is-open");
          other.querySelector("[data-accordion-panel]").style.maxHeight = "0px";
        });
        if (!isOpen) {
          item.classList.add("is-open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  function wireFullscreen() {
    const viewer = root.querySelector("[data-fullscreen]");
    const img = viewer.querySelector("[data-fullscreen-img]");
    const closeBtn = viewer.querySelector("[data-fullscreen-close]");
    root.querySelector("[data-gallery-main]").addEventListener("click", () => {
      img.src = product.images[state.imageIndex];
      viewer.classList.add("is-open");
    });
    closeBtn.addEventListener("click", () => viewer.classList.remove("is-open"));
    viewer.addEventListener("click", (e) => {
      if (e.target === viewer) viewer.classList.remove("is-open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") viewer.classList.remove("is-open");
    });
  }

  function renderRelated() {
    const relatedSection = document.querySelector("[data-related-grid]");
    if (!relatedSection) return;
    const related = NOIR.getRelated(product, 4);
    relatedSection.innerHTML = related.map((p) => NOIR.renderProductCard(p)).join("");
    NOIR.wireProductCards(relatedSection);
    NOIR.observeReveal(relatedSection);
  }

  /* -------------------- Recently viewed -------------------- */
  function trackRecentlyViewed() {
    const KEY = "noir_recently_viewed";
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {}
    list = list.filter((s) => s !== product.sku);
    list.unshift(product.sku);
    list = list.slice(0, 8);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function renderRecentlyViewed() {
    const wrap = document.querySelector("[data-recently-viewed-grid]");
    const section = document.querySelector("[data-recently-viewed-section]");
    if (!wrap) return;
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem("noir_recently_viewed")) || [];
    } catch (e) {}
    const products = list
      .filter((s) => s !== product.sku)
      .map((s) => NOIR.getProductBySku(s))
      .filter(Boolean)
      .slice(0, 4);
    if (!products.length) {
      if (section) section.style.display = "none";
      return;
    }
    wrap.innerHTML = products.map((p) => NOIR.renderProductCard(p)).join("");
    NOIR.wireProductCards(wrap);
    NOIR.observeReveal(wrap);
  }

  render();
  renderRelated();
  trackRecentlyViewed();
  renderRecentlyViewed();
})();
