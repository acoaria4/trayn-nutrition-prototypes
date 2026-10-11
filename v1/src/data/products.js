// Intentional product facts from the source claims register, not retail approvals.
export const products = [
  {
    id: "belgian-chocolate",
    flavor: "Belgian Chocolate",
    note: "The original chapter.",
    status: "Featured concept",
    color: "#8c4b35",
    image: "/images/products/belgian-chocolate",
    backImage: "/images/products/belgian-chocolate-back",
  },
  {
    id: "vanilla-creme",
    flavor: "Vanilla Creme",
    note: "A different expression.",
    status: "Future flavour concept",
    color: "#d5c8ab",
    image: "/images/products/vanilla-creme",
    backImage: null,
  },
  {
    id: "cafe-mocha",
    flavor: "Café Mocha",
    note: "The next chapter.",
    status: "Future flavour concept",
    color: "#795b4b",
    image: "/images/products/cafe-mocha",
    backImage: null,
  },
  {
    id: "cookies-cream",
    flavor: "Cookies & Cream",
    note: "Another perspective.",
    status: "Future flavour concept",
    color: "#a7a5a0",
    image: "/images/products/cookies-cream",
    backImage: null,
  },
].map((product) =>
  Object.freeze({
    ...product,
    name: "Whey Protein Blend",
    blend: "Whey Protein Concentrate + Whey Protein Isolate",
    netQuantityGrams: 500,
    allergens: ["Milk"],
    imageWidth: 1024,
    imageHeight: 1536,
    approval: "concept",
    nutrition: null,
    ingredients: null,
    servingInstructions: null,
    commerce: null,
  }),
);

export const featuredProduct = products[0];
export const getProduct = (id) =>
  products.find((product) => product.id === id) ?? featuredProduct;
export const productPath = "/products/trayn-whey-rich-chocolate/";
export const productUrl = (product) =>
  product.id === featuredProduct.id ? productPath : `/concepts/${product.id}/`;
export const brand = Object.freeze({
  name: "TRAYN Nutrition",
  email: "traynnutrition@gmail.com",
  phone: "+919345959409",
  phoneDisplay: "+91 93459 59409",
  instagram: "https://www.instagram.com/trayn.nutrition",
  domain: "https://traynnutrition.com",
});
