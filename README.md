# Computer Builder Site

A five-page responsive student website for exploring PC components, comparing pre-built computers, and planning a custom build. Built with HTML5, CSS3, Bootstrap 5.3.0, JavaScript and jQuery 3.7.1.

**Live website:** [Computer Builder Site](https://aleksizz-ctrl.github.io/pc-builder-site/)

**Repository:** [Aleksizz-ctrl/pc-builder-site](https://github.com/Aleksizz-ctrl/pc-builder-site)

## Pages and endterm features

| Page | Features in this revision |
| --- | --- |
| `index.html` — Home | Shared navigation and project introduction; light/dark theme toggle with a saved preference. |
| `builder.html` — Configurator | Component options generated from an array; price and power recalculation; CPU socket and estimated PSU checks; up to five saved build summaries with removal; shared theme toggle. Saved builds last for the current page session. |
| `catalog.html` — Catalog | Responsive CSS Grid and Flexbox component cards. Styles for selected cards are ready through `.selected`, `.is-selected` or `[aria-selected="true"]`; catalog interactions belong to the catalog contributor. |
| `prebuilt.html` — Pre-built PCs | Ready-made PC cards and a horizontally scrollable comparison table. Further comparison interactions belong to the catalog/comparison contributor. |
| `contact.html` — Contact Us | Custom form validation, Confirm email, inline errors and valid/invalid borders, first-invalid-field focus, a live character counter, personalized success feedback and form reset; jQuery FAQ accordion and a dynamically created Back to top button; shared theme toggle. |

The form checks data locally. It does not transmit requests, place orders or store personal information. Product values are coursework examples. Configurator checks cover CPU sockets and estimated PSU headroom; they do not replace full hardware compatibility verification.

### Form rules

- **Full name:** required, 2–100 characters, letters (including Unicode), spaces, hyphens and apostrophes only; at least one letter.
- **Email:** required, checked with a regular expression; up to 254 characters.
- **Confirm email:** required and must match Email after trimming surrounding whitespace.
- **Request type:** an option must be selected.
- **Budget:** optional.
- **Message:** at least 10 characters after trimming surrounding whitespace; no more than 2,000 characters in total.

`novalidate` disables the browser's automatic validation messages. Five separate validator functions return an error string or `''`; `showError` updates the text, border classes and `aria-invalid`. `submit` checks every field, `focusout` checks the field being left, and `input` rechecks a previously validated field as it is edited. Editing Email also rechecks an already validated Confirm email.

### jQuery and accessibility

`contact.html` loads Bootstrap, jQuery from the CDN, `main.js`, `contact.js` and `ui.js`, in that order. Use the full jQuery build: the slim build does not include the required animations.

`ui.js` uses ID (`#back-to-top`), class (`.faq-question`) and attribute (`[data-faq-question]`) selectors. FAQ clicks use `parent()`, `children()` and `siblings()` to find the answer and close the other answers using `slideDown()` and `slideUp()`. The floating button is created with jQuery, shown/hidden on scroll using `fadeIn()`/`fadeOut()`, and scrolls to the top on click using `animate()`.

FAQ questions are native buttons supporting Enter and Space, with `aria-expanded` and `aria-controls`. Labels and descriptions connect errors to their fields. A polite status announces success. Reduced-motion preferences disable the animations. If the CDN is unavailable, form validation still works and FAQ answers remain readable; jQuery effects require an internet connection.

## Run locally

Open `index.html` in a browser or serve this directory with a static web server, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Bootstrap is included in `vendor/bootstrap/` with its MIT license. jQuery is loaded from its CDN.

## How to test

1. Open the site, open Developer Tools → Console, and visit all five pages using the navigation bar. Check that each page loads and no red errors appear. Repeat these checks on the deployed website after all contributors' changes have merged.
2. On Home, switch to Light theme, navigate to Configurator and Contact, and confirm the preference persists. Toggle back and reload. Check text, fields, navigation and tables in both themes. After integration, repeat on Catalog and Pre-built PCs.
3. On Configurator, change a component and verify the row and total prices/power update. Choose an Intel CPU with an AM5 board to see a socket warning. Choose a high-power build with the weaker PSU to see a power warning. Save five summaries, confirm a sixth is rejected, then remove one and save again.
4. On Contact, submit the empty form. Every required field should show its own error, no browser popup should appear, and Full name should receive focus. The page must not reload or navigate.
5. Enter `A`, leave Full name and check the minimum-length message. Try `Daryn123` and check the character message. Correct it to `Дарын` or `Anne-Marie O'Neill`: the error should disappear while typing and the border should turn green.
6. Enter `not-an-email`, leave Email, then correct it to `daryn@example.com`. Enter a different Confirm email and check the mismatch error. Match both values, then change Email again: Confirm email should immediately become invalid if it was already checked.
7. Leave Request type unselected and submit; select an option and check the error clears. Budget may remain empty.
8. Type fewer than 10 meaningful characters in Message, then correct it. Check the counter updates when typing, pasting and deleting. Verify exactly 10 and exactly 2,000 characters pass. Normal typing/pasting is capped at 2,000 by `maxlength`; the JavaScript validator also rejects a longer value if it is set programmatically. Spaces alone must fail.
9. Complete the form with valid values and submit. Check that the green success message includes the entered name, all fields and borders reset, and the counter returns to zero. Submit again empty and confirm validation still works.
10. Open one FAQ answer, then another: the first should close. Click the open question again to close it. Repeat with Tab, Enter and Space. Rapid clicks should leave one consistent open/closed state.
11. Scroll down more than 300 pixels and check Back to top fades in. Click it and verify a smooth return to the top and the button disappearing. Repeat with reduced motion enabled: movement should be immediate.
12. Set the viewport to 375px wide (also check 320px), visit all five pages, open/close the mobile menu, and follow every navigation link. Check that form fields/buttons fit, catalog cards stack, and wide tables scroll inside their own containers without page-wide overflow.
13. After catalog/comparison changes merge, test their new controls and selected-card styles and update the page-feature table above with the actual implemented behavior.

## Team contributions

### Слава — Frontend and core functionality

**Main files:** `index.html`, `builder.html`, `main.js`, `builder.js`, shared base styles.

- Home page, shared navigation and footer, configurator layout.
- Persistent light/dark theme behavior in `main.js`.
- Component data arrays, generated dropdown options, price/power calculations, CPU socket and PSU checks, saved-build creation and removal in `builder.js`.
- Integration of the shared theme control and scripts across the core pages.

### Альтаир — Catalog and comparison

**Main files:** `catalog.html`, `prebuilt.html`, product images and catalog/comparison code.

- Responsive component cards using CSS Grid and Flexbox.
- Pre-built PC cards and the comparison table with `rowspan` and `colspan`.
- Catalog/comparison interactions and integration of selected-card styles in the endterm work.

### Дарын — Form, jQuery, responsive UI and documentation

**Main files:** `contact.html`, rewritten `contact.js`, new `ui.js`, appended styles in `styles.css`, `README.md`.

- Custom validation for five fields, Confirm email, field-specific errors, first-error focus, character counter, success feedback and reset.
- `submit`, `input` and `focusout` handling with `addEventListener` and `event.preventDefault()`.
- jQuery FAQ accordion, selectors, traversal, effects and a dynamically created Back to top button.
- Appended shared styles for the light theme, form states, floating button and selected cards without rewriting existing CSS.
- Contact page theme integration, accessible labels/status, keyboard interaction and reduced-motion support.
- Documentation, testing instructions and final verification of the integrated website.
- Midterm contribution: Contact layout, Bootstrap integration, responsive styles, local Bootstrap assets and accessibility improvements.

## Verification record

Local browser checks on 6 November 2026 passed 83 assertions covering the five page URLs, navigation targets, mobile menus, widths of 320/375/1280px, form validation and correction, successful reset, FAQ interaction, scrolling, reduced motion and theme persistence on the pages currently connected to `main.js`. Contact also keeps validation and readable FAQ answers when jQuery cannot load.

No JavaScript errors or Contact console errors were found. The existing Home page requests a missing `/favicon.ico` (HTTP 404); its source was left unchanged because it belongs to another contributor. Catalog and Pre-built PCs do not yet contain the shared theme toggle. The final integrated-site review remains pending the other contributors' work.

## Integration and publishing

1. Pull the latest `main` before integrating teammates' changes. Keep all five pages and the existing project topic.
2. Catalog and Pre-built PCs still need their contributors to add the shared `#theme-toggle` button and `main.js`. To use the shared Back to top control on those pages, load full jQuery followed by `ui.js`. Keep Bootstrap before the shared scripts. Only Contact loads `ui.js` in Daryn's assigned-file changes.
3. In GitHub **Settings → Pages**, choose the publishing branch and **/(root)** (or keep the existing deployment configuration). Push the integrated changes and wait for deployment to finish.
4. Open the live link above and run the five-page, console, navigation, theme and phone-width checks. A local pass does not prove that the published build is current.

## Defence notes

- **Why `novalidate`?** It lets `submit` run even for invalid HTML fields so our code can display consistent, field-specific feedback. Native validation messages alone do not implement matching email values or our full rules. Server-side validation would also be required if a real submission service were added.
- **What does a validator return?** An error string, or an empty string when valid. Validation rules are separate from display; `showError` handles messages, border classes and accessibility state.
- **How do the events differ?** `submit` checks the entire form; `focusout` checks a field when focus leaves it and bubbles to the form; `input` reacts to editing so checked errors disappear as soon as they are fixed.
- **What does `event.preventDefault()` do?** Cancels the browser's normal form submission/navigation. It does not stop event propagation or perform validation by itself.
- **Traversal:** `parent()` finds the FAQ item's container; `children()` selects its direct question/answer; `siblings()` finds the other FAQ items.
- **Effects:** `slideDown()` expands an answer, `slideUp()` collapses it, `fadeIn()`/`fadeOut()` show/hide the floating button, and `animate({ scrollTop: 0 })` scrolls upward. `.stop()` prevents a queue of animations from accumulating during rapid clicks.
- **Be ready to locate the code:** validators and event listeners in `contact.js`; FAQ/back-to-top handlers in `ui.js`; load order and error elements in `contact.html`; shared theme behavior in `main.js`; theme/form/selection styles at the end of `styles.css`.
