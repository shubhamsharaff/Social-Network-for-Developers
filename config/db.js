const mongoose = require('mongoose');
const config = require('config');

// Taking data from default.json 
const db = config.get('mongoURI');
// console.log(db)
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            // useCreateIndex: true
        });
        console.log("database is Connected")

    }
    catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}


module.exports = connectDB;

