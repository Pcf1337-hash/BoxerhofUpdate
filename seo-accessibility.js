// SEO and Structured Data Enhancement Module
// Implements Schema.org markup, Open Graph optimization, and SEO best practices

class SEOEnhancer {
    constructor() {
        this.organizationData = {
            name: "Boxer Nothilfe e.V.",
            description: "Ein sicherer Hafen für Hunde in Not. Wir päppeln Hunde aus schlechten Verhältnissen wieder auf und vermitteln sie liebevoll weiter.",
            url: window.location.origin,
            telephone: "+49 123 456 789",
            email: "info@boxerhof.de",
            address: {
                streetAddress: "Boxerhof 1",
                addressLocality: "Tierlieben",
                postalCode: "12345",
                addressCountry: "DE"
            },
            sameAs: [
                "https://facebook.com/boxerhof",
                "https://instagram.com/boxerhof",
                "https://youtube.com/@boxerhof"
            ]
        };
        
        this.init();
    }

    init() {
        this.addStructuredData();
        this.optimizeMetaTags();
        this.addBreadcrumbNavigation();
        this.setupSocialSharing();
        this.monitorSEOMetrics();
        console.log('🔍 SEO enhancements initialized');
    }

    addStructuredData() {
        // Organization Schema
        this.addJSONLD({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": this.organizationData.name,
            "description": this.organizationData.description,
            "url": this.organizationData.url,
            "telephone": this.organizationData.telephone,
            "email": this.organizationData.email,
            "address": {
                "@type": "PostalAddress",
                ...this.organizationData.address
            },
            "sameAs": this.organizationData.sameAs
        });

        // Animal Shelter Schema
        this.addJSONLD({
            "@context": "https://schema.org",
            "@type": "AnimalShelter",
            "name": this.organizationData.name,
            "description": this.organizationData.description,
            "url": this.organizationData.url,
            "telephone": this.organizationData.telephone,
            "email": this.organizationData.email,
            "address": {
                "@type": "PostalAddress",
                ...this.organizationData.address
            },
            "openingHours": [
                "Mo-Fr 09:00-17:00",
                "Sa 10:00-14:00"
            ],
            "paymentAccepted": "Cash, PayPal, Bank Transfer",
            "currenciesAccepted": "EUR"
        });

        // Website Schema
        this.addJSONLD({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": this.organizationData.name + " - Website",
            "url": this.organizationData.url,
            "description": this.organizationData.description,
            "publisher": {
                "@type": "Organization",
                "name": this.organizationData.name,
                "url": this.organizationData.url
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": this.organizationData.url + "/#animals?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        });

        // Add animal schemas for available animals
        this.addAnimalSchemas();
    }

    addAnimalSchemas() {
        // Get animals from localStorage or default data
        const animalsData = localStorage.getItem('boxerhof_animals');
        const animals = animalsData ? JSON.parse(animalsData) : [];

        animals.forEach(animal => {
            this.addJSONLD({
                "@context": "https://schema.org",
                "@type": "Pet",
                "name": animal.name,
                "description": animal.description,
                "breed": animal.breed,
                "age": animal.age,
                "gender": animal.gender || "Unknown",
                "animalType": "Dog",
                "image": animal.image,
                "adoptionStatus": this.mapStatusToSchema(animal.status),
                "location": {
                    "@type": "AnimalShelter",
                    "name": this.organizationData.name,
                    "address": {
                        "@type": "PostalAddress",
                        ...this.organizationData.address
                    }
                }
            });
        });
    }

    mapStatusToSchema(status) {
        const statusMap = {
            'available': 'Available',
            'Vermittlungsbereit': 'Available',
            'adopted': 'Adopted',
            'Vermittelt': 'Adopted',
            'not-ready': 'Not Available',
            'Nicht bereit': 'Not Available'
        };
        return statusMap[status] || 'Unknown';
    }

    addJSONLD(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data, null, 2);
        document.head.appendChild(script);
    }

    optimizeMetaTags() {
        // Dynamic meta descriptions based on page content
        this.updateMetaDescription();
        
        // Open Graph tags
        this.addOpenGraphTags();
        
        // Twitter Card tags
        this.addTwitterCardTags();
        
        // Additional SEO meta tags
        this.addSEOMetaTags();
    }

    updateMetaDescription() {
        const currentSection = this.getCurrentSection();
        let description = this.organizationData.description;

        const sectionDescriptions = {
            'animals': 'Entdecken Sie die liebevollen Hunde der Boxer Nothilfe e.V., die auf ein neues Zuhause warten. Jeder Hund verdient eine zweite Chance.',
            'about': 'Erfahren Sie mehr über die Boxer Nothilfe e.V. - ein Ort der Tierliebe, wo Hunde aus schlechten Verhältnissen wieder aufgepäppelt werden.',
            'gallery': 'Impressionen vom Boxerhof - sehen Sie, wie liebevoll unsere Hunde betreut werden und welche Freude sie uns täglich bringen.',
            'contact': 'Kontaktieren Sie die Boxer Nothilfe e.V. - wir freuen uns über Ihre Nachricht und helfen gerne bei allen Fragen rund um unsere Hunde.',
            'help': 'Helfen Sie Hunden in Not - durch Spenden, Adoption oder Freiwilligenarbeit können Sie das Leben unserer Schützlinge verbessern.'
        };

        if (sectionDescriptions[currentSection]) {
            description = sectionDescriptions[currentSection];
        }

        this.updateMetaTag('description', description);
    }

    getCurrentSection() {
        const hash = window.location.hash.replace('#', '');
        return hash || 'home';
    }

    addOpenGraphTags() {
        const ogTags = {
            'og:title': this.organizationData.name + ' - Ein sicherer Hafen für Hunde in Not',
            'og:description': this.organizationData.description,
            'og:type': 'website',
            'og:url': window.location.href,
            'og:site_name': this.organizationData.name,
            'og:locale': 'de_DE',
            'og:image': window.location.origin + '/docs/screenshots/boxerhof-homepage.png',
            'og:image:width': '1200',
            'og:image:height': '630',
            'og:image:alt': 'Boxer Nothilfe e.V. - Homepage'
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            this.addMetaTag('property', property, content);
        });
    }

    addTwitterCardTags() {
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': this.organizationData.name,
            'twitter:description': this.organizationData.description,
            'twitter:image': window.location.origin + '/docs/screenshots/boxerhof-homepage.png',
            'twitter:image:alt': 'Boxer Nothilfe e.V. - Ein sicherer Hafen für Hunde in Not'
        };

        Object.entries(twitterTags).forEach(([name, content]) => {
            this.addMetaTag('name', name, content);
        });
    }

