/* ==========================================================================
   NOIR CLOTHING CO. — Product Data
   Single source of truth. Every page reads from this file.
   ========================================================================== */

const NOIR_PRODUCTS = [
  {
    sku: "N01",
    slug: "signature-sweatpant",
    name: "Signature Sweatpant",
    category: "sweatpants",
    collection: "drop-001",
    price: 399000,
    tags: ["new", "bestseller"],
    description:
      "The sweatpant we built the label around. Heavyweight 420gsm French terry, cut wide through the leg and tapered at the ankle so it holds its shape without ever fighting your stride.",
    material: "420gsm cotton French terry, brushed interior.",
    fit: "Relaxed through hip and thigh, tapered ankle. Runs true to size.",
    details: [
      "Elasticated drawcord waistband",
      "Deep side pockets, back welt pocket",
      "Ribbed ankle cuff",
      "Garment-washed for softness",
    ],
    care: "Machine wash cold, inside out. Do not tumble dry high.",
    colors: [
      { name: "Black", hex: "#0c0c0c" },
      { name: "Grey", hex: "#8a8a8a" },
      { name: "Washed Black", hex: "#2b2b2b" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 6, M: 14, L: 18, XL: 9, XXL: 3 },
    images: [
      "assets/products/n07-utility-jacket.jpg",
      "assets/products/n07-utility-jacket.jpg",
    ],
  },
  {
    sku: "N02",
    slug: "heavyweight-tee",
    name: "Heavyweight Tee",
    category: "tops",
    collection: "drop-001",
    price: 249000,
    tags: ["new"],
    description:
      "A boxy, 240gsm tee with enough structure to hold its shape off the body. The kind of plain tee that isn't plain once you've worn one.",
    material: "240gsm combed cotton, enzyme washed.",
    fit: "Boxy, dropped shoulder. Size down for a closer fit.",
    details: [
      "Dropped shoulder seam",
      "Ribbed crewneck collar",
      "Side-seamed for a straighter silhouette",
    ],
    care: "Machine wash cold. Hang dry recommended.",
    colors: [
      { name: "Black", hex: "#0c0c0c" },
      { name: "Off White", hex: "#e8e6e1" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 10, M: 20, L: 22, XL: 12, XXL: 5 },
    images: [
      "assets/products/n07-utility-jacket.jpg",
      "assets/products/n07-utility-jacket.jpg",
    ],
  },
  {
    sku: "N03",
    slug: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "hoodies",
    collection: "drop-001",
    price: 449000,
    tags: ["new", "bestseller"],
    description:
      "Our heaviest hoodie, built oversized with a deep dropped shoulder and a hood cut large enough to layer under a jacket.",
    material: "480gsm cotton fleece, brushed back.",
    fit: "Oversized. Order your usual size for the intended drape.",
    details: [
      "Double-layered hood",
      "Kangaroo pocket with hidden phone pocket",
      "Raw-cut hem",
    ],
    care: "Machine wash cold, inside out.",
    colors: [
      { name: "Black", hex: "#0c0c0c" },
      { name: "Grey", hex: "#8a8a8a" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 4, M: 11, L: 15, XL: 8, XXL: 2 },
    images: [
      "assets/products/n07-utility-jacket.jpg",
      "assets/products/n07-utility-jacket.jpg",
    ],
  },
  {
    sku: "N04",
    slug: "relaxed-zip-hoodie",
    name: "Relaxed Zip Hoodie",
    category: "hoodies",
    collection: "drop-001",
    price: 499000,
    tags: [],
    description:
      "A full-zip built for layering. Relaxed through the body with a two-way zip and internal storm flap for cleaner lines when zipped.",
    material: "420gsm cotton-poly fleece blend.",
    fit: "Relaxed. True to size.",
    details: [
      "Two-way YKK zip",
      "Internal storm flap",
      "Ribbed cuffs and hem",
    ],
    care: "Machine wash cold, inside out.",
    colors: [
      { name: "Black", hex: "#0c0c0c" },
      { name: "Washed Black", hex: "#2b2b2b" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 7, M: 13, L: 16, XL: 6, XXL: 0 },
    images: [
      "assets/products/n07-utility-jacket.jpg",
      "assets/products/n07-utility-jacket.jpg",
    ],
  },
  {
    sku: "N05",
    slug: "washed-sweatpant",
    name: "Washed Sweatpant",
    category: "sweatpants",
    collection: "drop-001",
    price: 429000,
    tags: [],
    description:
      "The Signature Sweatpant, garment-dyed and stone-washed for a faded, worn-in tone from the first wear.",
    material: "420gsm cotton French terry, garment-dyed.",
    fit: "Relaxed through hip and thigh, tapered ankle.",
    details: [
      "Elasticated drawcord waistband",
      "Deep side pockets",
      "Stone-washed finish, tonal variation is intentional",
    ],
    care: "Machine wash cold, separately for the first wash.",
    colors: [
      { name: "Washed Black", hex: "#2b2b2b" },
      { name: "Grey", hex: "#8a8a8a" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 5, M: 9, L: 12, XL: 4, XXL: 1 },
    images: [
      "assets/products/n07-utility-jacket.jpg",
      "assets/products/n07-utility-jacket.jpg",
    ],
  },
  {
    sku: "N06",
    slug: "everyday-short",
    name: "Everyday Short",
    category: "shorts",
    collection: "drop-001",
    price: 299000,
    tags: [],
    description:
      "A heavyweight short cut from the same terry as the Signature Sweatpant, for the four months a year it's warm enough.",
    material: "420gsm cotton French terry.",
    fit: "Relaxed, sits at the knee.",
    details: ["Elasticated drawcord waistband", "Deep side pockets"],
    care: "Machine wash cold, inside out.",
    colors: [
      { name: "Black", hex: "#0c0c0c" },
      { name: "Grey", hex: "#8a8a8a" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 8, M: 15, L: 14, XL: 7, XXL: 3 },
    images: [
      "assets/products/n07-utility-jacket.jpg",
      "assets/products/n07-utility-jacket.jpg",
    ],
  },
  {
    sku: "N07",
    slug: "utility-jacket",
    name: "Utility Jacket",
    category: "outerwear",
    collection: "drop-001",
    price: 699000,
    tags: ["new"],
    description:
      "A structured track-inspired jacket built for cold mornings. Full zip, ribbed collar, and a fit clean enough to wear over anything else in the drop.",
    material: "Brushed poly-cotton twill, ribbed trims.",
    fit: "Straight through the body, true to size.",
    details: [
      "Full front zip",
      "Ribbed collar, cuffs and hem",
      "Embroidered chest emblem",
    ],
    care: "Machine wash cold, hang dry.",
    colors: [
      { name: "Navy", hex: "#12161f" },
      { name: "Black", hex: "#0c0c0c" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 3, M: 8, L: 10, XL: 5, XXL: 2 },
    images: [
      "assets/products/n07-utility-jacket.jpg",
      "assets/products/n07-utility-jacket.jpg",
    ],
  },
  {
    sku: "N08",
    slug: "daily-oversized-tee",
    name: "Daily Oversized Tee",
    category: "tops",
    collection: "drop-001",
    price: 229000,
    tags: [],
    description:
      "An everyday oversized tee in a lighter 220gsm jersey, made to be worn on its own or layered under the zip hoodie.",
    material: "220gsm cotton jersey.",
    fit: "Oversized, dropped shoulder.",
    details: ["Dropped shoulder seam", "Ribbed crewneck collar"],
    care: "Machine wash cold.",
    colors: [
      { name: "Black", hex: "#0c0c0c" },
      { name: "Off White", hex: "#e8e6e1" },
      { name: "Grey", hex: "#8a8a8a" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 12, M: 22, L: 20, XL: 10, XXL: 6 },
    images: [
      "assets/products/n07-utility-jacket.jpg",
      "assets/products/n07-utility-jacket.jpg",
    ],
  },
];

/* Helpers shared across pages */
const NOIR = window.NOIR || {};

NOIR.formatPrice = function (value) {
  return "Rp" + value.toLocaleString("id-ID");
};

NOIR.getProductBySlug = function (slug) {
  return NOIR_PRODUCTS.find((p) => p.slug === slug);
};

NOIR.getProductBySku = function (sku) {
  return NOIR_PRODUCTS.find((p) => p.sku === sku);
};

NOIR.getRelated = function (product, count = 4) {
  return NOIR_PRODUCTS.filter(
    (p) => p.category === product.category && p.sku !== product.sku
  ).slice(0, count);
};

window.NOIR = NOIR;
window.NOIR_PRODUCTS = NOIR_PRODUCTS;
