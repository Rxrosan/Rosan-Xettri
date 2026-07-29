// config.js
const CONFIG = {
    ACCESS_CODE: 'RX-2061',
    TYPING_SPEED: 10,
    SESSION_KEY: 'fillBlankAuth',
    STORAGE_KEY: 'kapaliTamsukData',
    MAX_ROWS_PER_PAGE: 32,
    THEME_KEY: 'rxStudioTheme',
    PERSISTENT_LOGIN_KEY: 'rxStudioPersistentLogin',
    WRITING_ANIMATION_KEY: 'rxStudioWritingAnimation',
    WITNESS_BOTH_PAGES_KEY: 'rxStudioWitnessBothPages',
    PAGE_MARGINS_KEY: 'rxStudioPageMargins',
    TEMPLATE_KEY: 'rxStudioSelectedTemplate'
};

// AUTO-DETECT MARGIN PRESETS SYSTEM
const MARGIN_PRESETS = {
    Lekhapadi: { top: '3in', right: '1.5in', bottom: '1in', left: '2in' },
    lekhapadinextpage: { top: '1in', right: '1in', bottom: '1in', left: '2in' },
    resetandedit: { top: '0in', right: '0in', bottom: '0in', left: '0in' }
};

let TEMPLATE_SYSTEM = null;