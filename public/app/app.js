var app = angular.module('ProjectApp', ['ui.router', 'ProjectCtrls']);

//app.config sets the configuration, this is an initial state
// when minification occurs we wont loose those within and w/o the function
app.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/404');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'app/views/home.html'
                })
                .state('projects', {
                    url: '/projects',
                    templateUrl: 'app/views/projects.html',
                    controller: 'IndexCtrl'
                })
                .state('newProject', {
                    url: '/projects/new',
                    templateUrl: 'app/views/newProject.html',
                    controller: 'NewCtrl'
                })
                .state('editProject', {
                    url: '/projects/edit/:id',
                    templateUrl: 'app/views/editProject.html',
                    controller: 'EditCtrl'
                })
                .state('showProject', {
                    url: '/projects/:id',
                    templateUrl: 'app/views/showProject.html',
                    controller: 'ShowCtrl'
                })
                .state('users', {
                    url: '/users',
                    templateUrl: 'app/views/users.html',
                    controller: 'IndexUsersCtrl'
                })
                .state('editUser', {
                    url: '/users/edit/:id',
                    templateUrl: 'app/views/editUser.html',
                    controller: 'EditUserCtrl'
                })
                .state('showUser', {
                    url: '/users/:id',
                    templateUrl: 'app/views/showUser.html',
                    controller: 'ShowUserCtrl'
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'app/views/userSignup.html',
                    controller: 'SignupCtrl'
                })
                // if user clicks the login button on the navbar direct to the login.html page
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/views/userLogin.html',
                    controller: 'LoginCtrl'
                })
                .state('404', {
                    url: '/404',
                    templateUrl: 'app/views/404.html'
                });

            $locationProvider.html5Mode(true);
        }
    ])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }]);
