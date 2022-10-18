const mongoose = require('mongoose');


const connectToDb = async () => {

    try {
        await mongoose.connect('mongodb://localhost:27017/hike_project', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
        )

    }
    catch (error) {
        console.error(error)
    }

};
module.exports = connectToDb;