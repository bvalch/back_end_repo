const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    // console.log(req.headers['Authorization'])
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer')) return res.status(401).json({ 'message': 'authHeader missing' });
    const token = authHeader.split(' ')[1];
    // console.log("REQUEST HEADER TOKEN  " +token)
    jwt.verify(
        token,
        // console.log(token),
        process.env.ACESS_TOKEN_KEY,
        (error, decoded) => {
            // console.log(decoded.username)
            // console.log(req)
            if(error) {console.log('jwt err'); return res.sendStatus(403)}
            // if (error) { console.error('ERROR in verifyJWT line 18 '+ error); return res.sendStatus(403)};
            req.user = decoded.username;
            // console.log(req)
            next();
        }
    )
   
};

module.exports = verifyJWT;
