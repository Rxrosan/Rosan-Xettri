// data/saveInputsToLocalStorage.js
function saveInputsToLocalStorage() {
    const allInputs = document.querySelectorAll('.page-content input, #editableWitnesses input');
    const data = Array.from(allInputs).map(input => input.value);
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
}