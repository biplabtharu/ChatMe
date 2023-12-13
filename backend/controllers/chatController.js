import CHAT from "../models/chatSchema.js";
import USER from "../models/userSchema.js";

const accessChats = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log(`user id not available`);
    return res.status(400).json({ message: `user id not available` });
  }

  var isChat = await CHAT.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  //   console.log(isChat);
  //     .populate("users", "-password")
  //     .populate("latestMessage");

  // const isChat = isChat.

  // console.log(isChat);

  // isChat = await USER.populate(isChat, {
  //   path: "latestMessage.sender",
  //   select: "name email pic",
  // });

  if (isChat.length > 0) {
    res.send(isChat[0]);
    console.log(isChat[0]);
  } else {
    console.log(`isChat ${isChat}`);
    console.log(`req.user id : ${req.user._id} and userId ${userId}`);

    try {
      const chat = new CHAT({
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      const newChat = await chat.save();
      console.log(`new chat ${newChat}`);
      const fullChat = await CHAT.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (err) {
      console.log(`chat creation error: ${err}`);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    const allChats = await CHAT.find({ users: { $eq: req.user._id } })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin")
      .then((result) => res.json(result));
  } catch (err) {
    console.log(`fetching chats error ${err}`);
  }
};

const createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json(`all fields are required`);
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .json(`more than 2 people are required to create group.`);
  } else {
    users.push(req.user);
    try {
      const newGroupChat = await CHAT.create({
        chatName: req.body.name,
        isGroupChat: true,
        users: users,
        groupAdmin: req.user,
      });

      const fullGroupChat = await CHAT.findOne({ _id: newGroupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (err) {
      console.log(err);
    }
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const group = await CHAT.findOne({ _id: chatId }).populate("groupAdmin");

  try {
    // console.log(group.groupAdmin._id === req.user._id);
    // console.log(req.user._id);
    // console.log(group.groupAdmin._id);
    if (group.groupAdmin._id.equals(req.user._id)) {
      try {
        const updateGroup = await CHAT.findByIdAndUpdate(
          { _id: chatId },
          {
            chatName,
          },
          { new: true }
        );

        if (!updateGroup) {
          return res.status(400).json(`group is not updated`);
        } else {
          console.log(updateGroup);
          return res.status(200).json(updateGroup);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json(`you are not group admin`);
    }
  } catch (err) {
    console.log(err);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  console.log(chatId);
  console.log(userId);
  try {
    const chat = await CHAT.findByIdAndUpdate(
      { _id: chatId },
      { $push: { users: userId } }
    )
      .populate("users", "-password")
      .populate("groupAdmin");

    res.json(chat);
  } catch (err) {
    x;
    console.log(`add to from group error ${err}`);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const chat = await CHAT.findByIdAndUpdate(
      { _id: chatId },
      { $pull: { users: userId } }
    )
      .populate("users", "-password")
      .populate("groupAdmin");

    console.log(chat);
    res.json(chat);
  } catch (err) {
    console.log(`remove from group error ${err}`);
  }
};

const deleteAllChats = async (req, res) => {
  await CHAT.deleteMany();
};

export {
  accessChats,
  deleteAllChats,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
