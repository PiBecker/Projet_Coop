var app = angular.module("coop", ['ngResource']);
var url_local = 'http://http://localhost/Projet_Coop/';
app.constant('api', {'key': 'ea7303b5009143bea9c81082e12bac96', 'url': 'http://coop.api.netlor.fr/api'});

app.service('TokenService', [function(){
	this.token = null;
	this.setToken = function(t) {
			if (localStorage.getItem('token') === undefined)
					localStorage.setItem('token', t);
			else
					this.token = localStorage.getItem('token');

	this.getToken = function(){
		if (localStorage.getItem('token') === undefined)
			return localStorage.getItem('token');
		else
			return null;
	}
}]);

app.config(['$httpProvider', 'api', function($httpProvider, api){
	$httpProvider.defaults.headers.common.Authorization = 'Token token='+api.key;

	$httpProvider.interceptors.push(['TokenService', function(TokenService){
		return {
			request: function(config){
				var token = TokenService.getToken();
				if(token != ""){
					config.url += ((config.url.indexOf('?') >= 0) ? '&' : '?')
	 	     							 +'token='+token;
				}
				return config;
			}
		};
	}]);

app.factory("Member", ['$resource', 'api', function($resource, api){
	return $resource(api.url+'/members/:id', {id: '@_id'}, {
		update: {
			method: 'PUT'
		},
		signin: {
			method: 'POST',
			url: api.url+'/members/signin'
		}
	});
}]);

app.controller("StartController", ['$scope', 'Member', 'TokenService', function($scope, Member, TokenService) {
    $scope.member = Member.signin({
            email: 'toto@toto.fr',
            password: 'toto',
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

	// $scope.newMember = new Member({
	// 	fullname: "TOTO",
	// 	email: "toto2@coop.fr",
	// 	password: "toto"
	// });

	// $scope.newMember.$save(function(m){
	// 	console.log($scope.newMember);
	// }, function(e){

	// });

/*$scope.member =	Member.save({
		fullname: "TOTO",
		email: "toto4@coop.fr",
		password: "toto"
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