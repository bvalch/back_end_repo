const Hike = require("../models/HikeSchema");
const Comment = require("../models/CommentSchema")
const User = require("../models/UserSchema");


const postCommentToHike= async (req,res)=>{
    
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

const getAllCommentsForAHike=async(req,res)=>{
   
    if(!req?.params?.id) return res.status(401).json({"message":"hike id required"})
    const hikeWithComments = await Hike.findById({_id:req.params.id})
    const commentPromises = hikeWithComments.hikeComments.map(comment => Comment.findById({ _id: comment._id }));
    const commentResults = await Promise.all(commentPromises);
    const commentArray = commentResults.map(result => result);
    if(!commentArray) return res.sendStatus(204).json({"message":"you do not have any comments"})     
    res.status(200).json(commentArray)

};
const getAllCommentsForUser=async(req,res)=>{
    const user = await User.findOne({refreshToken:req.cookies.jwtCookie}).exec();
    const commentsArray = await Comment.find({author_id:user._id})
    res.status(200).json(commentsArray)

}

const deleteComment=async(req,res)=>{
    if (!req?.body.commentId) return res.sendStatus(400).json({ "message": "id required" })
    console.log(req.body.commentId)
    //63d03e2fff4aee2e1f6d00df
    const commentToRemove = await Comment.findById({_id:req.body.commentId})
    const hikeToUpdate = await Hike.findById({_id:req.body.hikeId})
    const commentArray = hikeToUpdate.hikeComments.filter((comment)=>!comment._id.equals(commentToRemove._id))
    await Hike.updateOne({_id:hikeToUpdate._id},{hikeComments :commentArray})
    await Comment.deleteOne({_id:commentToRemove._id})
    // //remember to remove comment from hike comments array as well, moron;
    // console.log(commentToRemove._id.equals( hikeToUpdate.hikeComments[0]._id))


    res.status(200).json({"message":"success"})
}
    


//todo:
//find all comments for given hike id - done
//find all comments for given user -done
//delete comment
//update comment
//find one comment for given user maybe?



module.exports={
    postCommentToHike,
    getAllCommentsForAHike,
    getAllCommentsForUser,
    deleteComment
}