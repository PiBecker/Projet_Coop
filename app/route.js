var app = angular.module('app');

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
          template: '',
          controller: 'HomeController'
      })

      .when('/members', {
          templateUrl: './views/members.html',
          controller: 'MemberController'
      })

      .when('/members/signin', {
          templateUrl: './views/members/sign_in.html',
          controller: 'SigninController'
      })

      .when('/members/signout', {
          controller: 'SignoutController'
      })

      .when('/members/signup', {
        templateUrl: './views/members/sign_up.html',
        controller: 'SignupController'
      })

      .when('/channel/:idChannel', {
          templateUrl: './views/channel.html',
          controller:'ChannelController'
      })

      .otherwise({
          redirectTo: '/'
      });
}]);
