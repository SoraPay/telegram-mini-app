const webApp = window.Telegram.WebApp;
webApp.ready();

const navButtons = document.querySelectorAll('.nav-buttons button');
const pages = document.querySelectorAll('.page');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        pages.forEach(page => page.classList.remove('active'));
        if (button.querySelector('i').classList.contains('fa-home')) {
            document.querySelector('.main-page').classList.add('active');
        } else if (button.querySelector('i').classList.contains('fa-heart')) {
            document.querySelector('.favorites-page').classList.add('active');
        } else if (button.querySelector('i').classList.contains('fa-user')) {
            document.querySelector('.profile-page').classList.add('active');
        }
    });
});

const favoriteButtons = document.querySelectorAll('.favorite-btn');
favoriteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.querySelector('i').classList.toggle('liked');
        if (btn.querySelector('i').classList.contains('liked')) {
            webApp.showAlert('Добавлено в избранное!');
        } else {
            webApp.showAlert('Удалено из избранного!');
        }
    });
});

const notificationsBtn = document.getElementById('notifications-btn');
notificationsBtn.addEventListener('click', () => {
    const isEnabled = notificationsBtn.textContent === 'Включить уведомления';
    notificationsBtn.textContent = isEnabled ? 'Выключить уведомления' : 'Включить уведомления';
    webApp.showAlert(isEnabled ? 'Уведомления включены!' : 'Уведомления выключены!');
});

function editPhone() {
    webApp.showAlert('Функция изменения телефона в разработке');
}

function editAddress() {
    webApp.showAlert('Функция добавления адреса в разработке');
}