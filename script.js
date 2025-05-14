const textInput = document.getElementById('textInput');
const webApp = window.Telegram.WebApp;

webApp.ready();

function sendText() {
    const text = textInput.value.trim();
    if (!text) {
        webApp.showAlert('Введи текст!');
        return;
    }
    console.log('Отправка данных:', `/webapp_data ${text}`);
    webApp.sendData(`/webapp_data ${text}`);
    webApp.showAlert('Попытка отправки');
}