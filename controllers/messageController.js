const User = require("../models/UserSchema");
const MessageThread = require("../models/MessageThreadSchema");
const Profile = require("../models/ProfileSchema");

//TODO:try catch block here, this is a mess
const createMessageThread = async (req, res) => {
  if (
    !req?.body.messageRecepient ||
    !req?.body.messageSenderId ||
    !req?.body.messageTitle ||
    !req?.body?.messageText
  ) {
    return res.status(401).json({ message: "all fields required" });
  }
  const dateStamp = new Date().toISOString().split(".")[0].replace("T", "/");
  const recepient = await User.findById({
    _id: req.body.messageRecepient,
  }).exec();
  const sender = await User.findById({ _id: req.body.messageSenderId }).exec();
  const result = await MessageThread.create({
    messageThreadId: `${req.body.messageSenderId}sender${req.body.messageTitle}`,
    messageThreadTitle: req.body.messageTitle,
    messageThreadDate: req.body.messageTime,
    messageThreadParties: [
      {
        fromUserId: req.body.messageSenderId,
        userName: req.body.messageSender,
      },
      { toUserId: req.body.messageRecepient, userName: recepient.userName },
    ],
    threadMessages: [
      {
        Title: req.body.messageTitle,
        text: req.body.messageText,
        datestamp: dateStamp,
        read: false,
        from: sender.userName,
      },
    ],
  });
  const recepientId = recepient._id.toString();
  const senderId = sender._id.toString();
  const recepientProfile = await Profile.findOne({
    profileOwnerId: recepientId,
  });
  const senderProfile = await Profile.findOne({ profileOwnerId: senderId });
  recepientProfile.profileMessageThreads.push(result._id);
  senderProfile.profileMessageThreads.push(result._id);
  await recepientProfile.save();
  await senderProfile.save();
  res.status(200).json({ message: "message sent!" });
};

const getAllMessageThreads = async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies.jwtCookie;
  const user = await User.findOne({ refreshToken });
  //this retursns an array
  try {
    const messagesSent = await MessageThread.find({
      "messageThreadParties.0.fromUserId": user._id.toString(),
    });
    const messagesRecieved = await MessageThread.find({
      "messageThreadParties.1.toUserId": user._id.toString(),
    });
    console.log(messagesRecieved);

    // console.log(messagesSent[0].messageThreadParties[0])
    if (!messagesSent && !messagesRecieved)
      return res.status(204).json({ message: "you have no messages" });
    res.status(200).json({ sent: messagesSent, recieved: messagesRecieved });
  } catch (err) {
    console.error(err);
  }
};

//quick and dirty, no time
const replyToMessageThread = async (req, res) => {
  //   console.log(req.body);
  //   console.log("hitting backend");
  //find the thread
  const thread = await MessageThread.findById({
    _id: req.body.threadToAttachTo,
  });
  try {
    const result = await thread.updateOne({
      $push: {
        threadMessages: {
          Title: req.body.Title,
          text: req.body.text,
          datestamp: req.body.datestamp,
          from: req.body.from,
          read: false,
        },
      },
    });
    res.status(200).json({ message: "all good" });
  } catch (err) {
    console.error(err);
  }
};

const updateMessageThread = async (req, res) => {
  console.log(req.body);
  const userName = req.body.username;
  const threadId = req.params.id;
  const messageThread = await MessageThread.findById({ _id: threadId });
  const commentArray = messageThread.threadMessages;

  commentArray.forEach((el) => {
    if (el.from !== userName) {
      el.read = true;
    }
  });

  try {
    await messageThread.updateOne({ $set: { threadMessages: commentArray } });
    res.status(200).json({"message":"success"});
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  createMessageThread,
  getAllMessageThreads,
  replyToMessageThread,
  updateMessageThread,
};
