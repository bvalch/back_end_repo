const User = require('../models/UserSchema')

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwtCookie) return res.sendStatus(204);
    const refreshTokenFromCookie = cookies.jwtCookie

    const foundUser = await User.findOne({ refreshToken: refreshTokenFromCookie }).exec();
    if (!foundUser) {
        res.clearCookie('jwtCookie', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        return res.sendStatus(204);
    };
    

    await User.updateOne({ userName: foundUser.userName }, { $set: { refreshToken: "" } })

    res.clearCookie('jwtCookie', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.sendStatus(204);


};

module.exports = { handleLogout };