const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer')) return res.status(401).json({ 'message': 'authHeader missing' });
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACESS_TOKEN_KEY,
        (error, decoded) => {
           
            if(error) {console.log('jwt err'); return res.sendStatus(403)}
            if (error) { console.error('ERROR in verifyJWT line 18 '+ error); return res.sendStatus(403)};
            req.user = decoded.username;
            next();
        }
    )
   
};

module.exports = verifyJWT;
