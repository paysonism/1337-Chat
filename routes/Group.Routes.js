const express = require("express");
const { GroupModel } = require("../model/Group.Model");
const groupRoutes = express.Router();

// ROUTES - CREATE GROUP

groupRoutes.post("/createGroup", async (req, res) => {
    const { admin, groupOfUsers, groupName, groupImg } = req.body;

    try {
        const group = new GroupModel({
            admin,
            groupOfUsers,
            groupName,
            groupImg,
        });
        await group.save();
        res.send({ msg: "Group created successfully", group });
    } catch (error) {
        res.send({ msg: "Something went wtong", error: error });
    }
});

// only role ==> admin can access this route
groupRoutes.post("/addMembersToGroup", async (req, res) => {
    const { newMembersId, groupId, adminId } = req.body;
    try {
        const group = await GroupModel.updateOne(
            { $and: [{ _id: groupId }, { admin: adminId }] },
            { $push: { groupOfUsers: newMembersId } }
        );

        if (group.modifiedCount == 0) {
            res.status(401).send({ error: "No groups found" });
        } else res.send({ msg: "User has been Added to group successfully" });
    } catch (error) {
        res.send({ msg: "Something went wtong", error: error });
    }
});

// remove members from group

groupRoutes.post("/removeGroupMember", async (req, res) => {
    const { adminId, removeUserId, groupId } = req.body;
    try {
        const group = await GroupModel.updateOne(
            { $and: [{ _id: groupId }, { admin: adminId }] },
            {
                $pull: { groupOfUsers: removeUserId },
            }
        );
        if (group.modifiedCount == 0)
            res.status(401).send({ error: "Not Authorized" });
        else res.send({ msg: "User has been removed successfully" });
    } catch (error) {
        res.send({ msg: "Something went wtong", error: error.message });
    }
});

// delete group
groupRoutes.delete("/deleteGroup", async (req, res) => {
    const { adminId, groupId } = req.body;
    try {
        const group = await GroupModel.deleteOne({
            $and: [{ _id: groupId }, { admin: adminId }],
        });
        console.log(group);
        if (group.deletedCount == 0)
            res.status(401).send({ error: "Not Authorized" });
        else res.send({ msg: "Group Deleted successfully" });
    } catch (error) {
        res.send({ msg: "Something went wtong", error: error });
    }
});

// update name and profile pic of the group
groupRoutes.put("/updateGroup", async (req, res) => {
    try {
        const { groupId, img, name } = req.body;
        const group = await GroupModel.findOne({ _id: groupId });

        let newImg = img == undefined ? group.groupImg : img;
        let newName = name == undefined ? group.groupName : name;
        console.log(newName, newImg);
        await GroupModel.updateOne(
            { _id: groupId },
            { $set: { groupImg: newImg, groupName: newName } }
        );
        res.send({ msg: "Group Updated successfully" });
    } catch (error) {
        res.send({ msg: "Something went wtong", error: error });
    }
});

// send message

groupRoutes.put("/sendMsg", async (req, res) => {
    const { groupId, msg, senderId, senderName } = req.body;

    try {
        await GroupModel.updateOne(
            { _id: groupId },
            {
                $push: { listOfMsg: { msg, senderId, senderName } },
            }
        );
        res.send({ msg: "Message sent successfully" });
    } catch (error) {
        res.send({ msg: "Something went wtong", error: error });
    }
});

// leave group

groupRoutes.put("/leaveFromGroup", async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        await GroupModel.updateOne(
            { _id: groupId },
            { $pull: { groupOfUsers: userId } }
        );
        res.send({ msg: "User has been successfully left the group." });
    } catch (error) {
        res.send({ msg: "Something went wtong", error: error });
    }
});

module.exports = {
    groupRoutes,
};
