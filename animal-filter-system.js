// Advanced Filter System for Animal Listings
// Implements age, size, energy level filters and saved filter settings

class AnimalFilterSystem {
    constructor() {
        this.animals = [];
        this.filteredAnimals = [];
        this.filters = {
            breed: '',
            age: '',
            size: '',
            energyLevel: '',
            goodWithChildren: null,
            goodWithDogs: null,
            goodWithCats: null,
            status: '',
            searchQuery: ''
        };
        this.savedFilters = this.loadSavedFilters();
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        
        this.init();
    }

    init() {
        this.createFilterUI();
        this.loadAnimals();
        this.bindEvents();
    }

    // Create enhanced filter UI
    createFilterUI() {
        const filterContainer = document.querySelector('.animals-filters') || this.createFilterContainer();
        
        filterContainer.innerHTML = `
            <div class="filter-header">
                <h3>🔍 Hunde filtern</h3>
                <div class="filter-actions">
                    <button type="button" class="btn btn-sm btn-outline" id="saveFilters">
                        💾 Filter speichern
                    </button>
                    <button type="button" class="btn btn-sm btn-outline" id="loadFilters">
                        📁 Filter laden
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary" id="clearFilters">
                        🗑️ Zurücksetzen
                    </button>
                </div>
            </div>
            
            <div class="filter-grid">
                <!-- Search Bar -->
                <div class="filter-group filter-search">
                    <label for="searchQuery">🔍 Suche</label>
                    <input type="text" id="searchQuery" placeholder="Name, Rasse, Beschreibung...">
                </div>
                
                <!-- Breed Filter -->
                <div class="filter-group">
                    <label for="breedFilter">🐕 Rasse</label>
                    <select id="breedFilter">
                        <option value="">Alle Rassen</option>
                        <option value="boxer">Boxer</option>
                        <option value="labrador">Labrador</option>
                        <option value="golden-retriever">Golden Retriever</option>
                        <option value="german-shepherd">Deutscher Schäferhund</option>
                        <option value="husky">Husky</option>
                        <option value="mixed">Mischling</option>
                        <option value="other">Andere</option>
                    </select>
                </div>
                
                <!-- Age Filter -->
                <div class="filter-group">
                    <label for="ageFilter">🎂 Alter</label>
                    <select id="ageFilter">
                        <option value="">Alle Altersgruppen</option>
                        <option value="puppy">Welpe (0-1 Jahr)</option>
                        <option value="young">Jung (1-3 Jahre)</option>
                        <option value="adult">Erwachsen (3-7 Jahre)</option>
                        <option value="senior">Senior (7+ Jahre)</option>
                    </select>
                </div>
                
                <!-- Size Filter -->
                <div class="filter-group">
                    <label for="sizeFilter">📏 Größe</label>
                    <select id="sizeFilter">
                        <option value="">Alle Größen</option>
                        <option value="small">Klein (< 30cm)</option>
                        <option value="medium">Mittel (30-60cm)</option>
                        <option value="large">Groß (60-70cm)</option>
                        <option value="extra-large">Sehr groß (> 70cm)</option>
                    </select>
                </div>
                
                <!-- Energy Level Filter -->
                <div class="filter-group">
                    <label for="energyFilter">⚡ Energielevel</label>
                    <select id="energyFilter">
                        <option value="">Alle Energielevel</option>
                        <option value="low">Niedrig - Ruhig</option>
                        <option value="medium">Mittel - Ausgeglichen</option>
                        <option value="high">Hoch - Sehr aktiv</option>
                    </select>
                </div>
                
                <!-- Status Filter -->
                <div class="filter-group">
                    <label for="statusFilter">📋 Status</label>
                    <select id="statusFilter">
                        <option value="">Alle Status</option>
                        <option value="available">Vermittlungsbereit</option>
                        <option value="pending">In Vermittlung</option>
                        <option value="adopted">Vermittelt</option>
                        <option value="not-ready">Noch nicht bereit</option>
                    </select>
                </div>
            </div>
            
            <!-- Compatibility Filters -->
            <div class="compatibility-filters">
                <h4>👨‍👩‍👧‍👦 Verträglichkeit</h4>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="goodWithChildren">
                        <span class="checkbox-custom"></span>
                        Kinderfreundlich
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="goodWithDogs">
                        <span class="checkbox-custom"></span>
                        Verträglich mit anderen Hunden
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="goodWithCats">
                        <span class="checkbox-custom"></span>
                        Verträglich mit Katzen
                    </label>
                </div>
            </div>
            
            <!-- Sort Options -->
            <div class="sort-options">
                <h4>📊 Sortierung</h4>
                <div class="sort-controls">
                    <select id="sortBy">
                        <option value="name">Name</option>
                        <option value="age">Alter</option>
                        <option value="breed">Rasse</option>
                        <option value="arrivalDate">Ankunftsdatum</option>
                        <option value="size">Größe</option>
                    </select>
                    <button type="button" id="sortOrder" class="btn btn-sm btn-outline">
                        <span class="sort-icon">⬆️</span> Aufsteigend
                    </button>
                </div>
            </div>
            
            <!-- Results Counter -->
            <div class="filter-results">
                <span id="resultsCounter">0 Hunde gefunden</span>
                <div class="view-toggle">
                    <button type="button" class="btn btn-sm btn-outline active" data-view="grid">
                        🔲 Gitter
                    </button>
                    <button type="button" class="btn btn-sm btn-outline" data-view="list">
                        📄 Liste
                    </button>
                </div>
            </div>
        `;
    }

