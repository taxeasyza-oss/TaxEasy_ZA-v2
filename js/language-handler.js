// Language integration for app.js
// This file handles the integration between the main app and language system

// Initialize language system when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing language system...');
    
    // Initialize language system
    const initialLang = initializeLanguageSystem();
    
    // Load initial translations
    await loadLanguageTranslations(initialLang);
    
    // Apply initial translations
    applyTranslations(initialLang);
    
    // Set up language change listener
    document.addEventListener('languageChanged', function(event) {
        const newLang = event.detail.language;
        console.log('Language changed to:', newLang);
        
        // Load new translations and apply them
        loadLanguageTranslations(newLang).then(() => {
            applyTranslations(newLang);
            updateEFilingGuideLink(newLang);
        });
    });
    
    console.log('Language system initialized successfully');
});

// Apply translations to all elements with data-translate attributes
function applyTranslations(lang) {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = translate(key, lang);
        
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Handle placeholders
    const elementsWithPlaceholders = document.querySelectorAll('[data-placeholder-key]');
    elementsWithPlaceholders.forEach(element => {
        const key = element.getAttribute('data-placeholder-key');
        const translation = translate(key, lang);
        
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Update welcome message specifically
    updateWelcomeMessage(lang);
}

// Update welcome message based on language
function updateWelcomeMessage(lang) {
    const welcomeTitle = document.getElementById('welcomeTitle');
    const welcomeIntro = document.getElementById('welcomeIntro');
    const welcomeInstructions = document.getElementById('welcomeInstructions');
    
    if (welcomeTitle) {
        const titleText = translate('welcome_title', lang, 'Welcome to TaxEasy_ZA!');
        welcomeTitle.textContent = titleText;
    }
    
    if (welcomeIntro) {
        const introText = translate('welcome_intro', lang, 'This professional tax calculator will help you accurately calculate your South African personal income tax for the 2025 tax year (1 March 2024 – 28 February 2025).');
        welcomeIntro.textContent = introText;
    }
    
    if (welcomeInstructions) {
        const instructionsText = translate('welcome_instructions', lang, 'Please complete all sections accurately. Use the navigation buttons above to move between pages, and hover over the question mark icons for helpful tooltips.');
        welcomeInstructions.textContent = instructionsText;
    }
}

// Update eFiling guide link based on language
function updateEFilingGuideLink(lang) {
    const efilingBtn = document.getElementById('efilingBtn');
    if (efilingBtn) {
        const baseUrl = 'efiling-guides/efiling-guide';
        const newUrl = lang === 'en' ? `${baseUrl}.html` : `${baseUrl}_${lang}.html`;
        efilingBtn.href = newUrl;
    }
}

// Enhanced FAQ loading with language support
async function loadFAQContent() {
    const faqContent = document.getElementById('faqContent');
    if (!faqContent) return;

    try {
        const lang = document.getElementById('langSelect').value || 'en';
        const response = await fetch(`translations/faq_${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load FAQ: ${response.status}`);
        }
        
        const faqData = await response.json();
        const faqs = faqData.faqs || [];
        
        let faqHTML = '';
        faqs.forEach((faq, index) => {
            faqHTML += `
                <div class="faq-item">
                    <button class="faq-question" onclick="toggleFaq(${index})">
                        ${faq.question}
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="faq-answer" id="faq-answer-${index}">
                        ${faq.answer}
                    </div>
                </div>
            `;
        });
        
        faqContent.innerHTML = faqHTML;
        
    } catch (error) {
        console.error('FAQ load error:', error);
        faqContent.innerHTML = '<p class="error">FAQ content unavailable</p>';
    }
}

// Toggle FAQ item
function toggleFaq(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    if (answer) {
        const isOpen = answer.classList.contains('open');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-answer').forEach(item => {
            item.classList.remove('open');
        });
        
        // Toggle current item
        if (!isOpen) {
            answer.classList.add('open');
        }
    }
}

// Enhanced eFiling guide loading with language support
async function loadEFilingGuide() {
    const efilingContent = document.getElementById('efilingContent');
    if (!efilingContent) return;

    try {
        const lang = document.getElementById('langSelect').value || 'en';
        const guideFile = lang === 'en' ? 'efiling-guide.html' : `efiling-guide_${lang}.html`;
        const response = await fetch(`efiling-guides/${guideFile}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load eFiling guide: ${response.status}`);
        }
        
        const guideHTML = await response.text();
        efilingContent.innerHTML = guideHTML;
        
    } catch (error) {
        console.error('eFiling guide load error:', error);
        efilingContent.innerHTML = '<p class="error">eFiling guide unavailable</p>';
    }
}

// Make functions globally available
window.applyTranslations = applyTranslations;
window.updateWelcomeMessage = updateWelcomeMessage;
window.updateEFilingGuideLink = updateEFilingGuideLink;
window.loadFAQContent = loadFAQContent;
window.toggleFaq = toggleFaq;
window.loadEFilingGuide = loadEFilingGuide;

