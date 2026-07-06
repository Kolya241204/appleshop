const router = require("express").Router();
const db = require("../db/db");
const jwt = require("jsonwebtoken");

// Регистрация
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        await db.query(
            "SELECT create_user($1, $2, $3)",
            [name, email, password]
        );

        res.json({
            message: "Пользователь создан"
        });

    } catch (e) {
        console.log(e);

        res.status(500).json({
            message: "Ошибка"
        });
    }
});

// 👇 ВСТАВЛЯЕШЬ СЮДА КОД ВХОДА
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const result = await db.query(
        `SELECT id, name, email
         FROM users
         WHERE email = $1
         AND password = $2`,
        [email, password]
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
            email: user.email
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

});

module.exports = router;