const redis = require("../DB/redis");
const RateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        const key = `rate-limit:${ip}`;
        const request = await redis.incr(key);
        if (request === 1) {
            await redis.expire(key, 100);
        }
        if (request > 5) {
            return res.status(429).json({
                message: "Too many requests"
            });
        }
        next();
    } catch (error) {
        next();
    }
};
module.exports = RateLimiter;