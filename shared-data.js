// Shared Data Management System for Boxerhof
// This file provides a centralized data management system for both the admin panel and main website

// Cache management for version control
const VERSION_KEY = 'boxerhof_version';
const CURRENT_VERSION = new Date().getTime(); // Timestamp-based versioning

// Check if cache needs to be invalidated
function checkCacheVersion() {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (!storedVersion || parseInt(storedVersion) < CURRENT_VERSION - (24 * 60 * 60 * 1000)) {
        // If no version stored or version is older than 24 hours, clear cache
        clearOldCache();
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
        return false;
    }
    return true;
}

// Clear old cached data
function clearOldCache() {
    const keysToKeep = [VERSION_KEY, 'admin_logged_in'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    });
    
    console.log('🧹 Cache cleared for new version');
}

// Shared gallery data - the complete 25 image collection
const SHARED_GALLERY_DATA = [
    {
        id: 1,
        title: 'Hauptgebäude des Boxerhofs',
        description: 'Unser gemütliches Haupthaus mit Büro und Aufenthaltsräumen für Besucher',
        category: 'buildings',
        url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTY3ZTIyO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2QzNTQwMDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjxwYXR0ZXJuIGlkPSJwYXR0ZXJuMSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZDEpIi8+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjcGF0dGVybjEpIi8+PHRleHQgeD0iMjAwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfj6E8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5CaWxkIDE8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSI+SGF1cHRnZWLDpHVkZSBkZXMgQm94ZXJob2ZzPC90ZXh0Pjwvc3ZnPg==',
        uploadDate: new Date().toISOString(),
        isPlaceholder: true
    },
    {
        id: 2,
        title: 'Eingangsbereich',
        description: 'Der freundliche Empfangsbereich, wo Besucher herzlich willkommen geheißen werden',
        category: 'buildings',
        url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTY3ZTIyO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2QzNTQwMDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjxwYXR0ZXJuIGlkPSJwYXR0ZXJuMiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZDIpIi8+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjcGF0dGVybjIpIi8+PHRleHQgeD0iMjAwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfj6E8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5CaWxkIDI8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSI+RWluZ2FuZ3NiZXJlaWNoPC90ZXh0Pjwvc3ZnPg==',
        uploadDate: new Date().toISOString(),
        isPlaceholder: true
    },
    {
        id: 3,
        title: 'Außenanlagen Übersicht',
        description: 'Luftaufnahme unserer weitläufigen und sicheren Außenanlagen',
        category: 'buildings',
        url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQzIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTY3ZTIyO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2QzNTQwMDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjxwYXR0ZXJuIGlkPSJwYXR0ZXJuMyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZDMpIi8+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjcGF0dGVybjMpIi8+PHRleHQgeD0iMjAwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfj6E8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5CaWxkIDM8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSI+QXXDn2VuYW5sYWdlbiDDnGJlcnNpY2h0PC90ZXh0Pjwvc3ZnPg==',
        uploadDate: new Date().toISOString(),
        isPlaceholder: true
    },
    {
        id: 4,
        title: 'Glückliche Boxerhunde',
        description: 'Unsere Boxer beim entspannten Spielen im großen Auslaufgehege',
        category: 'animals',
        url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQ0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjM5YzEyO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U2N2UyMjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjxwYXR0ZXJuIGlkPSJwYXR0ZXJuNCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZDQpIi8+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjcGF0dGVybjQpIi8+PHRleHQgeD0iMjAwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfkJU8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5CaWxkIDQ8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSI+R2zDvGNrbGljaGUgQm94ZXJodW5kZTwvdGV4dD48L3N2Zz4=',
        uploadDate: new Date().toISOString(),
        isPlaceholder: true
    },
    {
        id: 5,
        title: 'Hundegruppe beim Spaziergang',
        description: 'Gemeinsamer Spaziergang unserer sozialisierten Hundegruppe',
        category: 'animals',
        url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQ1IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjM5YzEyO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U2N2UyMjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjxwYXR0ZXJuIGlkPSJwYXR0ZXJuNSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZDUpIi8+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjcGF0dGVybjUpIi8+PHRleHQgeD0iMjAwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfkJU8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5CaWxkIDU8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSI+SHVuZGVncnVwcGUgYmVpbSBTcGF6aWVyZ2FuZzwvdGV4dD48L3N2Zz4=',
        uploadDate: new Date().toISOString(),
        isPlaceholder: true
    }
    // I'll add more images but keep the file manageable for now
];

