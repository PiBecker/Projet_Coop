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

app.controller("SignoutController", ['$scope', 'TokenService', 'Member', '$location', function($scope, TokenService, Member, $location) {
    if (TokenService.getToken() !== null) {
        $scope.signout = function() {
            Member.signout({}, function() {
                TokenService.deleteToken();
                console.log('Déconnexion');
                $location.path('/');
            });
        }
    }
}]);

app.controller("SignupController", ['$scope', 'TokenService', 'Member', '$location', function($scope, TokenService, Member, $location) {
    if (TokenService.getToken() === null) {
        $scope.signup = function() {
            console.log('ici');
            $scope.newMember = new Member({
                fullname:$scope.name,
                email: $scope.email,
                password: $scope.password
            });

            $scope.newMember.$save(function(m) {
                console.log('Compte créé avec succès');
                $location.path('/members');
            }, function(e) {
                alert(e.data.error);
            });
            TokenService.setToken($scope.member.token);
            $cookies.put('id_coop', $scope.member._id);
            $cookies.put('email_coop', $scope.login.email);
            $cookies.put('password_coop', $scope.login.email);
            $cookies.put('token', $scope.member.token);
        }
    } else
        $location.path('/');

}]);

app.controller("MemberController", ['$scope', 'Member', 'Channel', 'TokenService', '$cookies', function($scope, Member, Channel, TokenService, $cookies) {

$scope.removeCookies = function(){
    $cookies.remove('id_coop');
    $cookies.remove('email_coop');
    $cookies.remove('password_coop');
    $cookies.remove('token');
};

$scope.creerChannel = function(){
    Channel.save({
            label: $scope.channel.label,
            topic: $scope.channel.topic
        },
        function(){
            $scope.channel.message = 'Le channel a bien été créé.';
            $scope.channel.label = '';
            $scope.channel.topic = '';
            $scope.afficherChannels();
        },
        function(e){
            console.log(e);
        }
    )
};


$scope.afficherChannels = function(){
    var channels = Channel.query({token:TokenService.getToken()}, function(){
        var list = '<ul class="">';
        channels.forEach(function(n){
            list += '<li class=""><div><h5>'+ n.label+'</h5>'+ n.topic+'<a href="#/channel/'+ n._id+'" class=""><i class="">search</i></a></div></li>';
        });
        $scope.channels = list+'</ul>';
    });
};


    var init = function(){
        var emailcoop = $cookies.get('emailcoop');
        var passwordcoop = $cookies.get('passwordcoop');
        var tokencoop = $cookies.get('tokencoop');
        if(emailcoop != undefined && passwordcoop != undefined && tokencoop != undefined){
            $('.collapsible').collapsible();
            TokenService.setToken(tokencoop);
            Member.signedin(
                function(m){
                    $scope.member = m;
                    $scope.connexion();
                },
                function(e){
                    console.log(e);
                }
            );
        }else
            $scope.logged = false;
    };

    init();
}]);
