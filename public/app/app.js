var app = angular.module('ProjectApp', ['ui.router', 'ProjectCtrls']);

app.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/404');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'app/views/projects.html',
                    controller: 'HomeCtrl'
                })
                .state('newProject', {
                    url: '/projects/new',
                    templateUrl: 'app/views/newProject.html',
                    controller: 'NewCtrl'
                })
                .state('projectShow', {
                    url: '/projects/:id',
                    templateUrl: 'app/views/showProject.html',
                    controller: 'ShowCtrl'
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'app/views/userSignup.html',
                    controller: 'SignupCtrl'
                })
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
        // add the interceptor to the existing Interceptors
        $httpProvider.interceptors.push('AuthInterceptor');
    }]);
