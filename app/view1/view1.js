'use strict';

angular.module('nutritionApp.ingredients', ['ngRoute']).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ingredients', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  }).when('/ingredients/:ndbno', {
    templateUrl: 'view1/ingredient.html',
    controller: 'IngredientReportCtrl'
  });
}])

.controller('View1Ctrl', ['$scope','$http',function($scope,$http) {
      var localData = localStorage.getItem('nutritionData') || undefined;
      if(localData){
        $scope.nutrition = JSON.parse(localData);
        //console.log('in local', $scope.nutrition);
      }else{
        $http.get('ingredients/ingredients.json').success(function(data) {
          localStorage.setItem('nutritionData',JSON.stringify(data));
          $scope.nutrition = data;

        });
      }
        $http.get('https://api.parse.com/1/classes/custom_ingredients',{
            headers:{
                'X-Parse-Application-Id': '6eWfrF9o99R8oPUNvFW6mXu6iJVoBzMS0c3dMZiu',
                'X-Parse-REST-API-Key':'HSHbAZxn8igmoF6wpVOQ7QfoQhKeekL4IJguGNbS'
            }
        }).success(function(data){
            $scope.customIngredients = data;
            console.log(data);

        });

        $scope.searchLimit = 10;

        $scope.startsWith = function (entireArray, myQuery) {
            var lowerStr = (entireArray + "").toLowerCase();
            return lowerStr.indexOf(myQuery.toLowerCase()) === 0;
            //this returns true if it is found in the entireArray
        };
        $scope.newIngredient = {
            name: null,
            ndbno: null
        };
        $scope.populateNew = function(ndb,name){
            console.log(ndb, name);
            $scope.newIngredient.name = name;
            $scope.newIngredient.ndbno = ndb;
        }



}])
    .controller('IngredientReportCtrl', ['$scope', '$http', '$routeParams', 'returnPercentage',function($scope,$http,$routeParams, returnPercentage){
      $http.get('http://api.nal.usda.gov/ndb/reports/?ndbno='+ $routeParams.ndbno +'&type=f&format=json&api_key=z4jl046RdF4ydQqwBhipZbHkjsrKP27W94A5eIyf').success(function(data){
          $scope.ingredientReport = data;
          var nutrients =   $scope.ingredientReport.report.food.nutrients;
          var carbNuts = [208,291,209,269,210,211,212,213,214,289];
          var proteinNuts = [203,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,521];
          var vitaminNuts = [318,320,321,322,334,337,338,415,417,432,431,435,418,401];
          //var macroNuts = [208,]
        $scope.carbs = _.filter(nutrients, function(nutrients){
            return _.contains(carbNuts, nutrients.nutrient_id)
        });
          //$scope.returnPercentage = function(n,d){return (n/d).toFixed(2) + '%';}
            $scope.returnPercentage = function(n,d){

              return returnPercentage(n,d);
          }

      });
      //console.log($routeParams.ndbno);
      //$scope.ingredient = $routeParams.id;
    }])
    .factory('returnPercentage',function(){

        return function(n,d){
          return (n/d).toFixed(2) + '%';
        }
    });