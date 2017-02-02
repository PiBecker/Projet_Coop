var app = angular.module("coopChannel", ['ngResource', 'ngCookies', 'ngSanitize', 'ngRoute']);

pp.constant('api', {'key': '169c3211b85b458bb411ab18a81c0f88', 'url': 'http://coop.api.netlor.fr/api'});

app.factory('Channel', ['$resource', 'api', function($resource, api){
    return $resource(api.url+'/channels/:_id', {_id:'@_id'}, {
      update: {
        method:'PUT'
      }
    })
 }]);

 app.service('TokenService', [function(){
     this.token = "";
     this.setToken = function(t){
         this.token = t;
     };

     this.getToken = function(){
         return this.token;
     }
 }]);
