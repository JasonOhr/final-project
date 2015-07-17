'use strict';

angular.module('nutritionApp.ingredients', ['ngRoute']).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ingredients', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
    access:{
        requiresLogin: true
    }
  }).when('/ingredients/:ndbno', {
    templateUrl: 'view1/ingredient.html',
    controller: 'IngredientReportCtrl'
  });
}])

.controller('View1Ctrl', ['$scope','$http','ParseConnector',function($scope,$http,ParseConnector
    ) {
        //$filter('limitTo')()
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

        ParseConnector.getAll().success(function(data){
            $scope.customIngredients = data;
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

            $scope.newIngredient.name = name;
            $scope.newIngredient.ndbno = ndb;
        };
        $scope.saveIngredient = function(name,id){
            ParseConnector.getNdbItem(id).success(function(data){
                var nutrients = data.report.food.nutrients;
                ParseConnector.saveIng({name:name,ndbno:id,nutrients:nutrients,fg:fg}).success(function(data) {
                        console.log(data);
                })
            });


        };




}])
    .controller('IngredientReportCtrl', ['$rootScope','$scope', '$http', '$routeParams', 'returnPercentage',function($rootScope,$scope,$http,$routeParams, returnPercentage){
      $http.get('http://api.nal.usda.gov/ndb/reports/?ndbno='+ $routeParams.ndbno +'&type=f&format=json&api_key=z4jl046RdF4ydQqwBhipZbHkjsrKP27W94A5eIyf').success(function(data){

          $scope.ingredientReport = data;
          //console.log($scope.ingredientReport);
          var nutrients =   $scope.ingredientReport.report.food.nutrients;//All nutrients and measure for an ingredient

          console.log('nuts',nutrients);
          var preMeasure = nutrients[0].measures;
          //var caloriesPerGram = Number((nutrients.value/100).toFixed.toFixed(2));
            //console.log('cal',caloriesPerGram);
          //console.log('preMeasure',preMeasure);
          var grams = {eqv: 1, label: 'g'};
          preMeasure.unshift(grams);
          $scope.measure = preMeasure;
          $scope.measurement = $scope.measure[0];
          $scope.convertToNumber();

          var carbNuts = [208,291,209,269,210,211,212,213,214,289];
          var proteinNuts = [203,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,521];
          $rootScope.vitaminNuts = [318,320,321,322,334,337,338,415,417,432,431,435,418,401];
          var topNuts = {protein:208, carbs:203};
        $scope.carbs = _.filter(nutrients, function(nutrients){
            return _.contains(proteinNuts, nutrients.nutrient_id)
        });
          console.log('the carbs:',$scope.carbs);
          $scope.chartInfo = _.map($scope.carbs,function(newC){
              return {y:newC.value, name:newC.name};
          });
          console.log($scope.chartInfo);


         $scope.vitamins =
            $scope.returnPercentage = function(n,d){
              return returnPercentage(n,d);
          };

          var nutrients = $scope.chartInfo
          $scope.chartConfig =  {
              options: {
                  chart: {
                      type: 'column'
                  },
                  drilldown:{
                      series: [{
                          id:'dudes',
                          data:[
                              ['little',3],['big',6],['whatever',2]
                          ]
                      },{
                          id:'guys',
                          data:[
                              ['girly',5],['big',6],['whatever',2]
                          ]
                      },{
                          id:'mofo',
                          data:[
                              ['week',1],['big',6],['whatever',2]
                          ]
                      }
                      ]
                  }
              },
              series: [
                  { name: 'Jane',
                      data: nutrients
                  }
              ],

              title: {
                  text:'Hello'
              },
              loading: false

          };
          console.log('measurement',$scope.measurement);

      });
        $scope.convertToNumber = function(){
            $scope.measureMultiplier = ($scope.measurement.eqv)/100;

        };
      //console.log($routeParams.ndbno);
    }])
    .factory('returnPercentage',function(){

        return function(n,d){
          return (n/d).toFixed(2) + '%';
        }
    });