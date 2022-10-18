const express = require('express');
const app = express();
const PORT = 3500;
// const corsOptions = require('./corsconfig/corsOptions')
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
const mongoose = require('mongoose');
const connectToDb = require('./middleware/dbConn')
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require('cookie-parser');

connectToDb();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/logout', require('./routes/logoutRoute'));
app.use('/register', require('./routes/regRoute'));
app.use('/auth', require('./routes/authRoute'));
app.use('/refresh', require('./routes/refreshRoute'));



app.use(verifyJWT)
app.use('/hikes', require('./routes/hikeRouter'));
app.use('/profile',require('./routes/profileRoute'));
// app.use('/getprofile',require('./routes/profileRoute'));






mongoose.connection.once('open', () => {
    console.log('conected to mongo');
    app.listen(PORT, () => { console.log(`server running on port ${PORT}`) });
})
