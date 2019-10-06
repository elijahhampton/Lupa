/**
 * @author Elijah Hampton
 * @date October 5, 2019
 * 
 * Lupa packs routes
 */

 //Express router
 const router = require('express').Router();

 //User model
 let Pack = require('../models/pack.model');

 //GET request for all packs
 router.route("/").get((req, res) => {
    Pack.find()
        .then(packs => res.json(packs))
        .catch(err => res.status(400).json("Error: " + err));
 });

 //POST request to add a user
 router.route("/add").post((req, res) => {
    //Retrieve packName, packLeader, and packMembers in request body
    const packName = req.body.packName;
    const packLeader = req.body.packLeader;
    const packMembers = req.body.packMember;

    //Create pack through model
    const newPack = new Pack({
        packName,
        packLeader,
        packMembers,
    });

    //Save pack to database
    newPack.save()
        .then(() => res.json("Successfully added pack: " + packName))
        .catch(err => res.status(400).json("Error: " + err));
    });

//GET request - find pack by packName
router.route("/:packName").get((req, res) => {
    //Find pack by packName
    const packNameQuery = req.params.packName;

    //Create pack query
    const packQuery = Pack.where({ packName: packNameQuery });

    //Execute Query
    packQuery.exec()
        .then(doc => {
            res.status(200).json({doc});
        })
        .catch(err => res.status(500).json());
});
