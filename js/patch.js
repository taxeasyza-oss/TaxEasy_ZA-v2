/* =========================================================
   TAXEASY_ZA – GLOBAL HOT-FIX BUNDLE
   Fixes: 1) empty FAQ, 2) empty tooltips,
          3) page 1 overflow, 4) missing occupation deductions,
          5) incomplete advanced sections
   ========================================================= */

/* 1️⃣  FAQ NOT SHOWING  */
document.addEventListener('DOMContentLoaded', () => {
  const isFaq = location.pathname.includes('faq.html');
  if (isFaq) {
    fetch('faq_en.json')      // fallback to English
      .then(r => r.json())
      .then(d => renderFaq(d.faqs || []))
      .catch(() => document.getElementById('faqItems').innerHTML = '<p>FAQ could not be loaded.</p>');
  }
});

function renderFaq(faqs) {
  const container = document.getElementById('faqItems');
  if (!container) return;
  container.innerHTML = faqs.map((f, i) => `
    <div class="faq-item" data-category="${f.category}">
      <button class="faq-question" onclick="toggleFaq(${i})">${f.question} <i class="fas fa-chevron-down"></i></button>
      <div class="faq-answer" id="answer-${i}">${f.answer}</div>
    </div>
  `).join('');
}

/* 2️⃣  EMPTY TOOLTIPS  */
document.addEventListener('DOMContentLoaded', () => {
  // fallback English tooltip text if any are missing
  const FALLBACK = {
    basic_salary_tooltip: '<strong>Code 3601:</strong> Regular monthly/annual salary before deductions.',
    bonus_tooltip: '<strong>Code 3605:</strong> 13th cheque, performance bonus, etc.',
    age_tooltip: '<strong>Tax Thresholds (2025):</strong><br>Under 65: R95,750<br>65-75: R148,217<br>Over 75: R165,689'
    // add more keys as needed
  };

  // load tooltips from JSON, fallback to FALLBACK
  fetch('en.json')
    .then(r => r.json())
    .then(data => Object.assign(window.translations = data, FALLBACK))
    .then(() => {
      document.querySelectorAll('.tooltip-icon').forEach(icon => {
        const key = icon.dataset.tooltip || icon.closest('.input-group')?.querySelector('input,select')?.id + '_tooltip';
        if (window.translations[key]) {
          icon.title = ''; // remove default browser tooltip
          icon.addEventListener('mouseenter', () => {
            const tip = document.createElement('div');
            tip.className = 'tooltip-popup';
            tip.innerHTML = window.translations[key];
            tip.style.cssText = 'position:absolute;background:#032E61;color:#fff;padding:.5rem;border-radius:6px;font-size:.8rem;max-width:250px;z-index:9999;';
            document.body.appendChild(tip);
            const rect = icon.getBoundingClientRect();
            tip.style.left = rect.left + 'px';
            tip.style.top  = (rect.top - tip.offsetHeight - 4) + 'px';
            icon.addEventListener('mouseleave', () => tip.remove(), { once: true });
          });
        }
      });
    });
});

/* 3️⃣  PREVENT VERTICAL SCROLL ON PAGE 1  */
const style = document.createElement('style');
style.textContent = `
  .page { display:none; }
  .page.active { display:block; overflow:hidden; }
`;
document.head.appendChild(style);

/* 4️⃣  OCCUPATION DEDUCTIONS NOT SHOWING  */
document.addEventListener('change', e => {
  if (e.target.id === 'occupation') {
    document.querySelectorAll('.occupation-fields').forEach(el => el.style.display = 'none');
    const target = document.getElementById(e.target.value + 'Fields');
    if (target) target.style.display = 'block';
  }
});

/* 5️⃣  COMPLETE ADVANCED SECTION MARKUP  */
document.addEventListener('DOMContentLoaded', () => {
  // inject missing advanced inputs only once
  if (document.getElementById('advancedForm')) return; // already handled

  // helper to create input
  const mk = (label, id, type = 'number', min = 0) => {
    const div = document.createElement('div');
    div.className = 'input-group';
    div.innerHTML = `<label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" min="${min}" step="0.01">`;
    return div;
  };

  // travel extras
  const travelExtras = document.getElementById('travelExpensesGroup');
  if (travelExtras && travelExtras.children.length < 3) {
    travelExtras.appendChild(mk('Fuel Expenses', 'fuelExpenses'));
    travelExtras.appendChild(mk('Maintenance Expenses', 'maintenanceExpenses'));
    travelExtras.appendChild(mk('Vehicle Insurance', 'insuranceExpenses'));
    travelExtras.appendChild(mk('Toll Fees', 'tollFees'));
    travelExtras.appendChild(mk('Parking Fees', 'parkingFees'));
  }

  // renewable energy
  const renewable = document.querySelector('[data-section="renewable_energy"]');
  if (renewable && renewable.children.length < 3) {
    renewable.appendChild(mk('Solar Water Heater (Section 12B)', 'solarWaterHeater'));
    renewable.appendChild(mk('Solar PV System (Section 12B)', 'solarPV'));
    renewable.appendChild(mk('Other Renewable Energy', 'otherRenewable'));
  }

  // occupation-specific
  const occFields = document.querySelector('[data-section="occupation-specific"]');
  if (occFields && occFields.children.length < 5) {
    occFields.appendChild(mk('Software Licences', 'softwareLicenses'));
    occFields.appendChild(mk('Hardware Upgrades', 'hardwareUpgrades'));
    occFields.appendChild(mk('Medical Equipment', 'medicalEquipment'));
    occFields.appendChild(mk('Professional Insurance', 'professionalInsurance'));
    occFields.appendChild(mk('Financial Software', 'financialSoftware'));
    occFields.appendChild(mk('Market Data Subscriptions', 'marketData'));
    occFields.appendChild(mk('Classroom Supplies', 'classroomSupplies'));
    occFields.appendChild(mk('Educational Materials', 'educationalMaterials'));
    occFields.appendChild(mk('Safety Equipment', 'safetyEquipment'));
    occFields.appendChild(mk('Occupation-Specific Expenses', 'occupationSpecificExpenses'));
  }
});
