// language-handler.js - ENHANCED
import { SUPPORTED_LANGUAGES } from './config.js';

// Enhanced translation validation with comprehensive key checking
export function validateTranslations(lang, translations) {
    // Core required translation keys for the tax application
    const requiredKeys = [
        // Navigation and main interface
        'title', 'tagline', 'nav_personal', 'nav_income', 
        'nav_deductions', 'nav_advanced', 'nav_summary',
        
        // Personal information section
        'personal_info', 'full_name', 'id_passport', 'age', 'occupation',
        'marital_status', 'tax_year', 'resident_status',
        
        // Income section
        'income_section', 'basic_salary', 'bonus', 'commission', 'overtime',
        'travel_allowance', 'other_allowances', 'fringe_benefits',
        'vehicle_fringe', 'medical_fringe', 'housing_fringe', 'meals_fringe',
        'other_fringe', 'investment_income', 'interest_income', 'dividend_income',
        'rental_income', 'other_income',
        
        // Tax paid section
        'tax_paid', 'paye_paid', 'uif_paid', 'provisional_tax_paid',
        
        // Deductions section
        'deductions_section', 'retirement_contributions', 'pension',
        'provident', 'retirement_annuity', 'medical_aid', 'medical_members',
        'medical_dependants', 'additional_medical', 'donations',
        
        // Travel deductions
        'travel_deductions', 'business_km', 'fuel_expenses', 'maintenance_expenses',
        'insurance_expenses', 'toll_fees', 'parking_fees',
        
        // Professional development
        'professional_development', 'cpd_expenses', 'membership_fees',
        'books_materials', 'tools_equipment',
        
        // Other deductions
        'other_deductions', 'home_office', 'legal_fees', 'allowance_expenses',
        
        // Renewable energy
        'renewable_energy', 'solar_water_heater', 'solar_pv', 'other_renewable',
        
        // Summary and results
        'summary_section', 'total_income', 'total_deductions', 'taxable_income',
        'tax_liability', 'tax_paid_total', 'refund_due', 'amount_owing',
        
        // Buttons and actions
        'next', 'previous', 'calculate', 'download_pdf', 'save_progress',
        'reset_form', 'help', 'faq', 'contact',
        
        // Validation messages
        'required_field', 'invalid_format', 'amount_too_high', 'amount_too_low',
        'invalid_id_number', 'invalid_age', 'calculation_error',
        
        // Tooltips (basic set)
        'tooltip_full_name', 'tooltip_id_passport', 'tooltip_age', 'tooltip_occupation',
        'tooltip_basic_salary', 'tooltip_bonus', 'tooltip_commission', 'tooltip_overtime',
        'tooltip_travel_allowance', 'tooltip_fringe_benefits', 'tooltip_pension',
        'tooltip_medical_aid', 'tooltip_donations', 'tooltip_business_km',
        'tooltip_home_office', 'tooltip_renewable_energy',
        
        // Status messages
        'loading', 'saving', 'saved', 'error_occurred', 'try_again',
        'form_incomplete', 'calculation_complete', 'pdf_generated',
        
        // Language selector
        'select_language', 'language_changed',
        
        // Footer and legal
        'disclaimer', 'privacy_policy', 'terms_of_service', 'copyright',
        
        // Error handling
        'network_error', 'server_error', 'validation_failed', 'unexpected_error'
    ];

    if (!translations || typeof translations !== 'object') {
        console.error(`Invalid translations object for language: ${lang}`);
        return false;
    }

    const missingKeys = requiredKeys.filter(key => {
        const value = translations[key];
        return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingKeys.length > 0) {
        console.warn(`Missing or empty translations in ${lang}:`, missingKeys);
        
        // Log detailed information about missing translations
        missingKeys.forEach(key => {
            console.warn(`  - Missing key: ${key}`);
        });
        
        return false;
    }

    // Additional validation for specific key patterns
    const tooltipKeys = Object.keys(translations).filter(key => key.startsWith('tooltip_'));
    if (tooltipKeys.length < 10) {
        console.warn(`Insufficient tooltip translations in ${lang}. Found: ${tooltipKeys.length}, expected at least 10`);
    }

    console.log(`Translation validation passed for ${lang}. Found ${Object.keys(translations).length} keys.`);
    return true;
}

// Enhanced fallback system with multiple fallback strategies
export function getFallbackText(key, defaultValue = '', currentLang = 'en') {
    // Strategy 1: Try the primary fallback language (English)
    const primaryFallback = 'en';
    if (currentLang !== primaryFallback && window.translations?.[primaryFallback]?.[key]) {
        console.warn(`Using ${primaryFallback} fallback for key: ${key}`);
        return window.translations[primaryFallback][key];
    }
    
    // Strategy 2: Try the first available language
    const availableLanguages = Object.keys(window.translations || {});
    for (const lang of availableLanguages) {
        if (lang !== currentLang && window.translations[lang]?.[key]) {
            console.warn(`Using ${lang} fallback for key: ${key}`);
            return window.translations[lang][key];
        }
    }
    
    // Strategy 3: Try to construct a meaningful default based on the key
    const constructedDefault = constructDefaultFromKey(key);
    if (constructedDefault) {
        console.warn(`Using constructed default for key: ${key}`);
        return constructedDefault;
    }
    
    // Strategy 4: Return the provided default value or a generic placeholder
    const finalFallback = defaultValue || `[${key}]`;
    console.error(`No translation found for key: ${key}, using fallback: ${finalFallback}`);
    return finalFallback;
}

// Helper function to construct meaningful defaults from translation keys
function constructDefaultFromKey(key) {
    // Convert snake_case to Title Case
    const titleCase = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    
    // Handle specific patterns
    const patterns = {
        'tooltip_': 'Help information for ',
        'nav_': '',
        'btn_': '',
        'error_': 'Error: ',
        'msg_': '',
        'label_': ''
    };
    
    for (const [pattern, prefix] of Object.entries(patterns)) {
        if (key.startsWith(pattern)) {
            const cleanKey = key.replace(pattern, '');
            const cleanTitle = cleanKey
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            return prefix + cleanTitle;
        }
    }
    
    return titleCase;
}

// Enhanced language loading with better error handling
export async function loadLanguageTranslations(lang) {
    try {
        // Validate language code
        if (!SUPPORTED_LANGUAGES.includes(lang)) {
            throw new Error(`Unsupported language: ${lang}`);
        }
        
        console.log(`Loading translations for language: ${lang}`);
        
        // Try to load the translation file
        const response = await fetch(`./translations/${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load translations: ${response.status} ${response.statusText}`);
        }
        
        const translations = await response.json();
        
        // Validate the loaded translations
        const isValid = validateTranslations(lang, translations);
        
        if (!isValid) {
            console.warn(`Translation validation failed for ${lang}, but continuing with available translations`);
        }
        
        // Store translations globally
        if (!window.translations) {
            window.translations = {};
        }
        window.translations[lang] = translations;
        
        console.log(`Successfully loaded ${Object.keys(translations).length} translations for ${lang}`);
        return translations;
        
    } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
        
        // If this is not the fallback language, try to load English as fallback
        if (lang !== 'en') {
            console.log('Attempting to load English as fallback...');
            try {
                return await loadLanguageTranslations('en');
            } catch (fallbackError) {
                console.error('Failed to load fallback language:', fallbackError);
            }
        }
        
        // Return empty object if all else fails
        return {};
    }
}

