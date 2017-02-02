var app = angular.module("coopChannel", ['ngResource', 'ngCookies', 'ngSanitize', 'ngRoute']);

app.constant('api', {'key': '169c3211b85b458bb411ab18a81c0f88', 'url': 'http://coop.api.netlor.fr/api'});

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

 app.factory('Post', ['$resource', 'api', 'TokenService', function($resource, api){

     return $resource(api.url+'/channels/:channel_id/posts/:_id', {channel_id:'@channel_id', id:'@_id'}, {
         update: {method:'PUT'}
     })
 }]);


 app.controller("ChannelController", ['$scope', 'Channel', 'Post', 'Member', 'TokenService', '$cookies', '$routeParams', '$location', function($scope, Channel, Post, Member, TokenService, $cookies, $routeParams, $location) {
     $scope.idChannel = $routeParams.idChannel;
     $scope.channel = {label:'', topic:''};
     $scope.idcoop = '';

     var members = [];

     var edit = false;

     TokenService.setToken($cookies.get('token'));

     Channel.get({
             _id:$scope.idChannel
         },
         function(c){
             $scope.channel = c;
         },
         function(e){
             console.log(e);
         }
     );

     $scope.envoyerPost = function(){
         Post.save({
                 channel_id:$scope.idChannel,
                 message:$scope.post.message
             },
             function(){
                 $scope.afficherPosts();
                 $scope.post.message = '';
             },
             function(e){
                 console.log(e);
             }
         )
     };

     $scope.afficherPosts = function(){
         Post.query({
                 channel_id:$scope.idChannel
             },
             function(p){
                 p.forEach(function(n){
                     members.forEach(function(nm){
                         if(n.member_id == nm._id)
                             n.member_name = nm.fullname;
                     });
                 });
                 $scope.posts = p;

                 var objDiv = document.getElementById("chat");
                 objDiv.scrollTop = objDiv.scrollHeight;
             },
             function(e){
                 console.log(e);
             }
         );


     };

     $scope.supprimerChannel = function(){
         Channel.delete({
                 _id:$scope.idChannel
             },
             function(){
                 $location.path('/');
             },
             function(e){
                 console.log(e);
             }
         )
     };

     $scope.supprimerPost = function(idPost){
         Post.delete({
                 channel_id:$scope.idChannel,
                 _id:idPost
             },
             function(){
                 $scope.afficherPosts();
             },
             function(e){
                 console.log(e);
             }
         )
     };

     $scope.retourMenu = function(){
         $location.path('/');
     };

     $scope.lancerEditionPost = function(p){
         if(p.edit){
             p.edit = false;
             edit = false;
         }else{
             $scope.posts.forEach(function(n){
                 n.edit = false;
             });
             edit = true;
             p.edit = true;
             p.newmessage = p.message;
         }
     };

     $scope.modifierPost = function(idPost, newMessage){
         if(newMessage != ''){
             console.log(idPost);
             Post.update({
                     channel_id:$scope.idChannel,
                     _id:idPost
                 },{ message:newMessage},
                 function(){
                     $scope.afficherPosts();
                 },
                 function(e){
                     console.log(e);
                 });
         }
     };

     $scope.removeCookies = function(){
         $cookies.remove('id_coop');
         $cookies.remove('email_coop');
         $cookies.remove('password_coop');
         $cookies.remove('token');
     };

     var init = function(){
         if($cookies.get('id_coop') != undefined)
             $scope.idcoop = $cookies.get('id_coop');

         Member.query({token:TokenService.getToken()},
             function(m){
                 members = m;
                 $scope.afficherPosts();
                 updatePosts();
             },
             function(e){
                 console.log(e);
                 $location.path('/');
                 $scope.removeCookies();
             });

     };

     init();

     var updatePosts = function(){
         setTimeout(function() {
             if(!edit){
                 $scope.afficherPosts();
                 updatePosts();
             }
         }, 300);
     };
 }]);
