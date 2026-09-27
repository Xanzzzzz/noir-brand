# NOIR CLOTHING CO.

A dark, editorial streetwear ecommerce front end. Vanilla HTML/CSS/JS, no build step — open `index.html` in a browser or serve the folder with any static server.

```
python3 -m http.server 8080     # then visit http://localhost:8080
```

## What's built

**Pages**
- `index.html` — home: intro loader, cinematic hero with scroll parallax, Drop 001 rail, category grid, editorial split, marquee, "Latest Pieces" rail, shop-the-look hotspots, brand section, newsletter, footer.
- `shop.html` — full catalog with category tabs, a filter drawer (size, color, price, availability), sorting, active-filter pills, and a responsive product grid.
- `product.html` — editorial product detail: gallery with fullscreen viewer, color/size selection with live stock messaging, accordion (description/material/fit/details/care/shipping/returns), related products, recently viewed.
- `cart.html` + the cart drawer (available on every page) — quantity controls, line removal, order summary with shipping logic.
- `checkout.html` — shipping + payment form with field-level validation, order summary, confirmation state.
- `wishlist.html` — saved pieces, with a designed empty state.
- `account.html` — order history dashboard shell.

**Architecture**
```
css/style.css        tokens, layout, every component
css/animations.css   keyframes + reduced-motion handling
css/responsive.css   all breakpoints, isolated from the main sheet
js/products.js       single source of truth for the 8 SKUs + shared helpers
js/app.js            navbar, announcement bar, search overlay, mobile menu, toasts
js/cart.js           cart state (localStorage) + drawer + cart page rendering
js/wishlist.js       wishlist state (localStorage)
js/shop.js           filtering, sorting, shop grid rendering
js/product.js        product-detail rendering and all its interactions
js/animations.js     intro loader, custom cursor, scroll-reveal, hero parallax, rails
```
Cart, wishlist, and recently-viewed all persist in `localStorage` and survive a refresh.

## Assets
The two photos you uploaded are wired in as real product imagery:
- the sweatpants photo → **N01 Signature Sweatpant**
- the track jacket photo → **N07 Utility Jacket**

The other six products use abstract dark SVG placeholders (no stock photography was available) — swap the files in `assets/products/` with real photography and the pages need no code changes, since every page reads image paths from `js/products.js`.

## Scope note — what's not built yet
To keep this deliverable focused and working end-to-end, `collection.html`, `lookbook.html`, `journal.html`, `journal-detail.html`, and `about.html` are **not** included yet. Their nav links currently point at `shop.html` as a placeholder rather than 404ing. Say the word and I'll build any of them out next in the same visual language.

## Known trade-offs
- Checkout is a front-end simulation (clears the cart and shows a confirmation state) — there's no real payment processor wired in.
- Product search matches name / category / SKU client-side against the in-memory catalog.
- The custom cursor is disabled automatically on touch/coarse-pointer devices per the brief.
