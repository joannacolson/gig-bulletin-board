var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    dueDate: Date,
    userId: String,
    techReq: String,
    showPublic: Boolean
});

module.exports = mongoose.model('Project', ProjectSchema);
