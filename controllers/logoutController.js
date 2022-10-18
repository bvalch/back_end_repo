const User = require('../models/UserSchema')

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwtCookie) return res.sendStatus(204);
    const refreshTokenFromCookie = cookies.jwtCookie
    // console.log(cookies)

    const foundUser = await User.findOne({ refreshToken: refreshTokenFromCookie }).exec();
    // console.log(foundUser)
    if (!foundUser) {
        res.clearCookie('jwtCookie', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        return res.sendStatus(204);
    };
    // another way mb?
    // foundUser.refreshToken="";
    // const result = await foundUser.save();

        // delete token in the db;

    await User.updateOne({ userName: foundUser.userName }, { $set: { refreshToken: "" } })

    res.clearCookie('jwtCookie', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.sendStatus(204);


};

module.exports = { handleLogout };