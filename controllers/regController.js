const User = require('../models/UserSchema')
const bcrypt = require('bcrypt');
const Profile = require("../models/ProfileSchema")
const handleNewUser = async (req, res) => {
    const { user, pass } = req.body;
    if (!user || !pass) return res.status(400).json({ 'message': "uname or pass are required" })
    const duplicate = await User.findOne({ userName: user }).exec();
    if (duplicate) return res.sendStatus(409);

    try {
        const hashPass = await bcrypt.hash(pass, 10)
        const newUser = { "username": user, "password": hashPass };
        result = await User.create({
            "userName": user,
            "pass": hashPass,
            "comments":[]
        });
        await Profile.create({
            personName: "default" ,
            personAge: 0 ,
            personLocation:"default" ,
            personInfo: "N/A" ,
            profileOwnerId: result._id
            ,
            profileOwnerAlias:user,
            profilePhoto:"/default.jpg"
        })
        res.status(201).json({ 'epic win': `new user ${user} created!` })

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

}

module.exports = { handleNewUser };