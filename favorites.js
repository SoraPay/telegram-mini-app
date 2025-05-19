const webApp = window.Telegram.WebApp;
webApp.ready();

const navButtons = document.querySelectorAll('.nav-buttons button');
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        if (button.querySelector('i').classList.contains('fa-home')) {
            webApp.openLink('https://sorapay.github.io/telegram-mini-app/');
        } else if (button.querySelector('i').classList.contains('fa-user')) {
            webApp.showAlert('Переход на "Профиль"');
        }
    });
});

const favoriteButtons = document.querySelectorAll('.favorite-btn');
favoriteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.querySelector('i').classList.toggle('liked');
        if (btn.querySelector('i').classList.contains('liked')) {
            webApp.showAlert('Удалено из избранного!');
        } else {
            webApp.showAlert('Добавлено в избранное!');
        }
    });
});