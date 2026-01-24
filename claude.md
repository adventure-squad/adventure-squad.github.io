# Adventure Squad Website

A Jekyll-based static travel blog documenting outdoor adventures with multimedia content (photos, videos, and interactive GPS trail maps).

## Tech Stack

- **Static Site Generator**: Jekyll with YAT theme (v1.10.0)
- **Styling**: SCSS/SASS
- **Maps**: Leaflet.js with GPX file support
- **Photo Gallery**: Custom masonry grid with lightbox
- **Photo Wall**: jQuery Poptrox lightbox with EXIF display
- **Video Hosting**: Cloudinary CDN with mobile optimization
- **Deployment**: GitHub Pages via GitHub Actions

## Project Structure

```
_posts/          # Blog posts (Markdown with YAML front matter)
_layouts/        # Page templates (default, post, home, photowall)
_includes/       # Reusable components (gallery-grid.html, image.html)
_sass/           # Theme stylesheets
assets/
  images/
    fulls/       # Full-size images (1024px) organized by trip
      kyrg/
      norway/
      slovenia/
      brielle/
      banners/
    thumbs/      # Auto-generated thumbnails (512px)
      kyrg/
      norway/
      ...
  videos/        # Video reels
  maps/          # GPX trail files
  js/            # Custom JS (gpx-map.js, video-optimizer.js)
  photowall/     # Photo wall CSS/JS assets
```

## Key Files

- `_config.yml` - Main Jekyll configuration
- `_includes/gallery-grid.html` - Photo gallery grid with lightbox
- `_includes/image.html` - Single image with lightbox
- `resize-images.mjs` - Auto-generates thumbnails from fulls/

## Local Development

```bash
bundle install
bundle exec jekyll serve
```

Site runs at `http://localhost:4000`

## Image Management

All images use a unified `fulls/thumbs` structure for performance:
- `fulls/` - Full-size images displayed in lightbox
- `thumbs/` - Thumbnails displayed in grids (faster page loads)

**Adding images (with auto-resize):**
```bash
# First time setup
npm install

# Generate thumbnails from all images in fulls/
npm run resize
```

**Manual:** Place full-size images in `assets/images/fulls/{trip}/`, then run `npm run resize` to generate thumbnails.

## Creating Posts

Posts go in `_posts/` with format `YYYY-MM-DD-title.md`. Front matter options:

```yaml
---
layout: post
title: "Trip Title"
categories: [trip]
tags: [hiking, kayaking]
banner:
  video: /assets/videos/reel.mp4
  image: /assets/images/fulls/banners/banner.jpg
image: /assets/images/fulls/trip/preview.jpg
---
```

## Custom Components

### Photo Gallery (in posts)
```liquid
{% include gallery-grid.html folder="assets/images/fulls/norway" %}
```
Renders masonry grid using thumbnails, opens full-size in lightbox. Supports keyboard/touch navigation.

### Single Image
```liquid
{% include image.html url="/assets/images/fulls/kyrg/photo.jpg" description="Caption" %}
```

### Photo Wall (standalone page)
Full-screen masonry gallery at `/photos/` showing all trip photos with EXIF metadata display.

### GPX Map
```html
<div id="map" style="height: 400px;"></div>
<script>initGPXMap('map', '/assets/maps/trail.gpx');</script>
```
Displays interactive trail map with Leaflet.

## Deployment

Push to `main` branch triggers GitHub Actions workflow which builds and deploys to GitHub Pages.

## External Services

- **Cloudinary**: Video hosting and optimization
- **Thunderforest**: Map tiles (API key in config)
