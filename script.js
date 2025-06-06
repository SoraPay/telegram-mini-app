const Telegram = window.Telegram.WebApp;
Telegram.ready();

let cart = [];
let likedItems = [];
let recentlyViewed = [];

const API_URL = 'http://localhost:5000/api';

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    throw error;
  }
}

async function renderProducts() {
  try {
    const products = await fetchData('products');
    const banners = await fetchData('banners');

    const app = document.getElementById("app");
    app.innerHTML = `
      <header>
        <h1>Shop</h1>
        <div class="cart-icon" onclick="viewCart()"><i class="fas fa-shopping-cart"></i></div>
      </header>
      <div class="search-bar">
        <input type="text" placeholder="Search" oninput="filterProducts(this.value)">
      </div>
      <section class="promotion">
        <h2>Promotions</h2>
        <div class="banner-grid">${banners.map(banner => `
          <div class="banner-card">
            ${banner.photo ? `<img src="http://localhost:5000/${banner.photo.toLowerCase()}" alt="${banner.name}" />` : '<div class="image-placeholder"></div>'}
          </div>
        `).join('')}</div>
      </section>
      <section class="recently-viewed">
        <h2>Recently Viewed</h2>
        <div class="recent-grid">${recentlyViewed.map(product => `
          <div class="recent-card" onclick="viewProductDetail(${product.id})">
            ${product.photo ? `<img class="product-icon" src="http://localhost:5000/${product.photo.toLowerCase()}" alt="${product.name}" />` : '<div class="image-placeholder"></div>'}
            <p>${product.name}</p>
          </div>
        `).join('')}</div>
      </section>
      <section class="catalog">
        <h2>Catalog</h2>
        <div class="grid">${products.map(product => `
          <div class="card" onclick="viewProductDetail(${product.id})">
            ${product.photo ? `<img class="product-icon" src="http://localhost:5000/${product.photo.toLowerCase()}" alt="${product.name}" />` : '<div class="image-placeholder"></div>'}
            <div class="like-icon ${likedItems.some(item => item.id === product.id) ? 'liked' : ''}" onclick="toggleLike(${product.id}, event)">
              <i class="fas fa-heart"></i>
            </div>
            <p>${product.name}</p>
            <p>${product.description || ''}</p>
          </div>
        `).join('')}</div>
      </section>
      <nav class="bottom-nav">
        <div class="nav-item home active" onclick="renderProducts()"><i class="fas fa-home"></i></div>
        <div class="nav-item search" onclick="renderLikedItems()"><i class="fas fa-heart"></i></div>
        <div class="nav-item profile" onclick="renderProfile()"><i class="fas fa-user"></i></div>
      </nav>
    `;
    updateActiveNav('home');
  } catch (error) {
    console.error(error);
    alert('Ошибка загрузки данных');
  }
}

async function filterProducts(searchTerm) {
  try {
    const products = await fetchData('products');
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const app = document.getElementById("app");
    app.innerHTML = `
      <header>
        <h1>Shop</h1>
        <div class="cart-icon" onclick="viewCart()"><i class="fas fa-shopping-cart"></i></div>
      </header>
      <div class="search-bar">
        <input type="text" placeholder="Search" value="${searchTerm}" oninput="filterProducts(this.value)">
      </div>
      <section class="catalog">
        <h2>Catalog</h2>
        <div class="grid">${filtered.map(product => `
          <div class="card" onclick="viewProductDetail(${product.id})">
            ${product.photo ? `<img class="product-icon" src="http://localhost:5000/${product.photo.toLowerCase()}" alt="${product.name}" />` : '<div class="image-placeholder"></div>'}
            <div class="like-icon ${likedItems.some(item => item.id === product.id) ? 'liked' : ''}" onclick="toggleLike(${product.id}, event)">
              <i class="fas fa-heart"></i>
            </div>
            <p>${product.name}</p>
            <p>${product.description || ''}</p>
          </div>
        `).join('')}</div>
      </section>
      <nav class="bottom-nav">
        <div class="nav-item home active" onclick="renderProducts()"><i class="fas fa-home"></i></div>
        <div class="nav-item search" onclick="renderLikedItems()"><i class="fas fa-heart"></i></div>
        <div class="nav-item profile" onclick="renderProfile()"><i class="fas fa-user"></i></div>
      </nav>
    `;
    updateActiveNav('home');
  } catch (error) {
    console.error(error);
    alert('Ошибка фильтрации');
  }
}

