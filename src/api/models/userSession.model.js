/**
 * @author Elijah Hampton
 * @date August 21, 2019
 */

 //Import Mongoose
 const mongoose = require('mongoose');

 //Import schema module
 const Schema = mongoose.Schema;

 //Create User Session Schema
 const userSessionSchema = new Schema({

 });

 const userSessionSchemaModel = mongoose.model("User Session Schema", userSessionSchema);

 module.exports = userSessionSchemaModel;