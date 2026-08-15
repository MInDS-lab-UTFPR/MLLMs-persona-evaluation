# Artwork

Editable sources for the two committed raster assets. Both are rendered with
[`rsvg-convert`](https://gitlab.gnome.org/GNOME/librsvg) (`brew install librsvg`)
and the outputs are committed, because GitHub Pages and social crawlers fetch
them directly.

## `og-social-card.svg` → `public/og.png`

The 1200 × 630 Open Graph preview. Composes the paper's title, headline finding,
and study counts beside a compact redrawing of figure 1, in the same palette.

```sh
rsvg-convert -w 1200 -h 630 -o ../public/og.png og-social-card.svg
```

It has to stay a PNG. No major social crawler renders SVG for a link preview —
pointing `og:image` at `public/paper/figure-1-experimental-design.svg` produced
a preview with no image at all.

## `icon.svg` → `app/icon.png`

The 512 × 512 site icon: six agent marks resolving into one centre. Deliberately
not a letter, so it is not confused with the sibling project page's serif "P" at
tab size.

```sh
rsvg-convert -w 512 -h 512 -o ../app/icon.png icon.svg
```

It lives in `app/` rather than `public/` because only Next's file convention
runs the icon through the asset pipeline, and so only it picks up `basePath`.
