router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const product = await db.query(
            "SELECT * FROM get_product($1)",
            [id]
        );

        const options = await db.query(
            "SELECT * FROM view_options($1)",
            [id]
        );

        const specifications = await db.query(
            `
            SELECT *
            FROM specifications_option
            WHERE product_id = $1
            `,
            [id]
        );

        res.json({
            product: product.rows[0],
            options: options.rows,
            specifications: specifications.rows
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});