    addSEOMetaTags() {
        const seoTags = {
            'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'googlebot': 'index, follow',
            'bingbot': 'index, follow',
            'revisit-after': '7 days',
            'author': 'Boxer Nothilfe e.V.',
            'language': 'de',
            'geo.region': 'DE',
            'geo.placename': 'Tierlieben',
            'geo.position': '52.5200;13.4050',
            'ICBM': '52.5200, 13.4050'
        };

        Object.entries(seoTags).forEach(([name, content]) => {
            this.addMetaTag('name', name, content);
        });
    }

    addMetaTag(attribute, name, content) {
        let existingTag = document.querySelector(`meta[${attribute}="${name}"]`);
        
        if (existingTag) {
            existingTag.setAttribute('content', content);
        } else {
            const meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            meta.setAttribute('content', content);
            document.head.appendChild(meta);
        }
    }

    updateMetaTag(name, content) {
        this.addMetaTag('name', name, content);
    }

    addBreadcrumbNavigation() {
        const currentSection = this.getCurrentSection();
        const breadcrumbData = this.getBreadcrumbData(currentSection);
        
        if (breadcrumbData.length > 1) {
            this.addJSONLD({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbData.map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.name,
                    "item": item.url
                }))
            });

            // Add visual breadcrumb navigation
            this.addVisualBreadcrumbs(breadcrumbData);
        }
    }

    getBreadcrumbData(section) {
        const breadcrumbs = [
            { name: 'Home', url: window.location.origin }
        ];

        const sectionNames = {
            'about': 'Über uns',
            'animals': 'Unsere Hunde',
            'gallery': 'Galerie',
            'guestbook': 'Gästebuch',
            'events': 'Veranstaltungen',
            'help': 'Hilfe',
            'contact': 'Kontakt'
        };

        if (section && section !== 'home' && sectionNames[section]) {
            breadcrumbs.push({
                name: sectionNames[section],
                url: window.location.origin + '/#' + section
            });
        }

        return breadcrumbs;
    }

    addVisualBreadcrumbs(breadcrumbData) {
        if (breadcrumbData.length <= 1) return;

        const existingBreadcrumbs = document.querySelector('.breadcrumb-navigation');
        if (existingBreadcrumbs) {
            existingBreadcrumbs.remove();
        }

        const breadcrumbNav = document.createElement('nav');
        breadcrumbNav.className = 'breadcrumb-navigation';
        breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');

        const breadcrumbList = document.createElement('ol');
        breadcrumbList.className = 'breadcrumb-list';

        breadcrumbData.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'breadcrumb-item';

            if (index === breadcrumbData.length - 1) {
                // Current page (no link)
                listItem.setAttribute('aria-current', 'page');
                listItem.textContent = item.name;
            } else {
                const link = document.createElement('a');
                link.href = item.url;
                link.textContent = item.name;
                listItem.appendChild(link);
            }

            breadcrumbList.appendChild(listItem);
        });

        breadcrumbNav.appendChild(breadcrumbList);

        // Insert after header
        const header = document.querySelector('.header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(breadcrumbNav, header.nextSibling);
        }
    }

    setupSocialSharing() {
        // Enhanced social sharing with better metadata
        const shareButtons = document.querySelectorAll('.share-btn, [data-share]');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const animalName = button.dataset.animal || 'Hund';
                const description = button.dataset.description || 'Dieser Hund sucht ein neues Zuhause';
                
                this.shareContent({
                    title: `${animalName} von der Boxer Nothilfe e.V.`,
                    text: description,
                    url: window.location.href
                });
            });
        });
    }

    async shareContent(data) {
        // Enhanced sharing with fallbacks
        if (navigator.share) {
            try {
                await navigator.share(data);
                console.log('✅ Content shared successfully');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.log('❌ Error sharing:', err);
                    this.fallbackShare(data);
                }
            }
        } else {
            this.fallbackShare(data);
        }
    }

    fallbackShare(data) {
        // Create sharing modal with multiple options
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <h3>📤 ${data.title} teilen</h3>
                <p>${data.text}</p>
                <div class="share-buttons">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}" 
                       target="_blank" class="share-button facebook">
                        📘 Facebook
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}" 
                       target="_blank" class="share-button twitter">
                        🐦 Twitter
                    </a>
                    <a href="https://wa.me/?text=${encodeURIComponent(data.text + ' ' + data.url)}" 
                       target="_blank" class="share-button whatsapp">
                        💬 WhatsApp
                    </a>
                    <button onclick="navigator.clipboard.writeText('${data.url}'); this.textContent='✅ Kopiert!'" 
                            class="share-button copy">
                        📋 Link kopieren
                    </button>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="close-button">
                    ✕ Schließen
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 10000);
    }

    monitorSEOMetrics() {
        // Monitor SEO-relevant metrics
        this.checkPagePerformance();
        this.validateStructuredData();
        this.monitorUserEngagement();
    }

    checkPagePerformance() {
        // Monitor Core Web Vitals for SEO
        if ('PerformanceObserver' in window) {
            // LCP monitoring
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    const lcp = entry.startTime;
                    if (lcp > 2500) {
                        console.warn('⚠️ LCP exceeds recommended threshold:', lcp + 'ms');
                    } else if (lcp < 1200) {
                        console.log('✅ Excellent LCP performance:', lcp + 'ms');
                    }
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // FID monitoring
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    const fid = entry.processingStart - entry.startTime;
                    if (fid > 100) {
                        console.warn('⚠️ FID exceeds recommended threshold:', fid + 'ms');
                    } else {
                        console.log('✅ Good FID performance:', fid + 'ms');
                    }
                }
            }).observe({ entryTypes: ['first-input'] });
        }
    }

    validateStructuredData() {
        // Basic validation of structured data
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        
        jsonLdScripts.forEach((script, index) => {
            try {
                const data = JSON.parse(script.textContent);
                if (data['@context'] && data['@type']) {
                    console.log(`✅ Valid structured data ${index + 1}:`, data['@type']);
                } else {
                    console.warn(`⚠️ Invalid structured data ${index + 1}:`, 'Missing @context or @type');
                }
            } catch (error) {
                console.error(`❌ JSON-LD parsing error ${index + 1}:`, error);
            }
        });
    }

    monitorUserEngagement() {
        // Track engagement metrics relevant to SEO
        let startTime = Date.now();
        let maxScroll = 0;
        
        // Scroll depth tracking
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            maxScroll = Math.max(maxScroll, scrollPercent);
        });

        // Page visibility tracking
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                const timeOnPage = Date.now() - startTime;
                console.log('📊 Engagement metrics:', {
                    timeOnPage: Math.round(timeOnPage / 1000) + 's',
                    maxScrollDepth: maxScroll + '%'
                });
            }
        });

        // Click tracking for internal links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.href.includes(window.location.hostname)) {
                console.log('🔗 Internal link clicked:', e.target.href);
            }
        });
    }

    // Method to update SEO data when content changes
    updateSEOForContent(contentType, data) {
        switch (contentType) {
            case 'animal':
                this.addAnimalSchemas();
                break;
            case 'event':
                this.addEventSchema(data);
                break;
            case 'page':
                this.updateMetaDescription();
                this.addBreadcrumbNavigation();
                break;
        }
    }

    addEventSchema(eventData) {
        this.addJSONLD({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": eventData.title,
            "description": eventData.description,
            "startDate": eventData.date + (eventData.time ? 'T' + eventData.time : ''),
            "endDate": eventData.endDate ? eventData.endDate + (eventData.endTime ? 'T' + eventData.endTime : '') : undefined,
            "location": {
                "@type": "Place",
                "name": eventData.location || this.organizationData.name,
                "address": {
                    "@type": "PostalAddress",
                    ...this.organizationData.address
                }
            },
            "organizer": {
                "@type": "Organization",
                "name": this.organizationData.name,
                "url": this.organizationData.url
            },
            "offers": eventData.price ? {
                "@type": "Offer",
                "price": eventData.price,
                "priceCurrency": "EUR"
            } : undefined
        });
    }
}

