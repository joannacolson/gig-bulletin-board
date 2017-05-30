var express = require('express');
var Project = require('../models/project');
var router = express.Router();

// Get all projects
router.route('/')
    .get(function(req, res) {
        Project.find(function(err, projects) {
            if (err) return res.status(500).send(err);

            return res.send(projects);
        });
    });

// Create a project
router.route('/')
    .post(function(req, res) {
        Project.create(req.body, function(err, project) {
            if (err) return res.status(500).send(err);

            return res.send(project);
        });
    });

// Get one project
router.route('/:id')
    .get(function(req, res) {
        Project.findById(req.params.id, function(err, project) {
            if (err) return res.status(500).send(err);

            return res.send(project);
        });
    });

// Update one project
router.route('/:id')
    .put(function(req, res) {
        Project.findByIdAndUpdate(req.params.id, req.body, function(err) {
            if (err) return res.status(500).send(err);

            return res.send({ message: 'success' });
        });
    });

// Delete one project
router.route('/:id')
    .delete(function(req, res) {
        Project.findByIdAndRemove(req.params.id, function(err) {
            if (err) return res.status(500).send(err);

            return res.send({ message: 'success' });
        });
    });

module.exports = router;
