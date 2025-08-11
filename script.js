// Shared Local Storage keys (shared with admin panel)
const MAIN_STORAGE_KEYS = {
    animals: 'boxerhof_animals',
    content: 'boxerhof_content',
    gallery: 'boxerhof_gallery'
};

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic content
    loadDynamicAnimals();
    
    // Initialize existing functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Enhanced validation
            if (!name || !email || !message) {
                showNotification('Bitte füllen Sie alle Felder aus.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }
            
            if (message.length < 10) {
                showNotification('Ihre Nachricht sollte mindestens 10 Zeichen lang sein.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wird gesendet...';
            submitBtn.disabled = true;
            
            // Simulate email sending (in real app, this would be an API call)
            setTimeout(() => {
                // Store message in localStorage for demo purposes
                const messages = JSON.parse(localStorage.getItem('boxerhof_messages') || '[]');
                messages.push({
                    id: Date.now(),
                    name: name,
                    email: email,
                    message: message,
                    timestamp: new Date().toISOString(),
                    status: 'unread'
                });
                localStorage.setItem('boxerhof_messages', JSON.stringify(messages));
                
                // Prepare email content
                const emailBody = `Neue Nachricht von ${name} (${email}):\n\n${message}`;
                const emailSubject = `Boxerhof Kontakt: ${name}`;
                
                // Create mailto link (fallback for demo)
                const mailtoLink = `mailto:info@boxerhof.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                
                // Show success message
                showNotification('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.', 'success');
                
                // Reset form
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Optional: Open email client (commented out for better UX)
                // window.open(mailtoLink);
                
            }, 1500);
        });
    }

    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const email = formData.get('email');
            const name = formData.get('name') || '';
            const consent = formData.get('consent');
            
            // Validation
            if (!email) {
                showNotification('Bitte geben Sie eine E-Mail-Adresse ein.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }
            
            if (!consent) {
                showNotification('Bitte stimmen Sie der Datenschutzerklärung zu.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wird abonniert...';
            submitBtn.disabled = true;
            
            // Simulate newsletter subscription (in real app, this would be an API call)
            setTimeout(() => {
                // Store subscription in localStorage for demo purposes
                const subscribers = JSON.parse(localStorage.getItem('boxerhof_newsletter') || '[]');
                
                // Check if already subscribed
                const existingSubscriber = subscribers.find(sub => sub.email === email);
                if (existingSubscriber) {
                    showNotification('Diese E-Mail-Adresse ist bereits für den Newsletter angemeldet.', 'info');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Add new subscriber
                subscribers.push({
                    id: Date.now(),
                    email: email,
                    name: name,
                    subscribedAt: new Date().toISOString(),
                    status: 'active'
                });
                localStorage.setItem('boxerhof_newsletter', JSON.stringify(subscribers));
                
                // Show success message
                showNotification(`Vielen Dank${name ? ', ' + name : ''}! Sie haben den Newsletter erfolgreich abonniert.`, 'success');
                
                // Reset form
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
            }, 1500);
        });
    }
    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature, .animal-card, .help-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not exist
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform: translateX(400px);
                transition: transform 0.3s ease;
                font-family: 'Inter', sans-serif;
                color: white;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #00b894, #00a085);
            }
            
            .notification-error {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
            }
            
            .notification-info {
                background: linear-gradient(135deg, #74b9ff, #0984e3);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-icon {
                font-size: 18px;
                font-weight: bold;
            }
            
            .notification-message {
                flex: 1;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            }
            
            .notification-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    transform: translateY(-100px);
                }
                
                .notification.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    const autoHide = setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoHide);
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Add loading animation for images (when added later)
function addImageLoadingEffect() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// Call image loading effect when DOM is ready
document.addEventListener('DOMContentLoaded', addImageLoadingEffect);

// Social sharing functionality
function setupSocialSharing() {
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const animal = this.dataset.animal;
            const description = this.dataset.description;
            const url = window.location.href;
            const shareText = `🐾 ${animal} auf dem Boxerhof: ${description} - Besuchen Sie uns!`;
            
            // Check if Web Share API is supported
            if (navigator.share) {
                navigator.share({
                    title: `Boxerhof - ${animal}`,
                    text: shareText,
                    url: url
                }).catch(err => {
                    console.log('Error sharing:', err);
                    fallbackShare(animal, shareText, url);
                });
            } else {
                fallbackShare(animal, shareText, url);
            }
        });
    });

    // Social media links tracking
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.dataset.platform;
            if (platform && platform !== 'email') {
                // Track social media clicks (for analytics)
                console.log(`Social media click: ${platform}`);
                
                // Store in localStorage for demo analytics
                const socialClicks = JSON.parse(localStorage.getItem('boxerhof_social_clicks') || '[]');
                socialClicks.push({
                    platform: platform,
                    timestamp: new Date().toISOString(),
                    url: this.href
                });
                localStorage.setItem('boxerhof_social_clicks', JSON.stringify(socialClicks));
            }
        });
    });
}

// Fallback sharing for browsers without Web Share API
function fallbackShare(animal, shareText, url) {
    // Create sharing modal
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <h3>🐾 ${animal} teilen</h3>
            <p>Teilen Sie diese Information über unsere ${animal} mit Ihren Freunden:</p>
            <div class="share-options">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}" 
                   target="_blank" class="share-option facebook">
                    📘 Facebook
                </a>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}" 
                   target="_blank" class="share-option twitter">
                    🐦 Twitter
                </a>
                <a href="https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}" 
                   target="_blank" class="share-option whatsapp">
                    💬 WhatsApp
                </a>
                <button class="share-option copy-link" data-text="${shareText + ' ' + url}">
                    📋 Link kopieren
                </button>
            </div>
            <button class="share-close">Schließen</button>
        </div>
    `;

    // Add modal styles
    if (!document.querySelector('#share-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'share-modal-styles';
        styles.textContent = `
            .share-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            
            .share-modal-content {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .share-modal-content h3 {
                color: #2c3e50;
                margin-bottom: 1rem;
            }
            
            .share-options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin: 1.5rem 0;
            }
            
            .share-option {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.75rem;
                border-radius: 8px;
                text-decoration: none;
                color: white;
                font-weight: 500;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .share-option.facebook {
                background: #3b5998;
            }
            
            .share-option.twitter {
                background: #1da1f2;
            }
            
            .share-option.whatsapp {
                background: #25d366;
            }
            
            .share-option.copy-link {
                background: #74b9ff;
            }
            
            .share-option:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .share-close {
                background: #e74c3c;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                margin-top: 1rem;
            }
            
            .share-close:hover {
                background: #c0392b;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(modal);

    // Handle copy link
    modal.querySelector('.copy-link').addEventListener('click', function() {
        const textToCopy = this.dataset.text;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification('Link wurde in die Zwischenablage kopiert!', 'success');
            }).catch(() => {
                fallbackCopyToClipboard(textToCopy);
            });
        } else {
            fallbackCopyToClipboard(textToCopy);
        }
    });

    // Close modal
    modal.querySelector('.share-close').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Fallback copy to clipboard
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification('Link wurde kopiert!', 'success');
}

// Initialize social sharing when DOM is ready
document.addEventListener('DOMContentLoaded', setupSocialSharing);

// Dynamic Animals Loading
function loadDynamicAnimals() {
    const animalsGrid = document.querySelector('.animals-grid');
    if (!animalsGrid) return;
    
    try {
        const storedAnimals = localStorage.getItem(MAIN_STORAGE_KEYS.animals);
        let animals = storedAnimals ? JSON.parse(storedAnimals) : [];
        
        // Filter only available animals for public display
        animals = animals.filter(animal => animal.status === 'available');
        
        if (animals.length === 0) {
            // Keep static content if no dynamic animals are available
            return;
        }
        
        // Clear existing static content and add dynamic animals
        animalsGrid.innerHTML = '';
        
        // Add filter/sort controls
        const filterControls = createAnimalFilters(animals);
        const animalsSection = document.getElementById('animals');
        const subtitle = animalsSection.querySelector('.section-subtitle');
        subtitle.insertAdjacentHTML('afterend', filterControls);
        
        // Display animals
        displayPublicAnimals(animals);
        
        // Setup filter event listeners
        setupAnimalFilters(animals);
        
    } catch (error) {
        console.error('Error loading dynamic animals:', error);
        // Keep static content on error
    }
}

function createAnimalFilters(animals) {
    // Get unique breeds for filter
    const breeds = [...new Set(animals.map(animal => animal.breed).filter(Boolean))];
    
    return `
        <div class="animals-filters">
            <div class="filter-group">
                <label for="breed-filter">Nach Rasse filtern:</label>
                <select id="breed-filter" class="filter-select">
                    <option value="">Alle Rassen</option>
                    ${breeds.map(breed => `<option value="${breed}">${breed}</option>`).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label for="sort-animals">Sortieren nach:</label>
                <select id="sort-animals" class="filter-select">
                    <option value="name">Name (A-Z)</option>
                    <option value="age">Alter (jüngste zuerst)</option>
                    <option value="arrival">Ankunft (neueste zuerst)</option>
                </select>
            </div>
            <div class="animals-count">
                <span id="animals-count">${animals.length}</span> Hunde warten auf ein neues Zuhause
            </div>
        </div>
    `;
}

function displayPublicAnimals(animals) {
    const animalsGrid = document.querySelector('.animals-grid');
    if (!animalsGrid) return;
    
    if (animals.length === 0) {
        animalsGrid.innerHTML = `
            <div class="no-animals-message">
                <div class="no-animals-icon">🐕</div>
                <h3>Aktuell keine Hunde zur Vermittlung</h3>
                <p>Alle unsere Hunde haben bereits ein liebevolles Zuhause gefunden! Schauen Sie bald wieder vorbei oder kontaktieren Sie uns für weitere Informationen.</p>
                <a href="#contact" class="btn btn-primary">Kontakt aufnehmen</a>
            </div>
        `;
        return;
    }
    
    animalsGrid.innerHTML = animals.map(animal => createPublicAnimalCard(animal)).join('');
    
    // Update animals count
    const countElement = document.getElementById('animals-count');
    if (countElement) {
        countElement.textContent = animals.length;
    }
}

function createPublicAnimalCard(animal) {
    const genderIcon = animal.gender === 'male' ? '♂️' : '♀️';
    const sizeText = {
        small: 'Klein',
        medium: 'Mittel', 
        large: 'Groß'
    }[animal.size] || '';
    
    const energyText = {
        low: 'Ruhig',
        medium: 'Ausgeglichen',
        high: 'Aktiv'
    }[animal.energyLevel] || '';
    
    // Health indicators
    const healthBadges = [];
    if (animal.vaccinated === 'yes') healthBadges.push('💉 Geimpft');
    if (animal.neutered === 'yes') healthBadges.push('🏥 Kastriert');
    
    // Compatibility indicators
    const compatibilityItems = [];
    if (animal.goodWith?.dogs) compatibilityItems.push('🐕 Hunde');
    if (animal.goodWith?.children) compatibilityItems.push('👶 Kinder');
    
    // Calculate days since arrival
    let daysSinceArrival = '';
    if (animal.arrivalDate) {
        const arrivalDate = new Date(animal.arrivalDate);
        const today = new Date();
        const diffTime = Math.abs(today - arrivalDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysSinceArrival = `Seit ${diffDays} Tagen bei uns`;
    }
    
    return `
        <div class="animal-card dynamic" data-id="${animal.id}" data-breed="${animal.breed}" data-age="${animal.age}" data-arrival="${animal.arrivalDate}">
            <div class="animal-image">
                ${animal.image ? 
                    `<img src="${animal.image}" alt="${animal.name}" class="animal-photo" onerror="this.style.display='none';">` : 
                    `<div class="animal-icon">${getAnimalIcon(animal.breed)}</div>`
                }
                ${animal.adoptionFee ? `<div class="adoption-fee">Schutzgebühr: ${animal.adoptionFee}€</div>` : ''}
            </div>
            <div class="animal-content">
                <div class="animal-header">
                    <h3>${animal.name} ${genderIcon}</h3>
                    <div class="animal-meta">
                        <span class="breed">${animal.breed}</span>
                        <span class="age">${animal.age}</span>
                        ${sizeText ? `<span class="size">${sizeText}</span>` : ''}
                        ${animal.weight ? `<span class="weight">${animal.weight}</span>` : ''}
                    </div>
                </div>
                
                <p class="animal-description">${animal.description}</p>
                
                ${energyText ? `<div class="energy-level"><strong>Energielevel:</strong> ${energyText}</div>` : ''}
                
                ${healthBadges.length > 0 ? `<div class="health-badges">${healthBadges.join(' • ')}</div>` : ''}
                
                ${compatibilityItems.length > 0 ? `<div class="compatibility"><strong>Verträglich mit:</strong> ${compatibilityItems.join(', ')}</div>` : ''}
                
                ${animal.specialNeeds ? `<div class="special-needs"><strong>Besondere Bedürfnisse:</strong> ${animal.specialNeeds}</div>` : ''}
                
                ${daysSinceArrival ? `<div class="arrival-info">${daysSinceArrival}</div>` : ''}
                
                <div class="animal-actions">
                    <button class="btn btn-primary contact-btn" onclick="contactAboutAnimal('${animal.name}', '${animal.id}')">
                        💝 Interesse zeigen
                    </button>
                    <button class="share-btn" data-animal="${animal.name}" data-description="${animal.description}">
                        📤 Teilen
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getAnimalIcon(breed) {
    const breedLower = breed?.toLowerCase() || '';
    if (breedLower.includes('boxer')) return '🥊';
    if (breedLower.includes('schäfer')) return '🐕‍🦺';
    if (breedLower.includes('retriever')) return '🦮';
    if (breedLower.includes('terrier')) return '🐕';
    return '🐶';
}

function setupAnimalFilters(allAnimals) {
    const breedFilter = document.getElementById('breed-filter');
    const sortSelect = document.getElementById('sort-animals');
    
    if (breedFilter) {
        breedFilter.addEventListener('change', () => filterAndSortAnimals(allAnimals));
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => filterAndSortAnimals(allAnimals));
    }
}

function filterAndSortAnimals(allAnimals) {
    const breedFilter = document.getElementById('breed-filter');
    const sortSelect = document.getElementById('sort-animals');
    
    let filteredAnimals = [...allAnimals];
    
    // Apply breed filter
    if (breedFilter && breedFilter.value) {
        filteredAnimals = filteredAnimals.filter(animal => animal.breed === breedFilter.value);
    }
    
    // Apply sorting
    if (sortSelect) {
        const sortBy = sortSelect.value;
        filteredAnimals.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'age':
                    // Parse age to number for sorting (assuming format like "3 Jahre")
                    const ageA = parseInt(a.age) || 0;
                    const ageB = parseInt(b.age) || 0;
                    return ageA - ageB;
                case 'arrival':
                    const dateA = new Date(a.arrivalDate || 0);
                    const dateB = new Date(b.arrivalDate || 0);
                    return dateB - dateA; // newest first
                default:
                    return 0;
            }
        });
    }
    
    displayPublicAnimals(filteredAnimals);
}

function contactAboutAnimal(animalName, animalId) {
    const subject = `Interesse an ${animalName}`;
    const body = `Hallo,\n\nich interessiere mich für ${animalName} und würde gerne mehr Informationen erhalten.\n\nTier-ID: ${animalId}\n\nVielen Dank!`;
    
    const mailtoLink = `mailto:info@boxerhof.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    window.location.href = mailtoLink;
    
    // Show confirmation message
    showNotification(`Ihr E-Mail-Programm wird geöffnet um Interesse an ${animalName} zu bekunden.`, 'info');
}

// Guestbook functionality
const GuestbookManager = {
    entries: [],
    currentPage: 0,
    entriesPerPage: 5,

    init: function() {
        this.loadEntries();
        this.setupEventListeners();
        this.renderEntries();
    },

    setupEventListeners: function() {
        const guestbookForm = document.getElementById('guestbookForm');
        if (guestbookForm) {
            guestbookForm.addEventListener('submit', this.handleSubmit.bind(this));
        }

        const loadMoreBtn = document.getElementById('loadMoreEntries');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.loadMoreEntries.bind(this));
        }
    },

    loadEntries: function() {
        const stored = localStorage.getItem('boxerhof_guestbook_entries');
        this.entries = stored ? JSON.parse(stored) : [];
        
        // Add some demo entries if none exist
        if (this.entries.length === 0) {
            this.entries = [
                {
                    id: 1,
                    name: "Familie Müller",
                    email: "mueller@example.com",
                    message: "Vielen Dank für die wunderbare Arbeit! Unser Rex hat sich perfekt eingelebt und ist der perfekte Familienhund geworden.",
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "approved",
                    image: null
                },
                {
                    id: 2,
                    name: "Anna Schmidt",
                    email: "",
                    message: "Die Betreuung auf dem Boxerhof ist einfach herzerwärmend. Man merkt sofort, wie viel Liebe in die Arbeit gesteckt wird.",
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "approved",
                    image: null
                }
            ];
            this.saveEntries();
        }
    },

    saveEntries: function() {
        localStorage.setItem('boxerhof_guestbook_entries', JSON.stringify(this.entries));
    },

    handleSubmit: function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const entry = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email') || '',
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            status: 'pending',
            image: null
        };

        // Handle image upload
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            if (imageFile.size > 5 * 1024 * 1024) {
                showNotification('Das Bild ist zu groß (max. 5MB)', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                entry.image = e.target.result;
                this.addEntry(entry);
            };
            reader.readAsDataURL(imageFile);
        } else {
            this.addEntry(entry);
        }
    },

    addEntry: function(entry) {
        this.entries.unshift(entry);
        this.saveEntries();
        
        showNotification('Vielen Dank für Ihren Eintrag! Er wird nach Prüfung freigeschaltet.', 'success');
        document.getElementById('guestbookForm').reset();
        
        // Update admin notification if in admin
        if (window.AdminPanel) {
            AdminPanel.updateGuestbookStats();
        }
    },

    renderEntries: function() {
        const container = document.getElementById('guestbookList');
        if (!container) return;

        const approvedEntries = this.entries.filter(entry => entry.status === 'approved');
        const entriesToShow = approvedEntries.slice(0, (this.currentPage + 1) * this.entriesPerPage);

        if (entriesToShow.length === 0) {
            container.innerHTML = `
                <div class="no-entries">
                    <p>Noch keine Gästebucheinträge vorhanden. Seien Sie der Erste!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = entriesToShow.map(entry => `
            <div class="guestbook-entry">
                <div class="guestbook-entry-header">
                    <div class="guestbook-entry-author">${entry.name}</div>
                    <div class="guestbook-entry-date">${this.formatDate(entry.timestamp)}</div>
                </div>
                <div class="guestbook-entry-message">${entry.message}</div>
                ${entry.image ? `<img src="${entry.image}" alt="Bild von ${entry.name}" class="guestbook-entry-image">` : ''}
            </div>
        `).join('');

        // Show/hide load more button
        const loadMoreBtn = document.getElementById('loadMoreEntries');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = entriesToShow.length < approvedEntries.length ? 'block' : 'none';
        }
    },

    loadMoreEntries: function() {
        this.currentPage++;
        this.renderEntries();
    },

    formatDate: function(timestamp) {
        return new Date(timestamp).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Events functionality
const EventsManager = {
    events: [],
    currentFilter: 'upcoming',

    init: function() {
        this.loadEvents();
        this.setupEventListeners();
        this.renderEvents();
    },

    setupEventListeners: function() {
        const filterBtns = document.querySelectorAll('.event-filters .filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderEvents();
            });
        });
    },

    loadEvents: function() {
        const stored = localStorage.getItem('boxerhof_events');
        this.events = stored ? JSON.parse(stored) : [];
        
        // Add demo events if none exist
        if (this.events.length === 0) {
            const now = new Date();
            const futureDate1 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
            const futureDate2 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            this.events = [
                {
                    id: 1,
                    title: "Tag der offenen Tür",
                    description: "Besuchen Sie uns und lernen Sie unsere Hunde kennen. Wir freuen uns auf Ihren Besuch und stehen für alle Fragen zur Verfügung.",
                    date: futureDate1.toISOString().split('T')[0],
                    time: "10:00",
                    endDate: futureDate1.toISOString().split('T')[0],
                    endTime: "16:00",
                    location: "Boxerhof, Hauptstraße 123",
                    capacity: 50,
                    price: 0,
                    registrationRequired: false,
                    contactInfo: "info@boxerhof.de",
                    status: "published",
                    image: null
                },
                {
                    id: 2,
                    title: "Hundetraining Workshop",
                    description: "Lernen Sie grundlegende Trainingsmethoden und verbessern Sie die Beziehung zu Ihrem Hund.",
                    date: futureDate2.toISOString().split('T')[0],
                    time: "14:00",
                    endDate: futureDate2.toISOString().split('T')[0],
                    endTime: "17:00",
                    location: "Trainingsplatz Boxerhof",
                    capacity: 15,
                    price: 25.00,
                    registrationRequired: true,
                    registrationDeadline: new Date(futureDate2.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    contactInfo: "training@boxerhof.de",
                    status: "published",
                    image: null
                },
                {
                    id: 3,
                    title: "Spendenlauf für Tiere",
                    description: "Gemeinsamer Lauf für den guten Zweck. Alle Teilnehmer erhalten eine Medaille und tragen zur Tierrettung bei.",
                    date: pastDate.toISOString().split('T')[0],
                    time: "09:00",
                    location: "Stadtpark",
                    capacity: 100,
                    price: 10.00,
                    registrationRequired: true,
                    status: "published",
                    image: null
                }
            ];
            this.saveEvents();
        }
    },

    saveEvents: function() {
        localStorage.setItem('boxerhof_events', JSON.stringify(this.events));
    },

    renderEvents: function() {
        const container = document.getElementById('eventsList');
        const noEventsMessage = document.getElementById('noEventsMessage');
        
        if (!container) return;

        let filteredEvents = this.events.filter(event => event.status === 'published');
        
        if (this.currentFilter === 'upcoming') {
            filteredEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
        } else if (this.currentFilter === 'past') {
            filteredEvents = filteredEvents.filter(event => new Date(event.date) < new Date());
        }

        if (filteredEvents.length === 0) {
            container.style.display = 'none';
            if (noEventsMessage) noEventsMessage.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        if (noEventsMessage) noEventsMessage.style.display = 'none';

        container.innerHTML = filteredEvents.map(event => this.renderEventCard(event)).join('');
    },

    renderEventCard: function(event) {
        const eventDate = new Date(event.date);
        const isUpcoming = eventDate >= new Date();
        
        return `
            <div class="event-card">
                <div class="event-image">
                    ${event.image ? `<img src="${event.image}" alt="${event.title}">` : '📅'}
                </div>
                <div class="event-content">
                    <div class="event-date">${this.formatEventDate(event.date, event.time)}</div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-description">${event.description}</div>
                    <div class="event-details">
                        ${event.location ? `<div class="event-detail">📍 ${event.location}</div>` : ''}
                        ${event.capacity ? `<div class="event-detail">👥 Max. ${event.capacity} Teilnehmer</div>` : ''}
                        ${event.price > 0 ? `<div class="event-detail">💰 ${event.price.toFixed(2)} €</div>` : '<div class="event-detail">💰 Kostenlos</div>'}
                        ${event.registrationRequired ? `<div class="event-detail">📝 Anmeldung erforderlich</div>` : ''}
                    </div>
                    <div class="event-actions">
                        ${isUpcoming && event.registrationRequired ? `
                            <a href="mailto:${event.contactInfo}?subject=Anmeldung: ${event.title}" class="event-action-btn primary">
                                Anmelden
                            </a>
                        ` : ''}
                        <a href="mailto:${event.contactInfo}?subject=Frage zu: ${event.title}" class="event-action-btn">
                            Mehr Infos
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    formatEventDate: function(date, time) {
        const eventDate = new Date(date);
        const formattedDate = eventDate.toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        if (time) {
            return `${formattedDate}, ${time} Uhr`;
        }
        return formattedDate;
    }
};

// Legal modals functionality
const LegalModals = {
    init: function() {
        this.setupEventListeners();
        this.checkCookieConsent();
    },

    setupEventListeners: function() {
        // Legal links
        document.querySelectorAll('.legal-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.openModal(target);
            });
        });

        // Privacy links in forms
        document.querySelectorAll('.privacy-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('datenschutz');
            });
        });

        // Close modal buttons
        document.querySelectorAll('.legal-modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.legal-modal').style.display = 'none';
            });
        });

        // Click outside to close
        document.querySelectorAll('.legal-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Cookie consent buttons
        const acceptCookies = document.getElementById('acceptCookies');
        const configureCookies = document.getElementById('configureCookies');
        
        if (acceptCookies) {
            acceptCookies.addEventListener('click', () => {
                this.acceptCookies();
            });
        }
        
        if (configureCookies) {
            configureCookies.addEventListener('click', () => {
                this.openModal('datenschutz');
            });
        }
    },

    openModal: function(modalId) {
        const modal = document.getElementById(modalId + 'Modal');
        if (modal) {
            modal.style.display = 'block';
        }
    },

    checkCookieConsent: function() {
        const consent = localStorage.getItem('cookie_consent');
        const banner = document.getElementById('cookieConsent');
        
        if (!consent && banner) {
            // Show cookie banner after 2 seconds
            setTimeout(() => {
                banner.style.display = 'block';
            }, 2000);
        }
    },

    acceptCookies: function() {
        localStorage.setItem('cookie_consent', 'accepted');
        localStorage.setItem('cookie_consent_date', new Date().toISOString());
        
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.style.display = 'none';
        }
        
        showNotification('Cookie-Einstellungen gespeichert', 'success');
    }
};

// Initialize all new functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    GuestbookManager.init();
    EventsManager.init();
    LegalModals.init();
});