// Shopify's editor prefixes generated JSON files with a block-comment header.
// Keep the downloaded files intact and remove that header only while reading.
export function parseShopifyJson(source) {
  return JSON.parse(source.replace(/^\uFEFF/, '').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
}
