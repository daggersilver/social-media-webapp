
function init() {
    const createPostBtn = document.getElementById('create-post-btn');
    const createPostPanel = document.getElementById('create-post-background');
    const closeCreatePostPanelBtn = document.getElementById('create-post-form-close-btn');
    const createPostForm = document.getElementById('create-post-form');
    const createPostInput = document.getElementById('post_content');
    const currUsername = document.getElementById('nav-user-profile').dataset.username;

    createPostBtn.addEventListener('click', () => {
        createPostPanel.style.display = 'flex';
    });

    closeCreatePostPanelBtn.addEventListener('click', () => {
        createPostPanel.style.display = 'none';
    });

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const postContent = createPostInput.value.trim();

        if(postContent === '') return ;

        createPostInput.value = '';

        const data = await fetch('/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({post_content: postContent})
        });

        const resp = await data.json();

        if(resp.inserted)
            window.location = `/user/${currUsername}`;
        else {
            createPostPanel.style.display = 'none';
            alert('internal error, try again later');
        }
    })
}

window.addEventListener('load', init);