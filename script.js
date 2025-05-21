const webApp = window.Telegram.WebApp;
webApp.ready();

// Получаем ID пользователя для уникальной авторизации
const userId = webApp.initDataUnsafe.user ? webApp.initDataUnsafe.user.id : 'default_user';

// Загружаем данные пользователя из localStorage
let userData = JSON.parse(localStorage.getItem(`user_${userId}`)) || { phone: '+7 (XXX) XXX-XX-XX', address: 'Укажите адрес' };
document.getElementById('phone').textContent = userData.phone;
document.getElementById('address').textContent = userData.address;

// Данные товаров
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
    },
    3: {
        title: "Товар 3",
        description: "Описание товара 3",
        extendedDescription: "Полное описание товара 3: новый продукт с уникальными функциями.",
        price: "300 руб",
        delivery: "Доставка за 5 дней",
        reviews: "Отзывы: 4.2/5",
        variants: "Цвет: чёрный, белый"
    },
    4: {
        title: "Товар 4",
        description: "Описание товара 4",
        extendedDescription: "Полное описание товара 4: стильный и современный продукт.",
        price: "400 руб",
        delivery: "Доставка за 4 дня",
        reviews: "Отзывы: 4.7/5",
        variants: "Цвет: золотой, серебряный"
    }
};

// Хранилище для избранного и истории
let favorites = [];
let history = [];

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
            updateFavorites();
        } else if (button.querySelector('i').classList.contains('fa-user')) {
            document.querySelector('.profile-page').classList.add('active');
        }
    });
});

let currentProductId = null;

const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('click', () => {
        const productId = card.getAttribute('data-id');
        currentProductId = productId;
        const product = products[productId];
        if (product) {
            pages.forEach(page => page.classList.remove('active'));
            const productPage = document.querySelector('.product-page');
            productPage.classList.add('active');
            document.getElementById('product-title').textContent = product.title;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-extended-description').textContent = product.extendedDescription;
            document.getElementById('product-price').textContent = `Цена: ${product.price}`;
            document.getElementById('product-delivery').textContent = product.delivery;
            document.getElementById('product-reviews').textContent = product.reviews;
            document.getElementById('product-variants').textContent = product.variants;

            updateHistory(productId);
        }
    });

    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = card.getAttribute('data-id');
        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
            favoriteBtn.textContent = 'В избранное';
            webApp.showAlert('Удалено из избранного!');
        } else {
            favorites.push(productId);
            favoriteBtn.textContent = 'Убрать из избранного';
            webApp.showAlert('Добавлено в избранное!');
        }
    });
});

const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', () => {
    pages.forEach(page => page.classList.remove('active'));
    document.querySelector('.main-page').classList.add('active');
});

const buyBtn = document.getElementById('buy-btn');
buyBtn.addEventListener('click', () => {
    if (userData.phone === '+7 (XXX) XXX-XX-XX' || userData.address === 'Укажите адрес') {
        webApp.showAlert('Пожалуйста, укажите телефон и адрес доставки в профиле перед покупкой!');
    } else {
        const product = products[currentProductId];
        webApp.showAlert(`Вы купили ${product.title} за ${product.price}! Доставка по адресу: ${userData.address}`);
    }
});

const notificationsBtn = document.getElementById('notifications-btn');
notificationsBtn.addEventListener('click', () => {
    const isEnabled = notificationsBtn.textContent === 'Включить уведомления';
    notificationsBtn.textContent = isEnabled ? 'Выключить уведомления' : 'Включить уведомления';
    webApp.showAlert(isEnabled ? 'Уведомления включены!' : 'Уведомления выключены!');
});

function editPhone() {
    webApp.showPopup({
        title: 'Изменить телефон',
        message: 'Введите новый номер телефона',
        buttons: [
            { id: 'save', type: 'default', text: 'Сохранить' },
            { type: 'cancel', text: 'Отмена' }
        ]
    }, (buttonId, input) => {
        if (buttonId === 'save' && input) {
            userData.phone = input;
            document.getElementById('phone').textContent = userData.phone;
            localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
            webApp.showAlert('Телефон успешно обновлён!');
        }
    });
}

function editAddress() {
    webApp.showPopup({
        title: 'Изменить адрес',
        message: 'Введите новый адрес доставки',
        buttons: [
            { id: 'save', type: 'default', text: 'Сохранить' },
            { type: 'cancel', text: 'Отмена' }
        ]
    }, (buttonId, input) => {
        if (buttonId === 'save' && input) {
            userData.address = input;
            document.getElementById('address').textContent = userData.address;
            localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
            webApp.showAlert('Адрес успешно обновлён!');
        }
    });
}

function updateFavorites() {
    const favoritesContainer = document.querySelector('.favorites-scroll');
    favoritesContainer.innerHTML = '';
    favorites.forEach(productId => {
        const product = products[productId];
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', productId);
        card.innerHTML = `
            <img src="https://via.placeholder.com/100" alt="Product">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <span>${product.price}</span>
            <button class="favorite-btn">Убрать из избранного</button>
        `;
        favoritesContainer.appendChild(card);
        card.addEventListener('click', () => {
            pages.forEach(page => page.classList.remove('active'));
            const productPage = document.querySelector('.product-page');
            productPage.classList.add('active');
            document.getElementById('product-title').textContent = product.title;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-extended-description').textContent = product.extendedDescription;
            document.getElementById('product-price').textContent = `Цена: ${product.price}`;
            document.getElementById('product-delivery').textContent = product.delivery;
            document.getElementById('product-reviews').textContent = product.reviews;
            document.getElementById('product-variants').textContent = product.variants;

            updateHistory(productId);
        });

        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            favorites = favorites.filter(id => id !== productId);
            favoriteBtn.textContent = 'В избранное';
            webApp.showAlert('Удалено из избранного!');
            updateFavorites();
        });
    });
}

function updateHistory(productId) {
    const historyContainer = document.querySelector('.history-scroll');
    history = history.filter(id => id !== productId);
    history.unshift(productId);
    if (history.length > 7) {
        history.pop();
    }

    historyContainer.innerHTML = '';
    history.forEach(id => {
        const product = products[id];
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = product.title;
        historyContainer.appendChild(card);
    });
}