// Generate the remaining 20 images dynamically
for (let i = 6; i <= 25; i++) {
    const categories = ['buildings', 'animals', 'care', 'events', 'nature'];
    const categoryIcons = { buildings: '🏡', animals: '🐕', care: '🏥', events: '🎉', nature: '🌳' };
    const categoryColors = {
        buildings: ['#e67e22', '#d35400'],
        animals: ['#f39c12', '#e67e22'],
        care: ['#27ae60', '#2ecc71'],
        events: ['#3498db', '#2980b9'],
        nature: ['#27ae60', '#16a085']
    };
    
    const categoryKey = categories[Math.floor((i-1) / 5) % categories.length];
    const colors = categoryColors[categoryKey];
    const icon = categoryIcons[categoryKey];
    
    const titles = {
        buildings: [`Hundeunterkünfte`, `Futterküche`, `Sicherheitseinrichtungen`],
        animals: [`Ruhige Momente`, `Welpenstube`, `Senior-Hunde Bereich`, `Trainingseinheit`, `Adoption Moment`, `Hundetraining Workshop`],
        care: [`Medizinische Betreuung`, `Fellpflege`, `Erste Hilfe Station`, `Quarantänebereich`, `Tierarzt Visite`],
        events: [`Tag der offenen Tür`, `Hoffest`, `Freiwillige bei der Arbeit`, `Spendenübergabe`],
        nature: [`Naturlandschaft`, `Sonnenuntergang am Hof`]
    };
    
    const descriptions = {
        buildings: [`Komfortable und hygienische Innenräume für unsere Pensionsgäste`, `Unsere saubere Küche für die Zubereitung von gesundem Hundefutter`, `Moderne Umzäunung und Sicherheitssysteme zum Schutz aller Tiere`],
        animals: [`Hunde beim Entspannen in der Abendsonne auf der Hofterrasse`, `Speziell eingerichteter Bereich für junge Hunde und Welpen`, `Ruhiger Bereich mit besonderen Annehmlichkeiten für ältere Hunde`, `Grundausbildung und Sozialisation mit erfahrenen Hundetrainern`, `Der emotionale Moment, wenn ein Hund sein neues Zuhause findet`, `Besucher lernen von unseren Experten richtige Hundeerziehung`],
        care: [`Professionelle tierärztliche Untersuchung in unserem Behandlungsraum`, `Liebevolle Körperpflege - ein wichtiger Teil unserer täglichen Betreuung`, `Gut ausgestatteter Notfallbereich für schnelle medizinische Versorgung`, `Separate, sichere Bereiche für neue oder kranke Tiere`, `Regelmäßige Gesundheitschecks durch unseren erfahrenen Tierarzt`],
        events: [`Besucher lernen unseren Hof und die Hunde bei einem besonderen Event kennen`, `Fröhliche Gemeinschaftsfeier mit Unterstützern und Hundefreunden`, `Unser engagiertes Team von Helfern beim täglichen Einsatz für die Tiere`, `Dankbare Momente mit großzügigen Unterstützern unserer Arbeit`],
        nature: [`Die wunderschöne Umgebung von Bad Oeynhausen um unseren Hof`, `Friedliche Abendstimmung, wenn der Tag auf dem Boxerhof zu Ende geht`]
    };
    
    const categoryTitles = titles[categoryKey];
    const categoryDescriptions = descriptions[categoryKey];
    const titleIndex = (i - 6) % categoryTitles.length;
    
    const title = categoryTitles[titleIndex] || `${categoryKey} Bild ${i}`;
    const description = categoryDescriptions[titleIndex] || `Beschreibung für ${categoryKey} Bild ${i}`;
    
    // Create SVG placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" /><stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" /></linearGradient><pattern id="pattern${i}" patternUnits="userSpaceOnUse" width="50" height="50"><circle cx="25" cy="25" r="20" fill="white" opacity="0.1"/></pattern></defs><rect width="400" height="300" fill="url(#grad${i})"/><rect width="400" height="300" fill="url(#pattern${i})"/><text x="200" y="120" font-family="Arial" font-size="60" text-anchor="middle" fill="white">${icon}</text><text x="200" y="160" font-family="Arial" font-size="14" text-anchor="middle" fill="white" font-weight="bold">Bild ${i}</text><text x="200" y="200" font-family="Arial" font-size="12" text-anchor="middle" fill="white" opacity="0.9">${title}</text></svg>`;
    
    SHARED_GALLERY_DATA.push({
        id: i,
        title: title,
        description: description,
        category: categoryKey,
        url: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg))),
        uploadDate: new Date().toISOString(),
        isPlaceholder: true
    });
}

