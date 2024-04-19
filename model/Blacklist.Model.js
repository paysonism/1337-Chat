const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
});

const BlacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = {
    BlacklistModel,
};
