'use strict';

angular.module('nutritionApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipes', {
    templateUrl: 'view2/recipes.html',
    controller: 'RecipeCtrl'
  });
}])

.controller('RecipeCtrl', ['$scope','ParseConnector',function($scope,ParseConnector) {
      ParseConnector.getAll().success(function(data){
        $scope.customIngredients = data;
      });
      $scope.newRecipeIngredients = [];

}])
.directive('recipeIngredients',['ingredients',function(ingredients){
      return {
        restrict: 'E',
        templateUrl: "recipeIngredients.html"
      }
}]);