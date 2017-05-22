var express = require('express');
var User = require('../models/user');
var router = express.Router();

// Get all user documents (records)
router.route('/')
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) return res.status(500).send(err);

            return res.send(users);
        });
    })

// Split the .get and .post to separate routes to make rowdy-logger report correctly...
// Creates a user document if one doesn't already exist, and returns the user document it created
// router.route('/')
.post(function(req, res) {
    // find the user first in case the email already exists
    User.findOne({ email: req.body.email }, function(err, user) {
        if (user) return res.status(400).send({ message: 'Email already exists' });

        User.create(req.body, function(err, user) {
            if (err) return res.status(500).send(err);

            return res.send(user);
        });
    });
});

// Get and return one user document by its id
router.get('/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) return res.status(500).send(err);

        return res.send(user);
    });
});

module.exports = router;
