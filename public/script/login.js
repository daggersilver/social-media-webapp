
function init() {
    const togglePasswordBtn = document.querySelector('.password-field')
                                .querySelector('i');
    const passwordField = document.querySelector('.password-field')
                                .querySelector('input');

    togglePasswordBtn.addEventListener('click', () => {
        if(passwordField.type === 'password')
            passwordField.type = 'text';
        else
            passwordField.type = 'password';
    })
}

window.addEventListener('load', init);