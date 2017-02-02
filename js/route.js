var app = angular.module("coop");

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
            templateUrl: './index.html',
        })

        .when('/members', {
            templateUrl: './views/members.html'
        })

        .when('/members/signin', {
            templateUrl: './views/members/sign_in.html'
        })

        .when('/members/signup', {
            templateUrl: './views/members/sign_up.html'
        })

        .when('/members/signout', {
            templateUrl: './views/members/sign_out.html'
        })

        .when('/channels', {
            templateUrl: './views/channels.html'
        })

        .when('/channels/new', {
            templateUrl: './views/channels/new.html'
        })

        .when('/channels/:id', {
            templateUrl: './views/channels/show.html'
        })

        .otherwise({
            redirectTo: '/'
        });
}]);
