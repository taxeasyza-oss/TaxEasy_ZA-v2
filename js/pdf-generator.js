import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Base64 encoded multilingual fonts
const notoSansSC = ''; // Actual base64 font data would go here

export function generateTaxPDF(taxData, language = 'en') {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        filters: ['ASCIIHexEncode'],
        lang: language.toUpperCase(),
        pdfVersion: '1.7'
    });

    // Add accessibility tags
    doc.setLanguage(language);
    doc.setDocumentProperties({
        title: taxData.translations.pdf_title || 'Tax Calculation Summary',
        subject: 'TaxEasy_ZA Tax Report',
        creator: 'TaxEasy_ZA v23',
        keywords: 'tax, south africa, sars'
    });

    // Add multilingual font
    doc.addFileToVFS('NotoSansSC.ttf', notoSansSC);
    doc.addFont('NotoSansSC.ttf', 'NotoSansSC', 'normal');
    doc.setFont('NotoSansSC');

    // PDF Metadata for accessibility
    doc.setCreator('TaxEasy_ZA v23 - POPIA Compliant');
    doc.setTitle(taxData.translations.pdf_title || 'Tax Calculation Summary');
    
    // Header Section
    doc.setFontSize(18);
    doc.text(taxData.translations.pdf_header, 15, 20);
    doc.setFontSize(12);
    doc.text(`${taxData.translations.generated_on}: ${new Date().toLocaleDateString()}`, 15, 28);

    // Personal Information Table
    doc.autoTable({
        startY: 35,
        head: [[taxData.translations.personal_info]],
        body: [
            [taxData.translations.full_name, taxData.fullName],
            [taxData.translations.id_number, taxData.idNumber],
            [taxData.translations.tax_year, taxData.taxYear]
        ],
        theme: 'grid',
        styles: {font: 'NotoSansSC', fontSize: 10}
    });

    // Tax Calculation Summary
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [[taxData.translations.calculation_summary]],
        body: [
            [taxData.translations.total_income, formatCurrency(taxData.grossIncome)],
            [taxData.translations.total_deductions, formatCurrency(taxData.totalDeductions)],
            [taxData.translations.taxable_income, formatCurrency(taxData.taxableIncome)],
            [taxData.translations.tax_payable, formatCurrency(taxData.taxPayable)],
            [taxData.translations.amount_due, {
                content: formatCurrency(taxData.finalAmount),
                styles: {textColor: taxData.finalAmount < 0 ? '#28a745' : '#dc3545'}
            }]
        ],
        theme: 'grid',
        styles: {font: 'NotoSansSC', fontSize: 10},
        columnStyles: {
            0: {fontStyle: 'bold'},
            1: {halign: 'right'}
        }
    });

    // Add accessible tags
    doc.setTag('h1', taxData.translations.pdf_header);
    doc.setTag('h2', taxData.translations.calculation_summary);
    
    // Save PDF with accessible filename
    const filename = `TaxReport_${taxData.fullName}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2
    }).format(amount);
}
