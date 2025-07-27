document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const key = document.getElementById('key').value;
    const errorMessage = document.getElementById('error-message');
    const phoneInput = document.getElementById('phone');
    const keyInput = document.getElementById('key');

    // Reset error states
    phoneInput.classList.remove('input-error');
    keyInput.classList.remove('input-error');
    errorMessage.style.display = 'none';

    const user = USERS.find(u => u.phone === phone && u.key === key);

    if (user) {
        localStorage.setItem('loggedInUserPhone', user.phone);
        window.location.href = 'KR-EXAM-ALL-COLLECTION.html';
    } else {
        errorMessage.style.display = 'block';
        phoneInput.classList.add('input-error');
        keyInput.classList.add('input-error');
    }
});