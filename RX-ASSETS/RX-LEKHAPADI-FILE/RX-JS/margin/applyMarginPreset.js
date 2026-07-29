// margin/applyMarginPreset.js
function applyMarginPreset(pageNumber, preset) {
    const margins = MARGIN_PRESETS[preset] || { top: '1in', right: '1in', bottom: '1in', left: '1in' };
    
    document.getElementById(`topMargin${pageNumber}`).value = margins.top;
    document.getElementById(`rightMargin${pageNumber}`).value = margins.right;
    document.getElementById(`bottomMargin${pageNumber}`).value = margins.bottom;
    document.getElementById(`leftMargin${pageNumber}`).value = margins.left;
}