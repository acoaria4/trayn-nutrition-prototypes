import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import {
  document,
  home,
  productPage,
  informationPage,
  notFoundPage,
} from "../src/templates.js";
import {
  products,
  featuredProduct,
  productUrl,
  productTitle,
  productDescription,
} from "../src/data/products.js";

const product = {
  type: "product",
  initialFlavor: featuredProduct.id,
  title: productTitle(featuredProduct),
  description: productDescription(featuredProduct),
  canonical: "/products/trayn-whey-rich-chocolate",
  content: productPage(featuredProduct),
};
const pages = [
  {
    file: "index.html",
    type: "home",
    title: "TRAYN Nutrition — Fuel Your Potential",
    description:
      "Fuel your potential. Get built. Explore TRAYN Belgian Chocolate whey protein concentrate, the 500 g pack and the mindset behind the brand.",
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
      title: productTitle(concept),
      description: productDescription(concept),
      canonical: productUrl(concept),
      content: productPage(concept),
    })),
  {
    file: "label-information.html",
    type: "information",
    title: "Product & Packaging Concept Information | TRAYN",
    description:
      "Product and packaging information for TRAYN Belgian Chocolate whey protein concentrate, with earlier flavour studies kept in the archive.",
    canonical: "/label-information.html",
    content: informationPage(),
  },
  {
    file: "404.html",
    type: "404",
    title: "Page Not Found | TRAYN Nutrition",
    description:
      "Return to TRAYN Nutrition and explore Belgian Chocolate whey protein concentrate.",
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
