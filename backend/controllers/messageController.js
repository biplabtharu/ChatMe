import USER from "../models/userSchema.js";
import MESSAGE from "../models/messageModel.js";
import CHAT from "../models/chatSchema.js";

const sendMessage = async (req, res) => {
  const { content, chat } = req.body;
  if (!content || !chat) {
    console.log(`invalid data in the request`);
    return res.sendStatus(400);
  }
  try {
    const newMessage = new MESSAGE({ sender: req.user._id, content, chat });

    let message = await newMessage.save();

    message = await message.populate("chat");
    message = await message.populate("sender", "name pic");

    // message = await message.populate("chat.users", "id name");

    // console.log("before");
    // console.log(message);
    message = await USER.populate(message, {
      path: "chat.users",
      select: "id name email pic",
    });
    // message = await message.populate("chat", {
    //   populate: {
    //     path: "users",
    //   },
    // });

    // message = await message.populate({
    //   path: "users",
    //   select: "id name",
    // });

    const updatedChat = await CHAT.findByIdAndUpdate(chat, {
      latestMessage: message,
    });
    // .populate("chat");

    // console.log(updatedChat);
    console.log("after");
    console.log(message);
    res.status(200).json(message);
  } catch (err) {
    console.log(`send Message error ${err}`);
    return res.status(400).send(err);
  }
};

const fetchMessage = async (req, res) => {
  const { chatId } = req.params;

  try {
    const allMessages = await MESSAGE.find({ chat: chatId })
      .populate("sender", "name pic")
      .populate("chat");
    res.status(200).json(allMessages);
  } catch (err) {
    console.log(err);
  }
};

const deleteMessage = async (req, res) => {
  await MESSAGE.deleteMany();
  res.json(`all messages deleted successfully`);
};

export { sendMessage, fetchMessage, deleteMessage };
