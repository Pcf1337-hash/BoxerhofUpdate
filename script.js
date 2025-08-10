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