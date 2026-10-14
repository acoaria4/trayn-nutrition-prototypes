import test from "node:test";
import assert from "node:assert/strict";
import {
  products,
  featuredProduct,
  getProduct,
  productPath,
  productUrl,
  productTitle,
  productDescription,
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

test("the current WPC pack never exposes the previous blend back label", () => {
  assert.equal(featuredProduct.name, "Whey Protein Concentrate");
  assert.equal(featuredProduct.blend, "Whey protein concentrate (WPC)");
  assert.equal(featuredProduct.archived, false);
  assert.equal(featuredProduct.image, "/images/products/belgian-chocolate-wpc");
  assert.doesNotMatch(productTitle(featuredProduct), /blend|isolate/i);
  assert.doesNotMatch(productDescription(featuredProduct), /blend|isolate/i);
  assert.equal(
    featuredProduct.backImage,
    "/images/products/belgian-chocolate-wpc-back",
  );
  assert.equal(
    featuredProduct.backLabelPdf,
    "/images/products/belgian-chocolate-wpc-back-label.pdf",
  );
  for (const product of products.filter((product) => product.archived)) {
    assert.equal(
      product.backImage,
      null,
      `${product.id}: no matching back label has been supplied`,
    );
    assert.equal(product.backLabelPdf, undefined);
  }
});

test("archived flavour routes retain their earlier formulation and artwork", () => {
  for (const product of products.filter(
    (product) => product !== featuredProduct,
  )) {
    assert.equal(product.archived, true);
    assert.equal(product.status, "Archived flavour concept");
    assert.equal(product.name, "Whey Protein Blend");
    assert.match(product.blend, /concentrate.*isolate/i);
    assert.equal(product.image, `/images/products/${product.id}`);
    assert.equal(productUrl(product), `/concepts/${product.id}/`);
    assert.match(productTitle(product), /Archived Concept/);
    assert.match(productDescription(product), /archived concept/i);
    assert.match(productDescription(product), /concentrate and isolate blend/i);
  }
});
