/* ==========================================================================
   NOIR CLOTHING CO. — cart.js
   Cart state lives in localStorage as an array of line items:
   { sku, name, price, color, size, qty, image }
   ========================================================================== */

(function () {
  const NOIR = window.NOIR || {};
  const CART_KEY = "noir_cart";

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount();
  }

  NOIR.getCart = readCart;

  NOIR.addToCart = function (product, color, size, qty = 1) {
    const items = readCart();
    const existing = items.find(
      (i) => i.sku === product.sku && i.color === color && i.size === size
    );
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        price: product.price,
        color,
        size,
        qty,
        image: product.images[0],
      });
    }
    writeCart(items);
    NOIR.renderCartDrawer();
  };

  NOIR.updateCartQty = function (sku, color, size, delta) {
    const items = readCart();
    const item = items.find((i) => i.sku === sku && i.color === color && i.size === size);
    if (!item) return;
    item.qty += delta;
    const filtered = item.qty <= 0 ? items.filter((i) => i !== item) : items;
    writeCart(filtered);
    NOIR.renderCartDrawer();
    if (typeof NOIR.renderCartPage === "function") NOIR.renderCartPage();
  };

  NOIR.removeFromCart = function (sku, color, size) {
    const items = readCart().filter(
      (i) => !(i.sku === sku && i.color === color && i.size === size)
    );
    writeCart(items);
    NOIR.renderCartDrawer();
    if (typeof NOIR.renderCartPage === "function") NOIR.renderCartPage();
  };

  NOIR.cartCount = function () {
    return readCart().reduce((sum, i) => sum + i.qty, 0);
  };

  NOIR.cartSubtotal = function () {
    return readCart().reduce((sum, i) => sum + i.qty * i.price, 0);
  };

  function updateCartCount() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      const count = NOIR.cartCount();
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  }

  /* -------------------- Drawer -------------------- */
  NOIR.openCartDrawer = function () {
    const drawer = document.querySelector("[data-cart-drawer]");
    const scrim = document.querySelector("[data-scrim]");
    if (!drawer) return;
    NOIR.renderCartDrawer();
    drawer.classList.add("is-open");
    if (scrim) scrim.classList.add("is-visible");
    const bagBtn = document.querySelector("[data-cart-open]");
    if (bagBtn) {
      bagBtn.classList.remove("bounce");
      void bagBtn.offsetWidth;
      bagBtn.classList.add("bounce");
    }
    document.body.style.overflow = "hidden";
  };

  NOIR.closeCartDrawer = function () {
    const drawer = document.querySelector("[data-cart-drawer]");
    const scrim = document.querySelector("[data-scrim]");
    if (drawer) drawer.classList.remove("is-open");
    const filterDrawer = document.querySelector("[data-filter-drawer]");
    if (scrim && !(filterDrawer && filterDrawer.classList.contains("is-open"))) {
      scrim.classList.remove("is-visible");
    }
    document.body.style.overflow = "";
  };

  NOIR.renderCartDrawer = function () {
    const container = document.querySelector("[data-cart-drawer-items]");
    const foot = document.querySelector("[data-cart-drawer-foot]");
    if (!container) return;
    const items = readCart();

    if (!items.length) {
      container.innerHTML = `
        <div class="drawer-empty">
          <i class="fa-solid fa-bag-shopping"></i>
          <p>Your bag is empty.</p>
        </div>`;
      if (foot) foot.style.display = "none";
      return;
    }
    if (foot) foot.style.display = "block";

    container.innerHTML = items
      .map(
        (item) => `
      <div class="drawer-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="drawer-item-info">
          <div class="drawer-item-top">
            <h4>${item.name}</h4>
            <span>${NOIR.formatPrice(item.price * item.qty)}</span>
          </div>
          <div class="drawer-item-meta">${item.color} / ${item.size}</div>
          <div class="drawer-item-bottom">
            <div class="qty-control">
              <button data-qty-minus data-sku="${item.sku}" data-color="${item.color}" data-size="${item.size}">−</button>
              <span>${item.qty}</span>
              <button data-qty-plus data-sku="${item.sku}" data-color="${item.color}" data-size="${item.size}">+</button>
            </div>
            <button class="remove-item" data-remove data-sku="${item.sku}" data-color="${item.color}" data-size="${item.size}">REMOVE</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    const subtotalEl = document.querySelector("[data-cart-subtotal]");
    if (subtotalEl) subtotalEl.textContent = NOIR.formatPrice(NOIR.cartSubtotal());

    container.querySelectorAll("[data-qty-plus]").forEach((btn) =>
      btn.addEventListener("click", () =>
        NOIR.updateCartQty(
          btn.dataset.sku,
          btn.dataset.color,
          btn.dataset.size,
          1
        )
      )
    );
    container.querySelectorAll("[data-qty-minus]").forEach((btn) =>
      btn.addEventListener("click", () =>
        NOIR.updateCartQty(
          btn.dataset.sku,
          btn.dataset.color,
          btn.dataset.size,
          -1
        )
      )
    );
    container.querySelectorAll("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", () =>
        NOIR.removeFromCart(btn.dataset.sku, btn.dataset.color, btn.dataset.size)
      )
    );
  };

  function initDrawerWiring() {
    const openBtns = document.querySelectorAll("[data-cart-open]");
    const closeBtn = document.querySelector("[data-cart-close]");
    const scrim = document.querySelector("[data-scrim]");

    openBtns.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        NOIR.openCartDrawer();
      })
    );
    if (closeBtn) closeBtn.addEventListener("click", NOIR.closeCartDrawer);
    if (scrim)
      scrim.addEventListener("click", () => {
        NOIR.closeCartDrawer();
        if (typeof NOIR.closeFilterDrawer === "function") NOIR.closeFilterDrawer();
      });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        NOIR.closeCartDrawer();
      }
    });
  }

  /* -------------------- Full cart page -------------------- */
  NOIR.renderCartPage = function () {
    const list = document.querySelector("[data-cart-page-list]");
    const empty = document.querySelector("[data-cart-page-empty]");
    const summary = document.querySelector("[data-cart-page-summary]");
    if (!list) return;
    const items = readCart();

    if (!items.length) {
      list.innerHTML = "";
      if (empty) empty.style.display = "block";
      if (summary) summary.style.display = "none";
      return;
    }
    if (empty) empty.style.display = "none";
    if (summary) summary.style.display = "block";

    list.innerHTML = items
      .map(
        (item) => `
      <div class="cart-row">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-row-info">
          <div class="cart-row-top">
            <h3>${item.name}</h3>
            <span>${NOIR.formatPrice(item.price * item.qty)}</span>
          </div>
          <div class="cart-row-meta">${item.color} / ${item.size} · SKU ${item.sku}</div>
          <div class="cart-row-bottom">
            <div class="qty-control">
              <button data-qty-minus data-sku="${item.sku}" data-color="${item.color}" data-size="${item.size}">−</button>
              <span>${item.qty}</span>
              <button data-qty-plus data-sku="${item.sku}" data-color="${item.color}" data-size="${item.size}">+</button>
            </div>
            <button class="remove-item" data-remove data-sku="${item.sku}" data-color="${item.color}" data-size="${item.size}">REMOVE</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    list.querySelectorAll("[data-qty-plus]").forEach((btn) =>
      btn.addEventListener("click", () =>
        NOIR.updateCartQty(btn.dataset.sku, btn.dataset.color, btn.dataset.size, 1)
      )
    );
    list.querySelectorAll("[data-qty-minus]").forEach((btn) =>
      btn.addEventListener("click", () =>
        NOIR.updateCartQty(btn.dataset.sku, btn.dataset.color, btn.dataset.size, -1)
      )
    );
    list.querySelectorAll("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", () =>
        NOIR.removeFromCart(btn.dataset.sku, btn.dataset.color, btn.dataset.size)
      )
    );

    const subtotal = NOIR.cartSubtotal();
    const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 29000;
    const total = subtotal + shipping;
    const set = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = val;
    };
    set("[data-summary-subtotal]", NOIR.formatPrice(subtotal));
    set("[data-summary-shipping]", shipping === 0 ? "Free" : NOIR.formatPrice(shipping));
    set("[data-summary-total]", NOIR.formatPrice(total));
  };

  function initPromoForm() {
    const form = document.querySelector("[data-promo-form]");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const msg = document.querySelector("[data-promo-msg]");
      if (!msg) return;
      msg.textContent = input.value.trim()
        ? "That code isn't valid right now."
        : "Enter a discount code.";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    NOIR.renderCartDrawer();
    initDrawerWiring();
    NOIR.renderCartPage();
    initPromoForm();
  });

  window.NOIR = NOIR;
})();
