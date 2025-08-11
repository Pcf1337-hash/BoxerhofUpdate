// Performance Enhancement Module
// Implements lazy loading, image optimization, and performance monitoring

class PerformanceEnhancer {
    constructor() {
        this.lazyImages = [];
        this.lazyElements = [];
        this.intersectionObserver = null;
        this.performanceMetrics = {
            imageLoadTimes: [],
            totalLoadTime: 0,
            interactionTimes: []
        };
        
        this.init();
    }

    init() {
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEnhancements());
        } else {
            this.setupEnhancements();
        }
    }

    setupEnhancements() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupPerformanceMonitoring();
        this.setupPreloading();
        this.setupServiceWorker();
        console.log('🚀 Performance enhancements initialized');
    }

    // Lazy Loading Implementation
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    root: null,
                    rootMargin: '50px',
                    threshold: 0.1
                }
            );

            // Find all lazy loadable elements
            this.lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
            this.lazyElements = document.querySelectorAll('.lazy-load');

            // Start observing
            this.lazyImages.forEach(img => this.intersectionObserver.observe(img));
            this.lazyElements.forEach(el => this.intersectionObserver.observe(el));

            console.log(`🖼️ Lazy loading setup for ${this.lazyImages.length} images and ${this.lazyElements.length} elements`);
        } else {
            // Fallback for older browsers
            this.loadAllImagesImmediately();
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                if (element.tagName === 'IMG') {
                    this.loadLazyImage(element);
                } else {
                    this.loadLazyElement(element);
                }

                this.intersectionObserver.unobserve(element);
            }
        });
    }

    loadLazyImage(img) {
        const startTime = performance.now();

        // Handle responsive images
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
        }
        
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }

        // Add loading class
        img.classList.add('loading');

        img.onload = () => {
            const loadTime = performance.now() - startTime;
            this.performanceMetrics.imageLoadTimes.push(loadTime);

            img.classList.remove('loading');
            img.classList.add('loaded');
            
            // Add fade-in animation
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            requestAnimationFrame(() => {
                img.style.opacity = '1';
            });

            console.log(`📸 Image loaded in ${loadTime.toFixed(2)}ms`);
        };

        img.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
            console.warn('❌ Failed to load image:', img.src);
        };
    }

    loadLazyElement(element) {
        element.classList.add('loaded');
        
        // Add scroll-triggered animation
        const animationClass = element.dataset.animation || 'micro-fade-in';
        element.classList.add(animationClass);
    }

    // Image Optimization
    setupImageOptimization() {
        // Convert images to WebP if supported
        if (this.supportsWebP()) {
            this.convertToWebP();
        }

        // Implement responsive images
        this.setupResponsiveImages();
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    convertToWebP() {
        const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".png"], img[src$=".jpeg"]');
        
        images.forEach(img => {
            const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // Test if WebP version exists
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
                console.log('🎨 Converted to WebP:', webpSrc);
            };
            testImg.onerror = () => {
                // Keep original format if WebP not available
                console.log('⚠️ WebP not available for:', img.src);
            };
            testImg.src = webpSrc;
        });
    }

    setupResponsiveImages() {
        const images = document.querySelectorAll('img:not([srcset])');
        
        images.forEach(img => {
            if (img.src && !img.dataset.responsive) {
                const baseSrc = img.src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
                const extension = img.src.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
                
                // Create responsive srcset
                const srcset = [
                    `${baseSrc}_320w${extension} 320w`,
                    `${baseSrc}_640w${extension} 640w`,
                    `${baseSrc}_1024w${extension} 1024w`,
                    `${baseSrc}_1440w${extension} 1440w`
                ].join(', ');
                
                img.srcset = srcset;
                img.sizes = '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 1024px) 1024px, 1440px';
                img.dataset.responsive = 'true';
            }
        });
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.measureCoreWebVitals();
        
        // Monitor user interactions
        this.setupInteractionMonitoring();
        
        // Monitor resource loading
        this.monitorResourcePerformance();
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('📊 LCP:', entry.startTime.toFixed(2) + 'ms');
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                const fid = entry.processingStart - entry.startTime;
                console.log('⚡ FID:', fid.toFixed(2) + 'ms');
            }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    console.log('📐 CLS:', clsValue.toFixed(4));
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    setupInteractionMonitoring() {
        ['click', 'scroll', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                const startTime = performance.now();
                
                requestAnimationFrame(() => {
                    const interactionTime = performance.now() - startTime;
                    this.performanceMetrics.interactionTimes.push(interactionTime);
                    
                    if (interactionTime > 100) {
                        console.warn(`⚠️ Slow ${eventType} interaction: ${interactionTime.toFixed(2)}ms`);
                    }
                });
            }, { passive: true });
        });
    }

    monitorResourcePerformance() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                if (resource.duration > 1000) {
                    console.warn(`🐌 Slow resource load: ${resource.name} took ${resource.duration.toFixed(2)}ms`);
                }
            });

            // Total page load time
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.performanceMetrics.totalLoadTime = loadTime;
            console.log(`🏁 Total page load time: ${loadTime}ms`);
        });
    }

    // Preloading Critical Resources
    setupPreloading() {
        // Preload critical CSS
        this.preloadResource('style.css', 'style');
        this.preloadResource('admin-style.css', 'style');
        
        // Preload critical images
        const criticalImages = [
            'hero-background.jpg',
            'logo.png',
            'about-image.jpg'
        ];
        
        criticalImages.forEach(img => {
            this.preloadResource(img, 'image');
        });

        // Preload next page resources
        this.preloadNextPageResources();
    }

    preloadResource(href, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        
        if (as === 'style') {
            link.onload = () => {
                link.rel = 'stylesheet';
            };
        }
        
        document.head.appendChild(link);
    }

    preloadNextPageResources() {
        // Preload admin panel resources when hovering over admin link
        const adminLink = document.querySelector('a[href="admin.html"]');
        if (adminLink) {
            adminLink.addEventListener('mouseenter', () => {
                this.preloadResource('admin.html', 'document');
                this.preloadResource('admin.js', 'script');
            }, { once: true });
        }
    }

    // Service Worker Registration
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker registered:', registration);
                    })
                    .catch(error => {
                        console.log('❌ Service Worker registration failed:', error);
                    });
            });
        }
    }

    // Utility Methods
    loadAllImagesImmediately() {
        // Fallback for browsers without IntersectionObserver
        this.lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }

    // Image Compression Helper
    compressImage(file, quality = 0.8, maxWidth = 1920) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Performance Report
    getPerformanceReport() {
        const avgImageLoadTime = this.performanceMetrics.imageLoadTimes.length > 0
            ? this.performanceMetrics.imageLoadTimes.reduce((a, b) => a + b, 0) / this.performanceMetrics.imageLoadTimes.length
            : 0;

        const avgInteractionTime = this.performanceMetrics.interactionTimes.length > 0
            ? this.performanceMetrics.interactionTimes.reduce((a, b) => a + b, 0) / this.performanceMetrics.interactionTimes.length
            : 0;

        return {
            totalLoadTime: this.performanceMetrics.totalLoadTime,
            averageImageLoadTime: avgImageLoadTime,
            averageInteractionTime: avgInteractionTime,
            imagesLoaded: this.performanceMetrics.imageLoadTimes.length,
            interactions: this.performanceMetrics.interactionTimes.length
        };
    }
}

