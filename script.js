const textInput = document.getElementById('textInput');
const webApp = window.Telegram.WebApp;

console.log('Telegram.WebApp:', webApp);
webApp.ready();
console.log('webApp.ready() выполнен');

function sendText() {
    const text = textInput.value.trim();
    console.log('Текст:', text);
    if (!text) {
        webApp.showAlert('Введи текст!');
        return;
    }
    const botCommand = `https://t.me/testShopFood_bot?start=webapp_data_${encodeURIComponent(text)}`;
    console.log('Команда для бота:', botCommand);
    try {
        webApp.openLink(botCommand); // Отправляем команду через ссылку
        webApp.showAlert('Команда отправлена: ' + botCommand);
        setTimeout(() => webApp.close(), 500);
    } catch (error) {
        webApp.showAlert('Ошибка: ' + error.message);
    }
}