// Enhanced Accessibility Module
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceKeyboardNavigation();
        this.addSkipLinks();
        this.improveAriaLabels();
        this.setupFocusManagement();
        this.addHighContrastMode();
        console.log('♿ Accessibility enhancements initialized');
    }

    enhanceKeyboardNavigation() {
        // Add visible focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid #667eea !important;
                outline-offset: 2px !important;
            }
            
            /* High contrast focus for better visibility */
            @media (prefers-contrast: high) {
                .focus-visible {
                    outline: 3px solid #000 !important;
                    outline-offset: 3px !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Add focus-visible class to focused elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });

        // Enhanced focus handling
        document.addEventListener('focusin', (e) => {
            if (document.body.classList.contains('using-keyboard')) {
                e.target.classList.add('focus-visible');
            }
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });
    }

    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
            <a href="#navigation" class="skip-link">Zur Navigation springen</a>
            <a href="#footer" class="skip-link">Zum Footer springen</a>
        `;

        // Add skip link styles
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -100px;
                left: 0;
                z-index: 9999;
            }
            
            .skip-link {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
                background: #000;
                color: #fff;
                padding: 8px 16px;
                text-decoration: none;
                font-weight: bold;
            }
            
            .skip-link:focus {
                position: static;
                width: auto;
                height: auto;
                overflow: visible;
                left: 0;
            }
        `;
        document.head.appendChild(style);

        document.body.insertBefore(skipLinks, document.body.firstChild);

        // Add IDs to main sections if they don't exist
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }

        const nav = document.querySelector('nav');
        if (nav && !nav.id) {
            nav.id = 'navigation';
        }

        const footer = document.querySelector('footer');
        if (footer && !footer.id) {
            footer.id = 'footer';
        }
    }

    improveAriaLabels() {
        // Add aria-labels to interactive elements without labels
        document.querySelectorAll('button, a').forEach(element => {
            if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
                const text = element.textContent.trim();
                if (text) {
                    element.setAttribute('aria-label', text);
                }
            }
        });

        // Improve form labels
        document.querySelectorAll('input, textarea, select').forEach(input => {
            if (!input.getAttribute('aria-label') && !input.labels?.length) {
                const placeholder = input.getAttribute('placeholder');
                if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                }
            }
        });

        // Add landmarks
        this.addLandmarkRoles();
    }

    addLandmarkRoles() {
        // Add landmark roles to improve navigation
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }

        const main = document.querySelector('main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }

        // Add banner role to header
        const header = document.querySelector('header');
        if (header && !header.getAttribute('role')) {
            header.setAttribute('role', 'banner');
        }
    }

    setupFocusManagement() {
        // Manage focus for modal dialogs
        document.addEventListener('keydown', (e) => {
            // Escape key closes modals
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal:not([style*="display: none"])');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
            
            // Trap focus in modals
            const activeModal = document.querySelector('.modal:not([style*="display: none"])');
            if (activeModal && e.key === 'Tab') {
                this.trapFocus(e, activeModal);
            }
        });
    }

    trapFocus(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    closeModal(modal) {
        modal.style.display = 'none';
        // Return focus to trigger element if available
        const trigger = modal.dataset.trigger;
        if (trigger) {
            const triggerElement = document.querySelector(trigger);
            if (triggerElement) {
                triggerElement.focus();
            }
        }
    }

    addHighContrastMode() {
        // Add high contrast mode toggle
        const contrastToggle = document.createElement('button');
        contrastToggle.className = 'contrast-toggle';
        contrastToggle.innerHTML = '🌓 Kontrast';
        contrastToggle.setAttribute('aria-label', 'Hohen Kontrast umschalten');
        
        contrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            localStorage.setItem('high-contrast', isHighContrast);
            contrastToggle.innerHTML = isHighContrast ? '🌕 Normal' : '🌓 Kontrast';
        });

        // Restore saved preference
        if (localStorage.getItem('high-contrast') === 'true') {
            document.body.classList.add('high-contrast');
            contrastToggle.innerHTML = '🌕 Normal';
        }

        // Add high contrast styles
        const style = document.createElement('style');
        style.textContent = `
            .high-contrast {
                filter: contrast(150%) saturate(0%);
            }
            
            .high-contrast .contrast-toggle {
                background: #000 !important;
                color: #fff !important;
                border: 2px solid #fff !important;
            }
            
            .contrast-toggle {
                position: fixed;
                top: 100px;
                right: 10px;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                max-width: calc(100vw - 40px);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            @media (max-width: 480px) {
                .contrast-toggle {
                    top: 80px;
                    right: 10px;
                    left: auto;
                    font-size: 11px;
                    padding: 6px 8px;
                    max-width: calc(100vw - 20px);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(contrastToggle);
    }
}

// Initialize enhancement modules
const seoEnhancer = new SEOEnhancer();
const accessibilityEnhancer = new AccessibilityEnhancer();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.seoEnhancer = seoEnhancer;
    window.accessibilityEnhancer = accessibilityEnhancer;
}

// Listen for URL changes to update SEO data
window.addEventListener('hashchange', () => {
    seoEnhancer.updateSEOForContent('page');
});

// Update SEO when animals data changes
window.addEventListener('storage', (e) => {
    if (e.key === 'boxerhof_animals') {
        seoEnhancer.updateSEOForContent('animal');
    }
});

console.log('🚀 SEO and Accessibility modules loaded successfully');