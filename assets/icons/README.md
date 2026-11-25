# Icons

The site shows its icons as inline SVG. There is no icon font and no third-party
icon CSS.

## Material Symbols

`material/<name>.svg` holds the Material Symbols Outlined icons that the site
uses (Apache License 2.0, by Google). The partial
`layouts/partials/svg-icon.html` puts one in the page:

```go-html-template
{{ partial "svg-icon.html" (dict "name" "link" "class" "align-middle") }}
```

The icon sits in an `<i>` (or, with `"tag" "span"`, a `<span>`) with the class
`material-icons`, so the size classes (`size-20` and so on), the colors, and the
layout rules of the theme still apply. The SVG is `1em` square in the text
color.

The `icon` of a page (front matter), of a link in `data/links.yaml`, and of an
item in `data/landing.yaml` is the name of a file in `material/`. The build
stops with an error when the file does not exist.

The chevrons of the sidebar groups and the breadcrumbs are the same icon, as a
CSS mask in `assets/docs/scss/_variables.scss` (`--chevron-right`).

## Add an icon

1. Find the icon on <https://fonts.google.com/icons> with the style **Material
   Symbols**, **Outlined**, fill off, weight 400, grade 0, optical size 24.
2. Download the SVG and save it as `material/<name>.svg`, with the name of the
   icon in lowercase and with underscores (for example `rocket_launch.svg`).
3. Keep `viewBox="0 -960 960 960"`. Set
   `width="1em" height="1em" fill="currentColor"` on the `<svg>` element, as in
   the other files.

The icons in `../images/social/` (GitHub, GitLab, Bitbucket) are separate SVG
files for the "Edit on" link of a page (`layouts/partials/docs/gitinfo.html`).
