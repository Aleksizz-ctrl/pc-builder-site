# Computer Builder Site

A responsive five-page website for exploring PC components, comparing pre-built computers, and creating custom PC builds.

**Technologies:** HTML5, CSS3, Bootstrap 5, JavaScript, jQuery 3.7.1.

**Live website:** https://aleksizz-ctrl.github.io/pc-builder-site/

**Repository:** https://github.com/Aleksizz-ctrl/pc-builder-site

## Website Pages

| Page | Description |
|---|---|
| Home | Project introduction, navigation and theme functionality. |
| Configurator | Custom PC builder with component selection, price calculation and compatibility checks. |
| Catalog | Interactive component catalog with search, category filters, sorting and favorites. |
| Pre-built PCs | Ready-made PC configurations with expandable specifications and comparison table. |
| Contact Us | Contact form with custom validation, FAQ accordion and Back to Top button. |

## New final features

- Live USD exchange rates with a shared currency selector and offline fallback.
- Saved build management using the configurator’s JavaScript classes and browser storage.
- Catalog favorites persist between visits.
- The configurator shows each selected component's share of build price and estimated power consumption.
- **A− / A+** in the navbar changes text size from 90% to 120%. The preference persists across pages and reloads.
- Contact Us restores unfinished form fields from this browser. Successful local validation clears the draft.

## API information

