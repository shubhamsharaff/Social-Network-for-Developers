const mongoose = require('mongoose');
const config = require('config');

// Taking data from default.json 
const db = config.get('mongoURI');
console.log(db)
const connectDB = () =>{
    try{
        mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("database is Connected")

    }
    catch(err){
        console.log("Database is not connected");
    }
}


module.exports = connectDB;


// const MongoClient = require("mongodb").MongoClient;
// const client = new MongoClient(config.get('mongoURI'));
// // console.log(client)

// const connectDB = () => {

//     try {
//         // Connect to the MongoDB cluster
//         client.connect();
//         console.log('Connected successfully to server');

//     }
//     catch (e) {
//         console.log("Database is not connected");
//     }
// }
