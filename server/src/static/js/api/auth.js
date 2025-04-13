const loginContainer = document.querySelector('#loginContainer')
const registerContainer = document.querySelector('#registerContainer')
const headerContainer = document.querySelector('#headerContainer')
loginContainer
    ?.querySelector('form')
    ?.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const email = loginContainer.querySelector('#inputEmail').value
        const password = loginContainer.querySelector('#inputPassword').value
        const data = JSON.stringify({email, password});
        $.ajax({
            url: '/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: data,
            success: function (response) {
                window.location.href = '/';
            },
            error: function (xhr, status, error) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    console.error(xhr.responseJSON);
                    createToast('error', xhr.responseJSON.message);
                } else {
                    createToast('error', 'Server error');
                }
            }
        });
    });

registerContainer
    ?.querySelector('form')
    ?.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        const email = registerContainer.querySelector('#inputEmail').value
        const password = registerContainer.querySelector('#inputPassword').value
        const username = registerContainer.querySelector('#inputUsername').value
        const data = JSON.stringify({email, password, username});
        $.ajax({
            url: '/api/register',
            method: 'POST',
            contentType: 'application/json',
            data: data,
            success: function (response) {
                window.location.href = '/';
            },
            error: function (xhr, status, error) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    console.error(xhr.responseJSON);
                    createToast('error', xhr.responseJSON.message);
                } else {
                    createToast('error', 'Server error');
                }
            }
        });
    });

headerContainer
    ?.querySelector('#logoutButton')
    ?.addEventListener('click', async () => {
        $.ajax({
            url: '/api/logout',
            method: 'POST',
            contentType: 'application/json',
            success: function (response) {
                window.location.href = '/login';
            },
            error: function (xhr, status, error) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    console.error(xhr.responseJSON);
                    createToast('error', xhr.responseJSON.message);
                } else {
                    console.log(xhr.responseJSON)
                    createToast('error', 'Server error');
                }
            }
        });
    })