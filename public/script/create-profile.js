function init() {
    const profilePictureContainer = document.getElementById('profile-picture');
    const changeProfilePictureBtn = profilePictureContainer.querySelector('.icon');
    const profilePictureInputBtn = profilePictureContainer.querySelector('input');
    const profileImg = profilePictureContainer.querySelector('img');

    profilePictureContainer.addEventListener('click', (e) => {

        profilePictureInputBtn.click();
    });

    profilePictureInputBtn.addEventListener('change', (e) => {
        const image = profilePictureInputBtn.files[0];

        profileImg.src = URL.createObjectURL(image);

        profileImg.onload = () => {
            URL.revokeObjectURL(profileImg.src);
        }
    })
}

window.addEventListener('load', init);