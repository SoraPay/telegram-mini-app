const webApp = window.Telegram.WebApp;
webApp.ready();

// Получаем ID пользователя для уникальной авторизации
const userId = webApp.initDataUnsafe.user ? webApp.initDataUnsafe.user.id : 'default_user';

// Загружаем данные пользователя из localStorage (телефон и адрес редактируются в профиле)
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

const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        pages.forEach(page => page.classList.remove('active'));
        const pageId = button.getAttribute('data-page');
        document.querySelector(`.page.${pageId}-page`).classList.add('active');
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
        updateFavorites();
    });
});

const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', () => {
    pages.forEach(page => page.classList.remove('active'));
    document.querySelector('.main-page').classList.add('active');
});

const buyBtn = document.getElementById('buy-btn');
buyBtn.addEventListener('click', () => {
    if (userData.address === 'Укажите адрес' || userData.phone === '+7 (XXX) XXX-XX-XX') {
        webApp.showAlert('Пожалуйста, укажите телефон и адрес доставки в профиле перед покупкой!');
    } else {
        webApp.showPopup({
            title: 'Подтверждение покупки',
            message: 'Хотите указать второй номер телефона? (опционально)',
            inputPlaceholder: 'Например: +79991234567',
            buttons: [
                { id: 'yes', type: 'default', text: 'Да' },
                { id: 'no', type: 'default', text: 'Нет' }
            ]
        }, (buttonId, input) => {
            const product = products[currentProductId];
            if (buttonId === 'yes' && input) {
                const deliveryInfo = `Телефон: ${userData.phone} (второй: ${input})`;
                webApp.showAlert(`Вы купили ${product.title} за ${product.price}! Доставка по адресу: ${userData.address}. ${deliveryInfo}`);
            } else {
                const deliveryInfo = `Телефон: ${userData.phone}`;
                webApp.showAlert(`Вы купили ${product.title} за ${product.price}! Доставка по адресу: ${userData.address}. ${deliveryInfo}`);
            }
        });
    }
});

const notificationsBtn = document.getElementById('notifications-btn');
notificationsBtn.addEventListener('click', () => {
    const isEnabled = notificationsBtn.textContent === 'Включить уведомления';
    notificationsBtn.textContent = isEnabled ? 'Выключить уведомления' : 'Включить уведомления';
    webApp.showAlert(isEnabled ? 'Уведомления включены!' : 'Уведомления выключены!');
});

function editPhone() {
    openModal('Изменить телефон', userData.phone, 'phone');
}

function editAddress() {
    openModal('Изменить адрес', userData.address, 'address');
}

function openModal(title, value, type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalInput = document.getElementById('modal-input');
    modalTitle.textContent = title;
    modalInput.value = value;
    modalInput.dataset.type = type;
    modal.style.display = 'flex';
}

function saveModal() {
    const modalInput = document.getElementById('modal-input');
    const type = modalInput.dataset.type;
    const value = modalInput.value.trim();

    if (value) {
        if (type === 'phone') {
            userData.phone = value;
            document.getElementById('phone').textContent = userData.phone;
        } else if (type === 'address') {
            userData.address = value;
            document.getElementById('address').textContent = userData.address;
        }
        localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
        webApp.showAlert(`${type === 'phone' ? 'Телефон' : 'Адрес'} успешно обновлён!`);
    } else {
        webApp.showAlert(`Пожалуйста, введите ${type === 'phone' ? 'номер телефона' : 'адрес'}!`);
    }
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
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