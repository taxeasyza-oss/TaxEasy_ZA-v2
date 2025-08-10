// Input Validation for TaxEasy_ZA Enhanced - IMPROVED

class InputValidator {
    constructor() {
        this.validationRules = {};
        this.errorMessages = {};
        this.customValidators = {};
        this.validationHistory = new Map();
        this.init();
    }

    init() {
        console.log('Initializing enhanced input validator');
        
        // Set up validation rules
        this.setupValidationRules();
        
        // Set up error messages
        this.setupErrorMessages();
        
        // Set up custom validators
        this.setupCustomValidators();
        
        // Attach event listeners
        this.attachEventListeners();
        
        console.log('Enhanced input validator initialized');
    }

    setupValidationRules() {
        this.validationRules = {
            // Personal Information - Enhanced validation
            fullName: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-Z\s'-\.]+$/,
                message: 'Please enter a valid full name (letters, spaces, hyphens, apostrophes, and periods only)'
            },
            
            idPassport: {
                required: true,
                minLength: 6,
                maxLength: 20,
                pattern: /^[0-9A-Z]+$/,
                customValidator: 'validateIdPassport',
                message: 'Please enter a valid South African ID or passport number'
            },
            
            age: {
                required: true,
                min: 18,
                max: 120,
                type: 'number',
                customValidator: 'validateAge',
                message: 'Age must be between 18 and 120 years'
            },

            // Income fields - Enhanced with realistic caps
            basicSalary: {
                min: 0,
                max: 50000000, // R50M cap for ultra-high earners
                type: 'currency',
                customValidator: 'validateSalaryReasonableness',
                message: 'Please enter a valid salary amount (maximum R50,000,000)'
            },

            bonus: {
                min: 0,
                max: 10000000, // R10M cap
                type: 'currency',
                dependsOn: 'basicSalary',
                customValidator: 'validateBonusRatio',
                message: 'Please enter a valid bonus amount (maximum R10,000,000)'
            },

            commission: {
                min: 0,
                max: 10000000,
                type: 'currency',
                message: 'Please enter a valid commission amount (maximum R10,000,000)'
            },

            overtime: {
                min: 0,
                max: 1000000, // R1M cap - more realistic
                type: 'currency',
                dependsOn: 'basicSalary',
                customValidator: 'validateOvertimeRatio',
                message: 'Please enter a valid overtime amount (maximum R1,000,000)'
            },

            travelAllowance: {
                min: 0,
                max: 500000, // R500K cap
                type: 'currency',
                message: 'Please enter a valid travel allowance amount (maximum R500,000)'
            },

            otherAllowances: {
                min: 0,
                max: 1000000,
                type: 'currency',
                message: 'Please enter a valid allowance amount (maximum R1,000,000)'
            },

            // Fringe benefits - Enhanced validation
            vehicleFringe: {
                min: 0,
                max: 500000,
                type: 'currency',
                customValidator: 'validateVehicleFringe',
                message: 'Please enter a valid vehicle fringe benefit amount (maximum R500,000)'
            },

            medicalFringe: {
                min: 0,
                max: 200000,
                type: 'currency',
                message: 'Please enter a valid medical fringe benefit amount (maximum R200,000)'
            },

            housingFringe: {
                min: 0,
                max: 1000000,
                type: 'currency',
                customValidator: 'validateHousingFringe',
                message: 'Please enter a valid housing fringe benefit amount (maximum R1,000,000)'
            },

            mealsFringe: {
                min: 0,
                max: 100000,
                type: 'currency',
                message: 'Please enter a valid meals fringe benefit amount (maximum R100,000)'
            },

            otherFringe: {
                min: 0,
                max: 500000,
                type: 'currency',
                message: 'Please enter a valid fringe benefit amount (maximum R500,000)'
            },

            // Investment income
            interestIncome: {
                min: 0,
                max: 10000000,
                type: 'currency',
                customValidator: 'validateInterestIncome',
                message: 'Please enter a valid interest income amount (maximum R10,000,000)'
            },

            dividendIncome: {
                min: 0,
                max: 10000000,
                type: 'currency',
                message: 'Please enter a valid dividend income amount (maximum R10,000,000)'
            },

            // Other income
            rentalIncome: {
                min: 0,
                max: 10000000,
                type: 'currency',
                customValidator: 'validateRentalIncome',
                message: 'Please enter a valid rental income amount (maximum R10,000,000)'
            },

            // Tax paid - Enhanced validation
            payePaid: {
                min: 0,
                max: 10000000,
                type: 'currency',
                dependsOn: ['basicSalary', 'bonus', 'commission'],
                customValidator: 'validatePayeReasonableness',
                message: 'Please enter a valid PAYE amount (maximum R10,000,000)'
            },

            uifPaid: {
                min: 0,
                max: 50000, // Realistic UIF cap
                type: 'currency',
                customValidator: 'validateUifCap',
                message: 'Please enter a valid UIF amount (maximum R50,000)'
            },

            provisionalTaxPaid: {
                min: 0,
                max: 10000000,
                type: 'currency',
                message: 'Please enter a valid provisional tax amount (maximum R10,000,000)'
            },

            // Retirement contributions - STRICT 2025 CAPS
            pension: {
                min: 0,
                max: 350000, // 2025 cap
                type: 'currency',
                customValidator: 'validateRetirementContribution',
                message: 'Pension contributions cannot exceed R350,000 (2025 limit)'
            },

            provident: {
                min: 0,
                max: 350000, // 2025 cap
                type: 'currency',
                customValidator: 'validateRetirementContribution',
                message: 'Provident fund contributions cannot exceed R350,000 (2025 limit)'
            },

            retirementAnnuity: {
                min: 0,
                max: 350000, // 2025 cap
                type: 'currency',
                customValidator: 'validateRetirementContribution',
                message: 'Retirement annuity contributions cannot exceed R350,000 (2025 limit)'
            },

            // Medical aid - Enhanced validation
            medicalAid: {
                min: 0,
                max: 100000,
                type: 'currency',
                dependsOn: ['medicalMembers', 'medicalDependants'],
                customValidator: 'validateMedicalAidContribution',
                message: 'Please enter a valid medical aid contribution amount (maximum R100,000)'
            },

            medicalMembers: {
                min: 0,
                max: 10,
                type: 'number',
                customValidator: 'validateMedicalMembers',
                message: 'Number of medical aid members must be between 0 and 10'
            },

            medicalDependants: {
                min: 0,
                max: 20,
                type: 'number',
                dependsOn: 'medicalMembers',
                customValidator: 'validateMedicalDependants',
                message: 'Number of dependants must be between 0 and 20'
            },

            additionalMedical: {
                min: 0,
                max: 500000,
                type: 'currency',
                dependsOn: ['medicalAid', 'medicalMembers'],
                customValidator: 'validateAdditionalMedical',
                message: 'Please enter a valid additional medical expenses amount (maximum R500,000)'
            },

            // Other deductions
            donations: {
                min: 0,
                max: 1000000,
                type: 'currency',
                customValidator: 'validateDonations',
                message: 'Please enter a valid donation amount (maximum R1,000,000)'
            },

            // Travel - Enhanced validation
            businessKm: {
                min: 0,
                max: 100000,
                type: 'number',
                customValidator: 'validateBusinessKilometers',
                message: 'Business kilometers must be between 0 and 100,000'
            },

            fuelExpenses: {
                min: 0,
                max: 200000,
                type: 'currency',
                dependsOn: 'businessKm',
                customValidator: 'validateFuelExpenses',
                message: 'Please enter a valid fuel expenses amount (maximum R200,000)'
            },

            maintenanceExpenses: {
                min: 0,
                max: 100000,
                type: 'currency',
                dependsOn: 'businessKm',
                customValidator: 'validateMaintenanceExpenses',
                message: 'Please enter a valid maintenance expenses amount (maximum R100,000)'
            },

            insuranceExpenses: {
                min: 0,
                max: 50000,
                type: 'currency',
                message: 'Please enter a valid insurance expenses amount (maximum R50,000)'
            },

            tollFees: {
                min: 0,
                max: 50000,
                type: 'currency',
                dependsOn: 'businessKm',
                message: 'Please enter a valid toll fees amount (maximum R50,000)'
            },

            parkingFees: {
                min: 0,
                max: 20000,
                type: 'currency',
                message: 'Please enter a valid parking fees amount (maximum R20,000)'
            },

            // Professional development
            cpdExpenses: {
                min: 0,
                max: 100000,
                type: 'currency',
                customValidator: 'validateCpdExpenses',
                message: 'Please enter a valid CPD expenses amount (maximum R100,000)'
            },

            membershipFees: {
                min: 0,
                max: 50000,
                type: 'currency',
                message: 'Please enter a valid membership fees amount (maximum R50,000)'
            },

            booksMaterials: {
                min: 0,
                max: 50000,
                type: 'currency',
                message: 'Please enter a valid books and materials amount (maximum R50,000)'
            },

            toolsEquipment: {
                min: 0,
                max: 200000,
                type: 'currency',
                customValidator: 'validateToolsEquipment',
                message: 'Please enter a valid tools and equipment amount (maximum R200,000)'
            },

            // Home office - Enhanced validation
            homeOffice: {
                min: 0,
                max: 100000,
                type: 'currency',
                customValidator: 'validateHomeOffice',
                message: 'Please enter a valid home office expenses amount (maximum R100,000)'
            },

            // Renewable energy - 2025 enhanced caps
            solarWaterHeater: {
                min: 0,
                max: 100000,
                type: 'currency',
                customValidator: 'validateRenewableEnergy',
                message: 'Please enter a valid solar water heater amount (maximum R100,000)'
            },

            solarPV: {
                min: 0,
                max: 500000,
                type: 'currency',
                customValidator: 'validateRenewableEnergy',
                message: 'Please enter a valid solar PV system amount (maximum R500,000)'
            },

            otherRenewable: {
                min: 0,
                max: 500000,
                type: 'currency',
                customValidator: 'validateRenewableEnergy',
                message: 'Please enter a valid renewable energy amount (maximum R500,000)'
            },

            // Legal and other
            legalFees: {
                min: 0,
                max: 200000,
                type: 'currency',
                customValidator: 'validateLegalFees',
                message: 'Please enter a valid legal fees amount (maximum R200,000)'
            },

            allowanceExpenses: {
                min: 0,
                max: 200000,
                type: 'currency',
                dependsOn: ['travelAllowance', 'otherAllowances'],
                customValidator: 'validateAllowanceExpenses',
                message: 'Please enter a valid allowance expenses amount (maximum R200,000)'
            }
        };
    }

    setupErrorMessages() {
        this.errorMessages = {
            required: 'This field is required',
            minLength: 'Must be at least {min} characters long',
            maxLength: 'Must not exceed {max} characters',
            min: 'Must be at least {min}',
            max: 'Must not exceed {max}',
            pattern: 'Invalid format',
            number: 'Must be a valid number',
            currency: 'Must be a valid amount',
            custom: 'Validation failed'
        };
    }

    setupCustomValidators() {
        this.customValidators = {
            // ID/Passport validation
            validateIdPassport: (value, field) => {
                if (!value) return [];
                
                // South African ID number validation (13 digits)
                if (/^\d{13}$/.test(value)) {
                    return this.validateSouthAfricanId(value);
                }
                
                // Passport validation (6-20 alphanumeric)
                if (/^[A-Z0-9]{6,20}$/.test(value.toUpperCase())) {
                    return [];
                }
                
                return ['Please enter a valid South African ID number (13 digits) or passport number'];
            },

            // Age validation with cross-checks
            validateAge: (value, field) => {
                const errors = [];
                const age = parseInt(value);
                
                if (age < 18) {
                    errors.push('You must be at least 18 years old to file a tax return');
                }
                
                if (age > 65) {
                    // Check if retirement income is declared
                    const pension = parseFloat(document.getElementById('pension')?.value) || 0;
                    const retirementAnnuity = parseFloat(document.getElementById('retirementAnnuity')?.value) || 0;
                    
                    if (pension === 0 && retirementAnnuity === 0) {
                        errors.push('Consider declaring retirement income if applicable for your age');
                    }
                }
                
                return errors;
            },

            // Salary reasonableness check
            validateSalaryReasonableness: (value, field) => {
                const errors = [];
                const salary = parseFloat(value) || 0;
                
                if (salary > 5000000) { // R5M+
                    errors.push('High income detected. Ensure all income sources are declared');
                }
                
                if (salary > 0 && salary < 1000) {
                    errors.push('Very low salary detected. Please verify the amount');
                }
                
                return errors;
            },

            // Bonus ratio validation
            validateBonusRatio: (value, field) => {
                const errors = [];
                const bonus = parseFloat(value) || 0;
                const salary = parseFloat(document.getElementById('basicSalary')?.value) || 0;
                
                if (bonus > 0 && salary > 0) {
                    const ratio = bonus / salary;
                    if (ratio > 2) { // Bonus > 200% of salary
                        errors.push('Bonus seems high relative to basic salary. Please verify');
                    }
                }
                
                return errors;
            },

            // Overtime ratio validation
            validateOvertimeRatio: (value, field) => {
                const errors = [];
                const overtime = parseFloat(value) || 0;
                const salary = parseFloat(document.getElementById('basicSalary')?.value) || 0;
                
                if (overtime > 0 && salary > 0) {
                    const ratio = overtime / salary;
                    if (ratio > 0.5) { // Overtime > 50% of salary
                        errors.push('High overtime amount. Ensure this is accurate');
                    }
                }
                
                return errors;
            },

            // PAYE reasonableness check
            validatePayeReasonableness: (value, field) => {
                const errors = [];
                const paye = parseFloat(value) || 0;
                const totalIncome = this.calculateTotalIncome();
                
                if (paye > 0 && totalIncome > 0) {
                    const ratio = paye / totalIncome;
                    if (ratio > 0.45) { // PAYE > 45% of income
                        errors.push('PAYE seems high. Please verify the amount');
                    }
                    if (ratio < 0.05 && totalIncome > 100000) { // PAYE < 5% for high income
                        errors.push('PAYE seems low for this income level');
                    }
                }
                
                return errors;
            },

            // UIF cap validation (2025)
            validateUifCap: (value, field) => {
                const errors = [];
                const uif = parseFloat(value) || 0;
                const maxUif = 2407.20; // 2025 UIF cap (R177,720 * 1%)
                
                if (uif > maxUif) {
                    errors.push(`UIF contributions cannot exceed R${maxUif.toFixed(2)} for 2025`);
                }
                
                return errors;
            },

            // Retirement contribution validation - STRICT 2025 CAPS
            validateRetirementContribution: (value, field) => {
                const errors = [];
                const amount = parseFloat(value) || 0;
                const totalRetirement = this.getTotalRetirementContributions();
                const maxTotal = 350000; // 2025 cap
                
                if (totalRetirement > maxTotal) {
                    errors.push(`Total retirement contributions cannot exceed R${maxTotal.toLocaleString()} for 2025`);
                }
                
                // Check against income
                const totalIncome = this.calculateTotalIncome();
                if (totalIncome > 0) {
                    const maxAllowed = Math.min(totalIncome * 0.275, maxTotal); // 27.5% of income or cap
                    if (totalRetirement > maxAllowed) {
                        errors.push(`Retirement contributions cannot exceed 27.5% of income (R${maxAllowed.toLocaleString()})`);
                    }
                }
                
                return errors;
            },

            // Medical dependants validation - ENHANCED
            validateMedicalDependants: (value, field) => {
                const errors = [];
                const dependants = parseInt(value) || 0;
                const members = parseInt(document.getElementById('medicalMembers')?.value) || 0;
                
                if (dependants > 0 && members === 0) {
                    errors.push('You must have at least one main member to claim dependants');
                }
                
                if (dependants > members * 4) {
                    errors.push('Unusually high number of dependants per member. Please verify');
                }
                
                // Age-based validation
                const age = parseInt(document.getElementById('age')?.value) || 0;
                if (dependants > 10 && age < 40) {
                    errors.push('High number of dependants for your age. Please verify');
                }
                
                return errors;
            },

            // Medical aid contribution validation
            validateMedicalAidContribution: (value, field) => {
                const errors = [];
                const contribution = parseFloat(value) || 0;
                const members = parseInt(document.getElementById('medicalMembers')?.value) || 0;
                const dependants = parseInt(document.getElementById('medicalDependants')?.value) || 0;
                
                if (contribution > 0 && (members + dependants) === 0) {
                    errors.push('Medical aid contributions require at least one member or dependant');
                }
                
                // Reasonableness check
                const totalPeople = members + dependants;
                if (totalPeople > 0) {
                    const perPersonCost = contribution / totalPeople;
                    if (perPersonCost > 8000) { // R8K per person per month seems high
                        errors.push('Medical aid contribution seems high per person. Please verify');
                    }
                }
                
                return errors;
            },

            // Business kilometers validation
            validateBusinessKilometers: (value, field) => {
                const errors = [];
                const km = parseInt(value) || 0;
                
                if (km > 50000) {
                    errors.push('Business kilometers over 50,000 may require additional documentation');
                }
                
                if (km > 80000) {
                    errors.push('Extremely high business kilometers. Ensure this is accurate');
                }
                
                return errors;
            },

            // Home office validation - Enhanced
            validateHomeOffice: (value, field) => {
                const errors = [];
                const amount = parseFloat(value) || 0;
                
                if (amount > 50000) {
                    errors.push('Home office expenses over R50,000 require employer confirmation');
                }
                
                // Check against income
                const totalIncome = this.calculateTotalIncome();
                if (totalIncome > 0 && amount > totalIncome * 0.1) {
                    errors.push('Home office expenses seem high relative to income');
                }
                
                return errors;
            },

            // Additional custom validators...
            validateVehicleFringe: (value, field) => {
                const errors = [];
                const amount = parseFloat(value) || 0;
                
                if (amount > 300000) {
                    errors.push('High vehicle fringe benefit. Ensure this includes all applicable amounts');
                }
                
                return errors;
            },

            validateRenewableEnergy: (value, field) => {
                const errors = [];
                const amount = parseFloat(value) || 0;
                
                // Check total renewable energy deductions
                const totalRenewable = this.getTotalRenewableEnergy();
                const maxRenewable = 1000000; // R1M total cap
                
                if (totalRenewable > maxRenewable) {
                    errors.push(`Total renewable energy deductions cannot exceed R${maxRenewable.toLocaleString()}`);
                }
                
                return errors;
            }
        };
    }

    // Helper method to validate South African ID numbers
    validateSouthAfricanId(idNumber) {
        const errors = [];
        
        // Check if it's 13 digits
        if (!/^\d{13}$/.test(idNumber)) {
            errors.push('South African ID must be exactly 13 digits');
            return errors;
        }
        
        // Extract components
        const year = parseInt(idNumber.substring(0, 2));
        const month = parseInt(idNumber.substring(2, 4));
        const day = parseInt(idNumber.substring(4, 6));
        
        // Validate date components
        if (month < 1 || month > 12) {
            errors.push('Invalid month in ID number');
        }
        
        if (day < 1 || day > 31) {
            errors.push('Invalid day in ID number');
        }
        
        // Luhn algorithm check for ID number
        if (!this.luhnCheck(idNumber)) {
            errors.push('Invalid South African ID number (checksum failed)');
        }
        
        return errors;
    }

    // Luhn algorithm implementation
    luhnCheck(idNumber) {
        let sum = 0;
        let alternate = false;
        
        for (let i = idNumber.length - 1; i >= 0; i--) {
            let n = parseInt(idNumber.charAt(i));
            
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            
            sum += n;
            alternate = !alternate;
        }
        
        return (sum % 10) === 0;
    }

    // Calculate total income for validation purposes
    calculateTotalIncome() {
        const incomeFields = [
            'basicSalary', 'bonus', 'commission', 'overtime', 
            'travelAllowance', 'otherAllowances', 'vehicleFringe',
            'medicalFringe', 'housingFringe', 'mealsFringe', 'otherFringe',
            'interestIncome', 'dividendIncome', 'rentalIncome'
        ];
        
        return incomeFields.reduce((total, fieldId) => {
            const value = parseFloat(document.getElementById(fieldId)?.value) || 0;
            return total + value;
        }, 0);
    }

    // Calculate total retirement contributions
    getTotalRetirementContributions() {
        const pension = parseFloat(document.getElementById('pension')?.value) || 0;
        const provident = parseFloat(document.getElementById('provident')?.value) || 0;
        const retirementAnnuity = parseFloat(document.getElementById('retirementAnnuity')?.value) || 0;
        
        return pension + provident + retirementAnnuity;
    }

    // Calculate total renewable energy deductions
    getTotalRenewableEnergy() {
        const solarWater = parseFloat(document.getElementById('solarWaterHeater')?.value) || 0;
        const solarPV = parseFloat(document.getElementById('solarPV')?.value) || 0;
        const otherRenewable = parseFloat(document.getElementById('otherRenewable')?.value) || 0;
        
        return solarWater + solarPV + otherRenewable;
    }

    attachEventListeners() {
        // Real-time validation on input
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="text"], input[type="number"], select')) {
                this.validateField(e.target, false); // Don't show errors on input
            }
        });

        // Full validation on blur
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input[type="text"], input[type="number"], select')) {
                this.validateField(e.target, true); // Show errors on blur
            }
        }, true);

        // Prevent invalid characters in number inputs
        document.addEventListener('keypress', (e) => {
            if (e.target.matches('input[type="number"]')) {
                this.handleNumberInput(e);
            }
        });

        // Format currency inputs on blur
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input[data-type="currency"]')) {
                this.formatCurrencyInput(e.target);
            }
        }, true);

        // Cross-field validation on change
        document.addEventListener('change', (e) => {
            if (e.target.matches('input, select')) {
                this.performCrossFieldValidation(e.target);
            }
        });
    }

    validateField(field, showErrors = false) {
        const fieldName = field.id || field.name;
        const rules = this.validationRules[fieldName];
        
        if (!rules) {
            return true; // No rules defined, consider valid
        }

        const value = field.value.trim();
        const errors = [];

        // Required validation
        if (rules.required && !value) {
            errors.push(this.errorMessages.required);
        }

        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            this.clearFieldError(field);
            return true;
        }

        // Length validations
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(this.errorMessages.minLength.replace('{min}', rules.minLength));
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(this.errorMessages.maxLength.replace('{max}', rules.maxLength));
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(rules.message || this.errorMessages.pattern);
        }

        // Number validations
        if (rules.type === 'number' || rules.type === 'currency') {
            const numValue = parseFloat(value);
            
            if (isNaN(numValue)) {
                errors.push(this.errorMessages.number);
            } else {
                if (rules.min !== undefined && numValue < rules.min) {
                    errors.push(this.errorMessages.min.replace('{min}', this.formatNumber(rules.min)));
                }

                if (rules.max !== undefined && numValue > rules.max) {
                    errors.push(this.errorMessages.max.replace('{max}', this.formatNumber(rules.max)));
                }
            }
        }

        // Custom validations
        if (rules.customValidator && this.customValidators[rules.customValidator]) {
            const customErrors = this.customValidators[rules.customValidator](value, field);
            errors.push(...customErrors);
        }

        // Show or clear errors
        if (errors.length > 0 && showErrors) {
            this.showFieldError(field, errors[0]);
            return false;
        } else {
            this.clearFieldError(field);
            return errors.length === 0;
        }
    }

    performCrossFieldValidation(changedField) {
        const fieldName = changedField.id || changedField.name;
        
        // Find fields that depend on this field
        Object.keys(this.validationRules).forEach(ruleFieldName => {
            const rule = this.validationRules[ruleFieldName];
            if (rule.dependsOn) {
                const dependencies = Array.isArray(rule.dependsOn) ? rule.dependsOn : [rule.dependsOn];
                if (dependencies.includes(fieldName)) {
                    const dependentField = document.getElementById(ruleFieldName);
                    if (dependentField) {
                        this.validateField(dependentField, true);
                    }
                }
            }
        });
    }

    showFieldError(field, message) {
        // Add error class to field
        field.classList.add('error');
        field.classList.remove('success');
        
        // Remove existing error message
        this.clearFieldError(field, false);
        
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insert error message after the field or its parent input group
        const inputGroup = field.closest('.input-group') || field.parentNode;
        inputGroup.appendChild(errorDiv);
        
        // Store validation result
        this.validationHistory.set(field.id, { valid: false, message, timestamp: Date.now() });
    }

    clearFieldError(field, addSuccessClass = true) {
        // Remove error class
        field.classList.remove('error');
        
        if (addSuccessClass && field.value.trim()) {
            field.classList.add('success');
        } else {
            field.classList.remove('success');
        }
        
        // Remove error message
        const inputGroup = field.closest('.input-group') || field.parentNode;
        const existingError = inputGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Update validation history
        if (field.value.trim()) {
            this.validationHistory.set(field.id, { valid: true, message: '', timestamp: Date.now() });
        }
    }

    handleNumberInput(e) {
        // Allow: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }

    formatCurrencyInput(field) {
        const value = parseFloat(field.value) || 0;
        if (value > 0) {
            field.value = value.toFixed(2);
        }
    }

    formatNumber(num) {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    }

    // Validate entire form
    validateForm() {
        let isValid = true;
        const errors = [];
        
        // Validate all fields with rules
        Object.keys(this.validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                const fieldValid = this.validateField(field, true);
                if (!fieldValid) {
                    isValid = false;
                    errors.push(`${fieldName}: validation failed`);
                }
            }
        });
        
        // Additional form-level validations
        const formErrors = this.validateFormLevel();
        errors.push(...formErrors);
        
        if (formErrors.length > 0) {
            isValid = false;
        }
        
        return { isValid, errors };
    }

    validateFormLevel() {
        const errors = [];
        
        // Check total retirement contributions
        const totalRetirement = this.getTotalRetirementContributions();
        if (totalRetirement > 350000) {
            errors.push('Total retirement contributions exceed R350,000 limit');
        }
        
        // Check income vs deductions reasonableness
        const totalIncome = this.calculateTotalIncome();
        const totalDeductions = this.calculateTotalDeductions();
        
        if (totalDeductions > totalIncome) {
            errors.push('Total deductions exceed total income');
        }
        
        return errors;
    }

    calculateTotalDeductions() {
        const deductionFields = [
            'pension', 'provident', 'retirementAnnuity', 'medicalAid',
            'additionalMedical', 'donations', 'fuelExpenses', 'maintenanceExpenses',
            'insuranceExpenses', 'tollFees', 'parkingFees', 'cpdExpenses',
            'membershipFees', 'booksMaterials', 'toolsEquipment', 'homeOffice',
            'solarWaterHeater', 'solarPV', 'otherRenewable', 'legalFees',
            'allowanceExpenses'
        ];
        
        return deductionFields.reduce((total, fieldId) => {
            const value = parseFloat(document.getElementById(fieldId)?.value) || 0;
            return total + value;
        }, 0);
    }

    // Get validation summary
    getValidationSummary() {
        const summary = {
            totalFields: 0,
            validFields: 0,
            invalidFields: 0,
            warnings: 0,
            errors: []
        };
        
        this.validationHistory.forEach((result, fieldId) => {
            summary.totalFields++;
            if (result.valid) {
                summary.validFields++;
            } else {
                summary.invalidFields++;
                summary.errors.push(`${fieldId}: ${result.message}`);
            }
        });
        
        return summary;
    }
}

// Initialize the validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.inputValidator = new InputValidator();
    console.log('Enhanced input validator ready');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputValidator;
}

