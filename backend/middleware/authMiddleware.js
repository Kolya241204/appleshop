const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Необходима авторизация"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Недействительный токен"
        });

    }

};