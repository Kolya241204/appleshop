// Создайте файл server.js в папке backend/
require("dotenv").config();
const app = require("./app"); // Импортируем вашу логику из app.js

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});