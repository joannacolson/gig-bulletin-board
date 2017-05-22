angular.module('RecipeServices', ['ngResource'])
    .factory('Recipe', ['$resource', function($resource) {
        return $resource('/api/recipes/:id');
    }])
    .factory('Auth', ['$window', function($window) {
        return {
            saveToken: function(token) {
                $window.localStorage['secretrecipes-token'] = token;
            },
            getToken: function() {
                return $window.localStorage['secretrecipes-token'];
            },
            removeToken: function() {
                $window.localStorage.removeItem('secretrecipes-token');
            },
            isLoggedIn: function() {
                return this.getToken() ? true : false;
            },
            currentUser: function() {
                if (this.isLoggedIn()) {
                    var token = this.getToken();

                    try { //Try executing some vulerable code that could potentially throw an excepttion
                        // this splits, decodes, parses and puts the object into payload
                        var payload = JSON.parse($window.atob(token.split('.')[1]));
                        console.log('payload fetched and decoded:', payload);
                        return payload;
                    } catch (err) {
                        // something was wrong with the previous process, gracefully handle the error
                        console.log('A bad one happened', err);
                        return false;
                    }
                }
                return false; //This happens if the user is not logged in...
            }
        };
    }])
    .factory('AuthInterceptor', ['Auth', function(Auth) { // this intercepts the request and tacks on the token when called
        return {
            request: function(config) {
                var token = Auth.getToken();
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            }
        };
    }])
    .factory('Alerts', [function() {
        var alerts = [];
        return {
            get: function() {
                return alerts;
            },
            add: function(type, msg) {
                alerts.push({ type: type, msg: msg });
            },
            clear: function() {
                alerts = [];
            }
        };
    }]);
