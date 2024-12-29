const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization

    const token = authHeader.split(" ")[1]

    jwt.verify(token, "secret-key", (error, result) => {
        if (!error) {
            req.user_id = result.user_id
            next()
        } else {
            console.error(error)
            return res.status(401).json({ message: "Unauthorized" })
        }
    })
}

module.exports = verifyToken