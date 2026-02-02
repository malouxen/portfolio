/**
 * Malous Portfolio - Gesamt-Logik
 * 1. Mehrsprachigkeit (i18n)
 * 2. Scroll-Position Memory
 * 3. Intelligenter Home-Button
 */

let translations = {};

// --- 1. SPRACH-LOGIK ---

async function loadLanguage(lang) {
    const paths = [
        `/13_lang/${lang}.json`,
        `13_lang/${lang}.json`,
        `../13_lang/${lang}.json`
    ];

    let success = false;
    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                translations = await response.json();
                success = true;
                break;
            }
        } catch (error) { continue; }
    }

    if (success) {
        updateUI(lang);
    }
}

function updateUI(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.innerHTML = translations[key];
        }
    });
    localStorage.setItem('malou_lang', lang);
    document.documentElement.lang = lang;
}

// --- 2. INITIALISIERUNG BEIM LADEN ---

document.addEventListener('DOMContentLoaded', () => {
    
    // A) Sprache laden
    const savedLang = localStorage.getItem('malou_lang') || 'de';
    loadLanguage(savedLang);

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const chosenLang = btn.getAttribute('data-lang');
            loadLanguage(chosenLang);
        });
    });

    // B) Scroll-Position & Home-Button Logik
    const isIndex = window.location.pathname.endsWith('index.html') || 
                   window.location.pathname === '/' || 
                   window.location.pathname.endsWith('Portfolio/'); // Je nach Server-Struktur

    if (isIndex) {
        // --- AUF DER STARTSEITE ---
        
        // 1. Position wiederherstellen, falls gespeichert
        const savedScrollPos = sessionStorage.getItem('scrollPos');
        if (savedScrollPos) {
            // Ein kurzer Timeout ist nötig, damit das Grid fertig gerendert ist
            setTimeout(() => {
                window.scrollTo({
                    top: parseInt(savedScrollPos),
                    behavior: 'instant'
                });
                // Nach dem Sprung löschen, damit es beim Refresh wieder oben startet
                sessionStorage.removeItem('scrollPos');
            }, 100);
        }

        // 2. Position speichern, wenn ein Projekt angeklickt wird
        const projectLinks = document.querySelectorAll('.project-grid a');
        projectLinks.forEach(link => {
            link.addEventListener('click', () => {
                sessionStorage.setItem('scrollPos', window.scrollY);
            });
        });

    } else {
        // --- AUF EINER UNTERSEITE ---

        // 3. "MALOU GUT" Button als Zurück-Button konfigurieren
        const homeBtn = document.querySelector('.project a');
        if (homeBtn) {
            homeBtn.addEventListener('click', (e) => {
                // Prüfen, ob der Nutzer von der eigenen Seite kam
                if (document.referrer.includes(window.location.hostname)) {
                    e.preventDefault(); // Standard-Link-Sprung verhindern
                    window.history.back(); // Browser-Zurück (behält Scroll-Position nativ bei)
                }
                // Wenn er direkt auf die Unterseite eingestiegen ist, 
                // wird das e.preventDefault() ignoriert und der Link führt normal zur index.html
            });
        }
    }
});