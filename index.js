require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//var path says this is the path in which we look for files. refer to ln 28

// JSON web token dependencies, including a secret key to sign the token
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
// be sure to add the .env file for this
var secret = process.env.JWT_SECRET;

// use rowdy-logger to show express routes
var rowdy = require('rowdy-logger');

var app = express();

// start using rowdy-logger on the express app
rowdy.begin(app);

// mongoose models and connection //invoke the users model when User is called
var mongoose = require('mongoose');
var User = require('./models/user');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/gigBBprojects');


// decode POST data in JSON and URL encoded formats
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('morgan')('dev'));

// OLD controllers without authorization
// app.use('/api/projects', require('./controllers/projects'));
// app.use('/api/users', require('./controllers/users'));

// Replace the above routes with the following
//We require authorization for all routes except for POSTing a new user
app.use('/api/projects', expressJWT({ secret: secret }), require('./controllers/projects'));
app.use('/api/users', expressJWT({ secret: secret }).unless({
    path: [{ url: '/api/users', methods: ['POST'] }]
}), require('./controllers/users'));

// this middleware will check if expressJWT did not authorize the user, and return a message
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ message: 'You need an authorization token to view this information.' });
    }
});

//POST /api/auth When user logs-in if authenticated, return a signed JWT look app/controllers.js & models/user.js
app.post('/api/auth', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
        // return 401 if error or no user
        if (err || !user) return res.status(401).send({ message: 'User not found' });

        // attempt to authenticate a user on the user model
        var isAuthenticated = user.authenticated(req.body.password);
        // return 401 if invalid password or error
        if (err || !isAuthenticated) return res.status(401).send({ message: 'User not authenticated' });

        // sign the JWT with the user payload and secret, then return
        // Joanna says the .toJSON() method might not be needed here, from code comparison
        var token = jwt.sign(user.toJSON(), secret);
        console.log({ user: user, token: token });
        // the return clause might not be needed here, from code comparison
        return res.send({ user: user, token: token });
    });
});

// all GETs that are not handled by the above controllers and routes are sent to the public/index.html file (uses AngularJS)
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

var server = app.listen(process.env.PORT || 3000, function() {
    rowdy.print();
});

module.exports = server;
