'use strict';

const componentData = [
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

const PSU_HEADROOM = 1.6;
const MAX_SAVED = 10;
const STORAGE_KEY = 'pc-builder-saved-builds';

class Component {
    constructor({ id, category, name, price, power, socket = null, watts = 0 }) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.price = price;
        this.power = power;
        this.socket = socket;
        this.watts = watts;
    }
}

const components = componentData.map((item) => new Component(item));

function findComponent(id) {
    return components.find((item) => item.id === id);
}

function getByCategory(category) {
    return components.filter((item) => item.category === category);
}

function formatPrice(value) {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function money(usd) {
    if (window.currencyService && typeof window.currencyService.format === 'function') {
        return window.currencyService.format(usd);
    }
    return formatPrice(usd);
}

class PCBuild {
    constructor(name, partIds = [], id = Date.now(), createdAt = new Date().toISOString()) {
        this.id = id;
        this.name = name;
        this.partIds = partIds;
        this.createdAt = createdAt;
    }

    getParts() {
        return this.partIds.map((partId) => findComponent(partId)).filter(Boolean);
    }

    getTotalPrice() {
        let total = 0;
        for (const part of this.getParts()) {
            total += part.price;
        }
        return total;
    }

    getTotalPower() {
        let power = 0;
        for (const part of this.getParts()) {
            power += part.power;
        }
        return power;
    }

    getRecommendedPsu() {
        return Math.ceil((this.getTotalPower() * PSU_HEADROOM) / 50) * 50;
    }

    checkCompatibility() {
        const problems = [];
        const parts = this.getParts();
        const cpu = parts.find((part) => part.category === 'cpu');
        const board = parts.find((part) => part.category === 'motherboard');
        const psu = parts.find((part) => part.category === 'psu');

        if (cpu && board && cpu.socket !== board.socket) {
            problems.push(`CPU socket (${cpu.socket}) does not fit the motherboard (${board.socket}).`);
        }
        if (psu && psu.watts < this.getRecommendedPsu()) {
            problems.push(`Power supply is too weak: ${this.getRecommendedPsu()} W recommended.`);
        }
        return problems;
    }

    rename(newName) {
        this.name = newName;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            partIds: this.partIds,
            createdAt: this.createdAt
        };
    }

    static fromJSON(data) {
        return new PCBuild(data.name, data.partIds, data.id, data.createdAt);
    }
}

class BuildStorage {
    constructor(key) {
        this.key = key;
        this.builds = this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem(this.key);
            if (!raw) return [];
            const data = JSON.parse(raw);
            if (!Array.isArray(data)) return [];
            return data
                .filter((item) => item && typeof item.name === 'string' && Array.isArray(item.partIds))
                .map((item) => PCBuild.fromJSON(item));
        } catch (error) {
            return [];
        }
    }

    persist() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.builds));
            return true;
        } catch (error) {
            return false;
        }
    }

    getAll() {
        return this.builds;
    }

    getById(id) {
        return this.builds.find((build) => build.id === id);
    }

    isFull() {
        return this.builds.length >= MAX_SAVED;
    }

    add(build) {
        this.builds.push(build);
        return this.persist();
    }

    rename(id, name) {
        const build = this.getById(id);
        if (!build) return false;
        build.rename(name);
        return this.persist();
    }

    updateParts(id, partIds) {
        const build = this.getById(id);
        if (!build) return false;
        build.partIds = partIds;
        return this.persist();
    }

    remove(id) {
        this.builds = this.builds.filter((build) => build.id !== id);
        return this.persist();
    }

    clear() {
        this.builds = [];
        return this.persist();
    }
}

const storage = new BuildStorage(STORAGE_KEY);

