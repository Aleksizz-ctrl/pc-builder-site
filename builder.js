'use strict';

const components = [
    { id: 'i5-13600k', category: 'cpu', name: 'Intel Core i5-13600K', price: 320, power: 125, socket: 'LGA1700' },
    { id: 'r5-7600x', category: 'cpu', name: 'AMD Ryzen 5 7600X', price: 220, power: 105, socket: 'AM5' },
    { id: 'i9-13900k', category: 'cpu', name: 'Intel Core i9-13900K', price: 580, power: 253, socket: 'LGA1700' },
    { id: 'rtx-4070', category: 'gpu', name: 'NVIDIA RTX 4070 12GB', price: 599, power: 200 },
    { id: 'rx-7800xt', category: 'gpu', name: 'AMD Radeon RX 7800 XT', price: 499, power: 263 },
    { id: 'rtx-4090', category: 'gpu', name: 'NVIDIA RTX 4090 24GB', price: 1599, power: 450 },
    { id: 'asus-z790', category: 'motherboard', name: 'ASUS TUF Gaming Z790-Plus', price: 180, power: 50, socket: 'LGA1700' },
    { id: 'msi-b650', category: 'motherboard', name: 'MSI MAG B650 Tomahawk', price: 210, power: 50, socket: 'AM5' },
    { id: 'corsair-32', category: 'ram', name: 'Corsair Vengeance 32GB (2x16GB) DDR5', price: 120, power: 15 },
    { id: 'kingston-16', category: 'ram', name: 'Kingston Fury 16GB (2x8GB) DDR4', price: 70, power: 15 },
    { id: 'samsung-980', category: 'storage', name: 'Samsung 980 Pro 2TB NVMe M.2', price: 110, power: 10 },
    { id: 'wd-black', category: 'storage', name: 'WD Black 1TB NVMe M.2', price: 60, power: 10 },
    { id: 'rm850x', category: 'psu', name: 'Corsair RM850x 850W Gold', price: 130, power: 0, watts: 850 },
    { id: 'evga-750', category: 'psu', name: 'EVGA 750W Bronze', price: 90, power: 0, watts: 750 }
];

let savedBuilds = [];
let buildCounter = 0;

const PSU_HEADROOM = 1.6;
const MAX_SAVED = 5;

function getByCategory(category) {
    return components.filter((item) => item.category === category);
}

function findComponent(id) {
    return components.find((item) => item.id === id);
}

function fillSelect(select) {
    getByCategory(select.dataset.category).forEach((item) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

function getSelectedParts() {
    const parts = [];
    document.querySelectorAll('.part-select').forEach((select) => {
        parts.push(findComponent(select.value));
    });
    return parts;
}

function calculateTotal(parts) {
    let total = 0;
    for (const part of parts) {
        total += part.price;
    }
    return total;
}

function calculatePower(parts) {
    let power = 0;
    for (const part of parts) {
        power += part.power;
    }
    return power;
}

function getRecommendedPsu(power) {
    return Math.ceil((power * PSU_HEADROOM) / 50) * 50;
}

function formatPrice(value) {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function checkCompatibility(parts) {
    const problems = [];
    const cpu = parts.find((part) => part.category === 'cpu');
    const board = parts.find((part) => part.category === 'motherboard');
    const psu = parts.find((part) => part.category === 'psu');
    const recommended = getRecommendedPsu(calculatePower(parts));

    if (cpu.socket !== board.socket) {
        problems.push(`CPU socket (${cpu.socket}) does not fit the motherboard (${board.socket}).`);
    }
    if (psu.watts < recommended) {
        problems.push(`Power supply is too weak: ${recommended} W recommended.`);
    }
    return problems;
}

function updateRow(select) {
    const row = select.closest('tr');
    const part = findComponent(select.value);
    row.querySelector('.power-cell').textContent = part.power > 0 ? `${part.power} W` : '-';
    row.querySelector('.price-cell').textContent = formatPrice(part.price);
}

function updateSummary() {
    const parts = getSelectedParts();
    const power = calculatePower(parts);
    const problems = checkCompatibility(parts);
    const isCompatible = problems.length === 0;

    document.querySelector('#total-power').textContent = `${power} W`;
    document.querySelector('#recommended-psu').textContent = `${getRecommendedPsu(power)} W`;
    document.querySelector('#total-price').textContent = formatPrice(calculateTotal(parts));

    const badge = document.querySelector('#compat-badge');
    badge.textContent = isCompatible ? '100% Compatible' : 'Issues found';
    badge.classList.toggle('bg-success', isCompatible);
    badge.classList.toggle('bg-danger', !isCompatible);

    const messageList = document.querySelector('#compat-messages');
    messageList.innerHTML = '';
    problems.forEach((problem) => {
        const item = document.createElement('li');
        item.textContent = problem;
        messageList.appendChild(item);
    });
}

function createSavedItem(build) {
    const item = document.createElement('li');
    item.className = 'd-flex justify-content-between align-items-center mb-2';

    const label = document.createElement('span');
    label.textContent = `${build.name}: ${formatPrice(build.total)}`;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn btn-sm btn-outline-danger remove-build';
    removeButton.dataset.id = build.id;
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove ${build.name}`);

    item.appendChild(label);
    item.appendChild(removeButton);
    return item;
}

function saveBuild() {
    const messageBox = document.querySelector('#save-message');

    if (savedBuilds.length >= MAX_SAVED) {
        messageBox.textContent = `You can save up to ${MAX_SAVED} builds. Remove one first.`;
        return;
    }

    buildCounter++;
    const build = {
        id: buildCounter,
        name: `Build #${buildCounter}`,
        total: calculateTotal(getSelectedParts())
    };
    savedBuilds.push(build);
    document.querySelector('#saved-builds').appendChild(createSavedItem(build));
    messageBox.textContent = `${build.name} saved.`;
}

document.addEventListener('DOMContentLoaded', () => {
    const selects = document.querySelectorAll('.part-select');

    selects.forEach(fillSelect);
    selects.forEach((select) => {
        select.addEventListener('change', () => {
            updateRow(select);
            updateSummary();
        });
        updateRow(select);
    });
    updateSummary();

    document.querySelector('#save-build').addEventListener('click', saveBuild);

    document.querySelector('#saved-builds').addEventListener('click', (event) => {
        if (!event.target.classList.contains('remove-build')) return;
        const id = Number(event.target.dataset.id);
        savedBuilds = savedBuilds.filter((build) => build.id !== id);
        event.target.closest('li').remove();
        document.querySelector('#save-message').textContent = 'Build removed.';
    });
});