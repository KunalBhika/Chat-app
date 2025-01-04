import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) res.status(401).json({ error: "Unauthorized - try logging in again" });

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) res.status(401).json({ error: "Unauthorized - try logging in again" });

        const user = await User.findById(decode.userId).select("-password");
        if (!user) res.status(404).json({ error: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
}