# TRAYN prototype project context

- Work on `v2/` unless the user names another version. Shopify migration is deferred.
- Preserve the current black foil, silver type and packaging red identity. `--red-accent: #f82030` highlights POTENTIAL, GET BUILT and small accents. Keep text clear of decorative artwork.
- Keep the header persistent. Use its measured height for hero pinning and anchor offsets. The hero must fill the remaining viewport without a black gap.
- Preserve the hero's 2,040 px scroll distance across screen sizes. Keep lighting delayed until after the pouch moves. No section snap scrolling.
- Preserve the section order: hero chapters 01/02, GET BUILT 03, packaging 04, product details 05, questions 06, contact.
- Sections after the hero follow content height; do not force viewport heights on phones. Interactions must work by touch and keyboard, honor reduced motion, and retain readable no-JavaScript HTML.
- Use the supplied printer PDF's back page as the source for label text. Keep transcribed artwork separate from verified retail/commercial records. Do not invent claims, testimonials, prices, availability or label values. Earlier blend concepts must not inherit current WPC label data.
- Prefer existing CSS, native HTML, Web Animations and the existing GSAP/Lenis setup. Do not add libraries for simple fades or tabs. Keep movement restrained and interruptible.
- Run render/build commands with `v2/` as the working directory; generated HTML is ignored. Test changed interactions and hero sizing on desktop, laptop and phone widths, including WebKit when available.
- Make local previews reviewable. Publish only when requested; do not treat an earlier deployment request as ongoing permission for later changes.

## Useful commands (from v2)

- `npm run check` and `npm test`
- `PLAYWRIGHT_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:browser`
- `SITE_BASE_PATH=/trayn-nutrition-prototypes/v2/ npm run build`
- `SITE_BASE_PATH=/trayn-nutrition-prototypes/v2/ npm run test:hosting:static`
- Restore root preview paths after a prefixed build: `node scripts/render-pages.mjs`
