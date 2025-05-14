const textInput = document.getElementById('textInput');
const webApp = window.Telegram.WebApp;

webApp.ready();

function sendText() {
    const text = textInput.value.trim();
    if (!text) {
        webApp.showAlert('Введи текст!');
        return;
    }
    webApp.sendData(`/webapp_data ${text}`);
    webApp.close();
}