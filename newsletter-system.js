// Newsletter System for Boxerhof
// Manages email subscriptions and automatic notifications for dog adoptions

class NewsletterSystem {
    constructor() {
        this.subscribers = [];
        this.STORAGE_KEY = 'boxerhof_newsletter_subscribers';
        this.NOTIFICATION_SETTINGS_KEY = 'boxerhof_notification_settings';
        this.loadSubscribers();
        this.initializeNotificationSettings();
    }

    // Load subscribers from localStorage
    loadSubscribers() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            this.subscribers = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading newsletter subscribers:', error);
            this.subscribers = [];
        }
    }

    // Save subscribers to localStorage
    saveSubscribers() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.subscribers));
        } catch (error) {
            console.error('Error saving newsletter subscribers:', error);
        }
    }

    // Initialize notification settings
    initializeNotificationSettings() {
        const defaultSettings = {
            notifyOnNewDog: true,
            notifyOnAdoption: true,
            emailTemplate: {
                newDog: {
                    subject: "🐕 Neuer Hund beim Boxerhof - {dogName} sucht ein Zuhause!",
                    body: `Liebe Tierfreunde,

wir freuen uns, Ihnen mitteilen zu können, dass ein neuer Hund bei uns angekommen ist und ein liebevolles Zuhause sucht:

🐕 **{dogName}**
📝 **Beschreibung:** {dogDescription}
👤 **Geschlecht:** {dogGender}
🎂 **Alter:** {dogAge}
🐾 **Rasse:** {dogBreed}
📍 **Status:** {dogStatus}

{dogDetails}

Möchten Sie {dogName} kennenlernen? Kontaktieren Sie uns gerne:
📞 +49 (0) 5731 923 4567
📧 info@boxerhof-badoeynhausen.de

Besuchen Sie auch unsere Website für weitere Informationen:
🌐 {websiteUrl}

Mit tierischen Grüßen,
Ihr Boxerhof-Team

---
Sie erhalten diese E-Mail, weil Sie sich für unseren Newsletter angemeldet haben.
Möchten Sie sich abmelden? Antworten Sie einfach auf diese E-Mail.`
                },
                adoption: {
                    subject: "❤️ Frohe Nachrichten vom Boxerhof - {dogName} hat ein Zuhause gefunden!",
                    body: `Liebe Tierfreunde,

wir haben wunderbare Neuigkeiten für Sie! 

🎉 **{dogName} hat ein liebevolles Zuhause gefunden!**

{dogName}, der {dogAge} alte {dogBreed}, der {arrivalText} bei uns angekommen ist, konnte erfolgreich in eine liebevolle Familie vermittelt werden.

Das zeigt wieder einmal, wie wichtig die Unterstützung von Menschen wie Ihnen ist. Dank Ihrer Hilfe und Ihres Interesses können wir Hunden wie {dogName} helfen, das perfekte Zuhause zu finden.

🐕 **Weitere Hunde suchen noch ein Zuhause:**
Schauen Sie gerne auf unserer Website vorbei, um andere Hunde kennenzulernen, die noch auf ihre große Liebe warten:
🌐 {websiteUrl}

Oder besuchen Sie uns direkt:
📍 Boxerhof 1, 32547 Bad Oeynhausen
📞 +49 (0) 5731 923 4567

Vielen Dank für Ihre Unterstützung!

Mit tierischen Grüßen,
Ihr Boxerhof-Team

---
Sie erhalten diese E-Mail, weil Sie sich für unseren Newsletter angemeldet haben.
Möchten Sie sich abmelden? Antworten Sie einfach auf diese E-Mail.`
                }
            }
        };

        const stored = localStorage.getItem(this.NOTIFICATION_SETTINGS_KEY);
        this.notificationSettings = stored ? JSON.parse(stored) : defaultSettings;
        this.saveNotificationSettings();
    }

    // Save notification settings
    saveNotificationSettings() {
        localStorage.setItem(this.NOTIFICATION_SETTINGS_KEY, JSON.stringify(this.notificationSettings));
    }

    // Subscribe a new email
    subscribe(email, name = '', preferences = {}) {
        if (!this.isValidEmail(email)) {
            throw new Error('Ungültige E-Mail-Adresse');
        }

        // Check if already subscribed
        const existingIndex = this.subscribers.findIndex(sub => sub.email.toLowerCase() === email.toLowerCase());
        
        if (existingIndex !== -1) {
            // Update existing subscription
            this.subscribers[existingIndex] = {
                ...this.subscribers[existingIndex],
                name: name || this.subscribers[existingIndex].name,
                preferences: { ...this.subscribers[existingIndex].preferences, ...preferences },
                updatedAt: new Date().toISOString()
            };
        } else {
            // Add new subscription
            const newSubscriber = {
                id: Date.now() + Math.random(),
                email: email.toLowerCase(),
                name: name,
                preferences: {
                    newDogs: true,
                    adoptions: true,
                    events: false,
                    newsletter: true,
                    ...preferences
                },
                subscribedAt: new Date().toISOString(),
                active: true
            };
            this.subscribers.push(newSubscriber);
        }

        this.saveSubscribers();
        return { success: true, email: email };
    }

    // Unsubscribe an email
    unsubscribe(email) {
        const index = this.subscribers.findIndex(sub => sub.email.toLowerCase() === email.toLowerCase());
        if (index !== -1) {
            this.subscribers[index].active = false;
            this.subscribers[index].unsubscribedAt = new Date().toISOString();
            this.saveSubscribers();
            return { success: true };
        }
        return { success: false, error: 'E-Mail-Adresse nicht gefunden' };
    }

    // Get active subscribers
    getActiveSubscribers(preference = null) {
        let active = this.subscribers.filter(sub => sub.active);
        
        if (preference) {
            active = active.filter(sub => sub.preferences[preference] === true);
        }
        
        return active;
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Send notification when new dog is added
    async notifyNewDog(dogData) {
        if (!this.notificationSettings.notifyOnNewDog) {
            return { success: false, reason: 'Notifications disabled' };
        }

        const subscribers = this.getActiveSubscribers('newDogs');
        if (subscribers.length === 0) {
            return { success: false, reason: 'No subscribers' };
        }

        const template = this.notificationSettings.emailTemplate.newDog;
        const emailData = this.prepareDogEmailData(dogData, template, 'new');

        return await this.sendBulkEmail(subscribers, emailData);
    }

    // Send notification when dog is adopted (removed from list)
    async notifyDogAdopted(dogData) {
        if (!this.notificationSettings.notifyOnAdoption) {
            return { success: false, reason: 'Adoption notifications disabled' };
        }

        const subscribers = this.getActiveSubscribers('adoptions');
        if (subscribers.length === 0) {
            return { success: false, reason: 'No subscribers for adoption notifications' };
        }

        const template = this.notificationSettings.emailTemplate.adoption;
        const emailData = this.prepareDogEmailData(dogData, template, 'adoption');

        return await this.sendBulkEmail(subscribers, emailData);
    }

    // Prepare email data with dog information
    prepareDogEmailData(dogData, template, type) {
        const websiteUrl = window.location.origin;
        const arrivalText = dogData.arrivalDate ? 
            `am ${new Date(dogData.arrivalDate).toLocaleDateString('de-DE')}` : 
            'vor einiger Zeit';

        // Prepare additional details
        let dogDetails = '';
        if (type === 'new') {
            const details = [];
            if (dogData.size) details.push(`📏 **Größe:** ${dogData.size}`);
            if (dogData.weight) details.push(`⚖️ **Gewicht:** ${dogData.weight}kg`);
            if (dogData.color) details.push(`🎨 **Farbe:** ${dogData.color}`);
            if (dogData.energyLevel) details.push(`⚡ **Energielevel:** ${dogData.energyLevel}`);
            if (dogData.goodWith) {
                const compatibility = [];
                if (dogData.goodWith.dogs) compatibility.push('Hunden');
                if (dogData.goodWith.children) compatibility.push('Kindern');
                if (dogData.goodWith.cats) compatibility.push('Katzen');
                if (compatibility.length > 0) {
                    details.push(`🤝 **Verträglich mit:** ${compatibility.join(', ')}`);
                }
            }
            if (dogData.specialNeeds) details.push(`🏠 **Besondere Bedürfnisse:** ${dogData.specialNeeds}`);
            
            dogDetails = details.length > 0 ? '\n' + details.join('\n') + '\n' : '';
        }

        // Replace placeholders in subject and body
        const replacements = {
            '{dogName}': dogData.name || 'Unbekannt',
            '{dogDescription}': dogData.description || 'Keine Beschreibung verfügbar',
            '{dogGender}': dogData.gender || 'Unbekannt',
            '{dogAge}': dogData.age || 'Unbekannt',
            '{dogBreed}': dogData.breed || 'Mischling',
            '{dogStatus}': dogData.status || 'Vermittlungsbereit',
            '{dogDetails}': dogDetails,
            '{arrivalText}': arrivalText,
            '{websiteUrl}': websiteUrl
        };

        let subject = template.subject;
        let body = template.body;

        Object.entries(replacements).forEach(([placeholder, value]) => {
            subject = subject.replace(new RegExp(placeholder, 'g'), value);
            body = body.replace(new RegExp(placeholder, 'g'), value);
        });

        return { subject, body };
    }

    // Simulate sending bulk email (in a real implementation, this would connect to an email service)
    async sendBulkEmail(subscribers, emailData) {
        console.log('📧 Newsletter Notification would be sent to:', subscribers.length, 'subscribers');
        console.log('📧 Subject:', emailData.subject);
        console.log('📧 Body preview:', emailData.body.substring(0, 200) + '...');

        // In a real implementation, you would integrate with:
        // - SMTP service (like SendGrid, Mailgun, AWS SES)
        // - Or a newsletter service (like Mailchimp)
        
        // For demo purposes, we'll simulate the sending process
        const sendPromises = subscribers.map(async (subscriber, index) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`📤 Email sent to: ${subscriber.email} (${subscriber.name || 'Unbekannt'})`);
                    resolve({ 
                        email: subscriber.email, 
                        success: true, 
                        timestamp: new Date().toISOString() 
                    });
                }, 100 * index); // Stagger the sending simulation
            });
        });

        try {
            const results = await Promise.all(sendPromises);
            const successful = results.filter(r => r.success).length;
            
            // Store notification in history
            this.addNotificationToHistory({
                type: emailData.subject.includes('Neuer Hund') ? 'new_dog' : 'adoption',
                subject: emailData.subject,
                recipientCount: successful,
                timestamp: new Date().toISOString(),
                results: results
            });

            return {
                success: true,
                sent: successful,
                total: subscribers.length,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error sending bulk email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Add notification to history
    addNotificationToHistory(notification) {
        const historyKey = 'boxerhof_notification_history';
        let history = [];
        
        try {
            const stored = localStorage.getItem(historyKey);
            history = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading notification history:', error);
        }

        history.unshift(notification); // Add to beginning
        
        // Keep only last 50 notifications
        if (history.length > 50) {
            history = history.slice(0, 50);
        }

        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    // Get notification history
    getNotificationHistory() {
        try {
            const stored = localStorage.getItem('boxerhof_notification_history');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error getting notification history:', error);
            return [];
        }
    }

    // Update notification settings
    updateNotificationSettings(newSettings) {
        this.notificationSettings = { ...this.notificationSettings, ...newSettings };
        this.saveNotificationSettings();
    }

    // Get subscriber statistics
    getStats() {
        const total = this.subscribers.length;
        const active = this.subscribers.filter(sub => sub.active).length;
        const inactive = total - active;
        
        const preferences = {
            newDogs: this.subscribers.filter(sub => sub.active && sub.preferences.newDogs).length,
            adoptions: this.subscribers.filter(sub => sub.active && sub.preferences.adoptions).length,
            events: this.subscribers.filter(sub => sub.active && sub.preferences.events).length,
            newsletter: this.subscribers.filter(sub => sub.active && sub.preferences.newsletter).length
        };

        return {
            total,
            active,
            inactive,
            preferences
        };
    }

    // Export subscribers (for admin panel)
    exportSubscribers() {
        const data = this.subscribers.map(sub => ({
            email: sub.email,
            name: sub.name,
            active: sub.active,
            subscribedAt: sub.subscribedAt,
            preferences: sub.preferences
        }));

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `boxerhof-newsletter-subscribers-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Create global instance
const newsletterSystem = new NewsletterSystem();

// Newsletter subscription form handler
function initializeNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const email = formData.get('email');
            const name = formData.get('name') || '';
            
            try {
                const result = newsletterSystem.subscribe(email, name);
                
                // Show success message
                showNewsletterMessage('✅ Vielen Dank für Ihre Anmeldung! Sie erhalten ab sofort Benachrichtigungen über neue Hunde und Vermittlungen.', 'success');
                form.reset();
                
            } catch (error) {
                showNewsletterMessage('❌ Fehler bei der Anmeldung: ' + error.message, 'error');
            }
        });
    });
}

// Show newsletter messages
function showNewsletterMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `newsletter-message newsletter-message-${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Style the message
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        border-radius: 8px;
        padding: 15px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 9999;
        font-family: Inter, sans-serif;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(messageEl);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations for messages
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .newsletter-message .message-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
    }
    
    .newsletter-message button {
        background: none;
        border: none;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .newsletter-message button:hover {
        background-color: rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(messageStyles);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initializeNewsletterForm);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsletterSystem;
}

// Make available globally
window.newsletterSystem = newsletterSystem;
window.NewsletterSystem = NewsletterSystem;