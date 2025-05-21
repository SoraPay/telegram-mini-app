const webApp = window.Telegram.WebApp;
webApp.ready();

// Данные товаров (заглушка)
const products = {
    1: {
        title: "Товар 1",
        description: "Описание товара 1",
        extendedDescription: "Полное описание товара 1: это отличный продукт с множеством функций.",
        price: "100 руб",
        delivery: "Доставка за 3 дня",
        reviews: "Отзывы: 4.5/5",
        variants: "Цвет: чёрный, золотой"
    },
    2: {
        title: "Товар 2",
        description: "Описание товара 2",
        extendedDescription: "Полное описание товара 2: надёжный и стильный выбор.",
        price: "200 руб",
        delivery: "Доставка за 2 дня",
        reviews: "Отзывы: 4.8/5",
        variants: "Цвет: белый, золотой"
    }
};

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

const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('click', () => {
        const productId = card.getAttribute('data-id');
        const product = products[productId];
        if (product) {
            pages.forEach(page => page.classList.remove('active'));
            const productPage = document.querySelector('.product-page');
            productPage.classList.add('active');
            document.getElementById('product-title').textContent = product.title;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-extended-description').textContent = product.extendedDescription;
            document.getElementById('product-price').textContent = `Цена: ${product.price}`;
            document.querySelector('.details-section:nth-child(3) p').textContent = product.delivery;
            document.querySelector('.details-section:nth-child(4) p').textContent = product.reviews;
            document.querySelector('.details-section:nth-child(5) p').textContent = product.variants;
        }
    });
});

const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', () => {
    pages.forEach(page => page.classList.remove('active'));
    document.querySelector('.main-page').classList.add('active');
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