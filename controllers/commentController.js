const Hike = require("../models/HikeSchema");
const Comment = require("../models/CommentSchema")
const User = require("../models/UserSchema")


const postCommentToHike= async (req,res)=>{
    console.log(req.body)
    if(!req?.body?.hikeToComment || !req?.body?.comment || !req?.body?.time){
        return res.status(401).json({"message":"comment, hike_id and date required"})
    }
    //we find the sender
    const sender = await User.findOne({refreshToken:req.cookies.jwtCookie}).exec();
    //we find the hike to attach the comment to
    const hikeToAttachCommentTo= await Hike.findOne({_id:req.body.hikeToComment}).exec();
        try{
            //we create the comment
            const commentCreateResult = await Comment.create({...req.body,replies:[],author_id:sender._id,author_name:sender.userName})
            console.log(hikeToAttachCommentTo.hikeComments)
            //we attach the comment id to the hike
            hikeToAttachCommentTo.hikeComments.push(commentCreateResult._id)
            //we update the hike
            const updatedHike=await hikeToAttachCommentTo.save()
            //we update the user comments
            sender.comments.push(commentCreateResult._id)
            await sender.save()
            //we send back the hike to be stored in state and the comment to be stored in state
            res.status(201).json({commentCreateResult,updatedHike})



        }catch(err){console.error(err)}
   

}






module.exports={
    postCommentToHike
}