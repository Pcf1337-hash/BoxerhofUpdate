// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
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

// Dog adoption functionality
document.addEventListener('DOMContentLoaded', function() {
    loadAdoptableDogs();
    setupDogFilters();
});

// Load dogs from admin localStorage and display them
function loadAdoptableDogs() {
    try {
        const storedAnimals = localStorage.getItem('boxerhof_animals');
        let availableDogs = [];
        
        if (storedAnimals) {
            const allAnimals = JSON.parse(storedAnimals);
            // Filter for dogs that are available for adoption
            availableDogs = allAnimals.filter(animal => 
                animal.type === 'dog' && 
                animal.status === 'available'
            );
        }
        
        displayDogs(availableDogs);
        
    } catch (error) {
        console.error('Error loading dogs:', error);
        showNoDogs();
    }
}

// Display dogs in the container
function displayDogs(dogs) {
    const container = document.getElementById('dogsContainer');
    const noDogs = document.getElementById('noDogs');
    
    if (!container) return;
    
    if (dogs.length === 0) {
        showNoDogs();
        return;
    }
    
    // Hide no dogs message and show container
    noDogs.style.display = 'none';
    container.style.display = 'grid';
    
    // Generate dog cards
    const dogCards = dogs.map(dog => createDogCard(dog)).join('');
    container.innerHTML = dogCards;
    
    // Add click event listeners to dog cards
    addDogCardEventListeners();
}