// Enhanced Filtering System
class EnhancedFilterSystem {
    constructor() {
        this.animals = [];
        this.filteredAnimals = [];
        this.activeFilters = {
            status: 'all',
            species: 'all',
            age: 'all',
            size: 'all',
            energyLevel: 'all',
            goodWithChildren: 'all',
            goodWithDogs: 'all',
            goodWithCats: 'all',
            search: ''
        };
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        
        this.init();
    }

    init() {
        this.loadAnimals();
        this.setupFilterUI();
        this.setupSearchFunctionality();
        this.applyFilters();
    }

    setupSearchFunctionality() {
        // This method will be called by the init function
        // Search functionality is handled in the setupFilterUI method
        console.log('🔍 Search functionality initialized');
    }

    loadAnimals() {
        // Load animals from localStorage or default data
        const stored = localStorage.getItem('boxerhof_animals');
        this.animals = stored ? JSON.parse(stored) : this.getDefaultAnimals();
    }

    getDefaultAnimals() {
        return [
            {
                id: 1,
                name: 'Bella',
                species: 'Hund',
                breed: 'Boxer Mix',
                age: '3 Jahre',
                size: 'Mittel',
                energyLevel: 'Hoch',
                status: 'Vermittlungsbereit',
                goodWithChildren: true,
                goodWithDogs: true,
                goodWithCats: false,
                description: 'Liebevolle und verspielte Hündin',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CZWxsYTwvdGV4dD48L3N2Zz4='
            },
            {
                id: 2,
                name: 'Max',
                species: 'Hund',
                breed: 'Deutscher Schäferhund',
                age: '5 Jahre',
                size: 'Groß',
                energyLevel: 'Mittel',
                status: 'Vermittlungsbereit',
                goodWithChildren: true,
                goodWithDogs: false,
                goodWithCats: false,
                description: 'Treuer Beschützer mit ruhigem Gemüt',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NYXI8L3RleHQ+PC9zdmc+'
            }
        ];
    }

