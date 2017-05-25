var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    dueDate: { type: Date, default: Date.now },
    userId: String,
    techReq: String,
    showPublic: Boolean
});

module.exports = mongoose.model('Project', ProjectSchema);
