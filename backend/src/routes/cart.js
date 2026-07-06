const router = require("express").Router();
const db = require("../db/db");
const auth = require("../middleware/authMiddleware");

// Получить корзину
// Получить корзину пользователя (с полными данными товаров)
router.get("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Ищем активную корзину
        const cartRes = await db.query(
            "SELECT id FROM cart WHERE users_id = $1 AND status = 'active'",
            [userId]
        );

        if (cartRes.rows.length === 0) {
            return res.json([]); // Корзина пуста
        }

        const cartId = cartRes.rows[0].id;

        // 2. Получаем товары с названиями, ценами и картинками
        const items = await db.query(
            `
            SELECT 
                pc.product_option_id AS id,
                p.name AS product_name,
                po.name AS option_name,
                po.prise AS price,
                pc.total AS quantity,
                (SELECT link FROM photo WHERE product_option_id = po.id LIMIT 1) AS image
            FROM product_cart pc
            JOIN product_option po ON pc.product_option_id = po.id
            JOIN product p ON po.product_id = p.id
            WHERE pc.cart_id = $1
            `,
            [cartId]
        );

        res.json(items.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка получения корзины" });
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