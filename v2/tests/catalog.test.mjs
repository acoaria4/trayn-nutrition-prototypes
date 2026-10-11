import test from "node:test";
import assert from "node:assert/strict";
import {
  products,
  featuredProduct,
  getProduct,
  productPath,
  productUrl,
  brand,
} from "../src/data/products.js";

test("unapproved concept products cannot accidentally advertise checkout or unsupported label claims", () => {
  assert.ok(products.length > 0, "A usable catalog is required");
  for (const product of products) {
    assert.equal(
      product.approval,
      "concept",
      `${product.id}: retail approval has not been supplied`,
    );
    for (const field of [
      "commerce",
      "nutrition",
      "ingredients",
      "servingInstructions",
    ]) {
      assert.equal(
        product[field],
        null,
        `${product.id}: ${field} needs verified source approval before publication`,
      );
    }
    assert.ok(
      product.allergens.includes("Milk"),
      `${product.id}: retain the known whey allergen`,
    );
    assert.equal(
      product.netQuantityGrams,
      500,
      `${product.id}: the supplied concept is the 500 g pack`,
    );
  }
});

test("every flavor has a unique public destination and safely falls back from unknown IDs", () => {
  const ids = products.map((product) => product.id);
  const destinations = products.map(productUrl);
  assert.equal(
    new Set(ids).size,
    products.length,
    "Duplicate IDs make flavor selection ambiguous",
  );
  assert.equal(
    new Set(destinations).size,
    products.length,
    "Every flavor needs a shareable destination",
  );
  assert.equal(
    productUrl(featuredProduct),
    productPath,
    "Preserve the existing public product URL",
  );
  assert.equal(productPath, "/products/trayn-whey-rich-chocolate/");
  for (const product of products) {
    const url = new URL(productUrl(product), brand.domain);
    assert.equal(
      url.origin,
      brand.domain,
      "Flavor navigation must remain on the brand site",
    );
    if (product !== featuredProduct) {
      const flavorId =
        url.searchParams.get("flavor") ||
        url.pathname.split("/").filter(Boolean).at(-1);
      assert.equal(
        getProduct(flavorId),
        product,
        "A copied flavor URL must reopen that flavor",
      );
    }
  }
  for (const badId of [
    undefined,
    null,
    "",
    "not-a-product",
    "<script>alert(1)</script>",
  ]) {
    assert.equal(
      getProduct(badId),
      featuredProduct,
      "Unknown external query input must resolve to a safe product",
    );
  }
});

test("only the supplied original pack exposes a back-label image", () => {
  assert.ok(
    featuredProduct.backImage,
    "The original source pack has a back view",
  );
  for (const product of products.filter(
    (product) => product !== featuredProduct,
  )) {
    assert.equal(
      product.backImage,
      null,
      `${product.id}: do not invent a future flavor nutrition label`,
    );
  }
});
