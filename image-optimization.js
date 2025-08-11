// Image Optimization Module for Boxerhof Website
// Handles automatic image compression and WebP conversion for better performance

class ImageOptimizer {
    constructor() {
        this.maxWidth = 1200;
        this.maxHeight = 800;
        this.quality = 0.85;
        this.webpSupported = this.checkWebPSupport();
    }

    // Check if browser supports WebP
    checkWebPSupport() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Optimize uploaded image
    async optimizeImage(file) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            return new Promise((resolve, reject) => {
                img.onload = () => {
                    // Calculate new dimensions
                    const { width, height } = this.calculateDimensions(img.width, img.height);
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to blob
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve({
                                blob: blob,
                                originalSize: file.size,
                                optimizedSize: blob.size,
                                compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1),
                                dimensions: { width, height }
                            });
                        } else {
                            reject(new Error('Failed to optimize image'));
                        }
                    }, 'image/jpeg', this.quality);
                };

                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = URL.createObjectURL(file);
            });
        } catch (error) {
            console.error('Image optimization failed:', error);
            throw error;
        }
    }

    // Calculate optimal dimensions
    calculateDimensions(originalWidth, originalHeight) {
        let { width, height } = { width: originalWidth, height: originalHeight };
        
        // Scale down if too large
        if (width > this.maxWidth) {
            height = (height * this.maxWidth) / width;
            width = this.maxWidth;
        }
        
        if (height > this.maxHeight) {
            width = (width * this.maxHeight) / height;
            height = this.maxHeight;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }

    // Lazy loading implementation
    initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // Convert images to WebP format if supported
    async convertToWebP(canvas) {
        if (await this.webpSupported) {
            return new Promise(resolve => {
                canvas.toBlob(resolve, 'image/webp', this.quality);
            });
        }
        return null;
    }

    // Batch process multiple images
    async batchOptimize(files) {
        const results = [];
        
        for (const file of files) {
            try {
                const result = await this.optimizeImage(file);
                results.push({ success: true, file: file.name, ...result });
            } catch (error) {
                results.push({ success: false, file: file.name, error: error.message });
            }
        }
        
        return results;
    }

    // Generate responsive image srcset
    generateResponsiveSrcSet(imageSrc, sizes = [320, 480, 768, 1024, 1200]) {
        return sizes.map(size => {
            return `${imageSrc}?w=${size} ${size}w`;
        }).join(', ');
    }

    // Image loading performance metrics
    trackImagePerformance() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            const startTime = performance.now();
            
            img.addEventListener('load', () => {
                const loadTime = performance.now() - startTime;
                console.log(`Image loaded: ${img.src} (${loadTime.toFixed(2)}ms)`);
                
                // Track to analytics if available
                if (window.gtag) {
                    gtag('event', 'image_load', {
                        'custom_parameter': loadTime,
                        'image_src': img.src
                    });
                }
            });
        });
    }
}

// Initialize image optimizer
const imageOptimizer = new ImageOptimizer();

// Auto-initialize lazy loading on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    imageOptimizer.initializeLazyLoading();
    imageOptimizer.trackImagePerformance();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageOptimizer;
}