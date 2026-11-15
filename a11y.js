'use strict';

(() => {
    const nav = document.querySelector('.navbar-nav');
    if (!nav) return;

    const key = 'pc-builder-font-size';
    const sizes = [90, 100, 110, 120];
    let index = 1;
    try {
        const saved = sizes.indexOf(Number(localStorage.getItem(key)));
        if (saved !== -1) index = saved;
    } catch {
        // The controls still work when storage is unavailable.
    }

    const controls = document.createElement('li');
    controls.className = 'nav-item d-flex align-items-center gap-1 ms-lg-2 py-1';
    const buttons = [-1, 1].map((step) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-sm btn-outline-info';
        button.textContent = step < 0 ? 'A−' : 'A+';
        button.setAttribute('aria-label', step < 0 ? 'Decrease text size' : 'Increase text size');
        button.addEventListener('click', () => {
            index += step;
            applySize();
            try {
                localStorage.setItem(key, sizes[index]);
            } catch {
                // Keep the selected size for the current page.
            }
        });
        controls.append(button);
        return button;
    });

    function applySize() {
        document.documentElement.style.fontSize = `${sizes[index]}%`;
        buttons[0].disabled = index === 0;
        buttons[1].disabled = index === sizes.length - 1;
    }

    nav.append(controls);
    applySize();
})();
