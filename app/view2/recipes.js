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
        //_.map(data.results,function(ing){
        //    var ndb = parseInt(ing.ndbno)
        //    return {ndbno:ndb}
        //});

        $scope.customIngredients = data.results;
        //console.log(data.results);
    }).success(function(){
        $scope.qty = 1;
        $scope.recipeIngredients = [];

        $scope.addIngredient = function(ndb,name,nutrients){
            var id = $scope.recipeIngredients.length + 1;

            $scope.recipeIngredients.push({id:id,name:name,ndbno:ndb,nutrients:nutrients})
            //$scope.customIngredients;
            console.log($scope.recipeIngredients);

        };
        $scope.removeIng = function(id){
            //console.log($scope.recipeIngredients.id);
            $scope.recipeIngredients = _.reject($scope.recipeIngredients,function(ing){
                console.log('ing',ing.id === id);
                return ing.id === id;
            });

        }
    });






}]);