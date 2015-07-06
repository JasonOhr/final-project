'use strict';

// Declare app level module which depends on views, and components
angular.module('nutritionApp', [
  'ngRoute',
  'nutritionApp.ingredients',
  'nutritionApp.view2',
  'nutritionApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view2'});
}]);
