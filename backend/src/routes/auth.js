const router = require("express").Router();
const jwt = require("jsonwebtoken");
const db = require("../db/db");

// Регистрация
router.post("/register", async (req, res) => {
    try {

        const { login, password, email } = req.body;

        await db.query(
            "SELECT create_user($1,$2,$3)",
            [login, password, email]
        );

        res.json({
            message: "Пользователь зарегистрирован"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Ошибка регистрации"
        });

    }
});

// Авторизация
router.post("/login", async (req, res) => {

    try {

        const { login, password } = req.body;

        const result = await db.query(
            `
            SELECT id, login, email
            FROM users
            WHERE login = $1
              AND pass = $2
            `,
            [login, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Неверный логин или пароль"
            });
        }

        const user = result.rows[0];

        const token = jwt.sign(
            {
                id: user.id,
                login: user.login
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            user
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Ошибка авторизации"
        });

    }

});

module.exports = router;