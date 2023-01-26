const User = require("../models/UserSchema");
const MessageThread = require("../models/MessageThreadSchema");
const Profile = require("../models/ProfileSchema")

const createMessageThread=async(req,res)=>{
if(!req?.body.messageRecepient || !req?.body.messageSenderId || !req?.body.messageTitle || !req?.body?.messageText){
    return res.status(401).json({"message":"all fields required"})
}
const recepient = await User.findById({_id:req.body.messageRecepient}).exec()
const sender = await User.findById({_id:req.body.messageSenderId}).exec()
const result = await MessageThread.create(
    {
    messageThreadId: `${req.body.messageSenderId}sender${req.body.messageTitle}`,
    messageThreadParties:[
        {"fromUserId":req.body.messageSenderId,"userName":req.body.messageSender}, 
        {"toUserId":req.body.messageRecepient,userName:recepient.userName}
    ] ,
     threadMessages:[{"Title":req.body.messageTitle, "text":req.body.messageText}]

})
const recepientId=recepient._id.toString();
const senderId=sender._id.toString()
const recepientProfile = await Profile.findOne({profileOwnerId:recepientId})
const senderProfile = await Profile.findOne({profileOwnerId:senderId})
recepientProfile.profileMessageThreads.push(result._id)
senderProfile.profileMessageThreads.push(result._id)
await recepientProfile.save()
await senderProfile.save();
res.status(200).json({"message":"message sent!"})

}


module.exports={
    createMessageThread
}