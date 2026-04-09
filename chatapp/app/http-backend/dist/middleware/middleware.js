import jwt, {} from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
export function Middleware(req, res, next) {
    const token = req.headers.token;
    if (typeof token !== "string") {
        return null;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    if (!decode) {
        res.json({
            msg: "Auth failed / Invalid Token"
        });
        return;
    }
    req.userId = decode.id;
    next();
}
//# sourceMappingURL=middleware.js.map