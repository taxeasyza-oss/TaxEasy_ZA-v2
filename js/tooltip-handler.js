// tooltip-handler.js - FIXED
document.addEventListener('DOMContentLoaded', () => {
  const tooltip = document.createElement('div');
  tooltip.id = 'custom-tooltip';
  tooltip.className = 'tooltip-popup';
  tooltip.style.cssText = `
    position:absolute; background:#2c3e50; color:#fff;
    padding:12px 16px; border-radius:8px; font-size:14px;
    line-height:1.4; max-width:280px; box-shadow:0 8px 24px rgba(0,0,0,.3);
    z-index:1000; pointer-events:none; transition:opacity .3s;
  `;
  document.body.appendChild(tooltip);

  const getTooltip = (key, lang) => {
    const occupation = document.getElementById('occupation')?.value;
    let content = '';
    
    // Get base tooltip content
    const baseKey = `tooltip_${key}`;
    content = window.translations?.[lang]?.[baseKey] || '';
    
    // Add occupation-specific content if available
    if (occupation) {
      const occupationKey = `${baseKey}_${occupation}`;
      const occupationContent = window.translations?.[lang]?.[occupationKey];
      if (occupationContent) {
        content += `\n\n${occupationContent}`;
      }
    }
    
    return content;
  };

  document.addEventListener('mouseover', e => {
    const icon = e.target.closest('.tooltip-icon, [data-tooltip]');
    if (!icon) return;
    const key = icon.dataset.tooltip || icon.dataset.tooltipKey;
    const lang = document.getElementById('langSelect')?.value || 'en';
    const html = getTooltip(key, lang);
    if (!html) return;
    tooltip.innerHTML = html;   // ← renders HTML
    tooltip.style.opacity = 1;
    const r = icon.getBoundingClientRect();
    tooltip.style.left = `${r.left + window.scrollX}px`;
    tooltip.style.top  = `${r.bottom + window.scrollY + 8}px`;
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest('.tooltip-icon')) tooltip.style.opacity = 0;
  });

  document.getElementById('langSelect')?.addEventListener('change', () => tooltip.style.opacity = 0);
});


