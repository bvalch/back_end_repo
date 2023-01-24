const Hike = require("../models/HikeSchema");
const Comment = require("../models/CommentSchema")
const User = require("../models/UserSchema");


const postCommentToHike= async (req,res)=>{
    console.log("HITTING POST COMMENT ROUTE")
    // console.log(req.body)
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
    console.log("HITTING ROUTE FOR HIKE COMMENTS?")
    // console.log(req.params)
    if(!req?.params?.id) return res.status(401).json({"message":"hike id required"})
    const hikeWithComments = await Hike.findById({_id:req.params.id})
    const commentPromises = hikeWithComments.hikeComments.map(comment => Comment.findById({ _id: comment._id }));
    const commentResults = await Promise.all(commentPromises);
    const commentArray = commentResults.map(result => result);
    console.log(commentArray)
    
    res.status(200).json(commentArray)

};
const getAllCommentsForUser=async(req,res)=>{
    console.log("HITTING ROUTE FOR USER COMMENT")
    // const user = await User.findOne({refreshToken:req.cookies.jwtCookie}).exec();
    // const commentsArray = await Comment.find({author_id:user._id})
    // console.log(commentsArray)

}


//todo:
//find all comments for given hike id - done
//find all comments for given user
//delete comment
//update comment
//find one comment for given user maybe?



module.exports={
    postCommentToHike,
    getAllCommentsForAHike,
    getAllCommentsForUser
}