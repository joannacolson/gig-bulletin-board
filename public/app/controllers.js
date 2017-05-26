angular.module('ProjectCtrls', ['ProjectServices'])
    .controller('IndexCtrl', ['$scope', 'Project', 'User', function($scope, Project, User) {
        $scope.projects = [];

        //runs a query against the project file when the view loads - this gives us all of the projects
        Project.query(function success(data) {
            $scope.projects = data;
            $scope.projects.forEach(function(project) {
                // console.log('Here is the userId:', project.userId);
                User.get({ id: project.userId }, function success(user) {
                    // console.log('Here is the user object:', user);
                    project.owner = user.firstName + " " + user.lastName;
                }, function error(data) {
                    console.log(data);
                });
            });
        }, function error(data) {
            console.log(data);
        });

        // $scope.getProjectOwnerName = function(userId) {
        //     console.log('Here is the userId:', userId);
        //     var ownerName = 'Joanna Colson.';
        //     User.get({ id: userId }, function success(user) {
        //         console.log('Here is the user object:', user);
        //         ownerName = user.firstName + " " + user.lastName;
        //     }, function error(data) {
        //         console.log(data);
        //     });
        //     return ownerName;
        // };

        $scope.deleteProject = function(id, projectsIdx) {
            Project.delete({ id: id }, function success(data) {
                $scope.projects.splice(projectsIdx, 1);
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('ShowCtrl', ['$scope', '$stateParams', 'Project', 'User', function($scope, $stateParams, Project, User) {
        $scope.project = {};

        Project.get({ id: $stateParams.id }, function success(data) {
            $scope.project = data;
            $scope.project.dueDate = new Date(data.dueDate);

            User.get({ id: data.userId }, function success(user) {
                $scope.project.owner = user.firstName + " " + user.lastName;
            }, function error(data) {
                console.log(data);
            });

        }, function error(data) {
            console.log(data);
        });
    }])
    .controller('NewCtrl', ['$scope', '$location', 'Project', 'Auth', function($scope, $location, Project, Auth) {
        var currentUser_id = Auth.currentUser()._id;
        // console.log('Auth currentUser._id is:', currentUser_id);
        $scope.project = {
            name: '',
            description: '',
            dueDate: new Date(),
            userId: currentUser_id,
            techReq: '',
            showPublic: false
        };
        // console.log('$scope.project object:', $scope.project);
        // TO DO: Get the current user's id and add it to the new project record
        $scope.createProject = function() {
            Project.save($scope.project, function success(data) {
                $location.path('/projects');
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('EditCtrl', ['$scope', '$stateParams', '$location', 'Project', function($scope, $stateParams, $location, Project) {
        $scope.project = {};

        Project.get({ id: $stateParams.id }, function success(data) {
            $scope.project = data;
            $scope.project.dueDate = new Date(data.dueDate);
        }, function error(data) {
            console.log(data);
        });

        $scope.updateProject = function() {
            // Pick up coding here... verify order of parameters below
            Project.update({ id: $stateParams.id }, $scope.project, function success(data) {
                $location.path('/projects');
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('IndexUsersCtrl', ['$scope', 'User', function($scope, User) {
        $scope.users = [];

        //runs a query against the user file when the view loads - this gives us all of the users
        User.query(function success(data) {
            console.log("Query all users front-end data:", data);
            $scope.users = data;
        }, function error(data) {
            console.log(data);
        });

        $scope.deleteUser = function(id, usersIdx) {
            User.delete({ id: id }, function success(data) {
                $scope.users.splice(usersIdx, 1);
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('EditUserCtrl', ['$scope', '$stateParams', '$location', 'User', function($scope, $stateParams, $location, User) {
        $scope.user = {};

        User.get({ id: $stateParams.id }, function success(data) {
            $scope.user = data;
        }, function error(data) {
            console.log(data);
        });

        $scope.updateUser = function() {
            // Pick up coding here... verify order of parameters below
            User.update({ id: $stateParams.id }, $scope.user, function success(data) {
                //**TO DO: direct user to a different path
                $location.path('/projects');
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('ShowUserCtrl', ['$scope', '$stateParams', '$location', 'User', function($scope, $stateParams, $location, User) {
        $scope.user = {};

        User.get({ id: $stateParams.id }, function success(data) {
            $scope.user = data;
        }, function error(data) {
            console.log(data);
        });

        // Replace this with a different function (or no function at all?)
        // $scope.updateUser = function() {
        // Pick up coding here... verify order of parameters below
        // User.update({ id: $stateParams.id }, $scope.user, function success(data) {
        //**TO DO: direct user to a different path
        // $location.path('/projects');
        // }, function error(data) {
        // console.log(data);
        // });
        // };
    }])
    .controller('NavCtrl', ['$scope', 'Auth', function($scope, Auth) {
        //set the variable to whether we are logged in
        $scope.isLoggedIn = function() {
            return Auth.isLoggedIn();
        };
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
