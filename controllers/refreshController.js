const User = require('../models/UserSchema')
const jwt = require('jsonwebtoken')

const handleRefresh = async (req, res) => {
    // console.log(req.headers)
    const cookies = req.cookies;
    if (!cookies?.jwtCookie) return res.sendStatus(401);
    const refreshToken = cookies.jwtCookie
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    // console.log(foundUser)
    if (!foundUser) return res.status(403).json({ 'message': 'at refresh controller' });


    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        (error, decoded) => {
            // console.log("DECODED NAME IS " + decoded.username)
            if (error ) { console.log(error + 'wtf') }

            // if (error || foundUser.userName !== decoded.username) { console.log(error + 'wtf') }
            // if (error ) {console.log('error in refreshController line 20')
            //     return res.status(403).json}({'msg':'f this'})};
            const acessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACESS_TOKEN_KEY, { expiresIn: '3s' }
            );
            // console.log("NEW ACCESS TOKEN " + acessToken)
            res.json({ acessToken });

        }
    );

};

module.exports = { handleRefresh };