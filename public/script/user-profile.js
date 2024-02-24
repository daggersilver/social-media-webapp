function init() {
    const profileTile = document.getElementById('profile');
    const profilePictureContainer = document.getElementById('profile-picture');
    const username = profileTile.dataset.username;
    const addFriendBtn = document.getElementById('add-friend-btn');
    const cancelRequestBtn = document.getElementById('cancel-request-btn');
    const removeFriendBtn = document.getElementById('remove-friend-btn');
    const deleteRequestBtn = document.getElementById('delete-request-btn');
    const acceptRequestBtn = document.getElementById('accept-request-btn');

    if(addFriendBtn) {
        addFriendBtn.addEventListener('click', addFriendEventListener);
    }

    if(removeFriendBtn) {
        removeFriendBtn.addEventListener('click', removeFriendEventListener);
    }

    if(cancelRequestBtn) {
        cancelRequestBtn.addEventListener('click', cancelFriendRequestEventListener);
    }

    if(deleteRequestBtn) {
        deleteRequestBtn.addEventListener('click', deleteFriendRequestEventListener);
    }

    if(acceptRequestBtn) {
        acceptRequestBtn.addEventListener('click', acceptFriendRequestEventListener)
    }

    showProfilePicture();
  
    async function addFriendEventListener() {
        const data = await fetch(`/user/add/${username}`, {method: 'PATCH'});
        const resp = await data.json();

        if(resp.updated === true) {
            window.location.reload();
        }
        else {
            alert('internal error. Please try again later');
        }
    }

    async function cancelFriendRequestEventListener() {
        const data = await fetch(`/user/cancel-request/${username}`, {method: 'PATCH'});
        const resp = await data.json();

        if(resp.updated === true) {
            window.location.reload();
        }
        else {
            alert('internal error. Please try again later');
        }
    }

    async function removeFriendEventListener() {
        const data = await fetch(`/user/remove/${username}`, {method: 'PATCH'});
        const resp = await data.json();

        if(resp.updated === true) {
            window.location.reload();
        }
        else {
            alert('internal error. Please try again later');
        }
    }

    async function deleteFriendRequestEventListener() {
        const data = await fetch(`/user/delete-request/${username}`, {method: 'PATCH'});
        const resp = await data.json();

        if(resp.updated === true) {
            window.location.reload();
        }
        else {
            alert('internal error. Please try again later');
        }
    }

    async function acceptFriendRequestEventListener() {
        const data = await fetch(`/user/accept-request/${username}`, {method: 'PATCH'});
        const resp = await data.json();

        if(resp.updated === true) {
            window.location.reload();
        }
        else {
            alert('internal error. Please try again later');
        }
    }

    async function showProfilePicture() {
        const resp = await fetch(`/user/picture/${username}`);

        if(resp.status == 200) {
            const profileImage = await resp.blob();
            const profileImageURL = URL.createObjectURL(profileImage);
    
            profilePictureContainer.style.backgroundImage = `url(${profileImageURL})`;
        }
    }

}

window.addEventListener('load', init);