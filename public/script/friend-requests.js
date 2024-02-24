function init() {
    const acceptRequestBtns = document.querySelectorAll('.request-accept-btn');
    const cancelRequestBtns = document.querySelectorAll('.request-cancel-btn');

    for(let acceptRequestBtn of acceptRequestBtns) {
        acceptRequestBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const url = `/search/requests/accept/${e.target.dataset.user_id}`;

            const data = await fetch(url, {method: 'PATCH'});
            const resp = await data.json();

            if(resp.updated === true) {
                window.location.reload();
            }
            else {
                alert('Internal error. Please try later.');
            }
        })
    }

    for(let cancelRequestBtn of cancelRequestBtns) {
        cancelRequestBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const url = `/search/requests/cancel/${e.target.dataset.user_id}`;

            const data = await fetch(url, {method: 'PATCH'});
            const resp = await data.json();

            if(resp.updated === true) {
                window.location.reload();
            }
            else {
                alert('Internal error. Please try later.');
            }
        })
    }
    
}

window.addEventListener('load', init);