// Shared animals data
const SHARED_ANIMALS_DATA = [
    {
        id: 1,
        name: 'Max',
        type: 'dog',
        age: '3 Jahre',
        gender: 'male',
        breed: 'Boxer',
        description: 'Max ist ein freundlicher und verspielter Boxer, der nach einem liebevollen Zuhause sucht. Er ist gut sozialisiert und liebt es, mit anderen Hunden zu spielen.',
        status: 'available',
        image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRNYXgiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMzljMTI7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTY3ZTIyO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dyYWRNYXgpIi8+PHRleHQgeD0iMjAwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfkJU8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5NYXg8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSI+MiBKYWhyZSBhbHRlciBCb3hlcjwvdGV4dD48L3N2Zz4=',
        size: 'large',
        weight: '30 kg',
        color: 'Braun-weiß',
        vaccinated: 'yes',
        neutered: 'yes',
        goodWithDogs: true,
        goodWithChildren: true,
        energyLevel: 'medium',
        trainingLevel: 'basic',
        arrivalDate: '2024-07-15',
        adoptionFee: 250
    },
    {
        id: 2,
        name: 'Luna',
        type: 'dog',
        age: '5 Jahre',
        gender: 'female',
        breed: 'Mischling',
        description: 'Luna ist eine ruhige und sanfte Hündin, die nach einem entspannten Zuhause sucht. Sie ist perfekt für Familien mit Kindern.',
        status: 'available',
        image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMzAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRMdW5hIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOWI1OWI2O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhlNDRhZDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNncmFkTHVuYSkiLz48dGV4dCB4PSIyMDAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+8J+QlTwvdGV4dD48dGV4dCB4PSIyMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC13ZWlnaHQ9ImJvbGQiPkx1bmE8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOSI+NSBKYWhyZSBhbHRlIE1pc2NobGluZ3NkYW1lPC90ZXh0Pjwvc3ZnPg==',
        size: 'medium',
        weight: '22 kg',
        color: 'Schwarz-braun',
        vaccinated: 'yes',
        neutered: 'yes',
        goodWithDogs: true,
        goodWithChildren: true,
        energyLevel: 'low',
        trainingLevel: 'advanced',
        arrivalDate: '2024-06-20',
        adoptionFee: 200
    }
];

// Shared content data
const SHARED_CONTENT_DATA = {
    hero: {
        title: 'Willkommen auf dem Boxerhof',
        subtitle: 'Ein liebevolles Zuhause für Hunde in Not',
        description: 'In Bad Oeynhausen bieten wir Hunden aus schwierigen Verhältnissen ein sicheres Zuhause auf Zeit. Mit viel Liebe und Hingabe päppeln wir sie wieder auf und finden für jeden das perfekte neue Zuhause.'
    },
    about: {
        text1: 'Der Boxerhof in Bad Oeynhausen ist ein Refugium für Hunde, die ein neues Zuhause suchen. Wir bieten nicht nur temporäre Unterbringung, sondern auch Pension für Hunde, deren Besitzer verreisen.',
        text2: 'Unser erfahrenes Team sorgt dafür, dass jeder Hund die individuelle Betreuung erhält, die er braucht. Von medizinischer Versorgung bis hin zur Sozialisation - wir bereiten unsere Schützlinge optimal auf ihr neues Leben vor.'
    },
    contact: {
        email: 'info@boxerhof-badoeynhausen.de',
        phone: '+49 (0) 5731 923 4567',
        address: 'Boxerhof 1, 32547 Bad Oeynhausen'
    }
};

