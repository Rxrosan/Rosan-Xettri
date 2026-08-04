// init/initWritingAnimation.js
function initWritingAnimationSetting() {
    const animationEnabled = localStorage.getItem(CONFIG.WRITING_ANIMATION_KEY) !== 'false';
    if (dom.animationToggle) dom.animationToggle.checked = animationEnabled;
    CONFIG.WRITING_ANIMATION_ENABLED = animationEnabled;
}