The site fetches live USD exchange rates from [ExchangeRate-API](https://www.exchangerate-api.com) at `https://open.er-api.com/v6/latest/USD`. Component data is local, and the contact form validates requests in the browser.

The configurator calls `renderStats(build)` from `updateSummary()` and renders into `#stats-panel`. It reads `getParts()`, `getTotalPrice()` and `getTotalPower()` on a `PCBuild`. Power share uses the `power` field in watts. PSU capacity is recorded separately as `watts`.

Browser storage keys include `pc-builder-font-size` for the text-size preference and `pc-builder-contact-draft` for the unfinished form.

## Catalog Features

The Catalog page contains 12 sample PC components, including CPUs, GPUs, RAM, storage devices, motherboards and power supplies.

Products are stored in a JavaScript array and displayed dynamically.

### Implemented functionality

- **Dynamic rendering:** `renderProducts()` generates product cards using a `for...of` loop.
- **Search:** users can find products by name while typing.
- **Category filtering:** products can be filtered by component type.
- **Sorting:** products can be sorted by price from low to high or high to low.
- **Favorites:** users can add and remove products from their favorites list.
- **Favorites counter:** the number of saved products updates automatically.
- **Remove functionality:** products can also be removed directly from the favorites list.
- **Event delegation:** one event listener handles dynamically generated favorite buttons.

### Main JavaScript Functions

| Function | Purpose |
|---|---|
| `renderProducts(list)` | Displays product cards dynamically. |
| `filterProducts(list, query, category)` | Filters products by name and category. |
| `sortProducts(list, mode)` | Sorts products by price without modifying the original array. |
| `toggleFavorite(id)` | Adds or removes a product from favorites. |
| `renderFavorites()` | Updates the favorites list and counter. |
| `updateCatalog()` | Applies the current search, filter and sorting settings. |

Favorites are stored in `localStorage` under `pc-builder-favorites` and remain available after reloading the page.

## Currency Converter

`currency.js` loads rates on all five pages. It converts prices in Catalog, Configurator, and Pre-built PCs.

- `CurrencyService.fetchRates()` requests rates with `async/await`, checks `response.ok` and handles request errors.
- Exchange rates are cached in `localStorage` under `pc-builder-currency-rates`.
- If the request fails, previously saved rates are used when available.
- The script creates the currency selector in the navbar on each page.
- The selected currency is saved under `pc-builder-selected-currency`.
- Product and pre-built PC prices are converted from their original USD values whenever the selected currency changes.
- The selector options are generated from `Object.keys(rates)`.
- The navbar status displays loading, success, missing-data or error/fallback information.
- The page footer credits ExchangeRate-API.

The conversion is display-only: the original product prices remain in USD in the page data.

## Pre-built PCs Features

The Pre-built PCs page contains three ready-made configurations:

- **Budget Gamer** — an affordable PC for 1080p gaming.
- **Workstation Pro** — a configuration for programming, editing and productivity.
- **Gaming Beast** — a high-performance gaming PC.

Each configuration includes expandable technical specifications:

- CPU
- GPU
- RAM
- Storage
- Power Supply
- Cooling

### jQuery Functionality

The `prebuilt.js` file adds interactive behavior to the View Build buttons.

Implemented jQuery methods:

| Method | Purpose |
|---|---|
| `$(document).ready()` | Runs the code after the document is ready. |
| `click()` / delegated click handler | Handles clicks on View Build buttons. |
| `preventDefault()` | Prevents the `href="#"` link from jumping to the top. |
| `closest()` | Finds the selected PC card. |
| `find()` | Finds the specifications inside the card. |
| `siblings()` | Finds and closes other PC cards. |
| `slideToggle()` | Expands or collapses build specifications. |
| `slideUp()` | Closes previously opened specifications. |
| `text()` | Changes the button label. |
| `css()` | Highlights the selected PC card with a border. |

Only one PC configuration can be expanded at a time.

## Team Contributions

### Altair — Catalog and Pre-built PCs

**Main files:** `catalog.html`, `catalog.js`, `prebuilt.html`, `prebuilt.js`, `currency.js`, `styles.css`.

- Implemented the exchange-rate API and persistent currency selection.

- Created the interactive PC component catalog.
- Added 12 products using a JavaScript array.
- Implemented dynamic product-card generation.
- Added live product search and category filtering.
- Implemented ascending and descending price sorting.
- Created the Favorites system with add/remove functionality and a live counter.
- Used event delegation to handle dynamically generated buttons.
- Developed three pre-built PC configurations.
- Added expandable technical specifications using jQuery animations.
- Implemented interactions using `closest()`, `find()`, `siblings()` and `slideToggle()`.
- Created the PC comparison table using HTML table structures, including `rowspan` and `colspan`.

### Slava — Frontend and Core Functionality

**Main files:** `index.html`, `builder.html`, `main.js`, `builder.js`.

- Developed the Home page and main navigation.
- Implemented the PC configurator.
- Added component selection and automatic price calculations.
- Implemented CPU socket and power supply compatibility checks.
- Added saved PC configurations.
- Implemented the shared light/dark theme functionality.

### Daryn — Contact Form and UI

**Main files:** `contact.html`, `contact.js`, `ui.js`, `a11y.js`, `stats.js`, `README.md`.

- Implemented custom form validation.
- Added email confirmation and field-specific error messages.
- Created a live character counter.
- Added success feedback and form reset functionality.
- Implemented the jQuery FAQ accordion.
- Added a dynamically created Back to Top button.
- Improved responsive design and accessibility.
- Updated project documentation.
- Added contact drafts, navbar text-size controls and build statistics.

## How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/Aleksizz-ctrl/pc-builder-site.git
```

2. Open the project folder:

```bash
cd pc-builder-site
```

3. Start a local server:

```bash
python3 -m http.server 8000
```

4. Open the website:

```text
http://localhost:8000
```

You can also open `index.html` directly in your browser.

## Testing Checklist

### Final features

| Feature | How to test |
| ------- | ----------- |
| Currency API | Watch the navbar status on reload. Select KZT and check prices on Catalog, Configurator, and Pre-built PCs. Confirm that KZT stays selected on Home and Contact Us. After a successful load, use DevTools to block the API endpoint and reload to check the saved-rate fallback. To check the empty state locally, override the response with `{"result":"success","rates":{}}`. |
| Saved builds | Save a named build, reload, then load, rename, update and delete the test build. |
| Build statistics | Open Configurator and change the GPU. Check that the two groups update with the summary and that each group totals about 100% after rounding. The PSU contributes to price and shows 0% in the power group. Save and load a different build and check that the bars update again. |
| Text size | Use A+ and A−, refresh, and visit another page. Verify that the selected size persists and that the corresponding button is disabled at each limit. Open the mobile menu to reach the controls on smaller screens. |
| Contact draft | Enter text and choose a request type and budget. Reload and verify the values and counter. Attempt an invalid submission and reload to check that the draft remains. Fill in valid values and submit. Reload and verify all fields and the counter are cleared. |

### Endterm regression checks

- On Home, navigate to each page and toggle the theme. Verify that the theme persists on reload.
- In Configurator, verify totals, an incompatible CPU and motherboard, and a weak PSU. Save, load, rename, update, delete and clear test builds.
- On Contact Us, verify field errors, first-invalid-field focus, the message counter, the FAQ accordion and Back to Top.
- Open DevTools Console on all five pages. Exercise their controls and watch for errors. Check the navbar and table scrolling at 320 px, 375 px and desktop widths.

### Catalog
1. Search for a product by name.
2. Select different component categories.
3. Sort products by price in both directions.
4. Search for a nonexistent product and check the empty-state message.
5. Add products to Favorites.
6. Remove products from both the catalog and favorites list.
7. Reload with a favorite selected and check that the saved favorite and counter persist.

### Pre-built PCs
1. Click View Build on each PC card.
2. Check that all technical specifications appear.
3. Open another PC and verify that the previous one closes.
4. Click the same button again to hide specifications.
5. Check the button text and highlighted border.

### Responsive Design
Test the website at desktop and mobile widths, including 320px and 375px. Check navigation, product cards and the comparison table.

## Notes

This is a student coursework project. Product prices and specifications are demonstration data and are not intended as real purchasing recommendations.

