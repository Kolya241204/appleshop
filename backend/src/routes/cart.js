const router = require("express").Router();
const db = require("../db/db");
const auth = require("../middleware/authMiddleware");

// Получить корзину
router.get("/", auth, async (req, res) => {

    try {

        const result = await db.query(
            "SELECT * FROM view_cart($1)",
            [req.user.id]
        );

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Ошибка получения корзины"
        });

    }

});

// Добавить товар
router.post("/", auth, async (req, res) => {

    try {

        const { optionId, quantity } = req.body;

        await db.query(
            "SELECT add_to_cart($1,$2,$3)",
            [
                req.user.id,
                optionId,
                quantity
            ]
        );

        res.json({
            message: "Товар добавлен"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Ошибка добавления"
        });

    }

});

// Очистить корзину
router.delete("/", auth, async (req, res) => {

    try {

        await db.query(
            "SELECT clear_cart($1)",
            [req.user.id]
        );

        res.json({
            message: "Корзина очищена"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Ошибка очистки корзины"
        });

    }

});

module.exports = router;