// Enhanced translation function with better error handling
export function translate(key, lang = 'en', fallbackValue = '') {
    try {
        // Check if translations are loaded
        if (!window.translations) {
            console.warn('Translations not loaded yet');
            return getFallbackText(key, fallbackValue, lang);
        }
        
        // Get translation for the requested language
        const translation = window.translations[lang]?.[key];
        
        if (translation && typeof translation === 'string' && translation.trim() !== '') {
            return translation;
        }
        
        // Use fallback system
        return getFallbackText(key, fallbackValue, lang);
        
    } catch (error) {
        console.error(`Error translating key "${key}":`, error);
        return getFallbackText(key, fallbackValue, lang);
    }
}

// Language change handler with validation
export function changeLanguage(newLang) {
    try {
        if (!SUPPORTED_LANGUAGES.includes(newLang)) {
            throw new Error(`Unsupported language: ${newLang}`);
        }
        
        console.log(`Changing language to: ${newLang}`);
        
        // Update the language selector if it exists
        const langSelect = document.getElementById('langSelect');
        if (langSelect && langSelect.value !== newLang) {
            langSelect.value = newLang;
        }
        
        // Store the language preference
        localStorage.setItem('preferredLanguage', newLang);
        
        // Trigger language change event
        const event = new CustomEvent('languageChanged', { 
            detail: { 
                language: newLang,
                previousLanguage: document.documentElement.lang || 'en'
            } 
        });
        document.dispatchEvent(event);
        
        // Update document language attribute
        document.documentElement.lang = newLang;
        
        return true;
        
    } catch (error) {
        console.error('Error changing language:', error);
        return false;
    }
}

// Initialize language system
export function initializeLanguageSystem() {
    try {
        // Get preferred language from localStorage or browser
        const savedLang = localStorage.getItem('preferredLanguage');
        const browserLang = navigator.language.split('-')[0];
        const defaultLang = SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en';
        const initialLang = savedLang || defaultLang;
        
        console.log(`Initializing language system with: ${initialLang}`);
        
        // Set up language selector if it exists
        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.value = initialLang;
            langSelect.addEventListener('change', (e) => {
                changeLanguage(e.target.value);
            });
        }
        
        // Load initial translations
        loadLanguageTranslations(initialLang);
        
        // Set document language
        document.documentElement.lang = initialLang;
        
        return initialLang;
        
    } catch (error) {
        console.error('Error initializing language system:', error);
        return 'en'; // Fallback to English
    }
}

// Export for global access
window.languageHandler = {
    validateTranslations,
    getFallbackText,
    loadLanguageTranslations,
    translate,
    changeLanguage,
    initializeLanguageSystem
};

