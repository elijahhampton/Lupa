'use strict'

/**
 * @author Elijah Hampton
 * @date August 19, 2019
 * 
 * Lupa users routes
 */

//Express router
const router = require("express").Router();
//User Model
let User = require("../models/user.model");

//GET request for all users
router.route("/").get((req, res) => {
    res.status(200).json(DB);
});

//POST request to add a user
router.route("/add").post((req, res) => {
    console.log('adding');
    //Retrieve user's username and password in request body
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const packs = ['Lupa Announcements'];

    console.log('couldnt add');

    //Create new user through model
    const newUser = new User({username, password, firstName, lastName, email, packs});

    //Save user to database
    newUser.save()
        .then(() => res.json("User added with: " + username + " " + password))
        .catch(err => res.status(400).json("Error: " + err));
    });


//DELETE request - delete user by ID
router.route("/:id").delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json("User deleted"))
        .catch(err => res.status(400).json("Error: " + err));
});

//GET request - find users by ID
router.route("/:username/:password").get((req, res) => {
    //Find user by username
    const username = req.params.username;
    const password = req.params.password;

});

//POST request - Update user by ID
router.route("/update/:id").post((req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.username = req.body.username;
            user.password = req.body.password;

            user.save()
                .then(() => res.json("User updated"))
                .catch(err => res.status(400).json("Error: " + err));
        })
        .catch (err => res.status(400).json("Error: " + err));

        
});

module.exports = router;