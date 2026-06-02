// margin/generateMarginPresetButtons.js
function generateMarginPresetButtons() {
    let buttonsHTML = '';
    
    for (const [presetKey, presetValue] of Object.entries(MARGIN_PRESETS)) {
        const presetName = formatPresetName(presetKey);
        buttonsHTML += `<div class="margin-preset-btn" data-preset="${presetKey}">${presetName}</div>`;
    }
    
    return buttonsHTML;
}