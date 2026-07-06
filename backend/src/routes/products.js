const router = require("express").Router();
const db = require("../db/db");

// Получить все товары
router.get("/", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM view_product();"
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Ошибка получения товаров"
        });
    }
});

// Получить один товар
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const product = await db.query(
            "SELECT * FROM get_product($1);",
            [id]
        );

        if (product.rows.length === 0) {
            return res.status(404).json({
                message: "Товар не найден"
            });
        }

        const options = await db.query(
            "SELECT * FROM view_options($1);",
            [id]
        );

        const photos = await db.query(
            "SELECT * FROM get_photos() WHERE product_option_id IN (SELECT id FROM view_options($1));",
            [id]
        );

        res.json({
            product: product.rows[0],
            options: options.rows,
            photos: photos.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Ошибка получения товара"
        });
    }
});

module.exports = router;