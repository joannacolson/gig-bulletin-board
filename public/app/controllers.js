angular.module('ProjectCtrls', ['ProjectServices'])
    .controller('IndexCtrl', ['$scope', 'Project', function($scope, Project) {
        $scope.projects = [];

        //runs a query against the project file when the view loads - this gives us all of the projects
        Project.query(function success(data) {
            $scope.projects = data;
        }, function error(data) {
            console.log(data);
        });
        // this is unexplanatory based on the delete route in controllers/projects.js routes
        $scope.deleteProject = function(id, projectsIdx) {
            Project.delete({ id: id }, function success(data) {
                $scope.projects.splice(projectsIdx, 1);
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('ShowCtrl', ['$scope', '$stateParams', 'Project', function($scope, $stateParams, Project) {
        $scope.project = {};

        Project.get({ id: $stateParams.id }, function success(data) {
            $scope.project = data;
        }, function error(data) {
            console.log(data);
        });
    }])
    .controller('NewCtrl', ['$scope', '$location', 'Project', function($scope, $location, Project) {
        $scope.project = {
            title: '',
            description: '',
            image: ''
        };
        $scope.createProject = function() {
            Project.save($scope.project, function success(data) {
                $location.path('/projects');
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
            Auth.removeToken();
        };
    }])
    .controller('SignupCtrl', ['$scope', '$timeout', 'Auth', '$http', '$location', 'Alerts', function($scope, $timeout, Auth, $http, $location, Alerts) {
        $scope.user = {
            firstName: '',
            lastName: '',
            phone: '',
            link: '',
            email: '',
            password: ''
        };
        var clearAlerts = function() {
            Alerts.clear();
        };

        $scope.userSignup = function() {
            $http.post('/api/users', $scope.user).then(function success(res) {
                console.log('successfully created a new user', res);
                // automatically log in the new user using the same logic as in the LoginCtrl
                $http.post('/api/auth', $scope.user).then(function success(res) {
                    console.log('response from server when logging in:', res);
                    Auth.saveToken(res.data.token);
                    Alerts.add('success', 'You are now logged in successfully.');
                    $timeout(clearAlerts, 5500);
                    $location.path('/projects'); // redirect logged-in user to bboard page
                }, function error(res) {
                    console.log('Something went wrong', res);
                    Alerts.add('error', 'Bad Login Info, Please Try Again.');
                    $timeout(clearAlerts, 5500);
                });
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
            $http.post('/api/auth', $scope.user).then(function success(res) {
                console.log('response from server when logging in:', res);
                Auth.saveToken(res.data.token);
                Alerts.add('success', 'You are now logged in successfully.');
                $timeout(clearAlerts, 5500);
                $location.path('/projects'); // redirect logged-in user to bboard page
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
