const User = require('../models/UserSchema')
const jwt = require('jsonwebtoken')

const handleRefresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwtCookie) return res.sendStatus(401);
    const refreshToken = cookies.jwtCookie
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) return res.status(403).json({ 'message': 'at refresh controller' });


    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        (error, decoded) => {
            if (error ) { console.log(error + 'wtf') }
            if (error || foundUser.userName !== decoded.username) { console.log(error + 'wtf') }
            if (error ) {console.log('error in refreshController line 20')
                {return res.status(403).json({'msg':'f this'})}};
            const acessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACESS_TOKEN_KEY, { expiresIn: '3s' }
            );
            res.json({ acessToken });

        }
    );

};

module.exports = { handleRefresh };