// Create individual dog card HTML
function createDogCard(dog) {
    const genderIcon = dog.gender === 'male' ? '♂️' : '♀️';
    const sizeText = getSizeText(dog.size);
    const energyText = getEnergyText(dog.energyLevel);
    
    // Create compatibility tags
    const compatibilityTags = [];
    if (dog.goodWith?.children) compatibilityTags.push('👶 Kinderfreundlich');
    if (dog.goodWith?.dogs) compatibilityTags.push('🐕 Hundeverträglich');
    
    const compatibilityHtml = compatibilityTags.length > 0 
        ? `<div class="dog-compatibility">${compatibilityTags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
        : '';
    
    // Health tags
    const healthTags = [];
    if (dog.vaccinated === 'yes') healthTags.push('💉 Geimpft');
    if (dog.neutered === 'yes') healthTags.push('🏥 Kastriert');
    
    const healthHtml = healthTags.length > 0 
        ? `<div class="dog-health">${healthTags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
        : '';
    
    return `
        <div class="dog-card" data-dog-id="${dog.id}" data-size="${dog.size || ''}" data-energy="${dog.energyLevel || ''}">
            <div class="dog-image">
                <img src="${dog.image || 'https://via.placeholder.com/300x200?text=Kein+Bild+verfügbar'}" 
                     alt="${dog.name}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Bild+nicht+verfügbar'">
                <div class="dog-status-badge">Vermittlungsbereit</div>
            </div>
            
            <div class="dog-info">
                <div class="dog-header">
                    <h3 class="dog-name">${dog.name} ${genderIcon}</h3>
                    <div class="dog-breed-age">${dog.breed} • ${dog.age}</div>
                </div>
                
                <div class="dog-description">
                    ${dog.description}
                </div>
                
                <div class="dog-details">
                    ${sizeText ? `<span class="detail-tag">📏 ${sizeText}</span>` : ''}
                    ${dog.weight ? `<span class="detail-tag">⚖️ ${dog.weight}</span>` : ''}
                    ${energyText ? `<span class="detail-tag">⚡ ${energyText}</span>` : ''}
                    ${dog.color ? `<span class="detail-tag">🎨 ${dog.color}</span>` : ''}
                </div>
                
                ${compatibilityHtml}
                ${healthHtml}
                
                ${dog.specialNeeds ? `
                    <div class="dog-special-needs">
                        <strong>🏠 Besondere Bedürfnisse:</strong>
                        <p>${dog.specialNeeds}</p>
                    </div>
                ` : ''}
                
                <div class="dog-actions">
                    <div class="dog-fee">
                        ${dog.adoptionFee ? `<span class="fee">Schutzgebühr: ${dog.adoptionFee}€</span>` : ''}
                    </div>
                    <button class="btn btn-primary dog-interest-btn" data-dog-name="${dog.name}">
                        💝 Interesse zeigen
                    </button>
                    <button class="btn btn-secondary dog-share-btn" data-dog-name="${dog.name}" data-dog-breed="${dog.breed}">
                        📤 Teilen
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper functions for text display
function getSizeText(size) {
    const sizeMap = {
        'small': 'Klein',
        'medium': 'Mittel',
        'large': 'Groß'
    };
    return sizeMap[size] || '';
}

function getEnergyText(energy) {
    const energyMap = {
        'low': 'Ruhig',
        'medium': 'Ausgeglichen',
        'high': 'Sehr aktiv'
    };
    return energyMap[energy] || '';
}

// Show no dogs message
function showNoDogs() {
    const container = document.getElementById('dogsContainer');
    const noDogs = document.getElementById('noDogs');
    
    if (container) container.style.display = 'none';
    if (noDogs) noDogs.style.display = 'block';
}

// Setup dog filtering functionality
function setupDogFilters() {
    const searchInput = document.getElementById('dogSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterDogs();
        });
    }
    
    // Size filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterDogs();
        });
    });
}

// Filter dogs based on search and selected filters
function filterDogs() {
    const searchTerm = document.getElementById('dogSearch')?.value.toLowerCase() || '';
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const dogCards = document.querySelectorAll('.dog-card');
    
    dogCards.forEach(card => {
        const dogName = card.querySelector('.dog-name')?.textContent.toLowerCase() || '';
        const dogBreed = card.querySelector('.dog-breed-age')?.textContent.toLowerCase() || '';
        const dogDescription = card.querySelector('.dog-description')?.textContent.toLowerCase() || '';
        const cardSize = card.dataset.size || '';
        
        // Check search match
        const matchesSearch = !searchTerm || 
            dogName.includes(searchTerm) || 
            dogBreed.includes(searchTerm) || 
            dogDescription.includes(searchTerm);
        
        // Check size filter match
        const matchesFilter = activeFilter === 'all' || cardSize === activeFilter;
        
        // Show or hide card
        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Check if any cards are visible
    const visibleCards = Array.from(dogCards).filter(card => card.style.display !== 'none');
    const container = document.getElementById('dogsContainer');
    const noDogs = document.getElementById('noDogs');
    
    if (visibleCards.length === 0 && dogCards.length > 0) {
        // Show "no results" message
        if (container) {
            container.innerHTML = `
                <div class="no-results">
                    <p>🔍 Keine Hunde gefunden, die Ihren Suchkriterien entsprechen.</p>
                    <button onclick="clearDogFilters()" class="btn btn-secondary">Filter zurücksetzen</button>
                </div>
            `;
        }
    }
}

// Clear all filters
function clearDogFilters() {
    const searchInput = document.getElementById('dogSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (searchInput) searchInput.value = '';
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
    
    loadAdoptableDogs(); // Reload all dogs
}

// Add event listeners to dog cards
function addDogCardEventListeners() {
    // Interest buttons
    document.querySelectorAll('.dog-interest-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dogName = this.dataset.dogName;
            showInterestInDog(dogName);
        });
    });
    
    // Share buttons
    document.querySelectorAll('.dog-share-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dogName = this.dataset.dogName;
            const dogBreed = this.dataset.dogBreed;
            shareDog(dogName, dogBreed);
        });
    });
}

// Handle interest in a dog
function showInterestInDog(dogName) {
    const contactEmail = 'info@boxerhof.de';
    const subject = `Interesse an ${dogName}`;
    const body = `Hallo,

ich interessiere mich für ${dogName} und würde gerne mehr erfahren.

Bitte kontaktieren Sie mich für weitere Informationen über eine mögliche Adoption.

Mit freundlichen Grüßen`;

    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    if (window.navigator.userAgent.indexOf('Mobile') !== -1) {
        // On mobile, try to open email app
        window.location.href = mailtoLink;
    } else {
        // On desktop, show a confirmation and open email
        if (confirm(`Möchten Sie eine E-Mail senden, um Ihr Interesse an ${dogName} zu bekunden?`)) {
            window.open(mailtoLink);
        }
    }
    
    // Also show a notification
    showNotification(`Vielen Dank für Ihr Interesse an ${dogName}! Eine E-Mail wurde vorbereitet.`, 'success');
}

// Share a dog
function shareDog(dogName, dogBreed) {
    const url = window.location.href;
    const shareText = `🐾 ${dogName} (${dogBreed}) sucht ein neues Zuhause! Besuchen Sie die Boxer Nothilfe e.V.`;
    
    if (navigator.share) {
        navigator.share({
            title: `Boxer Nothilfe - ${dogName}`,
            text: shareText,
            url: url
        }).catch(err => {
            fallbackShare(dogName, shareText, url);
        });
    } else {
        fallbackShare(dogName, shareText, url);
    }
}

// Make functions available globally
window.clearDogFilters = clearDogFilters;