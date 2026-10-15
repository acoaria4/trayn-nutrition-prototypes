# Motion checkpoint — 15 October 2026

`2026-10-15-before-redesign.patch` preserves both rejected motion passes, including
the uncommitted lower-section experiment, as a diff against `e4aee89`. The first
pass also remains in Git commit `4c9f31c`.

The main site returns to the earlier visual baseline. Header capitalization and
the packaging inspector's fast-reopen scroll-lock fix are retained. The old
corner ornament and one-off mindset entrance are removed.

The new visual direction now lives independently in `v3/`. It does not replace
the V2 homepage. No deployment is included.

To recover the old experiments, apply the saved patch **to a separate checkout of
`e4aee89`**, from the repository root. Do not apply it over ongoing redesign work.
