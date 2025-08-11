// Admin Panel JavaScript

// Global state
const adminState = {
    isLoggedIn: false,
    currentTab: 'dashboard',
    animals: [],
    content: {},
    gallery: []
};

// Demo credentials
const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'boxerhof123'
};

// Local storage keys
const STORAGE_KEYS = {
    animals: 'boxerhof_animals',
    content: 'boxerhof_content',
    gallery: 'boxerhof_gallery'
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadStoredData();
    setupEventListeners();
    updateDashboard();
});

// Initialize admin interface
function initializeAdmin() {
    const loginModal = document.getElementById('loginModal');
    const adminPanel = document.getElementById('adminPanel');
    
    // Check if already logged in (for demo purposes)
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    
    if (isLoggedIn) {
        loginModal.style.display = 'none';
        adminPanel.style.display = 'block';
        adminState.isLoggedIn = true;
    } else {
        loginModal.style.display = 'flex';
        adminPanel.style.display = 'none';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', handleLogout);
    
    // Tab navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Content forms
    const contentForms = document.querySelectorAll('.content-form');
    contentForms.forEach(form => {
        form.addEventListener('submit', handleContentSave);
    });
    
    // Animal management
    const addAnimalBtn = document.getElementById('addAnimalBtn');
    addAnimalBtn.addEventListener('click', () => openAnimalModal());
    
    const animalForm = document.getElementById('animalForm');
    animalForm.addEventListener('submit', handleAnimalSave);
    
    // Animal filters
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const animalSearch = document.getElementById('animalSearch');
    
    statusFilter.addEventListener('change', filterAnimals);
    typeFilter.addEventListener('change', filterAnimals);
    animalSearch.addEventListener('input', filterAnimals);
    
    // Gallery management
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    uploadBtn.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    
    // Drag and drop for gallery
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        sessionStorage.setItem('admin_logged_in', 'true');
        adminState.isLoggedIn = true;
        
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        
        showMessage('Erfolgreich angemeldet!', 'success');
        loadContentData();
    } else {
        showMessage('Ungültige Anmeldedaten!', 'error');
    }
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('admin_logged_in');
    adminState.isLoggedIn = false;
    
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    
    showMessage('Erfolgreich abgemeldet!', 'success');
}

// Switch tabs
function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Show active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    adminState.currentTab = tabName;
    
    // Load specific tab data
    switch(tabName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'content':
            loadContentData();
            break;
        case 'animals':
            loadAnimals();
            break;
        case 'gallery':
            loadGallery();
            break;
    }
}

// Load stored data
function loadStoredData() {
    // Load animals
    const storedAnimals = localStorage.getItem(STORAGE_KEYS.animals);
    if (storedAnimals) {
        adminState.animals = JSON.parse(storedAnimals);
    } else {
        // Initialize with demo data
        adminState.animals = [
            {
                id: 1,
                name: 'Max',
                type: 'dog',
                breed: 'Boxer',
                age: '3 Jahre',
                gender: 'male',
                status: 'available',
                description: 'Max ist ein freundlicher Boxer, der gerne spielt und kuschelt.',
                image: 'https://via.placeholder.com/300x200?text=Max+der+Boxer'
            }
        ];
        saveAnimals();
    }
    
    // Load content
    const storedContent = localStorage.getItem(STORAGE_KEYS.content);
    if (storedContent) {
        adminState.content = JSON.parse(storedContent);
    } else {
        // Initialize with current website content
        adminState.content = {
            hero: {
                title: 'Willkommen bei der Boxer Nothilfe e.V.',
                subtitle: 'Ein sicherer Hafen für Hunde in Not',
                description: 'Hier auf unserem Hof kümmern wir uns liebevoll um Hunde aus schlechten Verhältnissen. Wir päppeln sie wieder auf, geben ihnen medizinische Versorgung und vermitteln sie an liebevolle Familien weiter. Jeder Hund verdient eine zweite Chance auf ein glückliches Leben.'
            },
            about: {
                text1: 'Die Boxer Nothilfe e.V. ist mehr als nur ein Zuhause für Hunde in Not – es ist ein Ort, an dem Liebe, Fürsorge und Hingabe im Mittelpunkt stehen. Hier verwirklichen wir täglich den Traum, Hunden aus schlechten Verhältnissen zu helfen und sie wieder aufzupäppeln.',
                text2: 'Unsere Mission ist es, Hunden in Not ein sicheres und liebevolles Zuhause zu bieten, sie wieder gesund zu pflegen und an liebevolle Familien zu vermitteln. Als Teil der Boxer Nothilfe e.V. arbeiten wir täglich daran, das Leben von Boxern und anderen Hunden zu verbessern.'
            },
            contact: {
                email: 'info@boxerhof.de',
                phone: '+49 (0) 123 456 789',
                address: 'Boxerhof 1, 12345 Tierlieben'
            }
        };
        saveContent();
    }
    
    // Load gallery
    const storedGallery = localStorage.getItem(STORAGE_KEYS.gallery);
    if (storedGallery) {
        adminState.gallery = JSON.parse(storedGallery);
    } else {
        // Initialize with demo images
        adminState.gallery = [
            {
                id: 1,
                url: 'https://via.placeholder.com/400x300?text=Boxerhof+Bild+1',
                caption: 'Unser schöner Boxerhof',
                uploadDate: new Date().toISOString()
            },
            {
                id: 2,
                url: 'https://via.placeholder.com/400x300?text=Boxerhof+Bild+2',
                caption: 'Unsere Tiere beim Spielen',
                uploadDate: new Date().toISOString()
            }
        ];
        saveGallery();
    }
}

