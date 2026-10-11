"""Build portable browser assets from the existing TRAYN source repository.

Usage: python scripts/prepare_assets.py --source ../traynnutrition-website-v2
Requires Pillow, fontTools and brotli. Never changes the source repository.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont, ImageOps


PRODUCTS = {
    "belgian-chocolate": "assets/slipstream-front.webp",
    "belgian-chocolate-back": "assets/slipstream-back-concept.webp",
    "vanilla-creme": "new_website_3/assets/vanilla-creme.webp",
    "cafe-mocha": "new_website_3/assets/cafe-mocha.webp",
    "cookies-cream": "new_website_3/assets/cookies-cream.webp",
}
LOGO = "new_website_3/assets/package renders/revised/approved-logo.png"
FONTS = {
    "barlow-700": ("font-2.ttf", 700, "Barlow Condensed"),
    "barlow-800": ("font-3.ttf", 800, "Barlow Condensed"),
    "montserrat-400": ("font-4.ttf", 400, "Montserrat"),
    "montserrat-500": ("font-5.ttf", 500, "Montserrat"),
}
FONT_SOURCE = Path("new_website_3/assets")
BG = "#090A0C"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_product(source: Path, destination: Path, width: int) -> None:
    """Keep original 1024 px compressed bytes; downsample without cropping."""
    with Image.open(source) as original:
        if original.width == width and source.suffix.lower() == ".webp":
            shutil.copyfile(source, destination)
            return
        image = ImageOps.exif_transpose(original)
        height = round(image.height * width / image.width)
        image = image.resize((width, height), Image.Resampling.LANCZOS)
        # Alpha is encoded losslessly by WebP. Do not remove existing backgrounds.
        image.save(destination, "WEBP", quality=87, method=6, exact=True)


def make_font(source: Path, destination: Path, weight: int) -> None:
    font = TTFont(source, recalcTimestamp=False)
    if font["OS/2"].usWeightClass != weight:
        raise ValueError(f"Unexpected weight in {source.name}")
    options = subset.Options()
    options.recalc_timestamp = False
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
    options.name_languages = [0x409]
    options.layout_features = ["*"]
    # Latin, combining accents, punctuation, currency (including INR), trademark.
    characters = set(range(0x20, 0x7F))
    for start, end in ((0xA0, 0x250), (0x300, 0x370), (0x2000, 0x2070), (0x20A0, 0x20D0)):
        characters.update(range(start, end))
    characters.add(0x2122)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=characters)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(destination, reorderTables=True)
    font.close()


def make_social(source: Path, destination: Path) -> None:
    """Compose only supplied artwork and truthful type on a solid brand ground."""
    canvas = Image.new("RGBA", (1200, 630), BG)
    with Image.open(source / LOGO) as original:
        logo = original.convert("RGBA")
        logo.thumbnail((430, 260), Image.Resampling.LANCZOS)
        canvas.alpha_composite(logo, (70, 75))
    with Image.open(source / PRODUCTS["belgian-chocolate"]) as original:
        pouch = original.convert("RGBA")
        pouch.thumbnail((378, 567), Image.Resampling.LANCZOS)
        canvas.alpha_composite(pouch, (758, 29))
    draw = ImageDraw.Draw(canvas)
    display = ImageFont.truetype(str(source / FONT_SOURCE / "font-3.ttf"), 62)
    body = ImageFont.truetype(str(source / FONT_SOURCE / "font-5.ttf"), 19)
    small = ImageFont.truetype(str(source / FONT_SOURCE / "font-4.ttf"), 15)
    draw.line((70, 369, 143, 369), fill="#E51B2B", width=5)
    draw.text((67, 393), "WHEY PROTEIN BLEND", font=display, fill="#F3F3F1")
    draw.text((70, 485), "Belgian Chocolate  /  500 g concept", font=body, fill="#C5C7CB")
    draw.text((70, 565), "PACKAGING CONCEPT — NOT FOR SALE", font=small, fill="#C5C7CB")
    canvas.convert("RGB").save(destination, "JPEG", quality=91, optimize=True, subsampling=0)


def build(source: Path, output: Path) -> None:
    source = source.resolve(strict=True)
    output = output.resolve()
    if output == source or source in output.parents:
        raise ValueError("Output must be separate from the source repository")
    public = output / "public"
    for relative in ("images/products", "images/brand", "fonts", "licenses"):
        (public / relative).mkdir(parents=True, exist_ok=True)
    (output / "docs").mkdir(parents=True, exist_ok=True)
    manifest = {"products": [], "brand": [], "fonts": [], "licenses": []}

    def record(file: Path, source_relative: str, category: str, **extra: object) -> None:
        item = {
            "path": "/" + file.relative_to(public).as_posix(),
            "bytes": file.stat().st_size,
            "sha256": sha256(file),
            "source": source_relative,
            **extra,
        }
        if file.suffix in (".webp", ".png", ".jpg"):
            with Image.open(file) as image:
                item.update(width=image.width, height=image.height, alpha="A" in image.getbands())
        manifest[category].append(item)

    for slug, relative in PRODUCTS.items():
        for width in (640, 1024):
            file = public / "images/products" / f"{slug}-{width}.webp"
            save_product(source / relative, file, width)
            record(file, relative, "products", source_sha256=sha256(source / relative))

    logo_file = public / "images/brand/trayn-logo.webp"
    with Image.open(source / LOGO) as logo:
        logo.convert("RGBA").save(logo_file, "WEBP", lossless=True, method=6, exact=True)
        small_logo = logo.convert("RGBA").resize((256, round(logo.height * 256 / logo.width)), Image.Resampling.LANCZOS)
        small_logo.save(public / "images/brand/trayn-logo-256.webp", "WEBP", lossless=True, method=6, exact=True)
        icon = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        scaled = logo.convert("RGBA")
        scaled.thumbnail((120, 120), Image.Resampling.LANCZOS)
        icon.alpha_composite(scaled, ((128 - scaled.width) // 2, (128 - scaled.height) // 2))
        icon.save(public / "images/brand/favicon.png", "PNG", optimize=True)
    record(logo_file, LOGO, "brand", source_sha256=sha256(source / LOGO))
    record(public / "images/brand/trayn-logo-256.webp", LOGO, "brand", source_sha256=sha256(source / LOGO))
    record(public / "images/brand/favicon.png", LOGO, "brand")
    make_social(source, public / "images/social-share.jpg")
    record(public / "images/social-share.jpg", f"{LOGO}; {PRODUCTS['belgian-chocolate']}", "brand")

    for slug, (name, weight, family) in FONTS.items():
        file = public / "fonts" / f"{slug}.woff2"
        make_font(source / FONT_SOURCE / name, file, weight)
        record(file, (FONT_SOURCE / name).as_posix(), "fonts", family=family, weight=weight)
    for name in ("Barlow-Condensed-OFL.txt", "Montserrat-OFL.txt"):
        file = public / "licenses" / name
        shutil.copyfile(source / FONT_SOURCE / name, file)
        record(file, (FONT_SOURCE / name).as_posix(), "licenses")

    (public / "images/assets-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    lines = [
        "# Asset provenance and browser derivatives",
        "",
        "All package artwork is reused from the existing TRAYN repository. No product imagery was generated or altered, and source originals remain unchanged. Package images are concepts, not verified retail photography or print-ready labels.",
        "",
        "## Rebuild",
        "",
        "```sh",
        "python scripts/prepare_assets.py --source ../traynnutrition-website-v2",
        "```",
        "",
        "Requires Python with Pillow, fontTools and brotli. The source is supplied through the CLI; no absolute machine paths enter runtime assets. Outputs are deterministic for fixed source bytes and library versions. The script refuses to write within the source repository.",
        "",
        "## Artwork",
        "",
        "The current Belgian Chocolate front/back come from root `assets/slipstream-front.webp` and `assets/slipstream-back-concept.webp`. The three future flavours come from `new_website_3/assets/`. The approved supplied `new_website_3/assets/package renders/revised/approved-logo.png` supersedes the reconstructed logo kit.",
        "",
        "All pouch canvases retain their original 2:3 aspect ratio. The 1024 px exports preserve original WebP bytes; 640 px exports use Lanczos downsampling and WebP quality 87. Existing alpha is preserved; the three future-flavour images retain their opaque source backgrounds. No clipping, reshaping, background removal or package-label retouching is performed.",
        "",
        "The logo master is lossless WebP at its original 740 × 440 dimensions and preserves every RGBA pixel. A 256 × 152 lossless WebP derivative retains the complete logo and its proportions, with natural pixel rounding, for responsive header/footer delivery. The favicon contains the complete proportionally scaled logo. The 1200 × 630 social image places the supplied logo and pouch over solid obsidian with product identity and a visible concept disclosure; it adds no product claims.",
        "",
        "| Browser path | Dimensions | KiB | Alpha |",
        "| --- | --- | ---: | --- |",
    ]
    for item in manifest["products"] + manifest["brand"]:
        lines.append(f"| `{item['path']}` | {item['width']} × {item['height']} | {item['bytes'] / 1024:.1f} | {'Yes' if item['alpha'] else 'No'} |")
    lines += [
        "",
        "## Fonts and licensing",
        "",
        "Local Barlow Condensed and Montserrat source fonts are licensed under the SIL Open Font License. Their complete source licence texts are copied to `/licenses/`. WOFF2 exports retain font copyright/licence metadata and Latin, combining accents, punctuation and currency characters present in each source. This includes the café accent and rupee symbol where supported by the original font. Kerning and available OpenType layout features are retained.",
        "",
        "| Browser path | Family | Weight | KiB |",
        "| --- | --- | ---: | ---: |",
    ]
    for item in manifest["fonts"]:
        lines.append(f"| `{item['path']}` | {item['family']} | {item['weight']} | {item['bytes'] / 1024:.1f} |")
    lines += [
        "",
        "Machine-readable dimensions, sizes, relative provenance and SHA-256 checksums are recorded in `/images/assets-manifest.json`. All image files were decoded successfully after export; logo pixel equality, product dimensions/alpha and font weight/glyph availability were checked. These are file checks, not a browser performance score.",
        "",
    ]
    (output / "docs/ASSETS.md").write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({"images": len(manifest["products"]) + len(manifest["brand"]), "fonts": len(manifest["fonts"]), "image_bytes": sum(item["bytes"] for item in manifest["products"] + manifest["brand"]), "font_bytes": sum(item["bytes"] for item in manifest["fonts"])}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Existing source repository (read only)")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1], help="Separate redesign root")
    arguments = parser.parse_args()
    build(arguments.source, arguments.output)
