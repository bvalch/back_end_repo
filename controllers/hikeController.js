const Hike = require('../models/HikeSchema');
const User = require('../models/UserSchema')
const Profile=require("../models/ProfileSchema")
const multer = require("multer");
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../front_end_repo/public/cover");
    },
    filename: async (req, file, cb) => {
        console.log(req.file)
      const user = await User.findOne({ userName: req.user });
      const extension = file.mimetype.split("/")[1];
      cb(null, `user-${user._id}-${Date.now()}.${extension}`);
    },
  });
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("error", false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  const uploadHikeCover = upload.single("hikeCover");



const getAllHikes = async (req, res) => {
    const hikes = await Hike.find();
    if (!hikes) {return res.sendStatus(204).json({ "message:": "nothing here yet" })}else{
    res.json(hikes)}
}


const createNewHike = async (req, res) => {
    
    if (!req?.body?.hikeOrigin || !req?.body?.hikeDestination) {
        return res.status(400).json({ "message": "origin and destination fields are required" })
    }
    // console.log('create new hike' + req.body)
    const cookies = req.cookies
    const refreshToken = cookies.jwtCookie
    const owner = await User.findOne({ refreshToken })
    console.log("create hike" + owner)

    try {
        result = await Hike.create({
            hikeOrigin: req.body.hikeOrigin,
            hikeDestination: req.body.hikeDestination,
            hikeInfo: req.body.hikeInfo,
            hikeOwner:owner.userName,
            hikeOwnerId:owner._id,
            hikeDate: req.body.hikeDate,
            hikeTime: req.body.hikeTime,
            hikeTransport:req.body.hikeTransport,
            hikeComments:[],
            hikeCover:req?.file?.filename ||"default.jpg"
        }

        )
        res.status(201).json(result);

    } catch (error) { console.error('hike ctrl ln 32' + error) }
}



const updateHike = async (req, res) => {
    if (!req?.body?.id) return res.sendStatus(400).json({ "message": "something went wrong" })
    const hike = await Hike.findOne({ _id: req.body.id }).exec();
    if (!hike) return res.sendStatus(204).json({ "message": "hike can not be found/doesnt exist" })
    hike.hikeOrigin = req.body.hikeOrigin;
    hike.hikeDestination = req.body.hikeDestination;
    hike.hikeInfo = req.body.hikeInfo;
    const result = await hike.save();
    res.json(result)
}


const deleteHike = async (req, res) => {
    if (!req?.body.id) return res.sendStatus(400).json({ "message": "id required" })
    const hike = await Hike.findOne({ _id: req.body.id }).exec();
    if (!hike) return res.sendStatus(204).json({ "message": "hike can not be found/doesnt exist" })
    const result = await hike.deleteOne({ _id: req.body.id });
    res.json(result);

}

const getHikeById = async (req, res) => {
    if (!req?.params?.id) return res.sendStatus(400).json({ "message": "id required" })
    const hike = await Hike.findOne({ _id: req.body.id }).exec();
    if (!hike) {return res.sendStatus(204).json({ "message": "hike can not be found/doesnt exist" })}else{
    const result = await hike.findOne({ _id: req.params.id })
    res.status(200).json(result)
}
}
const getAllHikesByUserId=async(req,res)=>{

    if (!req?.params?.id || req?.params?.id === undefined){return res.sendStatus(400).json({ "message": "id required" })} else{
   
    // //now find the user associated with that profile
    const user = await User.findById({_id:req.params.id})
    // // console.log(user)
    // //now find all the hikes where hikeOwner matches userName
    const hikes = await Hike.find({hikeOwner:user.userName})
    console.log(hikes.length)
    if(hikes.length===0){res.status(204).json({"message":"no entries found"})}else{
    res.status(200).json(hikes)}
}

}

const joinHike = async (req, res) => {
    if (!req.body.hikeID) return res.status(400).json({ "message": "id required" })
    if (!req.cookies.jwtCookie) return res.status(400).json({ "message": "cant authorize" })


    try {
        const cookies = req.cookies;
        const refreshToken = cookies.jwtCookie;
        const hikeID = req.body.hikeID;
        const hike = await Hike.findOne({ _id: hikeID })
        const user = await User.findOne({ refreshToken })
        if (hike.hikeAtt.includes(user.userName)) { return res.status(409).json({ 'message': "you are already attending" }) }
        hike.hikeAtt.push(user.userName)
        const result = await hike.save();
        res.json(result)
        res.status(201).json({ 'message': `success, added user ${user.userName} to hike ID ${hike._id}` })
    } catch (err) {
        console.error('hike contrl'+err)
    }

}

module.exports = {
    getAllHikes,
    getHikeById,
    deleteHike,
    updateHike,
    createNewHike,
    joinHike,
    getAllHikesByUserId,
    uploadHikeCover,
}