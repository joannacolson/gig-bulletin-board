var app = angular.module('ProjectApp', ['ui.router', 'ProjectCtrls']);

//app.config sets the configuration this is an initial states
// when minification occurs we wont loose those within and w/o the function
//refer to ln 13-15 index.html for Providers
app.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/404');

            $stateProvider
            // update the home page

                .state('home', {
                    url: '/',
                    templateUrl: 'app/views/home.html',
                    // controller?? HomeCtrl
                })
                //This is the bulletin board route we need to change url
                .state('BB', {
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
                // if user clicks the login button on the navbar direct to the userLogin.html page
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
