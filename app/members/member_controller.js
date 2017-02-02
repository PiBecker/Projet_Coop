angular
    .module('app')
    .controller('MemberController', MemberController);

    MemberController.$inject = ['$scope', 'Member', 'TokenService'];

function MemberController($scope, Member, TokenService) {
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

		// app.controller("MemberController", ['$scope', 'Member', 'TokenService', '$location', function($scope, Member, TokenService, $location) {
		//     if (TokenService.getToken() === null) {
		//         Member.signin({
		//             email: "cooptata@toto.fr",
		//             password: 'tatayoyo'
		//         }, function(m) {
		//             $scope.member = m;
		//             TokenService.setToken($scope.member.token);
		//             console.log($location.path());
		//             $location.path('/signin');
		//         });
		//     } else {
		//         TokenService.setToken(localStorage.getItem('token'));
		//         // $scope.members = Member.query(function(members) {
		//         //     console.log($scope.members);
		//         // });
		//         // Member.signout({}, function() {
		//         //     TokenService.deleteToken();
		//         // })
		//         $location.path('/')
		//     }
		// }]);

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
}
