var app = angular.module("app", ['ngResource', 'ngRoute', 'ngSanitize']);

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

app.factory("Channel", ['$resource', 'api', function($resource, api) {
    return $resource(api.url + '/channels/:id', {
        id: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
}]);

app.factory('Post', ['$resource', 'api', 'TokenService', function($resource, api){

    return $resource(api.url+'/channels/:_channel_id/posts/:_post', {
      channel_id:'@_channel_id', id:'@_post'
    }, {
        update: {
          method:'PUT'
        }
    })
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

app.controller("SignoutController", ['$scope', 'TokenService', 'Member', '$location', function($scope, TokenService, Member, $location) {
    if (TokenService.getToken() !== null) {
        $scope.signout = function() {
            Member.signout({}, function() {
                TokenService.deleteToken();
                $location.path('/');
            });
        }
    }
}]);

app.controller("SignupController", ['$scope', 'TokenService', 'Member', '$location', function($scope, TokenService, Member, $location) {
    if (TokenService.getToken() === null) {
        $scope.signup = function() {
            $scope.newMember = new Member({
                fullname:$scope.name,
                email: $scope.email,
                password: $scope.password
            });

            $scope.newMember.$save(function(m) {
                console.log('Compte créé avec succès');
                $location.path('/members');
            }, function(e) {
                console.log(e);
            });

        }
    } else
        $location.path('/');

}]);

app.controller("ChannelController", ['$scope', 'TokenService', 'Channel', '$location', function($scope, TokenService, Channel, $location) {
  if (TokenService.getToken() !== null) {
      $scope.new = function() {
          $scope.newChannel = new Channel({
              label: $scope.label,
              topic: $scope.topic
          });

          $scope.newChannel.$save(function(m) {
              $location.path('/channels');
          }, function(e) {
              console.log(e);
          });
      }
      $scope.index = function(){
        var channels = Channel.query({token:TokenService.getToken()}, function(){
        var list = '<ul>';
        channels.forEach(function(c){
            list += '<li>'+ c.label+', '+ c.topic+', '+'<a href="#!/channels/'+ c._id+'">aller au channel</a></li>';
        });
        $scope.channels = list+'</ul>';
    });
};
  } else
      $location.path('/members/signin');
}]);


app.controller("PostController", ['$scope', 'TokenService', 'Channel', 'Post', '$routeParams', '$location', function($scope, TokenService, Channel, Post, $routeParams, $location) {
  if (TokenService.getToken() !== null) {
    $scope.add = function(){
      console.log($routeParams.id + ', ' + $scope.message);
      Post.save({
              channel_id: $routeParams.id,
              message: $scope.message
          },
          function(){
              $scope.get();
              $scope.message = '';
          },
          function(e){
              console.log(e);
          }
      )
    }

    $scope.get = function(){
      Post.query({
              channel_id:$scope.channel_id
          },
          function(p){
              $scope.posts = p;
          },
          function(e){
              console.log(e);
          }
    )}

  } else
      $location.path('/members/signin');
}]);
