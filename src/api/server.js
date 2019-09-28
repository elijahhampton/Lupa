/**
 * @author Elijah Hampton
 * @date August 19, 2019
 * 
 * Lupa Server
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

var corsOptions = {
    optionsSuccessStatus: 200,
}
// Each layer is essentially adding a function that specifically handles something to your flow through the middleware.
app.use(cors(corsOptions)); //cors middleware
app.use(express.json()); //express.json() middleware to allow parsing of json

const uri = process.env.ATLAS_URI; //MongoDB Database URI

//Connect to database using uri
mongoose.connect(uri, {
    useNewUrlParser: true, useCreateIndex: true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

/* Require files for routes */
const usersRouter = require("./routes/users");

/* Allow app to use routes provided by express */
app.use("/users", usersRouter);

//Starts server listening on port 5000.
app.listen(port, () => {
    console.log('Server is running on port: ', port);
});