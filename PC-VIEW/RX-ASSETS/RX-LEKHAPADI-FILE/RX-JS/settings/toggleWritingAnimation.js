// settings/toggleWritingAnimation.js
function toggleWritingAnimation() {
    const isAnimationEnabled = dom.animationToggle ? dom.animationToggle.checked : true;
    CONFIG.WRITING_ANIMATION_ENABLED = isAnimationEnabled;
    localStorage.setItem(CONFIG.WRITING_ANIMATION_KEY, isAnimationEnabled);
}