function fillSelect(select) {
    getByCategory(select.dataset.category).forEach((item) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

function getSelectedIds() {
    return Array.from(document.querySelectorAll('.part-select')).map((select) => select.value);
}

function currentBuild() {
    return new PCBuild('Current build', getSelectedIds());
}

function showMessage(text) {
    document.querySelector('#save-message').textContent = text;
}

function updateRow(select) {
    const row = select.closest('tr');
    const part = findComponent(select.value);
    row.querySelector('.power-cell').textContent = part.power > 0 ? `${part.power} W` : '-';
    row.querySelector('.price-cell').textContent = money(part.price);
}

function updateSummary() {
    const build = currentBuild();
    const problems = build.checkCompatibility();
    const isCompatible = problems.length === 0;

    document.querySelector('#total-power').textContent = `${build.getTotalPower()} W`;
    document.querySelector('#recommended-psu').textContent = `${build.getRecommendedPsu()} W`;
    document.querySelector('#total-price').textContent = money(build.getTotalPrice());

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

    if (typeof renderStats === 'function') {
        renderStats(build);
    }
}

function createSavedItem(build) {
    const item = document.createElement('li');
    item.className = 'border-bottom border-secondary py-2';

    const title = document.createElement('div');
    title.className = 'fw-semibold';
    title.textContent = build.name;

    const details = document.createElement('div');
    details.className = 'small text-muted';
    details.textContent = `${money(build.getTotalPrice())} | ${new Date(build.createdAt).toLocaleDateString('en-US')}`;

    const actions = document.createElement('div');
    actions.className = 'd-flex flex-wrap gap-1 mt-1';

    const buttons = [
        { action: 'load', label: 'Load', style: 'btn-outline-info' },
        { action: 'rename', label: 'Rename', style: 'btn-outline-light' },
        { action: 'update', label: 'Update', style: 'btn-outline-warning' },
        { action: 'delete', label: 'Delete', style: 'btn-outline-danger' }
    ];

    for (const config of buttons) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `btn btn-sm ${config.style}`;
        button.dataset.action = config.action;
        button.dataset.id = build.id;
        button.textContent = config.label;
        button.setAttribute('aria-label', `${config.label} ${build.name}`);
        actions.appendChild(button);
    }

    item.append(title, details, actions);
    return item;
}

function renderSaved() {
    const list = document.querySelector('#saved-builds');
    const builds = storage.getAll();

    list.innerHTML = '';
    builds.forEach((build) => list.appendChild(createSavedItem(build)));

    document.querySelector('#saved-empty').hidden = builds.length > 0;
    document.querySelector('#clear-builds').disabled = builds.length === 0;
}

function refreshAll() {
    document.querySelectorAll('.part-select').forEach((select) => updateRow(select));
    updateSummary();
    renderSaved();
}

function saveBuild() {
    if (storage.isFull()) {
        showMessage(`You can save up to ${MAX_SAVED} builds. Delete one first.`);
        return;
    }

    const input = document.querySelector('#build-name');
    const name = input.value.trim() || `Build #${storage.getAll().length + 1}`;
    const saved = storage.add(new PCBuild(name, getSelectedIds()));

    input.value = '';
    renderSaved();
    showMessage(saved ? `"${name}" saved.` : 'Could not save: browser storage is unavailable.');
}

function loadBuild(build) {
    build.getParts().forEach((part) => {
        const select = document.querySelector(`.part-select[data-category="${part.category}"]`);
        if (select) select.value = part.id;
    });
    refreshAll();
    showMessage(`"${build.name}" loaded.`);
}

function renameBuild(build) {
    const newName = prompt('New name for this build:', build.name);
    if (newName === null) return;

    const trimmed = newName.trim();
    if (trimmed === '') {
        showMessage('Name cannot be empty.');
        return;
    }

    storage.rename(build.id, trimmed);
    renderSaved();
    showMessage('Build renamed.');
}

function updateBuild(build) {
    storage.updateParts(build.id, getSelectedIds());
    renderSaved();
    showMessage(`"${build.name}" updated with the current selection.`);
}

function deleteBuild(build) {
    if (!confirm(`Delete "${build.name}"?`)) return;
    storage.remove(build.id);
    renderSaved();
    showMessage('Build deleted.');
}

function clearBuilds() {
    if (!confirm('Delete all saved builds?')) return;
    storage.clear();
    renderSaved();
    showMessage('All saved builds deleted.');
}

function handleSavedClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const build = storage.getById(Number(button.dataset.id));
    if (!build) return;

    const handlers = {
        load: loadBuild,
        rename: renameBuild,
        update: updateBuild,
        delete: deleteBuild
    };
    handlers[button.dataset.action](build);
}

document.addEventListener('DOMContentLoaded', () => {
    const selects = document.querySelectorAll('.part-select');

    selects.forEach(fillSelect);
    selects.forEach((select) => {
        select.addEventListener('change', () => {
            updateRow(select);
            updateSummary();
        });
    });

    document.querySelector('#save-build').addEventListener('click', saveBuild);
    document.querySelector('#clear-builds').addEventListener('click', clearBuilds);
    document.querySelector('#saved-builds').addEventListener('click', handleSavedClick);
    document.addEventListener('currencychange', refreshAll);

    refreshAll();
});