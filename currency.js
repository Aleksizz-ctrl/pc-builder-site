'use strict';

class CurrencyService {
    constructor() {
        this.apiUrl = 'https://open.er-api.com/v6/latest/USD';
        this.cacheKey = 'pc-builder-currency-rates';
        this.selectedKey = 'pc-builder-selected-currency';
        this.rates = null;
        this.currency = this.loadSelectedCurrency();
        this.statusElement = null;
    }

    loadSelectedCurrency() {
        try {
            return localStorage.getItem(this.selectedKey) || 'USD';
        } catch (error) {
            return 'USD';
        }
    }

    readCache() {
        try {
            const cached = JSON.parse(localStorage.getItem(this.cacheKey) || 'null');
            return cached && cached.rates && typeof cached.rates === 'object' ? cached.rates : null;
        } catch (error) {
            return null;
        }
    }

    saveCache(rates) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify({
                rates: rates,
                savedAt: Date.now()
            }));
        } catch (error) {
            console.warn('Currency rates could not be cached.', error);
        }
    }

    setStatus(message, state) {
        if (!this.statusElement) return;
        this.statusElement.textContent = message;
        this.statusElement.dataset.state = state;
    }

    async fetchRates() {
        this.setStatus('Loading exchange rates...', 'loading');

        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            if (data.result !== 'success' || !data.rates || Object.keys(data.rates).length === 0) {
                this.setStatus('No exchange-rate data received.', 'empty');
                const cachedRates = this.readCache();
                if (cachedRates) {
                    this.rates = cachedRates;
                    this.setStatus('No new data. Saved exchange rates are being used.', 'empty');
                    return this.rates;
                }
                return null;
            }

            this.rates = data.rates;
            this.saveCache(this.rates);
            if (!this.rates[this.currency]) this.currency = 'USD';
            this.setStatus('Exchange rates loaded successfully.', 'success');
            return this.rates;
        } catch (error) {
            const cachedRates = this.readCache();
            if (cachedRates) {
                this.rates = cachedRates;
                if (!this.rates[this.currency]) this.currency = 'USD';
                this.setStatus('Error loading rates. Saved exchange rates are being used.', 'fallback');
                return this.rates;
            }

            this.rates = null;
            this.setStatus('Error loading rates. No saved rates are available.', 'error');
            console.error('Currency rates request failed:', error);
            return null;
        }
    }

    formatPrice(usdPrice) {
        if (!this.rates || !this.rates[this.currency]) {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 2
            }).format(usdPrice);
        }

        const convertedPrice = usdPrice * this.rates[this.currency];
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: this.currency,
            maximumFractionDigits: 2
        }).format(convertedPrice);
    }

    updatePrices() {
        document.querySelectorAll('[data-usd]').forEach(element => {
            element.textContent = this.formatPrice(Number(element.dataset.usd));
        });
    }

    createCurrencyControl() {
        const navbar = document.querySelector('.navbar .container');
        const navCollapse = navbar && navbar.querySelector('.navbar-collapse');
        if (!navbar || !navCollapse) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'currency-control d-flex flex-wrap align-items-center gap-2 ms-lg-3 my-2';
        wrapper.innerHTML = `
            <label class="text-muted small mb-0" for="currency-select">Currency</label>
            <select class="form-select form-select-sm" id="currency-select" aria-label="Select currency" style="width: auto; min-width: 105px;">
                <option value="USD">USD</option>
            </select>
            <span id="currency-status" class="small text-muted" role="status" aria-live="polite">Loading exchange rates...</span>
        `;

        navCollapse.classList.add('has-currency-control');
        navCollapse.appendChild(wrapper);
        this.statusElement = wrapper.querySelector('#currency-status');
        const select = wrapper.querySelector('#currency-select');

        select.addEventListener('change', () => {
            this.currency = select.value;
            try {
                localStorage.setItem(this.selectedKey, this.currency);
            } catch (error) {
                console.warn('Currency preference could not be saved.', error);
            }
            this.updatePrices();
        });
    }

    populateCurrencies() {
        const select = document.querySelector('#currency-select');
        if (!select || !this.rates) return;

        const currencies = Object.keys(this.rates).sort();
        select.innerHTML = '';

        for (const code of currencies) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = code;
            select.appendChild(option);
        }

        if (!this.rates[this.currency]) this.currency = 'USD';
        select.value = this.currency;
    }

    async init() {
        this.createCurrencyControl();
        await this.fetchRates();
        if (this.rates) this.populateCurrencies();
        this.updatePrices();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.currencyService = new CurrencyService();
    window.currencyService.init();
});
