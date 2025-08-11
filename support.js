// Support Page Functionality
class SupportPage {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('Support page functionality initialized');
        
        // Setup social sharing
        this.setupSocialSharing();
        
        // Setup form handlers
        this.setupFormHandlers();
        
        // Setup animations
        this.setupAnimations();
    }
    
    setupSocialSharing() {
        const shareButtons = document.querySelectorAll('.social-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = btn.classList.contains('facebook') ? 'facebook' :
                               btn.classList.contains('twitter') ? 'twitter' : 'email';
                
                if (platform !== 'email') {
                    e.preventDefault();
                    this.shareOnSocial(platform);
                }
            });
        });
    }
    
    shareOnSocial(platform) {
        const url = encodeURIComponent(window.location.origin + '/boxerhof.html');
        const title = encodeURIComponent('Unterstützen Sie den Boxerhof Bad Oeynhausen');
        const description = encodeURIComponent('Helfen Sie uns dabei, mehr Hunden in Not zu helfen. Jede Spende macht einen Unterschied!');
        
        let shareUrl = '';
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title} - ${description}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title} - ${description}&hashtags=Tierschutz,Hunde,Spenden`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        }
    }
    
    setupFormHandlers() {
        // Newsletter form (if exists)
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubscription(new FormData(newsletterForm));
            });
        }
        
        // Contact form (if exists)
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(new FormData(contactForm));
            });
        }
    }
    
    handleNewsletterSubscription(formData) {
        const email = formData.get('email');
        const name = formData.get('name') || '';
        
        if (!this.validateEmail(email)) {
            this.showMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            return;
        }
        
        // Store subscription (in real app, this would go to a server)
        const subscription = {
            email: email,
            name: name,
            subscribed: new Date().toISOString(),
            source: 'support-page'
        };
        
        this.storeNewsletterSubscription(subscription);
        this.showMessage('Vielen Dank! Sie haben sich erfolgreich für unseren Newsletter angemeldet.', 'success');
        
        // Reset form
        document.getElementById('newsletterForm').reset();
    }
    
    handleContactForm(formData) {
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!name || !email || !message) {
            this.showMessage('Bitte füllen Sie alle Felder aus.', 'error');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            return;
        }
        
        // In a real application, this would send to a server
        console.log('Contact form submission:', { name, email, message });
        
        this.showMessage('Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.', 'success');
        
        // Reset form
        event.target.reset();
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    storeNewsletterSubscription(subscription) {
        let subscriptions = [];
        try {
            subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
        } catch (e) {
            subscriptions = [];
        }
        
        // Check if email already exists
        if (!subscriptions.find(sub => sub.email === subscription.email)) {
            subscriptions.push(subscription);
            localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
        }
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.support-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `support-message support-message-${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="message-text">${message}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add to top of main content
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(messageDiv, main.firstChild);
        } else {
            document.body.insertBefore(messageDiv, document.body.firstChild);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    setupAnimations() {
        // Animate donation cards on scroll
        this.setupScrollAnimations();
        
        // Animate statistics counters
        this.setupCounterAnimations();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe donation cards and other elements
        const elementsToAnimate = document.querySelectorAll('.donation-card, .support-card, .story-card, .impact-item');
        elementsToAnimate.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }
    
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000; // 2 seconds
        const start = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

// Bank Details Modal Functions
function showBankDetails() {
    const modal = document.getElementById('bankDetailsModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeBankDetails() {
    const modal = document.getElementById('bankDetailsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess();
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const message = document.createElement('div');
    message.className = 'copy-success-message';
    message.innerHTML = '✅ In die Zwischenablage kopiert!';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 3000);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('bankDetailsModal');
    if (e.target === modal) {
        closeBankDetails();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBankDetails();
    }
});

// Initialize support page functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.support-hero')) {
        new SupportPage();
    }
});

// Add CSS for animations
const animationStyles = `
    <style>
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .support-message {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            max-width: 500px;
            width: 90%;
            animation: slideDown 0.3s ease-out;
        }
        
        .support-message-success .message-content {
            background: #27ae60;
            color: white;
        }
        
        .support-message-error .message-content {
            background: #e74c3c;
            color: white;
        }
        
        .support-message-info .message-content {
            background: #3498db;
            color: white;
        }
        
        .message-content {
            display: flex;
            align-items: center;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .message-icon {
            margin-right: 1rem;
            font-size: 1.2rem;
        }
        
        .message-text {
            flex: 1;
            font-weight: 500;
        }
        
        .message-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 1rem;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
        
        .message-close:hover {
            opacity: 1;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    </style>
`;

// Inject animation styles
document.head.insertAdjacentHTML('beforeend', animationStyles);

// Export for external use
window.SupportPage = SupportPage;