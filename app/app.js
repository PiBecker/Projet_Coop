var app = angular.module("app", ['ngResource', 'ngRoute', 'member']);
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
