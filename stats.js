'use strict';

function renderStats(build) {
    const panel = document.querySelector('#stats-panel');
    const parts = build.getParts();
    const groups = [
        ['Price share', 'price', build.getTotalPrice()],
        ['Power share', 'power', build.getTotalPower()]
    ];

    panel.replaceChildren();
    for (const [title, property, total] of groups) {
        const heading = document.createElement('h2');
        heading.className = 'h5 mt-3';
        heading.textContent = title;
        panel.append(heading);

        if (!total) {
            const empty = document.createElement('p');
            empty.textContent = 'No ' + title.toLowerCase() + ' to show yet.';
            panel.append(empty);
            continue;
        }

        for (const part of parts) {
            const share = part[property] / total * 100;
            const row = document.createElement('label');
            row.className = 'd-block small mb-2 text-break';
            row.textContent = `${part.name} — ${share.toFixed(1)}%`;

            const bar = document.createElement('meter');
            bar.className = 'd-block w-100';
            bar.max = 100;
            bar.value = share;
            row.append(bar);
            panel.append(row);
        }
    }
}
