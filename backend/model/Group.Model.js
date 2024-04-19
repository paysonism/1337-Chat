const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema(
    {
        roomId: {
            type: Date,
            default: Date.now(),
        },
        admin: {
            type: String,
        },
        groupOfUsers: [],
        listOfMsg: [
            {
                msg: {
                    type: String,
                },
                senderId: {
                    type: String,
                },
                senderName: {
                    type: String,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        groupName: {
            type: String,
        },
        groupImg: {
            type: String,
            default:
                "https://t4.ftcdn.net/jpg/03/78/40/51/360_F_378405187_PyVLw51NVo3KltNlhUOpKfULdkUOUn7j.jpg",
        },
    },
    {
        timestamps: true,
    }
);

const GroupModel = mongoose.model("group", groupSchema);

module.exports = {
    GroupModel,
};
