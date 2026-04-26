# Grub Filter

A modern, dark-themed static web application for filtering and discovering local food places. Built to be deployed directly to GitHub Pages with no build step required. Data is loaded dynamically from YAML files.

## Features
- **Dynamic Filtering**: Filter places by cuisine, type, ownership, price, and custom tags.
- **Pure Static**: No build tools, no npm scripts, no frameworks. Just HTML, CSS, and vanilla JavaScript.
- **Data-Driven**: Powered entirely by easily editable `.yaml` files. The app uses `js-yaml` via CDN to parse data on the fly.
- **Premium Design**: Features a sleek dark mode with glassmorphic elements, dynamic CSS Grid layouts, and micro-animations.

## Quick Start

If you have `make` installed, you can use the following shortcuts:

- `make run` - Start a local server (port 8000)
- `make docker-run` - Start with Docker (port 8080)
- `make clean` - Remove local node dependencies

## How to Run Locally

Since the app uses `fetch()` to load the local YAML data files, you must serve it using a local HTTP server (opening `index.html` directly via `file://` in your browser will cause CORS errors).

If you have **Python** installed, you can easily start a server from the project directory:

```bash
# Python 3
python3 -m http.server 8000
```
*(Then open http://localhost:8000 in your browser)*

Alternatively, if you prefer **Node.js**:
```bash
npx serve .
```

### Running with Docker

If you have Docker installed, you can run the app without installing any local dependencies:

```bash
# Build and start the container
docker-compose up --build
```
*(The app will be available at http://localhost:8080. Local changes will sync automatically via volumes.)*

## How to Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to your repository's **Settings** tab.
3. In the left sidebar, click on **Pages**.
4. Under "Build and deployment", set the **Source** to "Deploy from a branch".
5. Select your `main` branch (and `/root` folder) and click **Save**.
6. Wait a minute or two, and your site will be live!

## Managing Data

To add or modify restaurants, simply edit the `data/negocc.yaml` file. The app will automatically detect new unique values for cuisine, type, tags, etc., and generate the appropriate filter chips in the UI. No HTML or JavaScript changes are necessary.