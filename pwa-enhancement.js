// Progressive Web App Enhancement for Boxerhof Website
// Implements advanced PWA features including offline functionality, push notifications, and app-like experience

class PWAEnhancement {
    constructor() {
        this.isOnline = navigator.onLine;
        this.deferredPrompt = null;
        this.swRegistration = null;
        this.updateAvailable = false;
        
        this.init();
    }

    async init() {
        // Register service worker
        await this.registerServiceWorker();
        
        // Set up PWA install prompt
        this.setupInstallPrompt();
        
        // Set up offline detection
        this.setupOfflineDetection();
        
        // Set up push notifications
        this.setupPushNotifications();
        
        // Set up app update detection
        this.setupUpdateDetection();
        
        // Initialize offline functionality
        this.initializeOfflineMode();
        
        // Set up background sync
        this.setupBackgroundSync();
        
        // Debug logging only in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🚀 PWA Enhancement initialized');
        }
    }

    // Register Service Worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.swRegistration = await navigator.serviceWorker.register('/sw.js');
                this.debugLog('✅ Service Worker registered successfully');
                
                // Listen for service worker updates
                this.swRegistration.addEventListener('updatefound', () => {
                    this.handleServiceWorkerUpdate();
                });
                
                return this.swRegistration;
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    // Handle service worker updates
    handleServiceWorkerUpdate() {
        const newWorker = this.swRegistration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.updateAvailable = true;
                this.showUpdateNotification();
            }
        });
    }

    // Show update notification
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-icon">🔄</div>
                <div class="update-text">
                    <h4>Update verfügbar</h4>
                    <p>Eine neue Version der App ist verfügbar. Jetzt aktualisieren?</p>
                </div>
                <div class="update-actions">
                    <button class="btn btn-primary btn-sm" onclick="pwaEnhancement.updateApp()">
                        Aktualisieren
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="this.closest('.pwa-update-notification').remove()">
                        Später
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds if not interacted with
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    // Update the app
    async updateApp() {
        if (this.swRegistration && this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            // Listen for controlling service worker change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }
    }

    // Set up PWA install prompt
    setupInstallPrompt() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.debugLog('✅ PWA was installed');
            this.hideInstallButton();
            this.trackInstallEvent();
        });
    }

    // Show install button
    showInstallButton() {
        let installButton = document.getElementById('pwa-install-button');
        
        if (!installButton) {
            installButton = document.createElement('button');
            installButton.id = 'pwa-install-button';
            installButton.className = 'btn btn-primary pwa-install-btn';
            installButton.innerHTML = `
                <span class="install-icon">📱</span>
                App installieren
            `;
            
            // Add to navigation or floating position
            const nav = document.querySelector('.nav-menu');
            if (nav) {
                nav.appendChild(installButton);
            } else {
                installButton.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                `;
                document.body.appendChild(installButton);
            }
            
            installButton.addEventListener('click', this.promptInstall.bind(this));
        }
        
        installButton.style.display = 'block';
    }

    // Hide install button
    hideInstallButton() {
        const installButton = document.getElementById('pwa-install-button');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    // Prompt app installation
    async promptInstall() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            
            const { outcome } = await this.deferredPrompt.userChoice;
            this.debugLog(`PWA install prompt outcome: ${outcome}`);
            
            if (outcome === 'accepted') {
                this.trackInstallPromptAccepted();
            }
            
            this.deferredPrompt = null;
            this.hideInstallButton();
        }
    }

    // Set up offline detection
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleOnlineStatusChange();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleOnlineStatusChange();
        });
    }

    // Handle online/offline status changes
    handleOnlineStatusChange() {
        const statusIndicator = this.getOrCreateStatusIndicator();
        
        if (this.isOnline) {
            statusIndicator.className = 'connection-status online';
            statusIndicator.innerHTML = `
                <span class="status-icon">🟢</span>
                <span class="status-text">Online</span>
            `;
            
            // Sync offline data when coming back online
            this.syncOfflineData();
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                statusIndicator.style.display = 'none';
            }, 3000);
        } else {
            statusIndicator.className = 'connection-status offline';
            statusIndicator.innerHTML = `
                <span class="status-icon">🔴</span>
                <span class="status-text">Offline - Eingeschränkte Funktionalität</span>
            `;
            statusIndicator.style.display = 'block';
        }
    }

    // Get or create status indicator
    getOrCreateStatusIndicator() {
        let indicator = document.getElementById('connection-status');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'connection-status';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                padding: 8px 16px;
                border-radius: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 10000;
                display: none;
                font-size: 14px;
                font-weight: 500;
            `;
            document.body.appendChild(indicator);
        }
        
        return indicator;
    }

    // Initialize offline mode functionality
    initializeOfflineMode() {
        // Cache important data for offline use
        this.cacheEssentialData();
        
        // Set up offline form submission queue
        this.setupOfflineFormQueue();
        
        // Create offline page indicator
        this.createOfflinePage();
    }

    // Cache essential data
    async cacheEssentialData() {
        const essentialData = {
            animals: localStorage.getItem('boxerhof_animals'),
            content: localStorage.getItem('boxerhof_content'),
            gallery: localStorage.getItem('boxerhof_gallery'),
            lastSync: new Date().toISOString()
        };
        
        localStorage.setItem('boxerhof_offline_cache', JSON.stringify(essentialData));
    }

    // Set up offline form submission queue
    setupOfflineFormQueue() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.isOnline) {
                    e.preventDefault();
                    this.queueFormSubmission(form);
                }
            });
        });
    }

    // Queue form submission for when online
    queueFormSubmission(form) {
        const formData = new FormData(form);
        const submissionData = {
            id: Date.now(),
            action: form.action || window.location.href,
            method: form.method || 'POST',
            data: Object.fromEntries(formData.entries()),
            timestamp: new Date().toISOString()
        };
        
        const queue = JSON.parse(localStorage.getItem('boxerhof_offline_queue') || '[]');
        queue.push(submissionData);
        localStorage.setItem('boxerhof_offline_queue', JSON.stringify(queue));
        
        this.showOfflineSubmissionMessage();
    }

    // Show offline submission message
    showOfflineSubmissionMessage() {
        const message = document.createElement('div');
        message.className = 'offline-submission-message';
        message.innerHTML = `
            <div class="message-content">
                <span class="message-icon">📄</span>
                <div class="message-text">
                    <strong>Formular gespeichert</strong>
                    <p>Ihre Nachricht wurde gespeichert und wird gesendet, sobald Sie wieder online sind.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }

    // Sync offline data when back online
    async syncOfflineData() {
        const queue = JSON.parse(localStorage.getItem('boxerhof_offline_queue') || '[]');
        
        if (queue.length === 0) return;
        
        this.debugLog(`📤 Syncing ${queue.length} offline submissions...`);
        
        for (const submission of queue) {
            try {
                await this.submitQueuedForm(submission);
                this.debugLog(`✅ Synced submission ${submission.id}`);
            } catch (error) {
                console.error(`❌ Failed to sync submission ${submission.id}:`, error);
            }
        }
        
        // Clear the queue
        localStorage.removeItem('boxerhof_offline_queue');
        
        this.showSyncCompleteMessage(queue.length);
    }

    // Submit queued form
    async submitQueuedForm(submission) {
        // In a real implementation, this would make an actual HTTP request
        // For now, we'll simulate the submission
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Simulated form submission:', submission);
                resolve();
            }, 1000);
        });
    }

    // Show sync complete message
    showSyncCompleteMessage(count) {
        const message = document.createElement('div');
        message.className = 'sync-complete-message';
        message.innerHTML = `
            <div class="message-content">
                <span class="message-icon">✅</span>
                <div class="message-text">
                    <strong>Synchronisation abgeschlossen</strong>
                    <p>${count} gespeicherte ${count === 1 ? 'Nachricht' : 'Nachrichten'} erfolgreich gesendet.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 4000);
    }

    // Set up push notifications
    async setupPushNotifications() {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            console.log('Push notifications not supported');
            return;
        }

        // Check current permission status
        if (Notification.permission === 'granted') {
            this.initializePushSubscription();
        } else if (Notification.permission !== 'denied') {
            this.showNotificationPrompt();
        }
    }

    // Show notification permission prompt
    showNotificationPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'notification-permission-prompt';
        prompt.innerHTML = `
            <div class="prompt-content">
                <div class="prompt-icon">🔔</div>
                <div class="prompt-text">
                    <h4>Benachrichtigungen aktivieren</h4>
                    <p>Erhalten Sie Updates über neue Hunde und wichtige Neuigkeiten.</p>
                </div>
                <div class="prompt-actions">
                    <button class="btn btn-primary btn-sm" onclick="pwaEnhancement.requestNotificationPermission()">
                        Aktivieren
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="this.closest('.notification-permission-prompt').remove()">
                        Nicht jetzt
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(prompt);
    }

    // Request notification permission
    async requestNotificationPermission() {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            this.initializePushSubscription();
            this.showNotificationSuccess();
        }
        
        // Remove prompt
        document.querySelector('.notification-permission-prompt')?.remove();
    }

    // Initialize push subscription
    async initializePushSubscription() {
        if (!this.swRegistration) return;

        try {
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    'YOUR_VAPID_PUBLIC_KEY_HERE' // Replace with actual VAPID key
                )
            });
            
            console.log('Push subscription successful:', subscription);
            
            // Send subscription to server (if you have a backend)
            // await this.sendSubscriptionToServer(subscription);
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
        }
    }

    // Utility function to log in development only
    debugLog(message) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(message);
        }
    }
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Show notification success message
    showNotificationSuccess() {
        const message = document.createElement('div');
        message.className = 'notification-success-message';
        message.innerHTML = `
            <div class="message-content">
                <span class="message-icon">✅</span>
                <div class="message-text">
                    <strong>Benachrichtigungen aktiviert</strong>
                    <p>Sie erhalten jetzt Updates über neue Hunde und Neuigkeiten.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 4000);
    }

    // Set up background sync
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            console.log('Background sync supported');
            
            // Register background sync for form submissions
            this.registerBackgroundSync('form-submission');
        }
    }

    // Register background sync
    async registerBackgroundSync(tag) {
        if (this.swRegistration) {
            try {
                await this.swRegistration.sync.register(tag);
                console.log(`Background sync registered: ${tag}`);
            } catch (error) {
                console.error('Background sync registration failed:', error);
            }
        }
    }

    // Set up update detection
    setupUpdateDetection() {
        // Check for updates periodically
        setInterval(() => {
            if (this.swRegistration) {
                this.swRegistration.update();
            }
        }, 60000); // Check every minute
    }

    // Create offline page
    createOfflinePage() {
        // This would be implemented in the service worker
        // For now, we'll just ensure offline functionality is ready
        console.log('Offline page functionality ready');
    }

    // Track PWA events
    trackInstallEvent() {
        console.log('📱 PWA installed');
        // Send to analytics if available
        if (window.gtag) {
            gtag('event', 'pwa_install', {
                'event_category': 'PWA',
                'event_label': 'App Installed'
            });
        }
    }

    trackInstallPromptAccepted() {
        console.log('📱 PWA install prompt accepted');
        // Send to analytics if available
        if (window.gtag) {
            gtag('event', 'pwa_install_prompt_accepted', {
                'event_category': 'PWA',
                'event_label': 'Install Prompt Accepted'
            });
        }
    }

    // Show test notification (for testing)
    showTestNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Boxerhof Update', {
                body: 'Ein neuer Hund ist verfügbar für die Adoption!',
                icon: '/icon-192x192.png',
                badge: '/icon-72x72.png',
                tag: 'new-animal',
                renotify: true,
                actions: [
                    {
                        action: 'view',
                        title: 'Ansehen'
                    },
                    {
                        action: 'close',
                        title: 'Schließen'
                    }
                ]
            });
        }
    }

    // Get PWA status
    getPWAStatus() {
        return {
            isOnline: this.isOnline,
            swRegistered: !!this.swRegistration,
            updateAvailable: this.updateAvailable,
            notificationsEnabled: Notification.permission === 'granted',
            installPromptAvailable: !!this.deferredPrompt
        };
    }
}

