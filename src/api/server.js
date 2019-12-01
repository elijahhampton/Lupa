/**
 * @author Elijah Hampton
 * @date August 19, 2019
 * 
 * Lupa Server
 */

const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
//const bodyparser = require('body-parser')


const app = express();
const port = 8080; // Need to set this up automatically from environment var
const ATLAS_URI = "mongodb+srv://ejh0017:Hamptonej1!@cluster0-mkk9u.gcp.mongodb.net/Lupa?retryWrites=true&w=majority";


var corsOptions = {
    optionsSuccessStatus: 200,
}
// Each layer is essentially adding a function that specifically handles something to your flow through the middleware.
app.use(cors(corsOptions)); //cors middleware
app.use(express.json()); //express.json() middleware to allow parsing of json
/*app.use(bodyparser.urlencoded({
    extended: true
}));*/

const uri = ATLAS_URI; //MongoDB Database URI
var db = undefined;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});

client.connect((err, result) => {
    if (err) {
        console.log(err);
    }
   console.log('Connected successfully server');
   db = client.db('lupa-app');

   //Starts server listening on port 5000.
app.listen(port, () => {
    console.log('Server is running on port: ', port);
});
   //client.close();
})

client.once('open', (data, err) => {
    if (err) {
        console.log(err)
    }
    console.log("MongoDB database connection established successfully");
});

/* Require files for routes */
const usersRouter = require("./routes/users");

/* Allow app to use routes provided by express */
app.use("/users", usersRouter);

module.exports = db;