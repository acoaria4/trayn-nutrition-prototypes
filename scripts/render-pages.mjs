import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import {
  document,
  home,
  productPage,
  informationPage,
  notFoundPage,
} from "../src/templates.js";
import { products, featuredProduct, productUrl } from "../src/data/products.js";

const product = {
  type: "product",
  initialFlavor: featuredProduct.id,
  title: "Belgian Chocolate Whey Blend Concept, 500 g | TRAYN",
  description:
    "Inspect TRAYN’s Belgian Chocolate concentrate and isolate blend concept, shown in a 500 g pack. Packaging concepts, not for sale.",
  canonical: "/products/trayn-whey-rich-chocolate",
  content: productPage(featuredProduct),
};
const pages = [
  {
    file: "index.html",
    type: "home",
    title: "TRAYN Nutrition — Under Tension",
    description:
      "Discover TRAYN Under Tension. Explore the Belgian Chocolate whey blend packaging concept and the next chapter of TRAYN Nutrition.",
    canonical: "/",
    content: home(),
  },
  { file: "product.html", ...product },
  { file: "products/trayn-whey-rich-chocolate/index.html", ...product },
  ...products
    .filter((concept) => concept.id !== featuredProduct.id)
    .map((concept) => ({
      file: `concepts/${concept.id}/index.html`,
      type: "product",
      initialFlavor: concept.id,
      title: `${concept.flavor} Whey Blend Concept, 500 g | TRAYN`,
      description: `Explore TRAYN’s ${concept.flavor} future flavour concept, shown as a 500 g concentrate and isolate blend. Packaging artwork, not for sale.`,
      canonical: productUrl(concept),
      content: productPage(concept),
    })),
  {
    file: "label-information.html",
    type: "information",
    title: "Product & Packaging Concept Information | TRAYN",
    description:
      "What TRAYN’s concept packaging shows, what is still unverified, and how to contact TRAYN for product information.",
    canonical: "/label-information.html",
    content: informationPage(),
  },
  {
    file: "404.html",
    type: "404",
    title: "Page Not Found | TRAYN Nutrition",
    description:
      "Return to TRAYN Nutrition and explore the whey blend concept.",
    canonical: "/404.html",
    content: notFoundPage(),
  },
];
for (const page of pages) {
  await mkdir(dirname(page.file), { recursive: true });
  // Vite resolves source entry points first; its post-HTML hook rebases public URLs.
  await writeFile(page.file, document(page));
}
console.log(
  `Rendered ${pages.length} static pages with crawlable product content.`,
);
