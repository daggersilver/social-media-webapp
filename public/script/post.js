
function changeCount(node, change) {
    let textContent  = node.textContent;
    let num = parseInt(textContent.substring(1, textContent.length-1));

    node.textContent = `(${num+change})`;

}


async function changeCountDB(postID, change) {
    let operation = (change > 0 ? 'like' : 'unlike');
    let url = `/post/${operation}/${postID}`;
    
    const response = await fetch(url, {method: 'PATCH'});
    
}

function changeCommentLikeCount(node, change) {
    let textContent  = node.textContent;
    let num = parseInt(textContent);

    node.textContent = num+change;
}

async function changeCommentLikeCountDB(id, change) {
    let operation = (change > 0 ? 'like' : 'unlike');
    let url = `/post/comment/${operation}/${id}`;

    const response = await fetch(url, {method: 'PATCH'});

}

function postLikeBtnClickHandler(e) {
    const likeBtn = e.target;
    const postTile = likeBtn.closest('.post-tile');
    const currUsername = document.body.getAttribute('data-username');

    if(likeBtn.classList.contains('liked-icon')) {
        likeBtn.classList.remove('liked-icon');
        likeBtn.classList.add('unliked-icon');

        changeCount(likeBtn.nextSibling, -1);
        changeCountDB(postTile.id, -1);
    }
    else {
        likeBtn.classList.add('liked-icon');
        likeBtn.classList.remove('unliked-icon');

        changeCount(likeBtn.nextSibling, 1);
        changeCountDB(postTile.id, 1);
    } 
}

async function postCommentBtnClickHandler(e) {
    const commentPanel = document.getElementById('comment-container');
    commentPanel.style.display = 'flex';

    const postID = e.target.closest('.post-tile').id;
    commentPanel.setAttribute('data-post_id', postID);
    commentPanel.setAttribute('data-comment_increment', 0);

    document.getElementById('comment-container-box').setAttribute('data-post_id', postID);
    const commentList = document.getElementById('comment-container-2');
    commentList.innerHTML = '';

    const loadingScreen = getLoadingScreen();
    commentList.appendChild(loadingScreen);

    commentList.innerHTML = await getComments(postID);
}

async function commentPanelCloseBtnClickHandler() {
    const commentPanel = document.getElementById('comment-container');
    commentPanel.style.display = 'none';

    const postID = commentPanel.dataset.post_id;
    const commentIncrement = parseInt(commentPanel.dataset.comment_increment);
    const post = document.getElementById(postID);
    const commentIconText = post.querySelector('.comment-icon-text');

    const commentCountText = commentIconText.innerText;
    const commentCount = parseInt(commentCountText.substring(1, commentCountText.length-1));

    commentIconText.innerText = `(${commentCount+commentIncrement})`;

}

async function addCommentFormSubmitHandler(e) {
    e.preventDefault();

    const postID = document.getElementById('comment-container-box').dataset.post_id;
    const inputField = document.getElementById('add-comment-input');
    const commentPanel = document.getElementById('comment-container');
    
    const url = `/post/comment/${postID}`;

    const commentText = inputField.value.trim();

    if(commentText === '') return ;

    inputField.value = '';

    const commentList = document.getElementById('comment-container-2');
    const loadingScreen = getLoadingScreen();

    commentList.innerHTML = '';
    commentList.appendChild(loadingScreen);

    await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({commentText})
    });

    commentList.innerHTML = await getComments(postID);
    commentPanel.setAttribute('data-comment_increment', parseInt(commentPanel.dataset.comment_increment)+1);
}

async function commentDeleteBtnClickHandler(e) {
    const postID = document.getElementById('comment-container-box').dataset.post_id;
    const comment = e.target.closest('.comment-tile');
    const commentList = document.getElementById('comment-container-2');
    const commentPanel = document.getElementById('comment-container');
    const loadingScreen = getLoadingScreen();

    commentList.innerHTML = '';
    commentList.appendChild(loadingScreen);

    await fetch(`/post/comment/${comment.id}`, {
        method: 'DELETE'
    });

    commentList.innerHTML = await getComments(postID);
    commentPanel.setAttribute('data-comment_increment', parseInt(commentPanel.dataset.comment_increment)-1);
}

async function commentLikeBtnClickHandler(e) {
    const likeBtn = e.target.closest('.comment-like-btn ');
    const commentLikeCountText = likeBtn.nextSibling;
    const commentID = likeBtn.closest('.comment-tile').id;

    if(likeBtn.classList.contains('comment-solid-heart')) {
        likeBtn.classList.remove('comment-solid-heart');
        likeBtn.classList.add('comment-hollow-heart');

        changeCommentLikeCount(likeBtn.nextSibling, -1);
        changeCommentLikeCountDB(commentID, -1)
    }
    else {
        likeBtn.classList.add('comment-solid-heart');
        likeBtn.classList.remove('comment-hollow-heart');

        changeCommentLikeCount(likeBtn.nextSibling, 1);
        changeCommentLikeCountDB(commentID, 1)
    }
}

async function postDeleteBtnClickHandler(e) {
    const postTile = e.target.closest('.post-tile');
    const postID = postTile.id;

    const url = `/post/${postID}`;

    const confirmation = confirm('The post will be permanently deleted. Do you want to continue ?');

    if(!confirmation) return;

    e.target.closest('.post-delete-btn').disabled  = true;

    await fetch(url, {method: 'DELETE'});

    window.location.reload();
}

function getLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.appendChild(document.createElement('div'))
    loadingScreen.classList.add('loading-screen');

    return loadingScreen;
}

async function getComments(postID) {
    const resp = await fetch(`/post/comment/${postID}`);
    const comments = await resp.text();

    return comments;
}
