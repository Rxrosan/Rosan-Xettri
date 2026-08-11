// ui/initInputHover.js
function initInputHover() {
    const allInputs = document.querySelectorAll('.page-content input, #editableWitnesses input');
    
    allInputs.forEach(input => {
        input.addEventListener('mouseenter', function() {
            if (this.parentElement) {
                this.parentElement.classList.add('hover-active');
            }
        });
        
        input.addEventListener('mouseleave', function() {
            if (this.parentElement) {
                this.parentElement.classList.remove('hover-active');
            }
        });
        
        input.addEventListener('focus', function() {
            if (this.parentElement) {
                this.parentElement.classList.add('focus-active');
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.parentElement) {
                this.parentElement.classList.remove('focus-active');
            }
        });
    });
}