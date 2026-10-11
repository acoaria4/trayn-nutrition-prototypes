// The current WPC product and earlier flavour studies keep distinct formulations.
// Packaging artwork does not supply final nutrition or retail approval.
export const products = [
  {
    id: "belgian-chocolate",
    flavor: "Belgian Chocolate",
    name: "Whey Protein Concentrate",
    blend: "Whey protein concentrate (WPC)",
    description: "Belgian Chocolate whey protein concentrate in a 500 g pack.",
    archived: false,
    note: "Belgian Chocolate. Whey protein concentrate. 500 g.",
    status: "Featured concept",
    color: "#8c4b35",
    image: "/images/products/belgian-chocolate-wpc",
    backImage: null,
  },
  {
    id: "vanilla-creme",
    flavor: "Vanilla Creme",
    note: "Earlier flavour study.",
    status: "Archived flavour concept",
    color: "#d5c8ab",
    image: "/images/products/vanilla-creme",
    backImage: null,
  },
  {
    id: "cafe-mocha",
    flavor: "Café Mocha",
    note: "Earlier flavour study.",
    status: "Archived flavour concept",
    color: "#795b4b",
    image: "/images/products/cafe-mocha",
    backImage: null,
  },
  {
    id: "cookies-cream",
    flavor: "Cookies & Cream",
    note: "Earlier flavour study.",
    status: "Archived flavour concept",
    color: "#a7a5a0",
    image: "/images/products/cookies-cream",
    backImage: null,
  },
].map((product) =>
  Object.freeze({
    name: "Whey Protein Blend",
    blend: "Whey protein concentrate + whey protein isolate",
    description: `Earlier ${product.flavor} packaging study for a 500 g whey concentrate and isolate blend. This archived concept is separate from the current WPC product.`,
    archived: true,
    netQuantityGrams: 500,
    allergens: ["Milk"],
    imageWidth: 1024,
    imageHeight: 1536,
    approval: "concept",
    nutrition: null,
    ingredients: null,
    servingInstructions: null,
    commerce: null,
    ...product,
  }),
);

export const featuredProduct = products[0];
export const getProduct = (id) =>
  products.find((product) => product.id === id) ?? featuredProduct;
export const productPath = "/products/trayn-whey-rich-chocolate/";
export const productUrl = (product) =>
  product.id === featuredProduct.id ? productPath : `/concepts/${product.id}/`;
export const productTitle = (product) =>
  `${product.flavor} ${product.name}, 500 g${product.archived ? " — Archived Concept" : ""} | TRAYN`;
export const productDescription = (product) =>
  `${product.description} Packaging concept; not for sale.`;
export const brand = Object.freeze({
  name: "TRAYN Nutrition",
  email: "traynnutrition@gmail.com",
  phone: "+919345959409",
  phoneDisplay: "+91 93459 59409",
  instagram: "https://www.instagram.com/trayn.nutrition",
  domain: "https://traynnutrition.com",
});
