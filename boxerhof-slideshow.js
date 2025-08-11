// Boxerhof Slideshow Functionality
class BoxerhofSlideshow {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevButton = document.querySelector('.prev-slide');
        this.nextButton = document.querySelector('.next-slide');
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        // Add event listeners
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }
        
        // Add indicator click listeners
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Start autoplay
        this.startAutoplay();
        
        // Pause autoplay on hover
        const slideshow = document.querySelector('.hero-slideshow');
        if (slideshow) {
            slideshow.addEventListener('mouseenter', () => this.stopAutoplay());
            slideshow.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
        
        // Load real images if available
        this.loadBoxerhofImages();
    }
    
    goToSlide(index) {
        // Remove active class from current slide and indicator
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }
        if (this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.remove('active');
        }
        
        // Update current slide index
        this.currentSlide = index;
        
        // Add active class to new slide and indicator
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        if (this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.add('active');
        }
        
        // Restart autoplay
        this.stopAutoplay();
        this.startAutoplay();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    addTouchSupport() {
        const slideshow = document.querySelector('.hero-slideshow');
        if (!slideshow) return;
        
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        slideshow.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            this.stopAutoplay();
        });
        
        slideshow.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent scrolling
        });
        
        slideshow.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only respond to horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
            
            isDragging = false;
            this.startAutoplay();
        });
    }
    
    async loadBoxerhofImages() {
        // Try to load the real Boxerhof images
        const imageUrls = [];
        for (let i = 1; i <= 25; i++) {
            imageUrls.push(`https://www.boxernothilfe.de/wp-content/uploads/2024/08/Boxerhof-${i}.jpg`);
        }
        
        // Test which images are available
        const availableImages = [];
        for (let i = 0; i < Math.min(imageUrls.length, 5); i++) {
            try {
                const isAvailable = await this.testImageUrl(imageUrls[i]);
                if (isAvailable) {
                    availableImages.push({
                        url: imageUrls[i],
                        index: i + 1
                    });
                }
            } catch (error) {
                console.log(`Image ${i + 1} not available:`, error);
            }
        }
        
        // Apply available images to slides
        if (availableImages.length > 0) {
            availableImages.forEach((image, index) => {
                if (index < this.slides.length) {
                    const slide = this.slides[index];
                    slide.style.backgroundImage = `linear-gradient(135deg, 
                        rgba(211, 84, 0, 0.6), 
                        rgba(230, 126, 34, 0.6)
                    ), url('${image.url}')`;
                    slide.style.backgroundSize = 'cover';
                    slide.style.backgroundPosition = 'center';
                }
            });
            
            console.log(`Loaded ${availableImages.length} Boxerhof images`);
        } else {
            console.log('Using fallback placeholder images');
            this.createFallbackImages();
        }
    }
    
    testImageUrl(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            
            // Timeout after 3 seconds
            setTimeout(() => resolve(false), 3000);
        });
    }
    
    createFallbackImages() {
        // Create beautiful fallback images using CSS gradients and SVG
        const fallbackConfigs = [
            {
                gradient: 'linear-gradient(135deg, #e67e22, #d35400)',
                icon: '🏡',
                title: 'Unser schöner Boxerhof'
            },
            {
                gradient: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                icon: '🌳',
                title: 'Weitläufige Außenanlagen'
            },
            {
                gradient: 'linear-gradient(135deg, #f39c12, #e67e22)',
                icon: '🐕',
                title: 'Glückliche Hunde'
            }
        ];
        
        this.slides.forEach((slide, index) => {
            const config = fallbackConfigs[index] || fallbackConfigs[0];
            
            // Create SVG background
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
                    <defs>
                        <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#e67e22;stop-opacity:0.8" />
                            <stop offset="100%" style="stop-color:#d35400;stop-opacity:0.8" />
                        </linearGradient>
                        <pattern id="texture${index}" patternUnits="userSpaceOnUse" width="100" height="100">
                            <circle cx="50" cy="50" r="30" fill="white" opacity="0.05"/>
                        </pattern>
                    </defs>
                    <rect width="1200" height="800" fill="url(#grad${index})"/>
                    <rect width="1200" height="800" fill="url(#texture${index})"/>
                    <text x="600" y="350" font-family="Arial" font-size="120" text-anchor="middle" fill="white" opacity="0.8">${config.icon}</text>
                    <text x="600" y="450" font-family="Arial" font-size="36" text-anchor="middle" fill="white" opacity="0.9">${config.title}</text>
                </svg>
            `;
            
            const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
            
            slide.style.backgroundImage = `url('${svgUrl}')`;
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
        });
    }
}

// Enhanced Image Gallery for the full 25 images
class BoxerhofGallery {
    constructor() {
        this.images = [];
        this.currentImageIndex = 0;
        this.isModalOpen = false;
        
        this.init();
    }
    
    async init() {
        await this.loadAllImages();
        this.createGalleryModal();
        this.addGalleryTriggers();
    }
    
    async loadAllImages() {
        console.log('Loading all 25 Boxerhof images...');
        
        // Try to load all 25 images
        const loadPromises = [];
        for (let i = 1; i <= 25; i++) {
            const url = `https://www.boxernothilfe.de/wp-content/uploads/2024/08/Boxerhof-${i}.jpg`;
            loadPromises.push(this.testImageAvailability(url, i));
        }
        
        const results = await Promise.all(loadPromises);
        this.images = results.filter(result => result.available);
        
        if (this.images.length > 0) {
            console.log(`Successfully loaded ${this.images.length} images`);
            this.createImageGallery();
        } else {
            console.log('No external images available, creating placeholder gallery');
            this.createPlaceholderGallery();
        }
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
            
            // Timeout after 2 seconds
            setTimeout(() => resolve({
                url: url,
                index: index,
                available: false
            }), 2000);
        });
    }
    
    createImageGallery() {
        // Add gallery section to pages that need it
        const galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) return;
        
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'boxerhof-gallery-grid';
        
        this.images.forEach((image, index) => {
            const imageCard = document.createElement('div');
            imageCard.className = 'gallery-image-card';
            imageCard.innerHTML = `
                <img src="${image.url}" alt="Boxerhof Bild ${image.index}" loading="lazy">
                <div class="image-overlay">
                    <button class="view-image-btn" data-index="${index}">
                        🔍 Vergrößern
                    </button>
                </div>
            `;
            galleryGrid.appendChild(imageCard);
        });
        
        galleryContainer.appendChild(galleryGrid);
        
        // Add click listeners
        galleryGrid.querySelectorAll('.view-image-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.openModal(index);
            });
        });
    }
    
    createPlaceholderGallery() {
        const placeholderImages = [
            { icon: '🏡', title: 'Hauptgebäude des Boxerhofs', description: 'Unser gemütliches Haupthaus mit Büro und Aufenthaltsräumen' },
            { icon: '🌳', title: 'Große Außenanlagen', description: 'Weitläufige Grünflächen zum Spielen und Entspannen' },
            { icon: '🐕', title: 'Hundeunterkünfte', description: 'Komfortable und sichere Unterkünfte für unsere Schützlinge' },
            { icon: '🏥', title: 'Medizinischer Bereich', description: 'Professionell ausgestattete Behandlungsräume' },
            { icon: '🎾', title: 'Trainingsplatz', description: 'Spezieller Bereich für Hundeerziehung und Spiel' },
            { icon: '🚿', title: 'Pflegeräume', description: 'Moderne Einrichtungen für die Körperpflege' },
            { icon: '🍽️', title: 'Futterküche', description: 'Hygienische Zubereitung der Mahlzeiten' },
            { icon: '🛏️', title: 'Quarantänebereich', description: 'Separate Bereiche für neue oder kranke Tiere' },
            { icon: '👨‍⚕️', title: 'Tierarztpraxis', description: 'Regelmäßige medizinische Betreuung vor Ort' },
            { icon: '🚗', title: 'Anfahrt und Parkplatz', description: 'Bequeme Erreichbarkeit für Besucher' },
            { icon: '🌺', title: 'Garten und Blumen', description: 'Liebevoll gestaltete Grünbereiche' },
            { icon: '🏃‍♂️', title: 'Auslaufbereiche', description: 'Verschiedene eingezäunte Auslaufzonen' },
            { icon: '🧸', title: 'Spielzeug und Beschäftigung', description: 'Reichlich Spielmöglichkeiten für alle Hunde' },
            { icon: '👥', title: 'Teamarbeit', description: 'Unser engagiertes Team bei der Arbeit' },
            { icon: '🏆', title: 'Erfolgsgeschichten', description: 'Glückliche Vermittlungen und neue Familien' },
            { icon: '🌅', title: 'Sonnenaufgang am Hof', description: 'Die friedliche Morgenstimmung' },
            { icon: '🌄', title: 'Landschaftsblick', description: 'Die schöne Umgebung von Bad Oeynhausen' },
            { icon: '🦴', title: 'Futter und Leckerlis', description: 'Hochwertige Ernährung für alle Hunde' },
            { icon: '🛡️', title: 'Sicherheitseinrichtungen', description: 'Umzäunung und Sicherheitssysteme' },
            { icon: '💝', title: 'Spendenübergabe', description: 'Dankbare Momente mit unseren Unterstützern' },
            { icon: '📚', title: 'Information und Beratung', description: 'Aufklärung über artgerechte Tierhaltung' },
            { icon: '🎉', title: 'Hoffeste und Events', description: 'Gemeinsame Feiern mit der Community' },
            { icon: '🌍', title: 'Nachhaltigkeit', description: 'Umweltbewusste Hofführung' },
            { icon: '💕', title: 'Liebe und Hingabe', description: 'Das Herzstück unserer Arbeit' },
            { icon: '🏠', title: 'Ein Zuhause für alle', description: 'Jeder Hund findet hier seinen Platz' }
        ];
        
        this.images = placeholderImages.slice(0, 25).map((placeholder, index) => ({
            url: this.createPlaceholderImageDataUrl(placeholder.icon, placeholder.title),
            index: index + 1,
            title: placeholder.title,
            description: placeholder.description,
            available: true
        }));
        
        this.createImageGallery();
    }
    
    createPlaceholderImageDataUrl(icon, title) {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                <defs>
                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#e67e22;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#d35400;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#bgGrad)"/>
                <text x="200" y="120" font-family="Arial" font-size="60" text-anchor="middle" fill="white">${icon}</text>
                <text x="200" y="200" font-family="Arial" font-size="16" text-anchor="middle" fill="white" font-weight="bold">${title}</text>
            </svg>
        `;
        
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }
    
    createGalleryModal() {
        const modal = document.createElement('div');
        modal.className = 'boxerhof-gallery-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <button class="modal-prev">❮</button>
                    <button class="modal-next">❯</button>
                    <img class="modal-image" src="" alt="">
                    <div class="modal-info">
                        <h3 class="modal-title"></h3>
                        <p class="modal-description"></p>
                        <span class="modal-counter"></span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        modal.querySelector('.modal-prev').addEventListener('click', () => this.prevImage());
        modal.querySelector('.modal-next').addEventListener('click', () => this.nextImage());
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isModalOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
    }
    
    openModal(index) {
        this.currentImageIndex = index;
        this.isModalOpen = true;
        this.updateModal();
        document.querySelector('.boxerhof-gallery-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.isModalOpen = false;
        document.querySelector('.boxerhof-gallery-modal').style.display = 'none';
        document.body.style.overflow = '';
    }
    
    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateModal();
    }
    
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateModal();
    }
    
    updateModal() {
        const modal = document.querySelector('.boxerhof-gallery-modal');
        const image = this.images[this.currentImageIndex];
        
        modal.querySelector('.modal-image').src = image.url;
        modal.querySelector('.modal-image').alt = image.title || `Boxerhof Bild ${image.index}`;
        modal.querySelector('.modal-title').textContent = image.title || `Boxerhof Bild ${image.index}`;
        modal.querySelector('.modal-description').textContent = image.description || '';
        modal.querySelector('.modal-counter').textContent = `${this.currentImageIndex + 1} von ${this.images.length}`;
    }
    
    addGalleryTriggers() {
        // Add trigger buttons where needed
        const galleryTriggers = document.querySelectorAll('[data-gallery-trigger]');
        galleryTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                this.openModal(0);
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slideshow if on homepage
    if (document.querySelector('.hero-slideshow')) {
        new BoxerhofSlideshow();
    }
    
    // Initialize gallery on all pages
    new BoxerhofGallery();
});

// Export for use in other scripts
window.BoxerhofSlideshow = BoxerhofSlideshow;
window.BoxerhofGallery = BoxerhofGallery;