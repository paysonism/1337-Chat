require("dotenv").config();
const { UserModel } = require("../model/User.Model");
const { BlacklistModel } = require("../model/Blacklist.Model");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    try {
        // check this token is blocked or not
        const isBlocked = await BlacklistModel.findOne({ token });
        if (isBlocked) {
            return res.status(403).json({ message: "Please Login" });
        }

        // check is token is expired or not
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(403).json({ message: "Unauthorized Access" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError")
            return res.status(400).json({ message: "Access token expired" });
        else return res.status(400).json({ message: "Please Login" });
    }
};

module.exports = { authenticate };
