// Enhanced TaxEasy_ZA Application Logic

// Global variables
let currentPage = 1;
let taxData = {};
let calculationTimeout = null;
let isCalculating = false;
let translations = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('TaxEasy_ZA Enhanced application initialized');
    
    // Initialize all components
    initializeNavigation();
    initializeValidation();
    initializeRentalToggle();
    initializeOccupationFields();
    initializeTravelMethodToggle();
    initializeTaxCalculation();
    initializePDFGeneration();
    initializeLanguageHandler();
    initializeTooltipHandler();
    
    console.log('Application setup complete');
});

// Page navigation functions
function showPage(pageNum) {
    // Validate page number
    if (pageNum < 1 || pageNum > 7) return;

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });

    // Show selected page
    const targetPage = document.getElementById(`page${pageNum}`);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active');
        currentPage = pageNum;
        
        // Update UI components
        updateProgressBar(pageNum);
        updateNavigationButtons(pageNum);

        // Load dynamic content
        switch(pageNum) {
            case 6:
                loadFAQContent();
                break;
            case 7:
                loadEFilingGuide();
                break;
            case 5:
                setTimeout(() => performTaxCalculation(), 500);
                break;
        }
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function initializeNavigation() {
    // Add event listeners to navigation buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextPage = parseInt(this.getAttribute('data-next'));
            if (validateCurrentPage()) {
                showPage(nextPage);
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevPage = parseInt(this.getAttribute('data-prev'));
            showPage(prevPage);
        });
    });
}

function updateProgressBar(pageNum) {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        // Calculate progress based on main pages (1-5)
        const mainPages = 5;
        let progress;
        
        if (pageNum <= mainPages) {
            progress = ((pageNum - 1) / (mainPages - 1)) * 100;
        } else {
            progress = 100; // FAQ and eFiling pages show as complete
        }
        
        progressFill.style.width = `${progress}%`;
        progressFill.setAttribute('aria-valuenow', progress);
        progressFill.setAttribute('aria-valuetext', `Step ${pageNum} of 5`);
        console.log(`Progress updated: Page ${pageNum}, Progress: ${progress}%`);
        
        // Announce progress update
        const announcement = document.getElementById('aria-announcements');
        if (announcement) {
            announcement.textContent = `Now on step ${pageNum} of 5: ${getStepName(pageNum)}`;
        }
    }
}

function updateNavigationButtons(pageNum) {
    const navButtons = document.querySelectorAll('.page-nav-btn');
    navButtons.forEach((button, index) => {
        button.classList.remove('active');
        
        // Handle numbered pages (1-5)
        if (index < 5 && index + 1 === pageNum) {
            button.classList.add('active');
        }
        // Handle FAQ page
        else if (pageNum === 6 && button.textContent.includes('FAQ')) {
            button.classList.add('active');
        }
        // Handle eFiling page
        else if (pageNum === 7 && button.textContent.includes('eFiling')) {
            button.classList.add('active');
        }
    });
}

