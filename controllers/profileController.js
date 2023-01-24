const Profile = require('../models/ProfileSchema');
const Users = require('../models/UserSchema');


const createProfile = async (req, res) => {
    const cookies = req.cookies
    const refreshToken = cookies.jwtCookie
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    console.log(req.body)
    try {
        result = await Profile.create({
         ...req.body, profileOwner: foundUser._id
        })
        res.status(201).json(result);
    } catch (err) { console.error('ln 15 profileCtrl' + err) }
};

const getProfile = async (req, res) => {
    const cookies = req.cookies
    const refreshToken = cookies.jwtCookie
    // console.log('asd' + refreshToken)
    try {
        const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
        const id = foundUser._id;
        const foundProfile = await Profile.findOne({ profileOwner: id })
        res.json(foundProfile)
    } catch (err) {
        console.error('ln 28 profileCnt'+err); res.status(69)
    }
}
const getForeignProfile = async (req, res) => {
    console.log(req.params.id)
    try {
        const user = await Users.findOne({ userName: req.params.id });
        console.log(user.userName)
        const foreignProfile = await Profile.findOne({ profileOwner: user._id });
        console.log(foreignProfile)
        const result ={...foreignProfile,screenName:user['userName']}
        console.log(result)
        res.json(result)
    } catch (err) { console.error('ln 41 profileCnt'+ err) }

}

const updateProfile = async (req, res) => {
    const cookies = req.cookies
    const refreshToken = cookies.jwtCookie
    try {
        const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
        const id = foundUser._id;

        await Profile.updateOne({ profileOwner: id },req.body);
        const result = await Profile.findOne({profileOwner:id})
        res.json(result)
    } catch (err) {
        console.error('ln 56 profileCnt'+err); res.status(409)
    }
}

const deleteProfile = async (req, res) => {
    const cookies = req.cookies
    const refreshToken = cookies.jwtCookie
    try {
        const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
        const id = foundUser._id;
        const result = await Profile.deleteOne({ profileOwner: id });
        res.json(result)
    } catch (err) {
        console.error('ln 82 profileCnt' + err); res.status(409)
    }



}


module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    getForeignProfile,
    deleteProfile
}