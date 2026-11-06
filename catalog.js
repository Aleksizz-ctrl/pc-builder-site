'use strict';

// Main product array: all catalog cards are created from this data.
const products = [
    { id: 1, name: 'AMD Ryzen 5 5600', category: 'CPU', price: 129, image: 'images/CPU-image.jfif', description: '6-core processor for gaming and everyday work.' },
    { id: 2, name: 'AMD Ryzen 7 7800X3D', category: 'CPU', price: 389, image: 'images/CPU-image.jfif', description: 'High-performance gaming processor with 3D V-Cache.' },
    { id: 3, name: 'Intel Core i5-14600K', category: 'CPU', price: 299, image: 'images/CPU-image.jfif', description: 'Powerful Intel processor for gaming and productivity.' },
    { id: 4, name: 'NVIDIA GeForce RTX 4060', category: 'GPU', price: 299, image: 'images/GPU-image.jfif', description: 'Efficient graphics card for modern 1080p gaming.' },
    { id: 5, name: 'NVIDIA GeForce RTX 4070 Super', category: 'GPU', price: 599, image: 'images/GPU-image.jfif', description: 'Great performance for high-refresh 1440p gaming.' },
    { id: 6, name: 'AMD Radeon RX 7800 XT', category: 'GPU', price: 499, image: 'images/GPU-image.jfif', description: 'Strong graphics performance with 16 GB of memory.' },
    { id: 7, name: 'Corsair Vengeance 16GB DDR5', category: 'RAM', price: 59, image: 'images/RAM-image.jfif', description: '16 GB DDR5 memory kit for a responsive system.' },
    { id: 8, name: 'Kingston Fury 32GB DDR5', category: 'RAM', price: 99, image: 'images/RAM-image.jfif', description: '32 GB DDR5 kit for gaming and multitasking.' },
    { id: 9, name: 'Samsung 990 EVO 1TB', category: 'Storage', price: 89, image: 'images/Storage-image.jfif', description: 'Fast 1 TB NVMe SSD for apps and games.' },
    { id: 10, name: 'WD Black SN850X 2TB', category: 'Storage', price: 159, image: 'images/Storage-image.jfif', description: 'High-speed 2 TB NVMe storage drive.' },
    { id: 11, name: 'MSI B650 Gaming Plus WiFi', category: 'Motherboard', price: 169, image: 'images/Motherboard-image.jfif', description: 'AM5 motherboard with Wi-Fi and modern connectivity.' },
    { id: 12, name: 'Corsair RM750e 750W', category: 'Power Supply', price: 109, image: 'images/PSU-image.jfif', description: 'Reliable 750W power supply for gaming PCs.' }
];

let favorites = [];

function renderProducts(list) {
    const productGrid = document.querySelector('#product-grid');
    productGrid.innerHTML = '';

    if (list.length === 0) {
        productGrid.innerHTML = '<p class="text-muted">No products found. Try another search or category.</p>';
        return;
    }

    for (const product of list) {
        const isFavorite = favorites.some(item => item.id === product.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" class="product-image" alt="${product.name}">
            <div class="product-info">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p><strong>$${product.price}</strong></p>
                <p class="text-muted">${product.category}</p>
                <button type="button" class="btn ${isFavorite ? 'btn-success' : 'btn-primary'} favorite-button" data-id="${product.id}">
                    ${isFavorite ? 'Added to favorites' : 'Add to favorites'}
                </button>
            </div>
        `;
        productGrid.appendChild(card);
    }
}

function filterProducts(list, query, category) {
    const searchText = query.toLowerCase().trim();

    return list.filter(product => {
        const matchesName = product.name.toLowerCase().includes(searchText);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesName && matchesCategory;
    });
}

function sortProducts(list, mode) {
    const sortedList = [...list];

    if (mode === 'price-asc') {
        sortedList.sort((a, b) => a.price - b.price);
    } else if (mode === 'price-desc') {
        sortedList.sort((a, b) => b.price - a.price);
    }

    return sortedList;
}

function toggleFavorite(id) {
    const product = products.find(item => item.id === id);
    const favoriteIndex = favorites.findIndex(item => item.id === id);

    if (favoriteIndex === -1) {
        favorites.push(product);
    } else {
        favorites.splice(favoriteIndex, 1);
    }

    renderFavorites();
    updateCatalog();
}

function renderFavorites() {
    const favoritesList = document.querySelector('#favorites-list');
    const favoritesCount = document.querySelector('#favorites-count');

    favoritesCount.textContent = favorites.length;
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<li class="list-group-item">No favorites yet.</li>';
        return;
    }

    for (const product of favorites) {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            <span>${product.name} — $${product.price}</span>
            <button type="button" class="btn btn-sm btn-outline-danger remove-favorite" data-id="${product.id}">Remove</button>
        `;
        favoritesList.appendChild(item);
    }
}

function updateCatalog() {
    const query = document.querySelector('#search-input').value;
    const category = document.querySelector('#category-filter').value;
    const mode = document.querySelector('#sort-select').value;

    const filteredProducts = filterProducts(products, query, category);
    const sortedProducts = sortProducts(filteredProducts, mode);
    renderProducts(sortedProducts);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#search-input');
    const categoryFilter = document.querySelector('#category-filter');
    const sortSelect = document.querySelector('#sort-select');
    const productGrid = document.querySelector('#product-grid');
    const favoritesList = document.querySelector('#favorites-list');

    searchInput.addEventListener('input', updateCatalog);
    categoryFilter.addEventListener('change', updateCatalog);
    sortSelect.addEventListener('change', updateCatalog);

    // Event delegation: one listener handles favorite buttons created later.
    productGrid.addEventListener('click', event => {
        const button = event.target.closest('.favorite-button');
        if (!button) return;
        toggleFavorite(Number(button.dataset.id));
    });

    favoritesList.addEventListener('click', event => {
        const button = event.target.closest('.remove-favorite');
        if (!button) return;
        toggleFavorite(Number(button.dataset.id));
    });

    renderFavorites();
    updateCatalog();
});
