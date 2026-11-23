# KitWorks Lab — Official Site & Interactive OBS Tool Demos

Static landing page and live browser demos for **TokiDock** and **GoalDock** (local HTML overlays controlled from OBS Studio's Custom Browser Dock).

Zero external dependencies, zero build step — ready for GitHub Pages out of the box.

## Directory Structure

```text
site/
├── index.html          # Bilingual (JP / EN) landing page + live TokiDock & GoalDock demos
├── css/
│   └── styles.css      # Editorial cream-paper design system + OBS preview canvas styling
├── js/
│   ├── i18n.js         # Japanese & English copy dictionary
│   ├── demos.js        # Interactive TokiDock & GoalDock dock-to-overlay simulators
│   └── main.js         # Language switcher, smooth anchor nav, initialization
├── assets/
│   ├── avatar-600.png  # KitWorks Lab brand mark
│   ├── favicon.png     # PNG favicon
│   └── favicon.svg     # Vector favicon
├── .nojekyll           # Serves static files directly on GitHub Pages
└── README.md
```

## Deploy to GitHub Pages

1. Create a public repository on GitHub (for example, `kitworks-lab.github.io` or `kitworks-site`).
2. Run the following commands inside this `site/` directory:

```bash
git init
git add .
git commit -m "Initial commit: KitWorks Lab site and live OBS demos"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

3. In GitHub repository **Settings → Pages**, set **Source** to **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be live at `https://<your-username>.github.io/` (or `https://<your-username>.github.io/<your-repo>/`).

## Local Preview

Open `index.html` directly in any browser, or run any static server (e.g. `npx serve .` or `python -m http.server 8080`).

## Products & Links

- **BOOTH Shop**: https://kitworks.booth.pm/
- **TokiDock Lite (Free)**: https://kitworks.booth.pm/items/9206701
- **TokiDock Pro (¥500)**: https://kitworks.booth.pm/items/9206701
- **GoalDock Lite (Free)**: https://kitworks.booth.pm/items/9207731
- **GoalDock Pro (¥500)**: https://kitworks.booth.pm/items/9207731
- **Zenn Book**: https://zenn.dev/kitworks/books/388f2b2ed4c788
- **note**: https://note.com/kitworks_lab
- **YouTube**: https://www.youtube.com/channel/UC_r4xzn2zs3gjbU3rXn3lpA
- **X**: https://x.com/kitworks_lab
