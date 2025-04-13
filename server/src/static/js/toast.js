let notifications = document.querySelector('.notifications');

function createToast(type, text, title = null, icon = null) {
    let newToast = document.createElement('div');
    switch (type) {
        case 'success':
            title = 'Success';
            icon = 'fa-solid fa-circle-check'
            break
        case 'error':
            title = 'Error';
            icon = 'fa-solid fa-circle-exclamation'
            break
        case 'warning':
            title = 'Warning';
            icon = 'fa-solid fa-triangle-exclamation';
            break
        case 'info':
            title = 'Info';
            icon = 'fa-solid fa-circle-info';
            break
    }
    newToast.innerHTML = `
            <div class="toast show ${type}">
                <i class="${icon}"></i>
                <div class="content">
                    <div class="title">${title}</div>
                    <span>${text}</span>
                </div>
                <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
            </div>`;
    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(
        () => newToast.remove(), 5000
    )
}