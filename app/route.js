angular
    .module('app')
    .config(config);

function config($routeProvider) {
    $routeProvider.when('/', {
            templateUrl: './index.html'
        })

        .when('/signin', {
            templateUrl: '../app/members/member_view.html',
            controller: 'MemberController'
        })

        when('/channel/:idChannel', {
          templateUrl: 'views/channel.html',
          controller:'ChannelController'
        }).

        .otherwise({
            redirectTo: '/signin'
        });
}
