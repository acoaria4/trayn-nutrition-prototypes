// Share path handling between static rendering, Vite, and enhanced navigation.
export function normalizeBasePath(value = "/") {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") return "/";
  if (
    !/^\/[A-Za-z0-9._~!$&()+,;=@%/-]+\/?$/.test(trimmed) ||
    trimmed.startsWith("//")
  ) {
    throw new Error(
      "SITE_BASE_PATH must be a URL pathname, such as /traynnutrition3/",
    );
  }
  const segments = trimmed.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error("SITE_BASE_PATH cannot contain relative path segments");
  }
  return `/${segments.join("/")}/`;
}

export function withBasePath(path, base = "/") {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${normalizeBasePath(base)}${path.slice(1)}`;
}

export function withoutBasePath(pathname, base = "/") {
  const prefix = normalizeBasePath(base);
  if (prefix === "/") return pathname;
  if (pathname === prefix.slice(0, -1)) return "/";
  return pathname.startsWith(prefix)
    ? `/${pathname.slice(prefix.length)}`
    : pathname;
}

// HTML is authored with site-root paths; only local URL attributes are rebased.
// Absolute canonical/OG URLs, email links, fragment links and copy are unchanged.
export function rebaseHtml(html, base = "/") {
  const prefix = normalizeBasePath(base);
  // Vite has already rebased bundled assets when its post-HTML hook runs.
  const rebase = (path) =>
    path.startsWith(prefix) && prefix !== "/"
      ? path
      : withBasePath(path, prefix);
  return html.replace(
    /\b(href|src|srcset)="([^"]*)"/g,
    (attribute, name, value) => {
      const rebased =
        name === "srcset"
          ? value
              .split(",")
              .map((candidate) => {
                const [url, ...descriptor] = candidate.trim().split(/\s+/);
                return [rebase(url), ...descriptor].join(" ");
              })
              .join(", ")
          : rebase(value);
      return `${name}="${rebased}"`;
    },
  );
}