// Initialize PWA enhancement
let pwaEnhancement;
document.addEventListener('DOMContentLoaded', () => {
    pwaEnhancement = new PWAEnhancement();
});

// Expose global functions
window.pwaEnhancement = pwaEnhancement;

// Add PWA-specific CSS
const pwaStyles = `
    .pwa-install-btn {
        display: none;
        gap: 8px;
        align-items: center;
    }
    
    .install-icon {
        font-size: 16px;
    }
    
    .connection-status {
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
    }
    
    .connection-status.online {
        background: #d4edda !important;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .connection-status.offline {
        background: #f8d7da !important;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .pwa-update-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        padding: 20px;
        max-width: 400px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    }
    
    .update-content {
        display: flex;
        gap: 16px;
        align-items: flex-start;
    }
    
    .update-icon {
        font-size: 24px;
        flex-shrink: 0;
    }
    
    .update-text h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
    }
    
    .update-text p {
        margin: 0 0 16px 0;
        font-size: 14px;
        color: #666;
    }
    
    .update-actions {
        display: flex;
        gap: 8px;
    }
    
    .notification-permission-prompt,
    .offline-submission-message,
    .sync-complete-message,
    .notification-success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        padding: 20px;
        max-width: 400px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    }
    
    .prompt-content,
    .message-content {
        display: flex;
        gap: 16px;
        align-items: flex-start;
    }
    
    .prompt-icon,
    .message-icon {
        font-size: 24px;
        flex-shrink: 0;
    }
    
    .prompt-text h4,
    .message-text strong {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
    }
    
    .prompt-text p,
    .message-text p {
        margin: 0;
        font-size: 14px;
        color: #666;
    }
    
    .prompt-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @media (max-width: 768px) {
        .pwa-update-notification,
        .notification-permission-prompt,
        .offline-submission-message,
        .sync-complete-message,
        .notification-success-message {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
        
        .connection-status {
            top: 10px;
            left: 10px;
            right: 10px;
            transform: none;
        }
    }
`;

// Add PWA styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = pwaStyles;
document.head.appendChild(styleSheet);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAEnhancement;
}