// Update dashboard statistics
function updateDashboard() {
    const animalsCount = adminState.animals.length;
    const availableCount = adminState.animals.filter(animal => animal.status === 'available').length;
    const imagesCount = adminState.gallery.length;
    
    document.getElementById('animalsCount').textContent = animalsCount;
    document.getElementById('availableCount').textContent = availableCount;
    document.getElementById('imagesCount').textContent = imagesCount;
    document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString('de-DE');
}

// Content management
function loadContentData() {
    // Hero section
    document.getElementById('heroTitle').value = adminState.content.hero.title || '';
    document.getElementById('heroSubtitle').value = adminState.content.hero.subtitle || '';
    document.getElementById('heroDescription').value = adminState.content.hero.description || '';
    
    // About section
    document.getElementById('aboutText1').value = adminState.content.about.text1 || '';
    document.getElementById('aboutText2').value = adminState.content.about.text2 || '';
    
    // Contact section
    document.getElementById('contactEmail').value = adminState.content.contact.email || '';
    document.getElementById('contactPhone').value = adminState.content.contact.phone || '';
    document.getElementById('contactAddress').value = adminState.content.contact.address || '';
}

function handleContentSave(e) {
    e.preventDefault();
    
    const form = e.target;
    const section = form.dataset.section;
    const formData = new FormData(form);
    
    if (!adminState.content[section]) {
        adminState.content[section] = {};
    }
    
    for (let [key, value] of formData.entries()) {
        adminState.content[section][key] = value;
    }
    
    saveContent();
    showMessage(`${section} Inhalte erfolgreich gespeichert!`, 'success');
    
    // Update main website if possible
    updateMainWebsite();
}

function saveContent() {
    localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(adminState.content));
}

// Animal management
function loadAnimals() {
    displayAnimals(adminState.animals);
}

function displayAnimals(animals) {
    const animalsList = document.getElementById('animalsList');
    
    if (animals.length === 0) {
        animalsList.innerHTML = '<div class="no-animals"><p>Keine Tiere gefunden.</p></div>';
        return;
    }
    
    animalsList.innerHTML = animals.map(animal => createAnimalCard(animal)).join('');
}

