function init() {
    const flashMessages = document.querySelectorAll('.flash-msg');

    setTimeout(() => {
        for(const flashMessage of flashMessages) {
            flashMessage.classList.add('transparent')
        }
    }, 500);

    setTimeout(() => {
        document.getElementById('flash-container').remove();
    }, 3000);
}

window.addEventListener('load', init);