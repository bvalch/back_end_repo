const User = require("../models/UserSchema");
const MessageThread = require("../models/MessageThreadSchema");
const UserSchema = require("../models/UserSchema");


const createMessageThread=async(req,res)=>{
if(!req?.body.messageRecepient || !req?.body.messageSenderId || !req?.body.messageTitle || !req?.body?.messageText){
    return res.status(401).json({"message":"all fields required"})
}
const recepient = await UserSchema.findById({_id:req.body.messageRecepient})
const result = await MessageThread.create(
    {
    messageThreadId: `${req.body.messageSenderId}sender${req.body.messageTitle}`,
    messageThreadParties:[
        {"fromUserId":req.body.messageSenderId,"userName":req.body.messageSender}, 
        {"toUserId":req.body.messageRecepient,userName:recepient.userName}
    ] ,
     threadMessages:[{"Title":req.body.messageTitle, "text":req.body.messageText}]

})
console.log(recepient)
console.log(result)


}


module.exports={
    createMessageThread
}