'use strict';

// Declare app level module which depends on views, and components
angular.module('nutritionApp', [
    'ngRoute',
    'nutritionApp.ingredients',
    'nutritionApp.view2',
    'nutritionApp.version',
    'nutritionServices',
    'authenticateModule'
])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.otherwise({redirectTo: '/view2'});
    }]);
    //.run(function($rootScope){
    //    $rootScope.$on('$routeChangeSuccess',function(){
    //        var currentUser = Parse.User.current();
    //        if(currentUser){
    //            $rootScope.isLoggedIn = true;
    //            $rootScope.currentUser = currentUser;
    //        }else {
    //            $rootScope.isLoggedIn = false;
    //        }
    //    })
    //});
