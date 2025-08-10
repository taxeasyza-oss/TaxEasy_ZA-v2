// SARS 2025 Tax Rates (1 March 2024 - 28 February 2025)
export const TAX_BRACKETS = [
    { threshold: 237100, rate: 0.18 },
    { threshold: 370500, rate: 0.26 },
    { threshold: 512800, rate: 0.31 },
    { threshold: 673000, rate: 0.36 },
    { threshold: 857900, rate: 0.39 }, 
    { threshold: 1817000, rate: 0.41 },
    { threshold: Infinity, rate: 0.45 }
];

export const MEDICAL_CREDITS = {
    mainMember: 364,
    firstDependant: 364,
    additionalDependants: 246
};

export const REBATES = {
    primary: 17235,
    over65: 9444,
    over75: 3145
};

export const RETIREMENT_LIMITS = {
    percentage: 0.275,
    annualCap: 350000
};

export const TRAVEL_RATES = {
    fixedPerKm: 4.20,
    deemedCostPercentage: 0.20
};
