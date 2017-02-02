var app = angular.module('app');

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
          template: '',
          controller: 'HomeController'
      })

      .when('/members', {
          templateUrl: './views/members.html'
      })

      .when('/members/signup', {
        templateUrl: './views/members/sign_up.html',
        controller: 'SignupController'
      })

      .when('/members/signin', {
          templateUrl: './views/members/sign_in.html',
          controller: 'SigninController'
      })

      .when('/members/signout', {
          templateUrl: './views/members/sign_out.html',
          controller: 'SignoutController'
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