    createFilterContainer() {
        const container = document.createElement('div');
        container.className = 'animals-filters';
        
        const animalsSection = document.querySelector('#animals');
        if (animalsSection) {
            animalsSection.insertBefore(container, animalsSection.firstChild);
        }
        
        return container;
    }

    // Bind all event listeners
    bindEvents() {
        // Filter inputs
        document.getElementById('searchQuery')?.addEventListener('input', this.handleSearch.bind(this));
        document.getElementById('breedFilter')?.addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('ageFilter')?.addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('sizeFilter')?.addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('energyFilter')?.addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('statusFilter')?.addEventListener('change', this.handleFilterChange.bind(this));

        // Compatibility checkboxes
        document.getElementById('goodWithChildren')?.addEventListener('change', this.handleCompatibilityChange.bind(this));
        document.getElementById('goodWithDogs')?.addEventListener('change', this.handleCompatibilityChange.bind(this));
        document.getElementById('goodWithCats')?.addEventListener('change', this.handleCompatibilityChange.bind(this));

        // Sort controls
        document.getElementById('sortBy')?.addEventListener('change', this.handleSortChange.bind(this));
        document.getElementById('sortOrder')?.addEventListener('click', this.toggleSortOrder.bind(this));

        // Filter actions
        document.getElementById('saveFilters')?.addEventListener('click', this.saveCurrentFilters.bind(this));
        document.getElementById('loadFilters')?.addEventListener('click', this.showLoadFiltersModal.bind(this));
        document.getElementById('clearFilters')?.addEventListener('click', this.clearAllFilters.bind(this));

        // View toggle
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', this.handleViewToggle.bind(this));
        });
    }

    // Load animals from localStorage
    loadAnimals() {
        const storedAnimals = localStorage.getItem('boxerhof_animals');
        this.animals = storedAnimals ? JSON.parse(storedAnimals) : this.getDefaultAnimals();
        this.applyFilters();
    }

    // Handle search input
    handleSearch(event) {
        this.filters.searchQuery = event.target.value.toLowerCase();
        this.applyFilters();
    }

    // Handle filter changes
    handleFilterChange(event) {
        const filterId = event.target.id.replace('Filter', '');
        this.filters[filterId] = event.target.value;
        this.applyFilters();
    }

    // Handle compatibility checkbox changes
    handleCompatibilityChange(event) {
        const property = event.target.id;
        this.filters[property] = event.target.checked ? true : null;
        this.applyFilters();
    }

    // Handle sort changes
    handleSortChange(event) {
        this.sortBy = event.target.value;
        this.applyFilters();
    }

    // Toggle sort order
    toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        const button = document.getElementById('sortOrder');
        const icon = button.querySelector('.sort-icon');
        
        if (this.sortOrder === 'asc') {
            icon.textContent = '⬆️';
            button.innerHTML = '<span class="sort-icon">⬆️</span> Aufsteigend';
        } else {
            icon.textContent = '⬇️';
            button.innerHTML = '<span class="sort-icon">⬇️</span> Absteigend';
        }
        
        this.applyFilters();
    }

    // Apply all filters and sorting
    applyFilters() {
        let filtered = [...this.animals];

        // Apply search filter
        if (this.filters.searchQuery) {
            filtered = filtered.filter(animal => {
                const searchText = `${animal.name} ${animal.breed} ${animal.description}`.toLowerCase();
                return searchText.includes(this.filters.searchQuery);
            });
        }

        // Apply dropdown filters
        Object.keys(this.filters).forEach(key => {
            if (this.filters[key] && key !== 'searchQuery') {
                if (key === 'age') {
                    filtered = this.filterByAge(filtered, this.filters[key]);
                } else if (key === 'size') {
                    filtered = this.filterBySize(filtered, this.filters[key]);
                } else if (key === 'energyLevel') {
                    filtered = this.filterByEnergyLevel(filtered, this.filters[key]);
                } else if (key.startsWith('goodWith')) {
                    filtered = this.filterByCompatibility(filtered, key, this.filters[key]);
                } else {
                    filtered = filtered.filter(animal => 
                        animal[key] && animal[key].toLowerCase() === this.filters[key].toLowerCase()
                    );
                }
            }
        });

        // Apply sorting
        filtered = this.sortAnimals(filtered);

        this.filteredAnimals = filtered;
        this.updateResultsDisplay();
        this.renderAnimals();
    }

    // Age-based filtering
    filterByAge(animals, ageGroup) {
        return animals.filter(animal => {
            const ageInYears = this.parseAge(animal.age);
            switch (ageGroup) {
                case 'puppy': return ageInYears < 1;
                case 'young': return ageInYears >= 1 && ageInYears < 3;
                case 'adult': return ageInYears >= 3 && ageInYears < 7;
                case 'senior': return ageInYears >= 7;
                default: return true;
            }
        });
    }

    // Size-based filtering
    filterBySize(animals, sizeCategory) {
        return animals.filter(animal => {
            if (!animal.characteristics?.size) return true;
            return animal.characteristics.size === sizeCategory;
        });
    }

    // Energy level filtering
    filterByEnergyLevel(animals, energyLevel) {
        return animals.filter(animal => {
            if (!animal.characteristics?.energyLevel) return true;
            return animal.characteristics.energyLevel === energyLevel;
        });
    }

    // Compatibility filtering
    filterByCompatibility(animals, compatibility, required) {
        if (!required) return animals;
        
        return animals.filter(animal => {
            return animal.characteristics && animal.characteristics[compatibility] === true;
        });
    }

    // Parse age string to number
    parseAge(ageString) {
        if (!ageString) return 0;
        const matches = ageString.match(/(\d+)/);
        return matches ? parseInt(matches[1]) : 0;
    }

    // Sort animals array
    sortAnimals(animals) {
        return animals.sort((a, b) => {
            let aValue = a[this.sortBy];
            let bValue = b[this.sortBy];

            // Special handling for different sort types
            if (this.sortBy === 'age') {
                aValue = this.parseAge(a.age);
                bValue = this.parseAge(b.age);
            } else if (this.sortBy === 'arrivalDate') {
                aValue = new Date(a.created || '2024-01-01');
                bValue = new Date(b.created || '2024-01-01');
            }

            // String comparison
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            let comparison = 0;
            if (aValue < bValue) comparison = -1;
            else if (aValue > bValue) comparison = 1;

            return this.sortOrder === 'desc' ? -comparison : comparison;
        });
    }

    // Update results counter and status
    updateResultsDisplay() {
        const counter = document.getElementById('resultsCounter');
        if (counter) {
            const count = this.filteredAnimals.length;
            counter.textContent = `${count} ${count === 1 ? 'Hund' : 'Hunde'} gefunden`;
        }
    }

    // Render filtered animals
    renderAnimals() {
        const animalsContainer = document.querySelector('.animals-grid') || 
                               document.querySelector('.animals-container');
        
        if (!animalsContainer) return;

        if (this.filteredAnimals.length === 0) {
            animalsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>Keine Hunde gefunden</h3>
                    <p>Versuchen Sie andere Filtereinstellungen oder löschen Sie die Filter.</p>
                    <button type="button" class="btn btn-primary" onclick="animalFilter.clearAllFilters()">
                        Filter zurücksetzen
                    </button>
                </div>
            `;
            return;
        }

        animalsContainer.innerHTML = this.filteredAnimals.map(animal => 
            this.renderAnimalCard(animal)
        ).join('');
    }

    // Render individual animal card
    renderAnimalCard(animal) {
        const characteristics = animal.characteristics || {};
        
        return `
            <div class="animal-card" data-id="${animal.id}">
                <div class="animal-image">
                    <img src="${animal.image || '/default-dog.jpg'}" 
                         alt="${animal.name}" 
                         loading="lazy">
                    <div class="animal-status ${animal.status?.toLowerCase().replace(' ', '-')}">
                        ${animal.status || 'Verfügbar'}
                    </div>
                </div>
                <div class="animal-info">
                    <h3>${animal.name}</h3>
                    <div class="animal-details">
                        <span class="detail-item">🐕 ${animal.breed}</span>
                        <span class="detail-item">📅 ${animal.age}</span>
                        <span class="detail-item">⚥ ${animal.gender}</span>
                        ${characteristics.size ? `<span class="detail-item">📏 ${this.getSizeLabel(characteristics.size)}</span>` : ''}
                        ${characteristics.energyLevel ? `<span class="detail-item">⚡ ${this.getEnergyLabel(characteristics.energyLevel)}</span>` : ''}
                    </div>
                    <p class="animal-description">${animal.description}</p>
                    
                    ${this.renderCompatibilityBadges(characteristics)}
                    
                    <div class="animal-actions">
                        <button class="btn btn-primary" onclick="showAnimalDetails('${animal.id}')">
                            Mehr erfahren
                        </button>
                        <button class="btn btn-outline" onclick="contactAboutAnimal('${animal.id}')">
                            Kontakt
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Render compatibility badges
    renderCompatibilityBadges(characteristics) {
        const badges = [];
        
        if (characteristics.goodWithChildren) badges.push('👶 Kinderfreundlich');
        if (characteristics.goodWithDogs) badges.push('🐕 Hundeverträglich');
        if (characteristics.goodWithCats) badges.push('🐱 Katzenverträglich');
        
        if (badges.length === 0) return '';
        
        return `
            <div class="compatibility-badges">
                ${badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
            </div>
        `;
    }

    // Get human-readable size label
    getSizeLabel(size) {
        const labels = {
            'small': 'Klein',
            'medium': 'Mittel',
            'large': 'Groß',
            'extra-large': 'Sehr groß'
        };
        return labels[size] || size;
    }

    // Get human-readable energy label
    getEnergyLabel(energy) {
        const labels = {
            'low': 'Ruhig',
            'medium': 'Ausgeglichen',
            'high': 'Sehr aktiv'
        };
        return labels[energy] || energy;
    }

    // Save current filter settings
    saveCurrentFilters() {
        const filterName = prompt('Name für diese Filtereinstellung:');
        if (!filterName) return;

        const filterSettings = {
            name: filterName,
            filters: { ...this.filters },
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            created: new Date().toISOString()
        };

        this.savedFilters.push(filterSettings);
        this.saveSavedFilters();
        
        this.showNotification(`Filter "${filterName}" gespeichert!`, 'success');
    }

    // Show load filters modal
    showLoadFiltersModal() {
        if (this.savedFilters.length === 0) {
            this.showNotification('Keine gespeicherten Filter vorhanden.', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal saved-filters-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Gespeicherte Filter laden</h3>
                <div class="saved-filters-list">
                    ${this.savedFilters.map((filter, index) => `
                        <div class="saved-filter-item">
                            <div class="filter-info">
                                <strong>${filter.name}</strong>
                                <small>Erstellt: ${new Date(filter.created).toLocaleDateString()}</small>
                            </div>
                            <div class="filter-actions">
                                <button class="btn btn-sm btn-primary" onclick="animalFilter.loadSavedFilter(${index})">
                                    Laden
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="animalFilter.deleteSavedFilter(${index})">
                                    Löschen
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        Schließen
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Load saved filter
    loadSavedFilter(index) {
        const filter = this.savedFilters[index];
        if (!filter) return;

        this.filters = { ...filter.filters };
        this.sortBy = filter.sortBy;
        this.sortOrder = filter.sortOrder;

        this.updateFilterUI();
        this.applyFilters();
        
        document.querySelector('.saved-filters-modal')?.remove();
        this.showNotification(`Filter "${filter.name}" geladen!`, 'success');
    }

    // Delete saved filter
    deleteSavedFilter(index) {
        const filter = this.savedFilters[index];
        if (!filter) return;

        if (confirm(`Filter "${filter.name}" wirklich löschen?`)) {
            this.savedFilters.splice(index, 1);
            this.saveSavedFilters();
            document.querySelector('.saved-filters-modal')?.remove();
            this.showLoadFiltersModal();
            this.showNotification(`Filter "${filter.name}" gelöscht!`, 'success');
        }
    }

    // Update UI to reflect current filters
    updateFilterUI() {
        Object.keys(this.filters).forEach(key => {
            const element = document.getElementById(key) || 
                           document.getElementById(key + 'Filter');
            
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = !!this.filters[key];
                } else {
                    element.value = this.filters[key] || '';
                }
            }
        });

        // Update sort UI
        const sortBySelect = document.getElementById('sortBy');
        if (sortBySelect) sortBySelect.value = this.sortBy;

        this.toggleSortOrder(); // This will update the sort order button
    }

    // Clear all filters
    clearAllFilters() {
        this.filters = {
            breed: '',
            age: '',
            size: '',
            energyLevel: '',
            goodWithChildren: null,
            goodWithDogs: null,
            goodWithCats: null,
            status: '',
            searchQuery: ''
        };
        
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        
        this.updateFilterUI();
        this.applyFilters();
        this.showNotification('Alle Filter zurückgesetzt!', 'info');
    }

    // Handle view toggle (grid/list)
    handleViewToggle(event) {
        const view = event.target.dataset.view;
        const animalsContainer = document.querySelector('.animals-grid') || 
                               document.querySelector('.animals-container');
        
        // Update active button
        document.querySelectorAll('[data-view]').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Update container class
        if (animalsContainer) {
            animalsContainer.className = view === 'list' ? 'animals-list' : 'animals-grid';
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    // Load saved filters from localStorage
    loadSavedFilters() {
        const stored = localStorage.getItem('boxerhof_saved_filters');
        return stored ? JSON.parse(stored) : [];
    }

    // Save filters to localStorage
    saveSavedFilters() {
        localStorage.setItem('boxerhof_saved_filters', JSON.stringify(this.savedFilters));
    }

    // Get default animals for testing
    getDefaultAnimals() {
        return [
            {
                id: '1',
                name: 'Bella',
                breed: 'Labrador Mix',
                age: '3 Jahre',
                gender: 'Weiblich',
                description: 'Liebevolle und verspielte Hündin',
                status: 'Vermittlungsbereit',
                characteristics: {
                    size: 'large',
                    energyLevel: 'medium',
                    goodWithChildren: true,
                    goodWithDogs: true,
                    goodWithCats: false
                },
                created: '2024-01-15'
            }
        ];
    }
}

// Initialize filter system
let animalFilter;
document.addEventListener('DOMContentLoaded', () => {
    animalFilter = new AnimalFilterSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimalFilterSystem;
}