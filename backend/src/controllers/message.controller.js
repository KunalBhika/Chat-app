import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error occured in getUsersForSideBar", error.message);
        res.status(500).json({ error: "internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const userToChatId = req.params.id;
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: req.user._id },
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error occured in getMessages", error.message);
        res.status(500).json({ error: "internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const myId = req.user._id;

        const { text, image } = req.body;

        let image_url;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            image_url = uploadResponse.secure_url;
        }

        const newMessage = await Message({
            senderId: myId,
            receiverId: receiverId,
            text: text,
            image: image_url
        })

        await newMessage.save();

        // Real-time socket io functionality goes here : TODO

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error occured in sendMessage", error.message);
        res.status(500).json({ error: "internal server error" });
    }
}