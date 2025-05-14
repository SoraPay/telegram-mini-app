const textInput = document.getElementById('textInput');
const webApp = window.Telegram.WebApp;

console.log('Telegram.WebApp инициализирован:', webApp); // Проверка инициализации

webApp.ready();
console.log('webApp.ready() выполнен'); // Проверка готовности

function sendText() {
    const text = textInput.value.trim();
    console.log('Введённый текст:', text); // Логирование текста

    if (!text) {
        webApp.showAlert('Введи текст!');
        console.log('Показан алерт: введи текст');
        return;
    }

    const dataToSend = `/webapp_data ${text}`;
    console.log('Данные для отправки:', dataToSend); // Логирование данных

    try {
        webApp.sendData(dataToSend);
        console.log('Данные отправлены:', dataToSend); // Подтверждение отправки
        setTimeout(() => {
            webApp.close();
            console.log('Mini App закрыт после задержки');
        }, 500); // Задержка 500мс
    } catch (error) {
        console.error('Ошибка при отправке:', error); // Логирование ошибок
    }
}