    setupFilterUI() {
        const filtersHTML = `
            <div class="enhanced-filters">
                <div class="filter-section">
                    <h3>🔍 Erweiterte Suche</h3>
                    <div class="search-modern">
                        <input type="text" id="animalSearch" placeholder="Name, Rasse oder Beschreibung suchen...">
                    </div>
                </div>
                
                <div class="filter-section">
                    <h4>Grunddaten</h4>
                    <div class="filter-grid">
                        <select id="statusFilter">
                            <option value="all">Alle Status</option>
                            <option value="Vermittlungsbereit">Vermittlungsbereit</option>
                            <option value="Vermittelt">Vermittelt</option>
                            <option value="Nicht bereit">Nicht bereit</option>
                        </select>
                        
                        <select id="ageFilter">
                            <option value="all">Alle Altersgruppen</option>
                            <option value="Welpe">Welpe (0-1 Jahr)</option>
                            <option value="Jung">Jung (1-3 Jahre)</option>
                            <option value="Erwachsen">Erwachsen (3-7 Jahre)</option>
                            <option value="Senior">Senior (7+ Jahre)</option>
                        </select>
                        
                        <select id="sizeFilter">
                            <option value="all">Alle Größen</option>
                            <option value="Klein">Klein (bis 40cm)</option>
                            <option value="Mittel">Mittel (40-60cm)</option>
                            <option value="Groß">Groß (60+ cm)</option>
                        </select>
                        
                        <select id="energyFilter">
                            <option value="all">Alle Energielevel</option>
                            <option value="Niedrig">Niedrig</option>
                            <option value="Mittel">Mittel</option>
                            <option value="Hoch">Hoch</option>
                        </select>
                    </div>
                </div>
                
                <div class="filter-section">
                    <h4>Verträglichkeit</h4>
                    <div class="filter-grid">
                        <select id="childrenFilter">
                            <option value="all">Kinder - Egal</option>
                            <option value="true">Gut mit Kindern</option>
                            <option value="false">Nicht für Kinder</option>
                        </select>
                        
                        <select id="dogsFilter">
                            <option value="all">Hunde - Egal</option>
                            <option value="true">Verträglich mit Hunden</option>
                            <option value="false">Einzelhund</option>
                        </select>
                        
                        <select id="catsFilter">
                            <option value="all">Katzen - Egal</option>
                            <option value="true">Verträglich mit Katzen</option>
                            <option value="false">Nicht für Katzen</option>
                        </select>
                    </div>
                </div>
                
                <div class="filter-section">
                    <h4>Sortierung</h4>
                    <div class="sort-controls">
                        <select id="sortBy">
                            <option value="name">Nach Name</option>
                            <option value="age">Nach Alter</option>
                            <option value="size">Nach Größe</option>
                            <option value="arrival">Nach Ankunft</option>
                        </select>
                        
                        <button id="sortOrder" class="btn-modern" data-order="asc">
                            ⬆️ Aufsteigend
                        </button>
                    </div>
                </div>
                
                <div class="filter-actions">
                    <button id="resetFilters" class="btn btn-secondary">🔄 Filter zurücksetzen</button>
                    <button id="saveFilters" class="btn btn-primary">💾 Filter speichern</button>
                </div>
                
                <div class="filter-results">
                    <span id="resultsCount" class="results-count">0 Hunde gefunden</span>
                </div>
            </div>
        `;

        // Insert enhanced filters
        const existingFilters = document.querySelector('.animals-filters');
        if (existingFilters) {
            existingFilters.innerHTML = filtersHTML;
            this.bindFilterEvents();
        }
    }

