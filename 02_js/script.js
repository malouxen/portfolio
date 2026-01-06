/**
 * Malous Portfolio - Mehrsprachigkeits-Logik (i18n)
 */

// Globaler Speicher für die geladenen Texte
let translations = {};

/**
 * Lädt die JSON-Datei basierend auf der gewählten Sprache.
 * Die Funktion ist so aufgebaut, dass sie den Ordner '13_lang' 
 * findet, egal ob man auf der Startseite oder in einem Unterordner ist.
 */
async function loadLanguage(lang) {
    // Wir definieren verschiedene Wege, um den Ordner zu finden:
    // 1. /13_lang/ (Absolut vom Hauptverzeichnis)
    // 2. 13_lang/ (Relativ vom aktuellen Ort)
    // 3. ../13_lang/ (Einen Ordner zurück)
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
                console.log(`Sprachdatei erfolgreich geladen von: ${path}`);
                break; // Suche beenden, wenn Datei gefunden wurde
            }
        } catch (error) {
            // Falls dieser Pfad nicht klappt, versuchen wir den nächsten im Loop
            continue; 
        }
    }

    if (success) {
        updateUI(lang);
    } else {
        console.error("Die Sprachdatei konnte unter keinem der Pfade gefunden werden.");
    }
}

/**
 * Aktualisiert die Texte auf der Webseite
 */
function updateUI(lang) {
    // Suche alle Elemente mit dem Attribut [data-i18n]
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        
        // Nutze .innerHTML statt .textContent, um <br> Tags aus der JSON zu erlauben
        if (translations[key]) {
            el.innerHTML = translations[key];
        }
    });

    // Sprache im Browser-Gedächtnis speichern
    localStorage.setItem('malou_lang', lang);
    
    // HTML-Sprachattribut für SEO/Browser setzen
    document.documentElement.lang = lang;
}

/**
 * Initialisierung beim Laden der Webseite
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Gespeicherte Sprache abrufen oder Standard 'de'
    const savedLang = localStorage.getItem('malou_lang') || 'de';
    
    // 2. Sprache beim Start laden
    loadLanguage(savedLang);

    // 3. Event-Listener für die Sprach-Buttons (DE/EN) hinzufügen
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Verhindert das Springen der Seite
            const chosenLang = btn.getAttribute('data-lang');
            loadLanguage(chosenLang);
        });
    });
});