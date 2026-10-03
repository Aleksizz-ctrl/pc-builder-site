# Computer Builder Site

A five-page responsive student website for exploring PC components, comparing pre-built computers, and planning a custom build. Built with HTML5, CSS3, Bootstrap 5.3.0, and a small vanilla JavaScript form demo.

## Pages

- `index.html` — home page and project benefits.
- `builder.html` — component-selection table and sample build summary.
- `catalog.html` — CSS Grid catalog with Flexbox cards.
- `prebuilt.html` — ready-made computers and a comparison table using rowspan and colspan.
- `contact.html` — custom build/support form, project contact, and FAQ.

## Participant 3 contribution

- Added Contact Us in the existing dark/cyan theme, retaining English to match the other pages.
- Used Bootstrap `row`, `col-lg-8`, `col-lg-4`, `col-md-6`, spacing, containers, and button utilities.
- Added labeled name/email inputs, request and budget dropdowns, textarea, and submit button. Native validation and JavaScript check the data locally; no information is sent or saved.
- Added keyboard-accessible FAQ using `details` and `summary`.
- Added tablet (991.98px) and phone (575.98px) media queries: catalog changes from three to two to one column, the build summary stops being sticky, and tables scroll within their containers.
- Connected Bootstrap JavaScript on all five pages so mobile navigation works everywhere.
- Added navigation labels, active-page markers, a skip link, visible keyboard focus, and reduced-motion support.
- Included Bootstrap locally in `vendor/bootstrap/`, with its MIT license, for offline use.

## Run locally

Open `index.html` in your browser. No installation or build step is required. Alternatively, serve this folder with any static web server.

## Publish on GitHub Pages

1. Copy the project files into the root of the team repository, preserving the `images` and `vendor` directories. Commit and push the changes to the publishing branch.
2. In the repository, open **Settings → Pages**.
3. Select **Deploy from a branch**, choose the branch containing these files, and select **/(root)**. Save.
4. Wait for deployment to complete and copy the live address displayed by GitHub into your submission.
5. Open the published website and test all five navigation links and the mobile menu.

Repository: https://github.com/Aleksizz-ctrl/pc-builder-site

Deployment status: prepared locally; online publication has not been performed or verified.

## Validation

Checked all five pages at viewport widths of 375, 768, and 1280 pixels: no page-level horizontal overflow. Catalog columns changed as expected. Mobile navigation expanded successfully. An empty form was rejected and a completed demo request produced a local validation message.

## Current limitations

This is a frontend demonstration, not a shop. The inherited configurator contains static prices, power figures, and a compatibility badge; selecting different components does not recalculate these values. Its checkout button has no order processing. The catalog and pre-built card links still use placeholder `#` destinations. Those features belong to the earlier participants' sections and need completion if the team intends to demonstrate them as functional. Sample product claims and prices are not verified shopping guidance.

The contact form has no backend or email delivery. The repository is the only verified contact destination supplied for the team; no fictional address, phone number, or mailbox has been added.