function createAnimalCard(animal) {
    const statusClass = `status-${animal.status}`;
    const statusText = {
        available: 'Vermittlungsbereit',
        adopted: 'Vermittelt',
        'not-ready': 'Nicht bereit'
    }[animal.status];
    
    const typeText = {
        dog: 'Hund',
        other: 'Andere'
    }[animal.type];
    
    const genderText = animal.gender === 'male' ? 'Männlich' : 'Weiblich';
    
    // Enhanced details
    const sizeText = {
        small: 'Klein',
        medium: 'Mittel',
        large: 'Groß'
    }[animal.size] || '';
    
    const energyText = {
        low: 'Ruhig',
        medium: 'Ausgeglichen',
        high: 'Sehr aktiv'
    }[animal.energyLevel] || '';
    
    const trainingText = {
        none: 'Nicht trainiert',
        basic: 'Grundkommandos',
        advanced: 'Gut trainiert'
    }[animal.trainingLevel] || '';
    
    // Compatibility indicators
    const goodWithItems = [];
    if (animal.goodWith?.dogs) goodWithItems.push('🐕 Hunde');
    if (animal.goodWith?.children) goodWithItems.push('👶 Kinder');
    
    const compatibilityText = goodWithItems.length > 0 ? goodWithItems.join(', ') : 'Keine Angaben';
    
    // Health status
    const healthItems = [];
    if (animal.vaccinated === 'yes') healthItems.push('💉 Geimpft');
    if (animal.neutered === 'yes') healthItems.push('🏥 Kastriert');
    
    const healthText = healthItems.length > 0 ? healthItems.join(', ') : '';
    
    // Arrival date formatting
    const arrivalText = animal.arrivalDate ? 
        `📅 Ankunft: ${new Date(animal.arrivalDate).toLocaleDateString('de-DE')}` : '';
    
    // Adoption fee
    const feeText = animal.adoptionFee ? `💰 Schutzgebühr: ${animal.adoptionFee}€` : '';
    
    return `
        <div class="animal-card enhanced" data-id="${animal.id}">
            <div class="animal-header">
                <div class="animal-info">
                    <h4>${animal.name}</h4>
                    <div class="animal-meta">
                        ${typeText} • ${animal.breed} • ${genderText} • ${animal.age}
                    </div>
                    ${sizeText || animal.weight ? 
                        `<div class="animal-size">${sizeText}${sizeText && animal.weight ? ' • ' : ''}${animal.weight || ''}</div>` 
                        : ''}
                </div>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            
            ${animal.color || animal.chipNumber ? `
                <div class="animal-details">
                    ${animal.color ? `<span class="detail-tag">🎨 ${animal.color}</span>` : ''}
                    ${animal.chipNumber ? `<span class="detail-tag">🔖 Chip: ${animal.chipNumber}</span>` : ''}
                </div>
            ` : ''}
            
            <div class="animal-description">
                ${animal.description}
            </div>
            
            ${energyText || trainingText ? `
                <div class="animal-characteristics">
                    ${energyText ? `<span class="char-tag energy">⚡ ${energyText}</span>` : ''}
                    ${trainingText ? `<span class="char-tag training">🎓 ${trainingText}</span>` : ''}
                </div>
            ` : ''}
            
            <div class="animal-compatibility">
                <strong>Verträglich mit:</strong> ${compatibilityText}
            </div>
            
            ${healthText ? `
                <div class="animal-health">
                    ${healthText}
                </div>
            ` : ''}
            
            ${animal.specialNeeds ? `
                <div class="animal-special-needs">
                    <strong>🏠 Besondere Bedürfnisse:</strong> ${animal.specialNeeds}
                </div>
            ` : ''}
            
            ${arrivalText || feeText ? `
                <div class="animal-adoption-info">
                    ${arrivalText ? `<span>${arrivalText}</span>` : ''}
                    ${feeText ? `<span>${feeText}</span>` : ''}
                </div>
            ` : ''}
            
            <div class="animal-actions">
                <button class="btn btn-primary btn-small" onclick="editAnimal(${animal.id})">
                    ✏️ Bearbeiten
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteAnimal(${animal.id})">
                    🗑️ Löschen
                </button>
            </div>
        </div>
    `;
}

