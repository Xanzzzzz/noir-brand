/* ==========================================================================
   NOIR CLOTHING CO. — wishlist.js
   Wishlist stored in localStorage as an array of SKUs.
   ========================================================================== */

(function () {
  const NOIR = window.NOIR || {};
  const KEY = "noir_wishlist";

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function write(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    updateWishlistCount();
  }

  NOIR.isWishlisted = function (sku) {
    return read().includes(sku);
  };

  NOIR.toggleWishlist = function (sku) {
    const list = read();
    const idx = list.indexOf(sku);
    if (idx > -1) list.splice(idx, 1);
    else list.push(sku);
    write(list);
    return list.includes(sku);
  };

  NOIR.getWishlistProducts = function () {
    const skus = read();
    return (window.NOIR_PRODUCTS || []).filter((p) => skus.includes(p.sku));
  };

  function updateWishlistCount() {
    document.querySelectorAll("[data-wishlist-count]").forEach((el) => {
      const count = read().length;
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  }

  document.addEventListener("DOMContentLoaded", updateWishlistCount);

  window.NOIR = NOIR;
})();
