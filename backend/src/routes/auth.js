const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Подключаем bcrypt
const db = require("../db/db");

// Регистрация
router.post("/register", async (req, res) => {
    try {
        const { login, password, email } = req.body;

        // Генерируем соль и хэшируем пароль (10 - сложность хэширования)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Передаем в базу захэшированный пароль
        await db.query(
            "SELECT create_user($1, $2, $3)",
            [login, hashedPassword, email]
        );

        res.json({ message: "Пользователь зарегистрирован" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка регистрации" });
    }
});

// Авторизация
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ищем пользователя только по email
        const result = await db.query(
            "SELECT id, login, email, pass FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Неверный email или пароль" });
        }

        const user = result.rows[0];

        // Сравниваем введенный пароль с хэшем из базы
        const validPassword = await bcrypt.compare(password, user.pass);
        if (!validPassword) {
            return res.status(401).json({ message: "Неверный email или пароль" });
        }

        const token = jwt.sign(
            { id: user.id, login: user.login },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user: { id: user.id, login: user.login, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка авторизации" });
    }
});

module.exports = router;