async function viewProductDetail(productId) {
  try {
    const products = await fetchData('products');
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Товар не найден');
    if (!recentlyViewed.some(item => item.id === productId)) {
      recentlyViewed.push(product);
      if (recentlyViewed.length > 5) recentlyViewed.shift();
    }
    const app = document.getElementById("app");
    app.innerHTML = `
      <header>
        <div class="back-arrow" onclick="renderProducts()"><i class="fas fa-arrow-left"></i></div>
        <h1>${product.name}</h1>
      </header>
      <section class="product-detail">
        ${product.photo ? `<img src="http://localhost:5000/${product.photo.toLowerCase()}" alt="${product.name}" />` : '<div class="image-placeholder"></div>'}
        <h2>${product.name}</h2>
        <p>${product.description || ''}</p>
        <div class="feedback">
          <div class="rating">
            <span>4.8</span>
            <div class="stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
            </div>
            <span>125 reviews</span>
          </div>
          <div class="review">
            <div class="image-placeholder" style="width: 40px; height: 40px;"></div>
            <div>
              <p>Ethan Carter</p>
              <p>5 stars - 2 months ago</p>
              <p>The ${product.name} is fantastic...</p>
            </div>
          </div>
        </div>
        <button class="add-to-cart" onclick="addToCart(${product.id}); renderProducts()">Add to Cart</button>
      </section>
      <nav class="bottom-nav">
        <div class="nav-item home" onclick="renderProducts()"><i class="fas fa-home"></i></div>
        <div class="nav-item search" onclick="renderLikedItems()"><i class="fas fa-heart"></i></div>
        <div class="nav-item profile" onclick="renderProfile()"><i class="fas fa-user"></i></div>
      </nav>
    `;
  } catch (error) {
    console.error(error);
    alert('Ошибка загрузки товара');
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  Telegram.MainButton.show();
  Telegram.MainButton.setParams({
    text: `Checkout (${cart.length})`,
    color: '#31b545'
  });
  Telegram.MainButton.onClick(checkout);
}

function checkout() {
  Telegram.sendData(`/checkout ${cart.map(item => item.id).join(',')}`);
  Telegram.MainButton.hide();
}

function viewCart() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <header>
      <div class="back-arrow" onclick="renderProducts()"><i class="fas fa-arrow-left"></i></div>
      <h1>Cart</h1>
    </header>
    <section class="cart-items">
      ${cart.length ? cart.map(p => `<p>${p.name} - $${p.price}</p>`).join('') : '<p>Cart is empty</p>'}
    </section>
    <nav class="bottom-nav">
      <div class="nav-item home" onclick="renderProducts()"><i class="fas fa-home"></i></div>
      <div class="nav-item search" onclick="renderLikedItems()"><i class="fas fa-heart"></i></div>
      <div class="nav-item profile" onclick="renderProfile()"><i class="fas fa-user"></i></div>
    </nav>
  `;
}

function renderProfile() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <header>
      <div class="back-arrow" onclick="renderProducts()"><i class="fas fa-arrow-left"></i></div>
      <h1>Profile</h1>
    </header>
    <section class="profile">
      <div class="profile-header">
        <div class="image-placeholder avatar"></div>
        <h2>John Doe</h2>
        <p>@johndoe</p>
      </div>
      <div class="contact-item">
        <div class="icon phone"><i class="fas fa-phone"></i></div>
        <p>Phone number</p>
      </div>
      <div class="contact-item">
        <div class="icon bell"><i class="fas fa-bell"></i></div>
        <p>Notifications</p>
        <div class="toggle-switch"></div>
      </div>
    </section>
    <nav class="bottom-nav">
      <div class="nav-item home" onclick="renderProducts()"><i class="fas fa-home"></i></div>
      <div class="nav-item search" onclick="renderLikedItems()"><i class="fas fa-heart"></i></div>
      <div class="nav-item profile active" onclick="renderProfile()"><i class="fas fa-user"></i></div>
    </nav>
  `;
  updateActiveNav('profile');
}

async function renderLikedItems() {
  try {
    const products = await fetchData('products');
    const app = document.getElementById("app");
    app.innerHTML = `
      <header>
        <div class="back-arrow" onclick="renderProducts()"><i class="fas fa-arrow-left"></i></div>
        <h1>Liked Items</h1>
      </header>
      <section class="liked-items">
        <div class="grid">${likedItems.map(product => `
          <div class="card">
            ${product.photo ? `<img class="product-icon" src="http://localhost:5000/${product.photo.toLowerCase()}" alt="${product.name}" />` : '<div class="image-placeholder"></div>'}
            <div class="like-icon ${likedItems.some(item => item.id === product.id) ? 'liked' : ''}" onclick="toggleLike(${product.id}, event)">
              <i class="fas fa-heart"></i>
            </div>
            <p>${product.name}</p>
            <p>${product.description || ''}</p>
          </div>
        `).join('')}</div>
      </section>
      <nav class="bottom-nav">
        <div class="nav-item home" onclick="renderProducts()"><i class="fas fa-home"></i></div>
        <div class="nav-item search active" onclick="renderLikedItems()"><i class="fas fa-heart"></i></div>
        <div class="nav-item profile" onclick="renderProfile()"><i class="fas fa-user"></i></div>
      </nav>
    `;
    updateActiveNav('search');
  } catch (error) {
    console.error(error);
    alert('Ошибка загрузки избранного');
  }
}

function toggleLike(productId, event) {
  event.stopPropagation();
  const product = products.find(p => p.id === productId);
  const index = likedItems.findIndex(item => item.id === productId);
  if (index === -1) {
    likedItems.push(product);
  } else {
    likedItems.splice(index, 1);
  }
  renderProducts();
}

function updateActiveNav(activeClass) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  document.querySelector(`.nav-item.${activeClass}`).classList.add('active');
}

document.addEventListener("DOMContentLoaded", renderProducts);