// Gallery Page Functionality
class GalleryPage {
    constructor() {
        this.currentView = 'grid';
        this.currentCategory = 'all';
        this.allImages = [];
        this.filteredImages = [];
        this.imagesPerPage = 12;
        this.currentPage = 1;
        this.isLoading = false;
        
        this.init();
    }
    
    async init() {
        console.log('Initializing Gallery Page...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load images
        await this.loadImages();
        
        // Setup gallery view
        this.setupGallery();
        
        // Initialize modal
        this.initModal();
    }
    
    setupEventListeners() {
        // Category filters
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
                this.updateActiveCategory(e.target);
            });
        });
        
        // View options
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeView(e.target.dataset.view);
                this.updateActiveView(e.target);
            });
        });
        
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreImages());
        }
    }
    
    async loadImages() {
        console.log('Loading Boxerhof images...');
        this.showLoading(true);
        
        // Create detailed image data for all 25 images
        const imageCategories = {
            buildings: [1, 2, 3, 7, 10, 23],
            animals: [4, 5, 6, 11, 12, 13, 18, 19],
            care: [8, 9, 14, 15, 20],
            events: [16, 17, 21, 22],
            nature: [24, 25]
        };
        
        const imageData = [
            { id: 1, title: 'Hauptgebäude des Boxerhofs', description: 'Unser gemütliches Haupthaus mit Büro und Aufenthaltsräumen für Besucher', category: 'buildings' },
            { id: 2, title: 'Eingangsbereich', description: 'Der freundliche Empfangsbereich, wo Besucher herzlich willkommen geheißen werden', category: 'buildings' },
            { id: 3, title: 'Außenanlagen Übersicht', description: 'Luftaufnahme unserer weitläufigen und sicheren Außenanlagen', category: 'buildings' },
            { id: 4, title: 'Glückliche Boxerhunde', description: 'Unsere Boxer beim entspannten Spielen im großen Auslaufgehege', category: 'animals' },
            { id: 5, title: 'Hundegruppe beim Spaziergang', description: 'Gemeinsamer Spaziergang unserer sozialisierten Hundegruppe', category: 'animals' },
            { id: 6, title: 'Ruhige Momente', description: 'Hunde beim Entspannen in der Abendsonne auf der Hofterrasse', category: 'animals' },
            { id: 7, title: 'Hundeunterkünfte', description: 'Komfortable und hygienische Innenräume für unsere Pensionsgäste', category: 'buildings' },
            { id: 8, title: 'Medizinische Betreuung', description: 'Professionelle tierärztliche Untersuchung in unserem Behandlungsraum', category: 'care' },
            { id: 9, title: 'Fellpflege', description: 'Liebevolle Körperpflege - ein wichtiger Teil unserer täglichen Betreuung', category: 'care' },
            { id: 10, title: 'Futterküche', description: 'Unsere saubere Küche für die Zubereitung von gesundem Hundefutter', category: 'buildings' },
            { id: 11, title: 'Welpenstube', description: 'Speziell eingerichteter Bereich für junge Hunde und Welpen', category: 'animals' },
            { id: 12, title: 'Senior-Hunde Bereich', description: 'Ruhiger Bereich mit besonderen Annehmlichkeiten für ältere Hunde', category: 'animals' },
            { id: 13, title: 'Trainingseinheit', description: 'Grundausbildung und Sozialisation mit erfahrenen Hundetrainern', category: 'animals' },
            { id: 14, title: 'Erste Hilfe Station', description: 'Gut ausgestatteter Notfallbereich für schnelle medizinische Versorgung', category: 'care' },
            { id: 15, title: 'Quarantänebereich', description: 'Separate, sichere Bereiche für neue oder kranke Tiere', category: 'care' },
            { id: 16, title: 'Tag der offenen Tür', description: 'Besucher lernen unseren Hof und die Hunde bei einem besonderen Event kennen', category: 'events' },
            { id: 17, title: 'Hoffest', description: 'Fröhliche Gemeinschaftsfeier mit Unterstützern und Hundefreunden', category: 'events' },
            { id: 18, title: 'Adoption Moment', description: 'Der emotionale Moment, wenn ein Hund sein neues Zuhause findet', category: 'animals' },
            { id: 19, title: 'Hundetraining Workshop', description: 'Besucher lernen von unseren Experten richtige Hundeerziehung', category: 'animals' },
            { id: 20, title: 'Tierarzt Visite', description: 'Regelmäßige Gesundheitschecks durch unseren erfahrenen Tierarzt', category: 'care' },
            { id: 21, title: 'Freiwillige bei der Arbeit', description: 'Unser engagiertes Team von Helfern beim täglichen Einsatz für die Tiere', category: 'events' },
            { id: 22, title: 'Spendenübergabe', description: 'Dankbare Momente mit großzügigen Unterstützern unserer Arbeit', category: 'events' },
            { id: 23, title: 'Sicherheitseinrichtungen', description: 'Moderne Umzäunung und Sicherheitssysteme zum Schutz aller Tiere', category: 'buildings' },
            { id: 24, title: 'Naturlandschaft', description: 'Die wunderschöne Umgebung von Bad Oeynhausen um unseren Hof', category: 'nature' },
            { id: 25, title: 'Sonnenuntergang am Hof', description: 'Friedliche Abendstimmung, wenn der Tag auf dem Boxerhof zu Ende geht', category: 'nature' }
        ];
        
        // Try to load real images first
        const realImages = await this.tryLoadRealImages();
        
        if (realImages.length > 0) {
            // Use real images with metadata
            this.allImages = realImages.map((img, index) => ({
                ...img,
                ...imageData[index],
                url: img.url,
                isReal: true
            }));
        } else {
            // Create placeholder images with metadata
            this.allImages = imageData.map(data => ({
                ...data,
                url: this.createPlaceholderImage(data),
                isReal: false
            }));
        }
        
        this.filteredImages = [...this.allImages];
        this.updateImageCount();
        this.showLoading(false);
        
        console.log(`Loaded ${this.allImages.length} images for gallery`);
    }
    
    async tryLoadRealImages() {
        const realImages = [];
        const maxConcurrent = 5; // Limit concurrent requests
        
        for (let i = 1; i <= 25; i += maxConcurrent) {
            const batch = [];
            for (let j = 0; j < maxConcurrent && (i + j) <= 25; j++) {
                const imageIndex = i + j;
                const url = `https://www.boxernothilfe.de/wp-content/uploads/2024/08/Boxerhof-${imageIndex}.jpg`;
                batch.push(this.testImageAvailability(url, imageIndex));
            }
            
            const results = await Promise.all(batch);
            realImages.push(...results.filter(result => result.available));
            
            // Small delay between batches to avoid overwhelming the server
            if (i + maxConcurrent <= 25) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        return realImages;
    }
    
    testImageAvailability(url, index) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({
                url: url,
                index: index,
                available: true
            });
            img.onerror = () => resolve({
                url: url,
                index: index,
                available: false
            });
            img.src = url;
            
            // Timeout after 3 seconds
            setTimeout(() => resolve({
                url: url,
                index: index,
                available: false
            }), 3000);
        });
    }
    
    createPlaceholderImage(data) {
        const colors = {
            buildings: ['#e67e22', '#d35400'],
            animals: ['#f39c12', '#e67e22'],
            care: ['#27ae60', '#2ecc71'],
            events: ['#3498db', '#2980b9'],
            nature: ['#27ae60', '#16a085']
        };
        
        const colorPair = colors[data.category] || colors.buildings;
        const icons = {
            buildings: '🏡',
            animals: '🐕',
            care: '🏥',
            events: '🎉',
            nature: '🌳'
        };
        const icon = icons[data.category] || '🏡';
        
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                <defs>
                    <linearGradient id="grad${data.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${colorPair[0]};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${colorPair[1]};stop-opacity:1" />
                    </linearGradient>
                    <pattern id="pattern${data.id}" patternUnits="userSpaceOnUse" width="50" height="50">
                        <circle cx="25" cy="25" r="20" fill="white" opacity="0.1"/>
                    </pattern>
                </defs>
                <rect width="400" height="300" fill="url(#grad${data.id})"/>
                <rect width="400" height="300" fill="url(#pattern${data.id})"/>
                <text x="200" y="120" font-family="Arial" font-size="60" text-anchor="middle" fill="white">${icon}</text>
                <text x="200" y="160" font-family="Arial" font-size="14" text-anchor="middle" fill="white" font-weight="bold">Bild ${data.id}</text>
                <text x="200" y="200" font-family="Arial" font-size="12" text-anchor="middle" fill="white" opacity="0.9">${data.title}</text>
            </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }
    
    setupGallery() {
        this.renderImages();
    }
    
    renderImages() {
        const container = document.getElementById('galleryContainer');
        if (!container) return;
        
        // Remove loading message
        const loadingMsg = container.querySelector('.loading-message');
        if (loadingMsg) {
            loadingMsg.remove();
        }
        
        // Create or get gallery grid
        let galleryGrid = container.querySelector('.boxerhof-gallery-grid');
        if (!galleryGrid) {
            galleryGrid = document.createElement('div');
            galleryGrid.className = `boxerhof-gallery-grid ${this.currentView}-view`;
            container.appendChild(galleryGrid);
        } else {
            galleryGrid.className = `boxerhof-gallery-grid ${this.currentView}-view`;
        }
        
        // Clear existing content
        galleryGrid.innerHTML = '';
        
        // Calculate images to show
        const imagesToShow = this.filteredImages.slice(0, this.currentPage * this.imagesPerPage);
        
        // Render images
        imagesToShow.forEach((image, index) => {
            const imageCard = this.createImageCard(image, index);
            galleryGrid.appendChild(imageCard);
        });
        
        // Update load more button
        this.updateLoadMoreButton();
    }
    
    createImageCard(image, index) {
        const card = document.createElement('div');
        card.className = 'gallery-image-card';
        card.setAttribute('data-category', image.category);
        card.setAttribute('data-index', index);
        
        if (this.currentView === 'list') {
            card.innerHTML = `
                <img src="${image.url}" alt="${image.title}" loading="lazy">
                <div class="image-info">
                    <h3>${image.title}</h3>
                    <p>${image.description}</p>
                    <div class="image-meta">
                        <span>📁 ${this.getCategoryDisplayName(image.category)}</span>
                        <span>🖼️ Bild ${image.id}/25</span>
                    </div>
                </div>
                <div class="image-overlay">
                    <button class="view-image-btn" data-index="${index}">
                        🔍 Vergrößern
                    </button>
                </div>
            `;
        } else {
            card.innerHTML = `
                <img src="${image.url}" alt="${image.title}" loading="lazy">
                <div class="image-overlay">
                    <button class="view-image-btn" data-index="${index}">
                        🔍 Vergrößern
                    </button>
                </div>
            `;
        }
        
        // Add click listener
        const viewBtn = card.querySelector('.view-image-btn');
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openModal(index);
        });
        
        // Make entire card clickable
        card.addEventListener('click', () => {
            this.openModal(index);
        });
        
        return card;
    }
    
    getCategoryDisplayName(category) {
        const names = {
            buildings: 'Gebäude & Anlagen',
            animals: 'Unsere Hunde',
            care: 'Pflege & Betreuung',
            events: 'Events & Gemeinschaft',
            nature: 'Natur & Umgebung'
        };
        return names[category] || category;
    }
    
    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        
        if (category === 'all') {
            this.filteredImages = [...this.allImages];
        } else {
            this.filteredImages = this.allImages.filter(img => img.category === category);
        }
        
        this.updateImageCount();
        this.renderImages();
    }
    
    changeView(view) {
        this.currentView = view;
        this.renderImages();
    }
    
    updateActiveCategory(activeBtn) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    updateActiveView(activeBtn) {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    updateImageCount() {
        const countElement = document.getElementById('imageCount');
        if (countElement) {
            const count = this.filteredImages.length;
            const category = this.currentCategory === 'all' ? 'Bilder' : `${this.getCategoryDisplayName(this.currentCategory)} Bilder`;
            countElement.textContent = `${count} ${category}`;
        }
    }
    
    loadMoreImages() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.currentPage++;
        
        // Simulate loading delay
        setTimeout(() => {
            this.renderImages();
            this.isLoading = false;
        }, 500);
    }
    
    updateLoadMoreButton() {
        const loadMoreContainer = document.querySelector('.load-more-container');
        const btn = document.getElementById('loadMoreBtn');
        
        if (!loadMoreContainer || !btn) return;
        
        const hasMoreImages = this.filteredImages.length > this.currentPage * this.imagesPerPage;
        
        if (hasMoreImages) {
            loadMoreContainer.style.display = 'block';
            btn.textContent = this.isLoading ? 'Lädt...' : 'Weitere Bilder laden';
            btn.disabled = this.isLoading;
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }
    
    showLoading(show) {
        const container = document.getElementById('galleryContainer');
        const loadingMsg = container.querySelector('.loading-message');
        
        if (show && !loadingMsg) {
            const loading = document.createElement('div');
            loading.className = 'loading-message';
            loading.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Lade wunderschöne Bilder vom Boxerhof...</p>
            `;
            container.appendChild(loading);
        } else if (!show && loadingMsg) {
            loadingMsg.remove();
        }
    }
    
    initModal() {
        // Modal functionality is handled by the BoxerhofGallery class from boxerhof-slideshow.js
        // We just need to make sure the images are available to it
        if (window.BoxerhofGallery) {
            // Update the global gallery instance with our images
            const globalGallery = new window.BoxerhofGallery();
            globalGallery.images = this.filteredImages;
        }
    }
    
    openModal(index) {
        // Use the global modal system
        if (window.BoxerhofGallery) {
            const galleryModal = new window.BoxerhofGallery();
            galleryModal.images = this.filteredImages;
            galleryModal.openModal(index);
        }
    }
}

// Initialize gallery page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on gallery page
    if (document.querySelector('.gallery-container')) {
        new GalleryPage();
    }
});

// Export for external use
window.GalleryPage = GalleryPage;