function filterAnimals() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchTerm = document.getElementById('animalSearch').value.toLowerCase();
    
    let filteredAnimals = adminState.animals;
    
    if (statusFilter !== 'all') {
        filteredAnimals = filteredAnimals.filter(animal => animal.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
        filteredAnimals = filteredAnimals.filter(animal => animal.type === typeFilter);
    }
    
    if (searchTerm) {
        filteredAnimals = filteredAnimals.filter(animal => 
            animal.name.toLowerCase().includes(searchTerm) ||
            animal.breed.toLowerCase().includes(searchTerm) ||
            animal.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayAnimals(filteredAnimals);
}

function openAnimalModal(animalId = null) {
    const modal = document.getElementById('animalModal');
    const form = document.getElementById('animalForm');
    const title = document.getElementById('animalModalTitle');
    
    if (animalId) {
        const animal = adminState.animals.find(a => a.id === animalId);
        if (animal) {
            title.textContent = 'Hund bearbeiten';
            fillAnimalForm(animal);
        }
    } else {
        title.textContent = 'Hund hinzufügen';
        form.reset();
        document.getElementById('animalId').value = '';
    }
    
    modal.style.display = 'flex';
}

function fillAnimalForm(animal) {
    // Basic information
    document.getElementById('animalId').value = animal.id;
    document.getElementById('animalName').value = animal.name;
    document.getElementById('animalType').value = animal.type;
    document.getElementById('animalAge').value = animal.age;
    document.getElementById('animalGender').value = animal.gender;
    document.getElementById('animalBreed').value = animal.breed;
    document.getElementById('animalDescription').value = animal.description;
    document.getElementById('animalStatus').value = animal.status;
    document.getElementById('animalImage').value = animal.image || '';
    
    // Enhanced details
    document.getElementById('animalSize').value = animal.size || '';
    document.getElementById('animalWeight').value = animal.weight || '';
    document.getElementById('animalColor').value = animal.color || '';
    document.getElementById('animalChip').value = animal.chipNumber || '';
    
    // Health & care
    document.getElementById('animalVaccinated').value = animal.vaccinated || '';
    document.getElementById('animalNeutered').value = animal.neutered || '';
    document.getElementById('animalMedicalNotes').value = animal.medicalNotes || '';
    
    // Characteristics & needs
    const goodWithDogs = document.querySelector('input[name="goodWithDogs"]');
    const goodWithChildren = document.querySelector('input[name="goodWithChildren"]');
    
    if (goodWithDogs) goodWithDogs.checked = animal.goodWith?.dogs || false;
    if (goodWithChildren) goodWithChildren.checked = animal.goodWith?.children || false;
    
    document.getElementById('animalEnergy').value = animal.energyLevel || '';
    document.getElementById('animalTraining').value = animal.trainingLevel || '';
    document.getElementById('animalSpecialNeeds').value = animal.specialNeeds || '';
    
    // Dates & adoption
    document.getElementById('animalArrivalDate').value = animal.arrivalDate || '';
    document.getElementById('animalAdoptionFee').value = animal.adoptionFee || '';
}

function closeAnimalModal() {
    document.getElementById('animalModal').style.display = 'none';
}

function handleAnimalSave(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Collect checkbox values for compatibility
    const goodWithDogs = formData.get('goodWithDogs') === 'true';
    const goodWithCats = formData.get('goodWithCats') === 'true';
    const goodWithChildren = formData.get('goodWithChildren') === 'true';
    
    const animalData = {
        id: formData.get('id') || Date.now(),
        // Basic information
        name: formData.get('name'),
        type: formData.get('type'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        breed: formData.get('breed'),
        description: formData.get('description'),
        status: formData.get('status'),
        image: formData.get('image'),
        
        // Enhanced details
        size: formData.get('size'),
        weight: formData.get('weight'),
        color: formData.get('color'),
        chipNumber: formData.get('chipNumber'),
        
        // Health & care
        vaccinated: formData.get('vaccinated'),
        neutered: formData.get('neutered'),
        medicalNotes: formData.get('medicalNotes'),
        
        // Characteristics & needs
        goodWith: {
            dogs: goodWithDogs,
            children: goodWithChildren
        },
        energyLevel: formData.get('energyLevel'),
        trainingLevel: formData.get('trainingLevel'),
        specialNeeds: formData.get('specialNeeds'),
        
        // Dates & adoption
        arrivalDate: formData.get('arrivalDate'),
        adoptionFee: parseFloat(formData.get('adoptionFee')) || 0,
        
        // Metadata
        createdAt: formData.get('id') ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const existingIndex = adminState.animals.findIndex(a => a.id == animalData.id);
    
    if (existingIndex !== -1) {
        // Keep original creation date when updating
        animalData.createdAt = adminState.animals[existingIndex].createdAt;
        adminState.animals[existingIndex] = animalData;
        showMessage('Tier erfolgreich aktualisiert!', 'success');
    } else {
        animalData.id = Date.now();
        animalData.createdAt = new Date().toISOString();
        adminState.animals.push(animalData);
        showMessage('Tier erfolgreich hinzugefügt!', 'success');
    }
    
    saveAnimals();
    loadAnimals();
    closeAnimalModal();
    updateDashboard();
}

function editAnimal(animalId) {
    openAnimalModal(animalId);
}

function deleteAnimal(animalId) {
    if (confirm('Sind Sie sicher, dass Sie dieses Tier löschen möchten?')) {
        adminState.animals = adminState.animals.filter(a => a.id !== animalId);
        saveAnimals();
        loadAnimals();
        updateDashboard();
        showMessage('Tier erfolgreich gelöscht!', 'success');
    }
}

function saveAnimals() {
    localStorage.setItem(STORAGE_KEYS.animals, JSON.stringify(adminState.animals));
}

// Gallery management
function loadGallery() {
    displayGallery();
    updateGalleryCount();
}

function displayGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (adminState.gallery.length === 0) {
        galleryGrid.innerHTML = '<div class="no-images"><p>Keine Bilder in der Galerie.</p></div>';
        return;
    }
    
    galleryGrid.innerHTML = adminState.gallery.map(image => createGalleryItem(image)).join('');
}

function createGalleryItem(image) {
    return `
        <div class="gallery-item" data-id="${image.id}">
            <img src="${image.url}" alt="${image.caption}" onerror="this.src='https://via.placeholder.com/200x200?text=Bild+nicht+gefunden'">
            <div class="gallery-overlay">
                <div class="gallery-actions">
                    <button class="btn btn-danger btn-small" onclick="deleteImage(${image.id})">
                        Löschen
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateGalleryCount() {
    document.getElementById('galleryCount').textContent = `${adminState.gallery.length} Bilder`;
}

function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    uploadFiles(files);
}

function handleDragOver(e) {
    e.preventDefault();
    e.target.classList.add('dragover');
}

function handleDragLeave(e) {
    e.target.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
}

function uploadFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        showMessage('Bitte wählen Sie Bilddateien aus!', 'error');
        return;
    }
    
    imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = {
                id: Date.now() + Math.random(),
                url: e.target.result,
                caption: file.name,
                uploadDate: new Date().toISOString()
            };
            
            adminState.gallery.push(imageData);
            saveGallery();
            displayGallery();
            updateGalleryCount();
            updateDashboard();
        };
        reader.readAsDataURL(file);
    });
    
    showMessage(`${imageFiles.length} Bild(er) erfolgreich hochgeladen!`, 'success');
}

function deleteImage(imageId) {
    if (confirm('Sind Sie sicher, dass Sie dieses Bild löschen möchten?')) {
        adminState.gallery = adminState.gallery.filter(img => img.id !== imageId);
        saveGallery();
        displayGallery();
        updateGalleryCount();
        updateDashboard();
        showMessage('Bild erfolgreich gelöscht!', 'success');
    }
}

function saveGallery() {
    localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(adminState.gallery));
}

// Utility functions
function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Add to page
    const container = document.querySelector('.admin-container') || document.body;
    container.insertBefore(messageEl, container.firstChild);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 3000);
}

function viewWebsite() {
    window.open('index.html', '_blank');
}

function updateMainWebsite() {
    // This would update the main website content in a real implementation
    // For demo purposes, we'll just show a message
    showMessage('Hauptwebsite würde aktualisiert werden (Demo-Modus)', 'info');
}

// Export functions for global access
window.switchTab = switchTab;
window.editAnimal = editAnimal;
window.deleteAnimal = deleteAnimal;
window.closeAnimalModal = closeAnimalModal;
window.deleteImage = deleteImage;
window.viewWebsite = viewWebsite;

// Guestbook Management
const GuestbookAdmin = {
    entries: [],
    currentFilter: 'all',

    init: function() {
        this.loadEntries();
        this.setupEventListeners();
        this.updateStats();
        this.renderEntries();
    },

    setupEventListeners: function() {
        // Filter buttons
        document.querySelectorAll('#guestbook .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#guestbook .filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.status;
                this.renderEntries();
            });
        });

        // Search
        const searchInput = document.getElementById('guestbookSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.renderEntries();
            });
        }
    },

    loadEntries: function() {
        const stored = localStorage.getItem('boxerhof_guestbook_entries');
        this.entries = stored ? JSON.parse(stored) : [];
    },

    saveEntries: function() {
        localStorage.setItem('boxerhof_guestbook_entries', JSON.stringify(this.entries));
    },

    updateStats: function() {
        const pending = this.entries.filter(e => e.status === 'pending').length;
        const approved = this.entries.filter(e => e.status === 'approved').length;
        const rejected = this.entries.filter(e => e.status === 'rejected').length;

        document.getElementById('pendingEntries').textContent = pending;
        document.getElementById('approvedEntries').textContent = approved;
        document.getElementById('rejectedEntries').textContent = rejected;
    },

    renderEntries: function() {
        const container = document.getElementById('guestbookEntries');
        if (!container) return;

        let filteredEntries = this.entries;
        
        // Apply status filter
        if (this.currentFilter !== 'all') {
            filteredEntries = filteredEntries.filter(entry => entry.status === this.currentFilter);
        }

        // Apply search filter
        const searchTerm = document.getElementById('guestbookSearch')?.value.toLowerCase();
        if (searchTerm) {
            filteredEntries = filteredEntries.filter(entry => 
                entry.name.toLowerCase().includes(searchTerm) ||
                entry.message.toLowerCase().includes(searchTerm) ||
                (entry.email && entry.email.toLowerCase().includes(searchTerm))
            );
        }

        // Sort by timestamp (newest first)
        filteredEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (filteredEntries.length === 0) {
            container.innerHTML = '<p class="no-entries">Keine Einträge gefunden.</p>';
            return;
        }

        container.innerHTML = filteredEntries.map(entry => this.renderEntryCard(entry)).join('');
    },

    renderEntryCard: function(entry) {
        return `
            <div class="guestbook-entry-admin ${entry.status}">
                <div class="entry-header">
                    <div class="entry-author">${entry.name}</div>
                    <div class="entry-status ${entry.status}">${this.getStatusText(entry.status)}</div>
                </div>
                <div class="entry-meta">
                    <span>📅 ${new Date(entry.timestamp).toLocaleDateString('de-DE')}</span>
                    ${entry.email ? `<span>📧 ${entry.email}</span>` : ''}
                </div>
                <div class="entry-message">${entry.message}</div>
                ${entry.image ? `<img src="${entry.image}" alt="Bild von ${entry.name}" class="entry-image">` : ''}
                <div class="entry-actions">
                    ${entry.status === 'pending' ? `
                        <button class="entry-action-btn approve" onclick="GuestbookAdmin.approveEntry(${entry.id})">✅ Freischalten</button>
                        <button class="entry-action-btn reject" onclick="GuestbookAdmin.rejectEntry(${entry.id})">❌ Ablehnen</button>
                    ` : ''}
                    ${entry.status === 'approved' ? `
                        <button class="entry-action-btn reject" onclick="GuestbookAdmin.rejectEntry(${entry.id})">❌ Verbergen</button>
                    ` : ''}
                    ${entry.status === 'rejected' ? `
                        <button class="entry-action-btn approve" onclick="GuestbookAdmin.approveEntry(${entry.id})">✅ Freischalten</button>
                    ` : ''}
                    <button class="entry-action-btn delete" onclick="GuestbookAdmin.deleteEntry(${entry.id})">🗑️ Löschen</button>
                </div>
            </div>
        `;
    },

    getStatusText: function(status) {
        const statusTexts = {
            pending: 'Warteschlange',
            approved: 'Veröffentlicht',
            rejected: 'Abgelehnt'
        };
        return statusTexts[status] || status;
    },

    approveEntry: function(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (entry) {
            entry.status = 'approved';
            this.saveEntries();
            this.updateStats();
            this.renderEntries();
            showMessage('Eintrag wurde freigeschaltet', 'success');
        }
    },

    rejectEntry: function(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (entry) {
            entry.status = 'rejected';
            this.saveEntries();
            this.updateStats();
            this.renderEntries();
            showMessage('Eintrag wurde abgelehnt', 'info');
        }
    },

    deleteEntry: function(entryId) {
        if (confirm('Sind Sie sicher, dass Sie diesen Eintrag dauerhaft löschen möchten?')) {
            this.entries = this.entries.filter(e => e.id !== entryId);
            this.saveEntries();
            this.updateStats();
            this.renderEntries();
            showMessage('Eintrag wurde gelöscht', 'success');
        }
    }
};

// Events Management
const EventsAdmin = {
    events: [],
    currentFilter: 'all',

    init: function() {
        this.loadEvents();
        this.setupEventListeners();
        this.updateStats();
        this.renderEvents();
    },

    setupEventListeners: function() {
        // Add event button
        const addEventBtn = document.getElementById('addEventBtn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => this.openEventModal());
        }

        // Filter buttons
        document.querySelectorAll('#events .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#events .filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderEvents();
            });
        });

        // Search
        const searchInput = document.getElementById('eventsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.renderEvents();
            });
        }

        // Event form
        const eventForm = document.getElementById('eventForm');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => this.handleEventSave(e));
        }

        // Modal close
        const modal = document.getElementById('eventModal');
        if (modal) {
            modal.querySelector('.close').addEventListener('click', () => this.closeEventModal());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeEventModal();
            });
        }
    },

    loadEvents: function() {
        const stored = localStorage.getItem('boxerhof_events');
        this.events = stored ? JSON.parse(stored) : [];
    },

    saveEvents: function() {
        localStorage.setItem('boxerhof_events', JSON.stringify(this.events));
    },

    updateStats: function() {
        const now = new Date();
        const upcoming = this.events.filter(e => e.status === 'published' && new Date(e.date) >= now).length;
        const past = this.events.filter(e => e.status === 'published' && new Date(e.date) < now).length;

        document.getElementById('upcomingEventsCount').textContent = upcoming;
        document.getElementById('pastEventsCount').textContent = past;
    },

    renderEvents: function() {
        const container = document.getElementById('eventsList');
        if (!container) return;

        let filteredEvents = this.events;
        
        // Apply filter
        if (this.currentFilter !== 'all') {
            const now = new Date();
            switch (this.currentFilter) {
                case 'upcoming':
                    filteredEvents = filteredEvents.filter(e => e.status === 'published' && new Date(e.date) >= now);
                    break;
                case 'past':
                    filteredEvents = filteredEvents.filter(e => e.status === 'published' && new Date(e.date) < now);
                    break;
                case 'draft':
                    filteredEvents = filteredEvents.filter(e => e.status === 'draft');
                    break;
            }
        }

        // Apply search filter
        const searchTerm = document.getElementById('eventsSearch')?.value.toLowerCase();
        if (searchTerm) {
            filteredEvents = filteredEvents.filter(event => 
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm) ||
                (event.location && event.location.toLowerCase().includes(searchTerm))
            );
        }

        // Sort by date
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filteredEvents.length === 0) {
            container.innerHTML = '<p class="no-events">Keine Veranstaltungen gefunden.</p>';
            return;
        }

        container.innerHTML = filteredEvents.map(event => this.renderEventCard(event)).join('');
    },

    renderEventCard: function(event) {
        const isUpcoming = new Date(event.date) >= new Date();
        
        return `
            <div class="event-admin-card">
                <div class="event-admin-header">
                    <div>
                        <div class="event-admin-title">${event.title}</div>
                        <div class="event-admin-status ${event.status}">${this.getStatusText(event.status)}</div>
                    </div>
                </div>
                <div class="event-admin-meta">
                    <div class="event-meta-item">📅 ${this.formatDate(event.date, event.time)}</div>
                    ${event.location ? `<div class="event-meta-item">📍 ${event.location}</div>` : ''}
                    ${event.capacity ? `<div class="event-meta-item">👥 ${event.capacity} Plätze</div>` : ''}
                    ${event.price ? `<div class="event-meta-item">💰 ${event.price.toFixed(2)} €</div>` : ''}
                </div>
                <div class="event-admin-description">${event.description}</div>
                <div class="event-admin-actions">
                    <button class="event-action-btn edit" onclick="EventsAdmin.editEvent(${event.id})">✏️ Bearbeiten</button>
                    <button class="event-action-btn duplicate" onclick="EventsAdmin.duplicateEvent(${event.id})">📋 Duplizieren</button>
                    <button class="event-action-btn delete" onclick="EventsAdmin.deleteEvent(${event.id})">🗑️ Löschen</button>
                </div>
            </div>
        `;
    },

    getStatusText: function(status) {
        const statusTexts = {
            published: 'Veröffentlicht',
            draft: 'Entwurf',
            cancelled: 'Abgesagt'
        };
        return statusTexts[status] || status;
    },

    formatDate: function(date, time) {
        const eventDate = new Date(date);
        const formattedDate = eventDate.toLocaleDateString('de-DE');
        return time ? `${formattedDate}, ${time}` : formattedDate;
    },

    openEventModal: function(eventId = null) {
        const modal = document.getElementById('eventModal');
        const form = document.getElementById('eventForm');
        const title = document.getElementById('eventModalTitle');
        
        if (eventId) {
            const event = this.events.find(e => e.id === eventId);
            if (event) {
                title.textContent = 'Veranstaltung bearbeiten';
                this.fillEventForm(event);
            }
        } else {
            title.textContent = 'Neue Veranstaltung erstellen';
            form.reset();
            document.getElementById('eventId').value = '';
        }
        
        modal.style.display = 'block';
    },

    closeEventModal: function() {
        document.getElementById('eventModal').style.display = 'none';
    },

    fillEventForm: function(event) {
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time || '';
        document.getElementById('eventEndDate').value = event.endDate || '';
        document.getElementById('eventEndTime').value = event.endTime || '';
        document.getElementById('eventLocation').value = event.location || '';
        document.getElementById('eventCapacity').value = event.capacity || '';
        document.getElementById('eventPrice').value = event.price || '';
        document.getElementById('eventRegistrationRequired').checked = event.registrationRequired || false;
        document.getElementById('eventRegistrationDeadline').value = event.registrationDeadline || '';
        document.getElementById('eventContactInfo').value = event.contactInfo || '';
        document.getElementById('eventStatus').value = event.status;
        document.getElementById('eventImage').value = event.image || '';
    },

    handleEventSave: function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const eventId = formData.get('id');
        
        const eventData = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            endDate: formData.get('endDate'),
            endTime: formData.get('endTime'),
            location: formData.get('location'),
            capacity: formData.get('capacity') ? parseInt(formData.get('capacity')) : null,
            price: formData.get('price') ? parseFloat(formData.get('price')) : 0,
            registrationRequired: formData.get('registrationRequired') === 'on',
            registrationDeadline: formData.get('registrationDeadline'),
            contactInfo: formData.get('contactInfo'),
            status: formData.get('status'),
            image: formData.get('image')
        };

        if (eventId) {
            // Update existing event
            const eventIndex = this.events.findIndex(e => e.id == eventId);
            this.events[eventIndex] = { ...this.events[eventIndex], ...eventData };
            showMessage('Veranstaltung wurde aktualisiert', 'success');
        } else {
            // Create new event
            eventData.id = Date.now();
            this.events.push(eventData);
            showMessage('Neue Veranstaltung wurde erstellt', 'success');
        }

        this.saveEvents();
        this.updateStats();
        this.renderEvents();
        this.closeEventModal();
    },

    editEvent: function(eventId) {
        this.openEventModal(eventId);
    },

    duplicateEvent: function(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            const duplicatedEvent = {
                ...event,
                id: Date.now(),
                title: event.title + ' (Kopie)',
                status: 'draft'
            };
            this.events.push(duplicatedEvent);
            this.saveEvents();
            this.updateStats();
            this.renderEvents();
            showMessage('Veranstaltung wurde dupliziert', 'success');
        }
    },

    deleteEvent: function(eventId) {
        if (confirm('Sind Sie sicher, dass Sie diese Veranstaltung löschen möchten?')) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.saveEvents();
            this.updateStats();
            this.renderEvents();
            showMessage('Veranstaltung wurde gelöscht', 'success');
        }
    }
};

// Update the switchTab function to handle new tabs
const originalSwitchTab = switchTab;
switchTab = function(tabName) {
    originalSwitchTab(tabName);
    
    // Initialize new modules when their tabs are opened
    if (tabName === 'guestbook' && !GuestbookAdmin.initialized) {
        GuestbookAdmin.init();
        GuestbookAdmin.initialized = true;
    } else if (tabName === 'events' && !EventsAdmin.initialized) {
        EventsAdmin.init();
        EventsAdmin.initialized = true;
    }
};

// Update global exports
window.GuestbookAdmin = GuestbookAdmin;
window.EventsAdmin = EventsAdmin;
window.closeEventModal = EventsAdmin.closeEventModal.bind(EventsAdmin);