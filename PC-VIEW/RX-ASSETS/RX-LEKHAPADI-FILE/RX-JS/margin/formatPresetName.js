// margin/formatPresetName.js
function formatPresetName(presetKey) {
    const names = {
        Lekhapadi: 'Lekhapadi',
        lekhapadinextpage: 'Next Page',
        resetandedit: 'Reset to Zero'
    };
    
    return names[presetKey] || presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
}