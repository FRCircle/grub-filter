# Grub Finder

A high-performance, Night Mode static web application for filtering and discovering local food places. Built for speed and legibility, it uses a premium design inspired by HTML5 UP's "Editorial" theme and is ready for instant deployment to GitHub Pages.

## Features
- **Location-Aware**: Switch between different cities (e.g., Bacolod, Bago) via a dynamic location picker.
- **Dynamic Filtering**: Filter places by cuisine, type, ownership, price, and custom tags.
- **Night Mode Aesthetics**: A sleek, dark UI featuring Emerald Green and Yellow accents with sharp typographic hierarchy.
- **Pure Static Architecture**: No build steps, no npm bloat. Just vanilla HTML, CSS, and JavaScript.
- **Data-Driven**: Powered by easily editable `.yaml` files. The app parses data on the fly using `js-yaml`.

## Quick Start

If you have `make` installed, you can use the following shortcuts:

- `make run` - Start a local server (port 8000)
- `make docker-run` - Start with Docker (port 8080)
- `make clean` - Remove local node dependencies

## How to Run Locally

Since the app uses `fetch()` to load the YAML data files, you must serve it using a local HTTP server (opening `index.html` directly via `file://` will cause CORS errors).

**Python 3:**
```bash
python3 -m http.server 8000
```
*(Open http://localhost:8000 in your browser)*

## How to Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to your repository's **Settings** tab.
3. In the left sidebar, click on **Pages**.
4. Under **Build and deployment**, ensure the **Source** is set to "Deploy from a branch".
5. Select your `main` branch and the `/ (root)` folder, then click **Save**.
6. Your site will be live at `https://frcircle.github.io/grub-finder/` within minutes.

## Managing Data

The app loads data files from the `data/` directory. 

1. **Add a new city**: Create a new `.yaml` file in `data/` (e.g., `manila.yaml`).
2. **Register the city**: The `index.html` currently lists locations in the `locationSelect` dropdown. Ensure your new file is added there.
3. **Edit contents**: Modify `data/bacolod.yaml` or `data/bago.yaml` to update restaurants. The app automatically builds filter chips based on the unique values found in these files.

Each restaurant entry supports multiple locations/branches:
```yaml
  - name: "Restaurant Name"
    description: "Brief description"
    cuisine: "asian"
    type: "cafe"
    ownership: "local"
    price: "$$"
    tags: ["wifi", "aircon"]
    address:
      - loc: "Street Name, City"
        gmap: "https://maps.app.goo.gl/..."
```