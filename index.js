const express = require("express");
const { connection } = require("./config/db");
const { userRoutes } = require("./routes/User.Routes");
const { groupRoutes } = require("./routes/Group.Routes");
const { UserModel } = require("./model/User.Model");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("Server online. Make sure your ports are correct in '/scripts' - Made By Payson - github.com/paysonism");
});
app.use("/user", userRoutes);
app.use("/group", groupRoutes);
const obj = {};
io.on("connection", (socket) => {
    console.log("Connection Established");

    socket.on("createConnection", (userId) => {
        obj[userId] = socket.id;
    });

    //server listening
    socket.on("chatMsg", async (msg, receiverId, senderId) => {
        let newMsg = {
            message: msg,
            senderId: senderId,
            receiverId: receiverId,
        };
        await UserModel.updateOne(
            { _id: senderId },
            { $push: { chatMessageModel: newMsg } }
        );
        await UserModel.updateOne(
            { _id: receiverId },
            { $push: { chatMessageModel: newMsg } }
        );
        // to individual socketid (private message)
        io.to(obj[receiverId]).emit("receivedMsg", msg, senderId);
    });
    socket.on("disconnect", () => {
        console.log("Connection Terminated");
    });
});

httpServer.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Successfully Connected to the 1337 Server");
        console.log("Server Port: " + process.env.PORT);
        console.log("Made By Payson - github.com/paysonism");
    } catch (error) {
        console.log(error);
    }
});
