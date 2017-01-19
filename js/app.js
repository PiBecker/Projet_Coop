var app = angular.module("coop", ['ngResource']);
var url_local = 'http://127.0.0.1/Projet_Coop/';

app.constant('api', {'key': '169c3211b85b458bb411ab18a81c0f88', 'url': 'http://coop.api.netlor.fr/api'});

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


app.config(['$httpProvider', 'api', function($httpProvider, api) {
    $httpProvider.defaults.headers.common.Authorization = 'Token token=' + api.key;

    $httpProvider.interceptors.push(['TokenService', function(TokenService) {
        return {
            request: function(config) {
                var token = TokenService.getToken();
                if (token !== null) {
                    config.url += ((config.url.indexOf('?') >= 0) ? '&' : '?') +
                        'token=' + token;
                }
                return config;
            }
        };
    }]);
}]);

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

app.controller("StartController", ['$scope', 'Member', 'TokenService', function($scope, Member, TokenService) {
    $scope.member = Member.signin({
            email: 'cooptata@toto.fr',
            password: 'tatayoyo',
        },
        function(m) {
            $scope.member = m;
            console.log($scope.member);
            TokenService.setToken($scope.member.token);
            $scope.member = Member.query(function(member) {
                console.log(member);
            })
        },
        function(e) {
            console.log(e);
        });

    $scope.members = Member.query(function(m) {
            console.log(m);
        },
        function(error) {
            console.log(error);
        }
    );

		app.controller("StartController", ['$scope', 'Member', 'TokenService', '$location', function($scope, Member, TokenService, $location) {
		    if (TokenService.getToken() === null) {
		        Member.signin({
		            email: "cooptata@toto.fr",
		            password: 'tatayoyo'
		        }, function(m) {
		            $scope.member = m;
		            TokenService.setToken($scope.member.token);
		            console.log($location.path());
		            $location.path('/signin');
		        });
		    } else {
		        TokenService.setToken(localStorage.getItem('token'));
		        // $scope.members = Member.query(function(members) {
		        //     console.log($scope.members);
		        // });
		        // Member.signout({}, function() {
		        //     TokenService.deleteToken();
		        // })
		        $location.path('/')
		    }
		}]);

	// $scope.newMember = new Member({
	// 	fullname: "cooptata",
	// 	email: "cooptata@toto.fr",
	// 	password: "tatayoyo"
	// });

	// $scope.newMember.$save(function(m){
	// 	console.log($scope.newMember);
	// }, function(e){

	// });

/*$scope.member =	Member.save({
    fullname: "cooptata",
    email: "cooptata@toto.fr",
    password: "tatayoyo"
	}, function(m){
		$scope.member.$delete(function(success){
			console.log(success);
		});
	}, function(e){
		console.log($scope.newMember);
	});

	$scope.members = Member.query(
		function(m){
			console.log(m);
		},
		function(error){
			console.log(error);
		}
	);*/
}]);
