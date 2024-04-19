const authorisation = (permitted) => {
    return (req, res, next) => {
        const user_role = req.user.role;
        if (permitted.includes(user_role)) {
            next();
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }
    };
};

module.exports = {
    authorisation,
};
