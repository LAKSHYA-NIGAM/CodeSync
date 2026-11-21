const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next) {
    try {
        // 1. Get token from Authorization header or cookie
        const authHeader = req.headers.authorization;
        let token = null;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                message: "Authentication token required"
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_fallback');

        // 3. Find the user
        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // 4. Attach user to request
        req.user = user;

        // 5. Continue to controller
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;
