// tools.js - Suche, Filter und Grid/Liste System
const Tools = {
    repos: [],
    currentFilter: 'relevance',
    currentModType: 'all',
    currentView: 'grid4',

    // Initialisiert alle Tools
    init() {
        this.initSearch();
        this.initFilter();
        this.initModType();
        this.initView();
    },

    // Suchfunktion
    initSearch() {
        const input = document.querySelector('.Discover-suchen input[type="text"]');
        if (!input) return;
        let timeout;
        input.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.search(e.target.value), 300);
        });
    },

    search(query) {
        const filtered = this.repos.filter(repo => {
            const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
            return text.includes(query.toLowerCase());
        });
        this.render(filtered);
    },

    // Filter nach Relevance, Downloads, etc.
    initFilter() {
        const items = document.querySelectorAll('#filtermenu .dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                this.currentFilter = item.textContent.trim().toLowerCase().replace(/\s+/g, '');
                this.updateFilterLabel('Sortieren nach:', this.currentFilter);
                document.getElementById('filtermenu').classList.remove('open');
                this.applyFilters();
            });
        });
    },

    // Mods/Addon Filter
    initModType() {
        const items = document.querySelectorAll('#Mods-und-addons .dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.textContent.trim().toLowerCase();
                if (text.includes('nur mods')) this.currentModType = 'mods';
                else if (text.includes('nur addons')) this.currentModType = 'addons';
                else this.currentModType = 'all';
                document.getElementById('Mods-und-addons').classList.remove('open');
                this.applyFilters();
            });
        });
    },

    // Grid/Liste Ansicht
    initView() {
        const items = document.querySelectorAll('#Grid-oder-list .dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.textContent.trim();
                if (text.includes('6x6')) this.currentView = 'grid6';
                else if (text.includes('Liste')) this.currentView = 'list';
                else this.currentView = 'grid4';
                this.updateViewLabel(this.currentView);
                document.getElementById('Grid-oder-list').classList.remove('open');
                this.applyView();
            });
        });
    },

    updateFilterLabel(prefix, value) {
        const span = document.querySelector('.Discover-filter span');
        if (span) span.textContent = value;
    },

    updateViewLabel(view) {
        const span = document.querySelector('.Discover-grid-oder-list span');
        if (!span) return;
        const labels = { grid4: 'Grid!', grid6: 'Längere grid!', list: 'Liste!' };
        span.textContent = labels[view] || 'Grid!';
    },

    applyFilters() {
        let filtered = [...this.repos];
        if (this.currentModType === 'mods') {
            filtered = filtered.filter(r => !r.isAddon);
        } else if (this.currentModType === 'addons') {
            filtered = filtered.filter(r => r.isAddon);
        }
        const sorters = {
            relevance: (a, b) => (b.stars || 0) - (a.stars || 0),
            herunterladen: (a, b) => (b.downloads || 0) - (a.downloads || 0),
            folgenen: (a, b) => (b.followers || 0) - (a.followers || 0),
            veröffentlich: (a, b) => new Date(b.created) - new Date(a.created),
            neuesupdate: (a, b) => new Date(b.updated) - new Date(a.updated)
        };
        const key = this.currentFilter.replace(/\s+/g, '');
        if (sorters[key]) filtered.sort(sorters[key]);
        this.render(filtered);
    },

    applyView() {
        const box = document.querySelector('.Discover-box');
        if (!box) return;
        box.classList.remove('grid4', 'grid6', 'list');
        box.classList.add(this.currentView);
        const style = box.style;
        if (this.currentView === 'grid4') {
            style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else if (this.currentView === 'grid6') {
            style.gridTemplateColumns = 'repeat(6, 1fr)';
        } else {
            style.gridTemplateColumns = '1fr';
        }
    },

    // Rendert die Repos in die Discover-Box
    render(repos) {
        const box = document.querySelector('.Discover-box');
        if (!box) return;
        box.innerHTML = repos.map((repo, i) => `
            <div class="Disocver-item" onclick="Modsinfo(${i})">
                <div class="Discover-icon"><img src="${repo.platform === 'github' ? 'Res/Bild/Icon/Desktop/Status/github-fill.svg' : 'Res/Bild/Icon/Desktop/Status/gitlab-fill.svg'}"></div>
                ${repo.banner ? `<div class="Discover-banner"><img src="${repo.banner}"></div>` : ''}
                <div class="Discover-info">
                    <span class="Info-bold">${repo.name}</span>
                    <p>von: <span class="Info-small">${repo.author}</span></p>
                    <p class="Info-id">Id: <span class="id">${i}</span></p>
                </div>
            </div>
        `).join('');
    },

    // Setzt Repo-Daten von außen
    setRepos(repos) {
        this.repos = repos;
        this.applyFilters();
    }
};

document.addEventListener('DOMContentLoaded', () => Tools.init());
