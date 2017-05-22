var express = require('express');
var Recipe = require('../models/recipe');
var router = express.Router();

// Get all recipes
// TO DO return only recipes for currently logged in user
router.route('/')
    .get(function(req, res) {
        Recipe.find(function(err, recipes) {
            if (err) return res.status(500).send(err);

            return res.send(recipes);
        });
    });

// Create a recipe
// TO DO have the request include the user_id for the logged in user
router.route('/')
    .post(function(req, res) {
        Recipe.create(req.body, function(err, recipe) {
            if (err) return res.status(500).send(err);

            return res.send(recipe);
        });
    });

// Get one recipe
router.route('/:id')
    .get(function(req, res) {
        Recipe.findById(req.params.id, function(err, recipe) {
            if (err) return res.status(500).send(err);

            return res.send(recipe);
        });
    });

// Update one recipe
router.route('/:id')
    .put(function(req, res) {
        Recipe.findByIdAndUpdate(req.params.id, req.body, function(err) {
            if (err) return res.status(500).send(err);

            return res.send({ message: 'success' });
        });
    });

// Delete one recipe
router.route('/:id')
    .delete(function(req, res) {
        Recipe.findByIdAndRemove(req.params.id, function(err) {
            if (err) return res.status(500).send(err);

            return res.send({ message: 'success' });
        });
    });

module.exports = router;
