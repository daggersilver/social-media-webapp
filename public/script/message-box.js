var messageUpdateInterval;

function messageBoxCloseBtnClickHandler(e) {
    const messageBox = document.getElementById('message-box');

    messageBox.style.display = 'none';

    clearInterval(messageUpdateInterval);
}

async function messageUserBtnClickHandler(e) {
    const userTile  = e.target.closest('.user-tile');
    const friendUsername = userTile.dataset.username;
    const friendUserID = userTile.dataset.user_id;

    const messageBox = document.getElementById('message-box');
    const messageContainer = document.getElementById('message-box-main-container');

    messageBox.querySelector('#message-box-heading').innerText = '@' + friendUsername;
    
    messageBox.style.display = 'flex';
    messageBox.setAttribute('data-skip_posts', 0);
    messageBox.setAttribute('data-friend_user_id', friendUserID);

    messageContainer.innerHTML = '';

    await addNewMessages();

    messageUpdateInterval = setInterval(async () => {
        await addNewMessages();
    }, 2000);
}

async function messageFormSubmitHandler(e) {
    e.preventDefault();

    console.log('a')

    const messageContainer = document.getElementById('message-box-main-container');
    const messageBox = document.getElementById('message-box');
    const messageInput = document.getElementById('send-message-form-input');
    let skipPosts = parseInt(messageBox.dataset.skip_posts);
    const friendUserID = messageBox.dataset.friend_user_id;


    const newMessage = messageInput.value.trim();
    messageInput.value = '';

    await addNewMessages();

    if(newMessage) {
        messageContainer.appendChild(createMessage(newMessage, true));
    
        await fetch(`/message/${friendUserID}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content: newMessage})
        });
    
        skipPosts++;

        messageContainer.scrollTo(0, messageContainer.scrollHeight);
    
        messageBox.setAttribute('data-skip_posts', skipPosts);
    }

}

async function addNewMessages() {
    const messageContainer = document.getElementById('message-box-main-container');
    const messageBox = document.getElementById('message-box');
    let skipPosts = parseInt(messageBox.dataset.skip_posts);
    const friendUserID = messageBox.dataset.friend_user_id;

    const resp = await fetch(`/message/${friendUserID}?skip=${skipPosts}`);
    const messages = await resp.json();

    for(const message of messages) {
        const messageElement = createMessage(message.content, (message.receiver == friendUserID));

        messageContainer.appendChild(messageElement);
    }

    skipPosts += messages.length;
    messageBox.setAttribute('data-skip_posts', skipPosts);
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function createMessage(content, sent) {
    const message = document.createElement('div');

    if(sent)
        message.className = 'message-box-message sent-message';
    else
        message.className = 'message-box-message received-message';

    message.innerText = content;

    return message;
}