// Data Management Functions
class SharedDataManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Check cache version on initialization
        checkCacheVersion();
        
        // Set up version tracking for updates
        this.setupVersionTracking();
    }
    
    setupVersionTracking() {
        // Add version parameter to stylesheets and scripts to prevent caching
        const version = Date.now();
        this.addVersionToAssets(version);
    }
    
    addVersionToAssets(version) {
        // Add version parameter to prevent caching issues
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        const scripts = document.querySelectorAll('script[src]');
        
        links.forEach(link => {
            if (link.href && !link.href.includes('?v=')) {
                link.href += `?v=${version}`;
            }
        });
        
        scripts.forEach(script => {
            if (script.src && !script.src.includes('?v=') && !script.src.includes('googleapis')) {
                script.src += `?v=${version}`;
            }
        });
    }
    
    // Gallery Management
    getGalleryData() {
        const stored = localStorage.getItem('boxerhof_gallery_synced');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Return the complete 25-image gallery
        this.setGalleryData(SHARED_GALLERY_DATA);
        return SHARED_GALLERY_DATA;
    }
    
    setGalleryData(data) {
        localStorage.setItem('boxerhof_gallery_synced', JSON.stringify(data));
        this.notifyDataChange('gallery');
    }
    
    // Animals Management
    getAnimalsData() {
        const stored = localStorage.getItem('boxerhof_animals_synced');
        if (stored) {
            return JSON.parse(stored);
        }
        
        this.setAnimalsData(SHARED_ANIMALS_DATA);
        return SHARED_ANIMALS_DATA;
    }
    
    setAnimalsData(data) {
        localStorage.setItem('boxerhof_animals_synced', JSON.stringify(data));
        this.notifyDataChange('animals');
    }
    
    // Content Management  
    getContentData() {
        const stored = localStorage.getItem('boxerhof_content_synced');
        if (stored) {
            return JSON.parse(stored);
        }
        
        this.setContentData(SHARED_CONTENT_DATA);
        return SHARED_CONTENT_DATA;
    }
    
    setContentData(data) {
        localStorage.setItem('boxerhof_content_synced', JSON.stringify(data));
        this.notifyDataChange('content');
    }
    
    // Notification system for data changes
    notifyDataChange(dataType) {
        // Dispatch custom event to notify other parts of the application
        const event = new CustomEvent('boxerhofDataChanged', {
            detail: { dataType, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
        
        // Update version to force cache refresh
        localStorage.setItem(VERSION_KEY, Date.now().toString());
    }
    
    // Force refresh of all cached data
    forceCacheRefresh() {
        clearOldCache();
        location.reload();
    }
    
    // Get data statistics for dashboard
    getDataStats() {
        const gallery = this.getGalleryData();
        const animals = this.getAnimalsData();
        
        return {
            totalImages: gallery.length,
            totalAnimals: animals.length,
            availableAnimals: animals.filter(a => a.status === 'available').length,
            adoptedAnimals: animals.filter(a => a.status === 'adopted').length,
            lastUpdate: localStorage.getItem(VERSION_KEY) || Date.now()
        };
    }
}

// Initialize shared data manager
if (typeof window !== 'undefined') {
    window.SharedDataManager = SharedDataManager;
    window.sharedDataManager = new SharedDataManager();
    
    console.log('🔄 Shared Data Management System initialized');
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SharedDataManager,
        SHARED_GALLERY_DATA,
        SHARED_ANIMALS_DATA,
        SHARED_CONTENT_DATA,
        checkCacheVersion,
        clearOldCache
    };
}