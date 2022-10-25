const Profile = require('../models/ProfileSchema');
const Users = require('../models/UserSchema');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;


const createProfile = async (req, res) => {
    const cookies = req.cookies
    const refreshToken = cookies.jwtCookie
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();

    try {

        result = await Profile.create({
            personName: req.body.name,
            personAge: req.body.age,
            personInfo: req.body.info,
            personLocation: req.body.location,
            profileOwner: foundUser._id

        })
        res.status(201).json({ 'message': 'greteast success' });


    } catch (err) { console.error('lalal' + err) }
};

const getProfile = async (req, res) => {
    const cookies = req.cookies
    const refreshToken = cookies.jwtCookie
    console.log('asd' + refreshToken)
    try {
        const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
        const id = foundUser._id;
        const foundProfile = await Profile.findOne({ profileOwner: id })
        res.json(foundProfile)
    } catch (err) {
        console.error('llal'+err); res.status(69)
    }
}
const getForeignProfile = async (req, res) => {
    console.log(req.params.id)
    // console.log('trigger')

    try {
        const user = await Users.findOne({ userName: req.params.id });
        console.log(user.userName)
        const foreignProfile = await Profile.findOne({ profileOwner: user._id });
        console.log(foreignProfile)
        const result ={...foreignProfile,screenName:user['userName']}
        console.log(result)
        res.json(result)
    } catch (err) { console.error('lalala'+ err) }

}

const updateProfile = async (req, res) => {
    const cookies = req.cookies
    const refreshToken = cookies.jwtCookie
    try {
        const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
        const id = foundUser._id;

        const foundProfile = await Profile.findOne({ profileOwner: id });
        foundProfile.personName = req.body.name;
        foundProfile.personAge = req.body.age;
        foundProfile.personInfo = req.body.info;
        foundProfile.personLocation = req.body.location;
        const result = await foundProfile.save()

        res.json(result)
    } catch (err) {
        console.error('lalala'+err); res.status(409)
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
        console.error('profile ctrl line 82' + err); res.status(409)
    }



}


module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    getForeignProfile,
    deleteProfile
}