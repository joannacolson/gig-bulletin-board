angular.module('RecipeCtrls', ['RecipeServices'])
    .controller('HomeCtrl', ['$scope', 'Recipe', function($scope, Recipe) {
        $scope.recipes = [];

        Recipe.query(function success(data) {
            $scope.recipes = data;
        }, function error(data) {
            console.log(data);
        });

        $scope.deleteRecipe = function(id, recipesIdx) {
            Recipe.delete({ id: id }, function success(data) {
                $scope.recipes.splice(recipesIdx, 1);
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('ShowCtrl', ['$scope', '$stateParams', 'Recipe', function($scope, $stateParams, Recipe) {
        $scope.recipe = {};

        Recipe.get({ id: $stateParams.id }, function success(data) {
            $scope.recipe = data;
        }, function error(data) {
            console.log(data);
        });
    }])
    .controller('NewCtrl', ['$scope', '$location', 'Recipe', function($scope, $location, Recipe) {
        $scope.recipe = {
            title: '',
            description: '',
            image: ''
        };

        $scope.createRecipe = function() {
            Recipe.save($scope.recipe, function success(data) {
                $location.path('/');
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('NavCtrl', ['$scope', 'Auth', function($scope, Auth) {
        //set the variable to whether we are logged in
        $scope.isLoggedIn = function() {
            return Auth.isLoggedIn();
        }
        $scope.logout = function() {
            // to implement
            // console.log('logging out');
            Auth.removeToken();
        };
    }])
    .controller('SignupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
        $scope.user = {
            email: '',
            password: ''
        };
        $scope.userSignup = function() {
            // to implement
            $http.post('/api/users', $scope.user).then(function success(res) {
                console.log('successfully created a new user', res);
                $location.path('/'); //relocate to the home page
            }, function error(res) {
                console.log('Error while signing up', res);
            });
        };
    }])
    .controller('LoginCtrl', ['$scope', '$timeout', 'Auth', '$http', '$location', 'Alerts', function($scope, $timeout, Auth, $http, $location, Alerts) {
        $scope.user = {
            email: '',
            password: ''
        };
        var clearAlerts = function() {
            Alerts.clear();
        };

        $scope.userLogin = function() {
            // to implement
            $http.post('/api/auth', $scope.user).then(function success(res) {
                console.log('response from server when logging in:', res);
                Auth.saveToken(res.data.token);
                Alerts.add('success', 'You are now logged in successfully.');
                $timeout(clearAlerts, 5500);
                // $scope.isLoggedIn = Auth.isLoggedIn();
                $location.path('/'); // redirect to home page
            }, function error(res) {
                console.log('Something went wrong', res);
                Alerts.add('error', 'Bad Login Info, Please Try Again.');
                $timeout(clearAlerts, 5500);
            });
        };
    }])
    .controller('AlertsController', ['$scope', 'Alerts', function($scope, Alerts) {
        $scope.alerts = function() {
            return Alerts.get();
        };
    }]);
// .controller('AlertCtrl', ['$scope', 'Alerts', function($scope, Alerts) {
//     $scope.Alerts = Alerts;
// }]);
