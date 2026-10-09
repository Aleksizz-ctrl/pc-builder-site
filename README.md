# Computer Builder Site

A five-page responsive student website for exploring PC components, comparing pre-built computers, and planning a custom build. Built with HTML5, CSS3, Bootstrap 5.3.0, and a small vanilla JavaScript form demo.

**Live website:** [Computer Builder Site](https://aleksizz-ctrl.github.io/pc-builder-site/)

## Pages

- `index.html` — home page and project benefits.
- `builder.html` — component-selection table and sample build summary.
- `catalog.html` — CSS Grid catalog with Flexbox cards.
- `prebuilt.html` — ready-made computers and a comparison table using rowspan and colspan.
- `contact.html` — custom build/support form, project contact, and FAQ.

## Team contributions

### Participant 1 — Frontend & Core Layout

**Main files:** `index.html`, `builder.html`, and the shared base styles in `styles.css`.

- Built the home page with a hero banner, project benefits, and links to the configurator and catalog.
- Created the shared navigation bar and footer used across the website.
- Built the configurator layout using an HTML table and dropdowns for CPU, GPU, motherboard, RAM, storage, and power supply selection.
- Added a build summary displaying sample prices, power figures, and compatibility information. These values are static in the current demo.
- Defined the shared dark/cyan color palette, CSS variables, typography, spacing, and base component styles.

### Participant 2 — Components Catalog & Comparison

**Main files:** `catalog.html`, `prebuilt.html`, product images, and catalog/comparison styles in `styles.css`.

- Built the component catalog with a CSS Grid layout.
- Used Flexbox inside catalog cards to arrange images, category names, descriptions, and buttons.
- Created the pre-built PC page with images, descriptions, and sample prices for three builds.
- Added a comparison table covering processors, graphics cards, memory, storage, power supplies, cooling, use cases, and prices.
- Used `rowspan` and `colspan` to merge table cells and added custom card and table styling.

### Participant 3 — UI/UX & Responsive Design

**Main files:** `contact.html`, `contact.js`, responsive styles in `styles.css`, Bootstrap assets, and `README.md`.

- Added Contact Us in the existing dark/cyan theme, retaining English to match the other pages.
- Used Bootstrap `row`, `col-lg-8`, `col-lg-4`, `col-md-6`, spacing, containers, and button utilities.
- Added labeled name/email inputs, request and budget dropdowns, textarea, and submit button. Native validation and JavaScript check the data locally; no information is sent or saved.
- Added keyboard-accessible FAQ using `details` and `summary`.
- Added tablet (991.98px) and phone (575.98px) media queries: catalog changes from three to two to one column, the build summary stops being sticky, and tables scroll within their containers.
- Connected Bootstrap JavaScript on all five pages so mobile navigation works everywhere.
- Added navigation labels, active-page markers, a skip link, visible keyboard focus, and reduced-motion support.
- Included Bootstrap locally in `vendor/bootstrap/`, with its MIT license, for offline use.
- Prepared the project documentation and GitHub Pages publishing instructions.

## Run locally

Open `index.html` in your browser. No installation or build step is required. Alternatively, serve this folder with any static web server.

## Publish on GitHub Pages

1. Copy the project files into the root of the team repository, preserving the `images` and `vendor` directories. Commit and push the changes to the publishing branch.
2. In the repository, open **Settings → Pages**.
3. Select **Deploy from a branch**, choose the branch containing these files, and select **/(root)**. Save.
4. Wait for deployment to complete and copy the live address displayed by GitHub into your submission.
5. Open the published website and test all five navigation links and the mobile menu.

Repository: https://github.com/Aleksizz-ctrl/pc-builder-site

The project is published on [GitHub Pages](https://aleksizz-ctrl.github.io/pc-builder-site/).

## Validation

Checked all five pages at viewport widths of 375, 768, and 1280 pixels: no page-level horizontal overflow. Catalog columns changed as expected. Mobile navigation expanded successfully. An empty form was rejected and a completed demo request produced a local validation message.

## Current limitations

This is a frontend demonstration, not a shop. The configurator contains static prices, power figures, and a compatibility badge; selecting different components does not recalculate these values. Its checkout button has no order processing. The catalog and pre-built card links use placeholder `#` destinations. Sample product claims and prices are demonstration content.

The contact form validates input locally and has no backend or email delivery. The contact page links to the team repository.
