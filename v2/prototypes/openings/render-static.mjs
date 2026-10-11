import { readFile, writeFile } from "node:fs/promises";

// Render these isolated studies before Vite starts, retaining real content if
// JavaScript or motion fails. No generated production-site files are touched.
const root = new URL(".", import.meta.url);
const template = await readFile(new URL("./view.html", root), "utf8");
const names = ["quiet", "tension", "flavour"];
const titles = ["The Quiet Before", "Under Tension", "The Flavour Study"];
const asset = (name) => `./assets/${name}`;
for (const [index, name] of names.entries()) {
  const source = (
    await readFile(new URL(`./${name}.js`, root), "utf8")
  ).replace(/^import\s+['"]\.\/[^'"]+\.css['"];?\s*$/gm, "");
  const { render } = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );
  const content = render({
    asset,
    logo: asset("trayn-logo.webp"),
    pouch: asset("pouch.webp"),
    backPouch: asset("pouch-back.webp"),
  });
  const html = template
    .replace(
      "<title>TRAYN — Opening experience</title>",
      `<title>${titles[index]} — TRAYN</title>`,
    )
    .replace(
      "</head>",
      `<link rel="stylesheet" href="./base.css"><link rel="stylesheet" href="./${name}.css"></head>`,
    )
    .replace("<body>", `<body data-variant="${index + 1}">`)
    .replace(
      '<div id="experience-content"></div>',
      `<div id="experience-content">${content}</div>`,
    )
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript\s*>/gi, "");
  await writeFile(new URL(`./${name}.html`, root), html);
}
console.log("Rendered three isolated, static opening studies.");
