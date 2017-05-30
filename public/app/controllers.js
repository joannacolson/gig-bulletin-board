angular.module('ProjectCtrls', ['ProjectServices'])
    .controller('IndexCtrl', ['$scope', 'Project', 'User', function($scope, Project, User) {
        $scope.projects = [];

        //runs a query against the project file when the view loads - this gives us all of the projects
        Project.query(function success(data) {
            $scope.projects = data;
            $scope.projects.forEach(function(project) {
                User.get({ id: project.userId }, function success(user) {
                    project.owner = user.firstName + " " + user.lastName;
                }, function error(data) {
                    console.log(data);
                });
            });
        }, function error(data) {
            console.log(data);
        });

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
        $scope.project = {
            name: '',
            description: '',
            dueDate: new Date(),
            userId: currentUser_id,
            techReq: '',
            showPublic: false
        };
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
            User.update({ id: $stateParams.id }, $scope.user, function success(data) {
                $location.path('/projects');
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('ShowUserCtrl', ['$scope', '$stateParams', '$location', 'User', 'Auth', 'Project', function($scope, $stateParams, $location, User, Auth, Project) {
        $scope.user = {};

        User.get({ id: $stateParams.id }, function success(data) {
            $scope.user = data;
        }, function error(data) {
            console.log(data);
        });

        $scope.isCurrentUser = function(user_id) {
            return user_id == Auth.currentUser()._id;
        };

        $scope.projects = [];

        //runs a query against the project file when the view loads - this gives us all of the projects
        Project.query(function success(data) {
            $scope.projects = data;
            $scope.projects.forEach(function(project) {
                project.dueDate = new Date(project.dueDate);
            });
        }, function error(data) {
            console.log(data);
        });

        $scope.deleteProject = function(id, projectsIdx) {
            Project.delete({ id: id }, function success(data) {
                $scope.projects.splice(projectsIdx, 1);
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('NavCtrl', ['$scope', 'Auth', function($scope, Auth) {
        //set the variable to whether we are logged in
        $scope.isLoggedIn = function() {
            return Auth.isLoggedIn();
        };
        $scope.logout = function() {
            Auth.removeToken();
        };
        $scope.getCurrentUserId = function() {
            return Auth.currentUser()._id;
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
                    $timeout(clearAlerts, 4000);
                    $location.path('/projects'); // redirect logged-in user to bboard page
                }, function error(res) {
                    console.log('Something went wrong', res);
                    Alerts.add('error', 'Bad Login Info, Please Try Again.');
                    $timeout(clearAlerts, 4000);
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
                $timeout(clearAlerts, 4000);
                $location.path('/projects'); // redirect logged-in user to bboard page
            }, function error(res) {
                console.log('Something went wrong', res);
                Alerts.add('error', 'Bad Login Info, Please Try Again.');
                $timeout(clearAlerts, 4000);
            });
        };
    }])
    .controller('AlertsController', ['$scope', 'Alerts', function($scope, Alerts) {
        $scope.alerts = function() {
            return Alerts.get();
        };
    }]);
