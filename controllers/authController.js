const User = require('../models/UserSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { user, pass } = req.body;
    // change status to sendstatus
    if (!user || !pass) return res.status(400).json({ 'error': 'uname andd pass required' });
    const foundUser = await User.findOne({userName:user}).exec();
    if (!foundUser) return res.sendStatus(401);

    
    const verifyPass = await bcrypt.compare(pass, foundUser.pass);

    if (verifyPass) {
        const acessToken = jwt.sign(
            { "username": foundUser.userName },
            process.env.ACESS_TOKEN_KEY,
            { expiresIn: '1d' } 

        );

        const refreshToken = jwt.sign(
            { "username": foundUser.userName },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: '1d' }

        );
        
        await User.updateOne({_id:foundUser.id},{$set:{"refreshToken":refreshToken}})
        
        res.cookie('jwtCookie', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ acessToken });
    }
    else {
        res.sendStatus(401)
    };

};

module.exports = { handleLogin };