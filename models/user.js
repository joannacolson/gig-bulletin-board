var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//*** added collections to schema
var UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    link: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        var returnJson = {
            _id: ret._id,
            firstName: ret.firstName,
            lastName: ret.lastName,
            phone: ret.phone,
            link: ret.link,
            email: ret.email
        };
        return returnJson;
    }
});

UserSchema.methods.authenticated = function(password) {
    var user = this;
    var isAuthenticated = bcrypt.compareSync(password, user.password);
    return isAuthenticated ? user : false;
};

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        next();
    } else {
        this.password = bcrypt.hashSync(this.password, 10);
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);
