var app = angular.module("app", ['ngResource', 'ngRoute']);

/** CONSTANT **/
app.constant('api', {'key': '169c3211b85b458bb411ab18a81c0f88', 'url': 'http://coop.api.netlor.fr/api'});


/** SERVICE **/
app.service('TokenService', [function() {
    this.token = '';
    this.setToken = function(t) {
        if (localStorage.getItem('token') === null) {
            localStorage.setItem('token', t);
        } else {
            this.token = localStorage.getItem('token');
        }
    }
    this.getToken = function() {
        return localStorage.getItem('token');
    }
    this.deleteToken = function() {
        if (localStorage.getItem('token') !== null)
            localStorage.removeItem('token');
    }
}]);

/** CONFIG **/
app.config(['$httpProvider', 'api', function($httpProvider, api) {
    $httpProvider.defaults.headers.common.Authorization = 'Token token=' + api.key;

    $httpProvider.interceptors.push(['TokenService', function(TokenService) {
        return {
            request: function(config) {
                var token = TokenService.getToken();
                if (token !== null) {
                    config.url += ((config.url.indexOf('?') >= 0) ? '&' : '?') + 'token=' + token;
                }
                return config;
            }
        };
    }]);
}]);

/** FACTORIES **/
app.factory("Member", ['$resource', 'api', function($resource, api) {
    return $resource(api.url + '/members/:id', {
        id: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        signin: {
            method: 'POST',
            url: api.url + '/members/signin'
        },
        signout: {
            method: 'DELETE',
            url: api.url + '/members/signout'
        }
    });
}]);

/** CONTROLLERS **/

app.controller("HomeController", ['$scope', 'Member', 'TokenService', '$location', function($scope, Member, TokenService, $location) {
    if (TokenService.getToken() === null) {
        $location.path('/members/signin');
    } else {
        $location.path('/');
    }
}]);

app.controller("SigninController", ['$scope', 'Member', 'TokenService', '$location', function($scope, Member, TokenService, $location) {
  if (TokenService.getToken() === null){
    $scope.signin = function(){
      $scope.member = Member.signin({
            email: $scope.email, //cooptata@toto.fr
            password: $scope.password, //tatayoyo
        },
      function(m) {
          $scope.member = m;
          TokenService.setToken($scope.member.token);
          $location.path('/members');
      },
      function(e) {
          console.log(e);
      });
    }
  }
  else{
    $location.path('/members');
  }
}]);

app.controller("SignoutController", ['$scope', 'TokenService', 'Member', '$location', function(scope, TokenService, Member, $location) {
    if (TokenService.getToken() !== null) {
        $scope.logout = function() {
            Member.signout({}, function() {
                TokenService.deleteToken();
                console.log('Déconnexion');
                $location.path('/signin');
            });
        }
    }
}]);
