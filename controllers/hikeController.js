const Hike = require('../models/HikeSchema');
const User = require('../models/UserSchema')

const getAllHikes = async (req, res) => {
    const hikes = await Hike.find();
    if (!hikes) return res.sendStatus(204).json({ "message:": "nothing here yet" })
    res.json(hikes)
}
const createNewHike = async (req, res) => {
    console.log(req.body)
    if (!req?.body?.hikeOrigin || !req?.body?.hikeDestination) {
        return res.status(400).json({ "message": "origin and destination fields are required" })
    }
    console.log('create new hike' + req.body)
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
            hikeDate: req.body.hikeDate,
            hikeTime: req.body.hikeTime,
            hikeTransport:req.body.hikeTransport
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
    if (!hike) return res.sendStatus(204).json({ "message": "hike can not be found/doesnt exist" })
    const result = await hike.findOne({ _id: req.params.id })
    res.json(result)

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
    joinHike
}