const router = require("express").Router();
const db = require("../db/db");
const auth = require("../middleware/authMiddleware");

// Оформление заказа из корзины
router.post("/checkout", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Находим активную корзину пользователя
        const cartRes = await db.query(
            "SELECT id FROM cart WHERE users_id = $1 AND status = 'active'",
            [userId]
        );

        if (cartRes.rows.length === 0) {
            return res.status(400).json({ message: "У вас нет активной корзины" });
        }

        const cartId = cartRes.rows[0].id;

        // 2. Вызываем транзакционную SQL-функцию
        // Передаем cartId, userId и status_id (например, 1 - "Новый заказ")
        const orderRes = await db.query(
            "SELECT checkout_cart($1, $2, 1) AS order_id",
            [cartId, userId]
        );

        // 3. Закрываем старую корзину (меняем статус)
        await db.query(
            "UPDATE cart SET status = 'completed', update = NOW() WHERE id = $1",
            [cartId]
        );

        res.json({ 
            message: "Заказ успешно оформлен", 
            orderId: orderRes.rows[0].order_id 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при оформлении заказа" });
    }
});

// Получить историю заказов текущего пользователя
router.get("/history", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Запрос к БД для получения списка заказов
        const result = await db.query(
            `SELECT id, status_id, created_at FROM orders WHERE users_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка загрузки истории" });
    }
});

// Обновление статуса заказа (доступно только админу)
// В идеале здесь должен быть middleware для проверки роли (isAdmin)
router.patch("/:id/status", auth, async (req, res) => {
    try {
        const { statusId } = req.body;
        const orderId = req.params.id;

        await db.query(
            "UPDATE orders SET status_id = $1 WHERE id = $2",
            [statusId, orderId]
        );

        res.json({ message: "Статус заказа обновлен" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка обновления статуса" });
    }
});
module.exports = router;