// Form validation
function validateCurrentPage() {
    const currentPageElement = document.getElementById(`page${currentPage}`);
    if (!currentPageElement) return true;
    
    const requiredFields = currentPageElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        // Handle different form control types
        const value = field.tagName === 'SELECT' ? field.selectedIndex >= 0 : field.value.trim();
        if (!value) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message fade-in';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span class="error-text">${message}</span>
    `;
    errorDiv.style.animation = 'fadeIn 0.3s ease-in';
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Rental section toggle
function initializeRentalToggle() {
    const rentalIncomeField = document.getElementById('rentalIncome');
    const rentalSection = document.getElementById('rentalSection');
    
    if (rentalIncomeField && rentalSection) {
        rentalIncomeField.addEventListener('input', function() {
            const value = parseFloat(this.value) || 0;
            if (value > 0) {
                rentalSection.style.display = 'block';
            } else {
                rentalSection.style.display = 'none';
            }
        });
    }
}

// Occupation-specific fields
function initializeOccupationFields() {
    const occupationSelect = document.getElementById('occupation');
    if (occupationSelect) {
        occupationSelect.addEventListener('change', function() {
            showOccupationFields(this.value);
        });
    }
}

function showOccupationFields(occupation) {
    // Hide all occupation-specific fields
    const occupationFields = document.querySelectorAll('.occupation-fields');
    occupationFields.forEach(field => {
        field.style.display = 'none';
    });
    
    // Show selected occupation fields
    if (occupation) {
        const targetField = document.getElementById(`${occupation}Fields`);
        if (targetField) {
            targetField.style.display = 'block';
        }
    }
}

// Travel method toggle
function initializeTravelMethodToggle() {
    const travelMethodSelect = document.getElementById('travelMethod');
    const detailedExpensesDiv = document.getElementById('detailedTravelExpenses');
    
    if (travelMethodSelect && detailedExpensesDiv) {
        travelMethodSelect.addEventListener('change', function() {
            if (this.value === 'estimate') {
                detailedExpensesDiv.style.display = 'block';
            } else {
                detailedExpensesDiv.style.display = 'none';
            }
        });
    }
}

// Tax calculation
function initializeTaxCalculation() {
    // Add event listeners to all input fields for real-time calculation
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(triggerCalculation, 1000));
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            try {
                func.apply(this, args);
            } finally {
                isCalculating = false;
            }
        }, wait);
    };
}

function triggerCalculation() {
    if (currentPage === 5) {
        performTaxCalculation();
    }
}

function performTaxCalculation() {
    if (isCalculating) {
        console.log('Calculation already in progress');
        return;
    }
    
    console.log('Starting tax calculation');
    isCalculating = true;
    
    // Clear any existing timeout
    if (calculationTimeout) {
        clearTimeout(calculationTimeout);
    }
    
    // Set timeout for calculation
    calculationTimeout = setTimeout(() => {
        console.warn('Calculation timeout');
        isCalculating = false;
        showCalculationError('Calculation timed out. Please try again.');
    }, 10000);
    
    try {
        // Show loading state
        showCalculationLoading();
        
        // Collect all tax data
        const data = collectTaxData();
        
        // Validate required data
        if (!validateTaxData(data)) {
            isCalculating = false;
            clearTimeout(calculationTimeout);
            showCalculationError('Please complete required fields before calculating.');
            return;
        }
        
        // Perform calculation
        setTimeout(() => {
            try {
                const results = calculateTax(data);
                displayTaxResults(results);
                
                // Clear timeout and reset flag
                clearTimeout(calculationTimeout);
                isCalculating = false;
                
                console.log('Tax calculation completed successfully');
            } catch (error) {
                console.error('Calculation error:', error);
                clearTimeout(calculationTimeout);
                isCalculating = false;
                showCalculationError('An error occurred during calculation. Please check your inputs and try again.');
            }
        }, 1500); // Simulate calculation time
        
    } catch (error) {
        console.error('Tax calculation error:', error);
        clearTimeout(calculationTimeout);
        isCalculating = false;
        showCalculationError('An error occurred during calculation. Please check your inputs and try again.');
    }
}

function collectTaxData() {
    const data = {
        // Personal info
        age: parseInt(document.getElementById('age')?.value) || 0,
        
        // Employment Income
        basicSalary: parseFloat(document.querySelector('[data-code="3601"]')?.value) || 0,
        bonus: parseFloat(document.querySelector('[data-code="3605"]')?.value) || 0,
        commission: parseFloat(document.querySelector('[data-code="3606"]')?.value) || 0,
        overtime: parseFloat(document.querySelector('[data-code="3607"]')?.value) || 0,
        
        // Allowances
        travelAllowance: parseFloat(document.querySelector('[data-code="3701"]')?.value) || 0,
        otherAllowances: parseFloat(document.querySelector('[data-code="3713"]')?.value) || 0,
        
        // Fringe Benefits
        vehicleFringe: parseFloat(document.querySelector('[data-code="3802"]')?.value) || 0,
        medicalFringe: parseFloat(document.querySelector('[data-code="3810"]')?.value) || 0,
        housingFringe: parseFloat(document.querySelector('[data-code="3804"]')?.value) || 0,
        mealsFringe: parseFloat(document.querySelector('[data-code="3808"]')?.value) || 0,
        otherFringe: parseFloat(document.querySelector('[data-code="3812"]')?.value) || 0,
        
        // Investment Income
        interestIncome: parseFloat(document.getElementById('interestIncome')?.value) || 0,
        dividendIncome: parseFloat(document.getElementById('dividendIncome')?.value) || 0,
        
        // Other Income
        rentalIncome: parseFloat(document.getElementById('rentalIncome')?.value) || 0,
        
        // Tax Paid
        payePaid: parseFloat(document.getElementById('payePaid')?.value) || 0,
        uifPaid: parseFloat(document.getElementById('uifPaid')?.value) || 0,
        provisionalTaxPaid: parseFloat(document.getElementById('provisionalTaxPaid')?.value) || 0,
        
        // Retirement Contributions
        pension: parseFloat(document.querySelector('[data-code="4001"]')?.value) || 0,
        provident: parseFloat(document.querySelector('[data-code="4003"]')?.value) || 0,
        retirementAnnuity: parseFloat(document.querySelector('[data-code="4006"]')?.value) || 0,
        
        // Other Deductions
        donations: parseFloat(document.querySelector('[data-code="4030"]')?.value) || 0,
        medicalAid: parseFloat(document.querySelector('[data-code="4005"]')?.value) || 0,
        medicalMembers: parseInt(document.getElementById('medicalMembers')?.value) || 0,
        medicalDependants: parseInt(document.getElementById('medicalDependants')?.value) || 0,
        additionalMedical: parseFloat(document.querySelector('[data-code="4024"]')?.value) || 0,
        
        // Rental Expenses
        rentalBondInterest: parseFloat(document.getElementById('rentalBondInterest')?.value) || 0,
        rentalRates: parseFloat(document.getElementById('rentalRates')?.value) || 0,
        rentalInsurance: parseFloat(document.getElementById('rentalInsurance')?.value) || 0,
        rentalRepairs: parseFloat(document.getElementById('rentalRepairs')?.value) || 0,
        rentalDepreciation: parseFloat(document.getElementById('rentalDepreciation')?.value) || 0,
        rentalAgent: parseFloat(document.getElementById('rentalAgent')?.value) || 0,
        rentalOther: parseFloat(document.getElementById('rentalOther')?.value) || 0,
        
        // Professional Development
        cpdExpenses: parseFloat(document.getElementById('cpdExpenses')?.value) || 0,
        membershipFees: parseFloat(document.getElementById('membershipFees')?.value) || 0,
        booksMaterials: parseFloat(document.getElementById('booksMaterials')?.value) || 0,
        toolsEquipment: parseFloat(document.getElementById('toolsEquipment')?.value) || 0,
        
        // Home Office
        homeOffice: parseFloat(document.getElementById('homeOffice')?.value) || 0,
        
        // Travel & Transport
        businessKm: parseInt(document.getElementById('businessKm')?.value) || 0,
        travelMethod: document.getElementById('travelMethod')?.value || 'logbook',
        fuelExpenses: parseFloat(document.getElementById('fuelExpenses')?.value) || 0,
        maintenanceExpenses: parseFloat(document.getElementById('maintenanceExpenses')?.value) || 0,
        insuranceExpenses: parseFloat(document.getElementById('insuranceExpenses')?.value) || 0,
        tollFees: parseFloat(document.getElementById('tollFees')?.value) || 0,
        parkingFees: parseFloat(document.getElementById('parkingFees')?.value) || 0,
        
        // Renewable Energy
        solarWaterHeater: parseFloat(document.getElementById('solarWaterHeater')?.value) || 0,
        solarPV: parseFloat(document.getElementById('solarPV')?.value) || 0,
        otherRenewable: parseFloat(document.getElementById('otherRenewable')?.value) || 0,
        
        // Legal & Other
        legalFees: parseFloat(document.getElementById('legalFees')?.value) || 0,
        allowanceExpenses: parseFloat(document.getElementById('allowanceExpenses')?.value) || 0,
        
        // Occupation Specific
        occupation: document.getElementById('occupation')?.value || '',
        softwareLicenses: parseFloat(document.getElementById('softwareLicenses')?.value) || 0,
        hardwareUpgrades: parseFloat(document.getElementById('hardwareUpgrades')?.value) || 0,
        medicalEquipment: parseFloat(document.getElementById('medicalEquipment')?.value) || 0,
        professionalInsurance: parseFloat(document.getElementById('professionalInsurance')?.value) || 0,
        financialSoftware: parseFloat(document.getElementById('financialSoftware')?.value) || 0,
        marketData: parseFloat(document.getElementById('marketData')?.value) || 0,
        classroomSupplies: parseFloat(document.getElementById('classroomSupplies')?.value) || 0,
        educationalMaterials: parseFloat(document.getElementById('educationalMaterials')?.value) || 0,
        safetyEquipment: parseFloat(document.getElementById('safetyEquipment')?.value) || 0,
        occupationSpecificExpenses: parseFloat(document.getElementById('occupationSpecificExpenses')?.value) || 0
    };
    
    console.log('Collected tax data:', data);
    return data;
}

function validateTaxData(data) {
    // Basic validation
    if (data.age < 18 || data.age > 120) {
        return false;
    }
    
    // At least some income should be provided
    const totalIncome = data.basicSalary + data.bonus + data.commission + data.overtime + 
                       data.travelAllowance + data.otherAllowances + data.interestIncome + 
                       data.dividendIncome + data.rentalIncome;
    
    return totalIncome > 0;
}

function calculateTax(data) {
    // Check if tax constants are available
    if (typeof calculateIncomeTax === 'undefined') {
        throw new Error('Tax calculation functions not available');
    }
    
    // Calculate gross income
    const employmentIncome = data.basicSalary + data.bonus + data.commission + data.overtime;
    const allowances = data.travelAllowance + data.otherAllowances;
    const fringeBenefits = data.vehicleFringe + data.medicalFringe + data.housingFringe + 
                          data.mealsFringe + data.otherFringe;
    
    // Apply exemptions
    const interestExemption = calculateInterestExemption(data.interestIncome, data.age);
    const taxableInterest = data.interestIncome - interestExemption;
    
    const dividendExemption = calculateDividendExemption(data.dividendIncome);
    const taxableDividends = data.dividendIncome - dividendExemption;
    
    // Calculate net rental income
    const rentalExpenses = data.rentalBondInterest + data.rentalRates + data.rentalInsurance + 
                          data.rentalRepairs + data.rentalDepreciation + data.rentalAgent + data.rentalOther;
    const netRentalIncome = Math.max(0, data.rentalIncome - rentalExpenses);
    
    const grossIncome = employmentIncome + allowances + fringeBenefits + 
                       taxableInterest + taxableDividends + netRentalIncome;
    
    // Calculate deductions
    const retirementDeduction = calculateRetirementDeduction(
        data.pension, data.provident, data.retirementAnnuity, grossIncome
    );
    
    const donationDeduction = calculateDonationDeduction(data.donations, grossIncome);
    
    // Professional and occupation-specific deductions
    const professionalDeductions = data.cpdExpenses + data.membershipFees + data.booksMaterials + 
                                  data.toolsEquipment + data.homeOffice + data.legalFees + 
                                  data.allowanceExpenses;
    
    // Travel deductions
    let travelDeduction = 0;
    if (data.travelMethod === 'logbook') {
        travelDeduction = calculateTravelDeduction(data.businessKm, 'logbook');
    } else {
        travelDeduction = data.fuelExpenses + data.maintenanceExpenses + data.insuranceExpenses + 
                         data.tollFees + data.parkingFees;
    }
    
    // Renewable energy deductions (Section 12B)
    const renewableEnergyDeduction = data.solarWaterHeater + data.solarPV + data.otherRenewable;
    
    // Occupation-specific deductions
    const occupationDeductions = data.softwareLicenses + data.hardwareUpgrades + data.medicalEquipment + 
                                data.professionalInsurance + data.financialSoftware + data.marketData + 
                                data.classroomSupplies + data.educationalMaterials + data.safetyEquipment + 
                                data.occupationSpecificExpenses;
    
    const totalDeductions = retirementDeduction + donationDeduction + professionalDeductions + 
                           travelDeduction + renewableEnergyDeduction + occupationDeductions;
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);
    
    // Calculate additional medical expenses deduction
    const additionalMedicalDeduction = calculateAdditionalMedicalDeduction(data.additionalMedical, taxableIncome);
    const finalTaxableIncome = Math.max(0, taxableIncome - additionalMedicalDeduction);
    
    // Calculate income tax using 2025 brackets
    let remainingIncome = finalTaxableIncome;
    let tax = 0;
    
    for (const bracket of TAX_BRACKETS) {
        if (remainingIncome <= 0) break;
        
        const taxableInBracket = Math.min(remainingIncome, bracket.threshold);
        tax += taxableInBracket * bracket.rate;
        remainingIncome -= bracket.threshold;
    }

    // Apply age-related rebates
    tax = Math.max(0, tax - getAgeRebate(data.age));
    
    // Calculate medical aid tax credits
    const medicalAidCredits = calculateMedicalAidCredits(data.medicalMembers, data.medicalDependants);
    
    // Calculate final tax payable
    const taxAfterCredits = Math.max(0, incomeTax - medicalAidCredits);
    
    // Calculate total tax paid
    const totalTaxPaid = data.payePaid + data.uifPaid + data.provisionalTaxPaid;
    
    // Calculate final amount due or refund
    const finalAmount = taxAfterCredits - totalTaxPaid;
    
    // Calculate effective tax rate
    const effectiveRate = grossIncome > 0 ? (taxAfterCredits / grossIncome) * 100 : 0;
    
    return {
        grossIncome,
        totalDeductions,
        taxableIncome: finalTaxableIncome,
        incomeTax,
        medicalAidCredits,
        taxAfterCredits,
        totalTaxPaid,
        finalAmount,
        effectiveRate,
        isRefund: finalAmount < 0,
        
        // Breakdown details
        employmentIncome,
        allowances,
        fringeBenefits,
        taxableInterest,
        taxableDividends,
        netRentalIncome,
        retirementDeduction,
        donationDeduction,
        professionalDeductions,
        travelDeduction,
        renewableEnergyDeduction,
        occupationDeductions,
        additionalMedicalDeduction,
        
        // Exemptions
        interestExemption,
        dividendExemption
    };
}

function showCalculationLoading() {
    const resultsContainer = document.getElementById('calculationResults');
    const loadingState = document.getElementById('loadingState');
    const taxResults = document.getElementById('taxResults');
    const calculationError = document.getElementById('calculationError');
    
    if (resultsContainer && loadingState && taxResults && calculationError) {
        loadingState.style.display = 'block';
        taxResults.style.display = 'none';
        calculationError.style.display = 'none';
    }
}

function displayTaxResults(results) {
    const loadingState = document.getElementById('loadingState');
    const taxResults = document.getElementById('taxResults');
    const calculationError = document.getElementById('calculationError');
    
    if (loadingState && taxResults && calculationError) {
        loadingState.style.display = 'none';
        calculationError.style.display = 'none';
        taxResults.style.display = 'block';
        
        // Format currency
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
                minimumFractionDigits: 2
            }).format(Math.abs(amount));
        };
        
        // Format percentage
        const formatPercentage = (rate) => {
            return `${rate.toFixed(2)}%`;
        };
        
        // Create results HTML
        const resultsHTML = `
            <div class="results-section">
                <h3>Income Summary</h3>
                <div class="result-row">
                    <span class="result-label">Gross Income</span>
                    <span class="result-value">${formatCurrency(results.grossIncome)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Total Deductions</span>
                    <span class="result-value">${formatCurrency(results.totalDeductions)}</span>
                </div>
                <div class="result-row total">
                    <span class="result-label">Taxable Income</span>
                    <span class="result-value">${formatCurrency(results.taxableIncome)}</span>
                </div>
            </div>
            
            <div class="results-section">
                <h3>Tax Calculation</h3>
                <div class="result-row">
                    <span class="result-label">Income Tax</span>
                    <span class="result-value">${formatCurrency(results.incomeTax)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Medical Aid Credits</span>
                    <span class="result-value">-${formatCurrency(results.medicalAidCredits)}</span>
                </div>
                <div class="result-row total">
                    <span class="result-label">Tax After Credits</span>
                    <span class="result-value">${formatCurrency(results.taxAfterCredits)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Tax Already Paid</span>
                    <span class="result-value">${formatCurrency(results.totalTaxPaid)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Effective Tax Rate</span>
                    <span class="result-value">${formatPercentage(results.effectiveRate)}</span>
                </div>
            </div>
            
            <div class="results-section">
                <div class="result-row final ${results.isRefund ? 'refund-due' : 'tax-due'}">
                    <span class="result-label">
                        <strong>${results.isRefund ? 'Refund Due' : 'Additional Tax Due'}</strong>
                    </span>
                    <span class="result-value">
                        <strong>${formatCurrency(results.finalAmount)}</strong>
                    </span>
                </div>
            </div>
        `;
        
        taxResults.innerHTML = resultsHTML;
        
        // Store results for PDF generation
        window.lastTaxResults = results;
    }
}

function showCalculationError(message) {
    const loadingState = document.getElementById('loadingState');
    const taxResults = document.getElementById('taxResults');
    const calculationError = document.getElementById('calculationError');
    
    if (loadingState && taxResults && calculationError) {
        loadingState.style.display = 'none';
        taxResults.style.display = 'none';
        calculationError.style.display = 'block';
        
        const errorMessage = calculationError.querySelector('p');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }
}

// PDF Generation
function initializePDFGeneration() {
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    
    if (generatePdfBtn) {
        generatePdfBtn.addEventListener('click', function() {
            generateTaxPDF();
        });
    }
    
    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', function() {
            applyDiscountCode();
        });
    }
}

function generateTaxPDF() {
    if (!window.lastTaxResults) {
        showNotification('Please calculate your tax first', 'error');
        return;
    }
    
    // This would integrate with the PDF generation service
    showNotification('PDF generation feature requires payment integration', 'info');
}

function applyDiscountCode() {
    const discountCode = document.getElementById('discountCode').value.trim();
    
    if (!discountCode) {
        showNotification('Please enter a discount code', 'error');
        return;
    }
    
    // Simulate discount code validation
    const validCodes = ['SAVE10', 'STUDENT', 'FIRST'];
    
    if (validCodes.includes(discountCode.toUpperCase())) {
        showNotification('Discount code applied successfully!', 'success');
        const generateBtn = document.getElementById('generatePdfBtn');
        if (generateBtn) {
            generateBtn.innerHTML = '<i class="fas fa-file-pdf"></i> <span>Generate PDF (R89)</span>';
        }
    } else {
        showNotification('Invalid discount code', 'error');
    }
}

// Language and content loading
function initializeLanguageHandler() {
    // This will be handled by the separate language-handler.js file
    console.log('Language handler initialized');
}

function initializeTooltipHandler() {
    // This will be handled by the separate tooltip-handler.js file
    console.log('Tooltip handler initialized');
}

async function loadFAQContent() {
    const faqContent = document.getElementById('faqContent');
    if (!faqContent) return;

    try {
        const lang = document.getElementById('langSelect').value || 'en';
        const response = await fetch(`faq_${lang}.json`);
        const faqData = await response.json();
        
        let html = '<div class="faq-section">';
        faqData.forEach((item, index) => {
            html += `
                <div class="faq-item">
                    <button class="faq-question" aria-expanded="false" id="faq-${index}-q">
                        ${item.question}
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="faq-answer" aria-hidden="true" id="faq-${index}-a">
                        ${item.answer}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        faqContent.innerHTML = html;
        initializeFAQToggle();
    } catch (error) {
        console.error('FAQ load error:', error);
        faqContent.innerHTML = '<p class="error">FAQ content unavailable</p>';
    }
}

function initializeFAQToggle() {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !expanded);
            button.nextElementSibling.setAttribute('aria-hidden', expanded);
            button.querySelector('i').classList.toggle('fa-rotate-180');
        });
    });
}

async function loadEFilingGuide() {
    const efilingContent = document.getElementById('efilingContent');
    if (!efilingContent) return;

    try {
        const lang = document.getElementById('langSelect').value || 'en';
        const response = await fetch(`efiling-guide_${lang}.html`);
        const guideHTML = await response.text();
        efilingContent.innerHTML = guideHTML;
    } catch (error) {
        console.error('eFiling guide load error:', error);
        efilingContent.innerHTML = '<p class="error">eFiling guide unavailable</p>';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fas fa-info-circle';
    if (type === 'error') icon = 'fas fa-exclamation-triangle';
    if (type === 'success') icon = 'fas fa-check-circle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Make functions globally available
window.showPage = showPage;
window.performTaxCalculation = performTaxCalculation;
window.showNotification = showNotification;

