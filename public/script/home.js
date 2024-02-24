let addNewPosts = true;
const POST_LIMIT = 5;
let skip_posts = 5;

function init() {
    const currUsername = document.body.getAttribute('data-username');
    const postTileContainer = document.getElementById('post-container');
    postTileContainer.setAttribute('data-addNewPosts', true);

    postTileContainer.addEventListener('scroll', async () => {
        let distanceToBottom = postTileContainer.scrollHeight 
                                    - postTileContainer.scrollTop 
                                    - postTileContainer.clientHeight;


        if(distanceToBottom < 10 && addNewPosts) {
            const loadingScreen = getLoadingScreen();
            postTileContainer.appendChild(loadingScreen);
            addNewPosts = false;

            const resp = await fetch(`/post?postLimit=${POST_LIMIT}&postSkip=${skip_posts}`);
            const fetchedPosts = await resp.text();

            postTileContainer.removeChild(loadingScreen);
            postTileContainer.insertAdjacentHTML('beforeend', fetchedPosts);

            if(fetchedPosts) {
                addNewPosts  = true;
                skip_posts += POST_LIMIT;
            }
        }
    })
}

window.addEventListener('load', init);