    bindFilterEvents() {
        // Search input
        document.getElementById('animalSearch').addEventListener('input', 
            this.debounce((e) => {
                this.activeFilters.search = e.target.value;
                this.applyFilters();
            }, 300)
        );

        // Filter selects
        ['statusFilter', 'ageFilter', 'sizeFilter', 'energyFilter', 
         'childrenFilter', 'dogsFilter', 'catsFilter'].forEach(filterId => {
            document.getElementById(filterId).addEventListener('change', (e) => {
                const filterKey = filterId.replace('Filter', '');
                this.activeFilters[filterKey === 'children' ? 'goodWithChildren' : 
                                  filterKey === 'dogs' ? 'goodWithDogs' :
                                  filterKey === 'cats' ? 'goodWithCats' : filterKey] = e.target.value;
                this.applyFilters();
            });
        });

        // Sort controls
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });

        document.getElementById('sortOrder').addEventListener('click', (e) => {
            const button = e.target;
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            button.dataset.order = this.sortOrder;
            button.textContent = this.sortOrder === 'asc' ? '⬆️ Aufsteigend' : '⬇️ Absteigend';
            this.applyFilters();
        });

        // Action buttons
        document.getElementById('resetFilters').addEventListener('click', () => {
            this.resetFilters();
        });

        document.getElementById('saveFilters').addEventListener('click', () => {
            this.saveFilters();
        });
    }

    applyFilters() {
        let filtered = [...this.animals];

        // Apply search filter
        if (this.activeFilters.search) {
            const searchTerm = this.activeFilters.search.toLowerCase();
            filtered = filtered.filter(animal => 
                animal.name.toLowerCase().includes(searchTerm) ||
                animal.breed.toLowerCase().includes(searchTerm) ||
                animal.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply dropdown filters
        Object.keys(this.activeFilters).forEach(key => {
            if (key !== 'search' && this.activeFilters[key] !== 'all') {
                filtered = filtered.filter(animal => {
                    if (key.startsWith('goodWith')) {
                        return animal[key] === (this.activeFilters[key] === 'true');
                    }
                    return animal[key] === this.activeFilters[key];
                });
            }
        });

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[this.sortBy];
            let bVal = b[this.sortBy];

            if (this.sortBy === 'age') {
                aVal = this.parseAge(aVal);
                bVal = this.parseAge(bVal);
            }

            if (this.sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        this.filteredAnimals = filtered;
        this.updateResultsDisplay();
        this.renderAnimals();
    }

    parseAge(ageString) {
        // Convert age string to number for sorting
        const match = ageString.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    updateResultsDisplay() {
        const count = this.filteredAnimals.length;
        const countElement = document.getElementById('resultsCount');
        if (countElement) {
            countElement.textContent = `${count} ${count === 1 ? 'Hund' : 'Hunde'} gefunden`;
        }
    }

    renderAnimals() {
        const container = document.querySelector('.animals-grid') || document.querySelector('#animalsContainer');
        
        if (!container) return;

        if (this.filteredAnimals.length === 0) {
            container.innerHTML = `
                <div class="no-animals-message micro-fade-in">
                    <div class="no-animals-icon">🐕</div>
                    <h3>Keine Hunde gefunden</h3>
                    <p>Mit den aktuellen Filtern wurden keine Hunde gefunden. Versuchen Sie andere Suchkriterien.</p>
                    <button onclick="enhancedFilterSystem.resetFilters()" class="btn btn-primary">
                        Filter zurücksetzen
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredAnimals.map((animal, index) => `
            <div class="animal-card card-enhanced micro-bounce" style="animation-delay: ${index * 0.1}s">
                <div class="animal-photo-container">
                    <img src="${animal.image}" alt="${animal.name}" class="animal-photo lazy-load" loading="lazy">
                    <div class="status-badge status-${animal.status.toLowerCase().replace(/\s+/g, '-')}">
                        ${animal.status}
                    </div>
                </div>
                
                <div class="animal-content">
                    <div class="animal-header">
                        <h3 class="heading-modern">${animal.name}</h3>
                        <div class="animal-meta">
                            <span>🐕 ${animal.breed}</span>
                            <span>🎂 ${animal.age}</span>
                            <span>📏 ${animal.size}</span>
                            <span>⚡ ${animal.energyLevel}</span>
                        </div>
                    </div>
                    
                    <p class="animal-description">${animal.description}</p>
                    
                    <div class="compatibility">
                        ${animal.goodWithChildren ? '👶 Kinderfreundlich' : ''}
                        ${animal.goodWithDogs ? '🐕 Hundeverträglich' : ''}
                        ${animal.goodWithCats ? '🐱 Katzenverträglich' : ''}
                    </div>
                    
                    <div class="animal-actions">
                        <button class="contact-btn btn-modern" onclick="contactAboutAnimal('${animal.name}')">
                            💌 Kontakt aufnehmen
                        </button>
                        <button class="share-btn btn btn-outline" onclick="shareAnimal(${animal.id})">
                            📤 Teilen
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Initialize lazy loading for new elements
        const newLazyElements = container.querySelectorAll('.lazy-load');
        newLazyElements.forEach(el => performanceEnhancer.intersectionObserver?.observe(el));
    }

    resetFilters() {
        this.activeFilters = {
            status: 'all',
            species: 'all',
            age: 'all',
            size: 'all',
            energyLevel: 'all',
            goodWithChildren: 'all',
            goodWithDogs: 'all',
            goodWithCats: 'all',
            search: ''
        };

        // Reset UI
        document.querySelectorAll('.enhanced-filters select').forEach(select => {
            select.value = 'all';
        });
        document.getElementById('animalSearch').value = '';

        this.applyFilters();
    }

    saveFilters() {
        localStorage.setItem('boxerhof_saved_filters', JSON.stringify(this.activeFilters));
        console.log('💾 Filter preferences saved');
        
        // Show notification
        this.showNotification('Filter-Einstellungen gespeichert!', 'success');
    }

    loadSavedFilters() {
        const saved = localStorage.getItem('boxerhof_saved_filters');
        if (saved) {
            this.activeFilters = { ...this.activeFilters, ...JSON.parse(saved) };
            console.log('📂 Loaded saved filter preferences');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} micro-slide-right`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize enhancements
const performanceEnhancer = new PerformanceEnhancer();
const enhancedFilterSystem = new EnhancedFilterSystem();

// Global functions for animal interactions
window.contactAboutAnimal = function(animalName) {
    const subject = `Interesse an ${animalName}`;
    const body = `Hallo,\n\nich interessiere mich für ${animalName} und würde gerne mehr erfahren.\n\nViele Grüße`;
    
    window.location.href = `mailto:info@boxerhof.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

window.shareAnimal = async function(animalId) {
    const animal = enhancedFilterSystem.animals.find(a => a.id === animalId);
    if (!animal) return;

    const shareData = {
        title: `${animal.name} sucht ein Zuhause`,
        text: `${animal.description} - Boxer Nothilfe e.V.`,
        url: window.location.href + '#animal-' + animalId
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Sharing cancelled');
        }
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareData.url);
        enhancedFilterSystem.showNotification('Link kopiert!', 'success');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceEnhancer, EnhancedFilterSystem };
}