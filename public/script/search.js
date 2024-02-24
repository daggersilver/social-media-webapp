function init() {
    const queryUserResultContainer = document.getElementById('search-result-container');
    const queryUserForm = document.getElementById('search-form');
    const queryInput  = document.getElementById('search-input');

    queryUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const query = queryInput.value.trim();
        const url = `/search/users?userQuery=${query}`;

        const resp = await fetch(url);
        const htmlContent = await resp.text(); 

        queryUserResultContainer.innerHTML = htmlContent;
    });
}

window.addEventListener('load', init);