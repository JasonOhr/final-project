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

.controller('View1Ctrl', ['$scope','$timeout','$http','ParseConnector','focus',function($scope,$timeout,$http,ParseConnector,focus
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
        focus("mainQuery")
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
            focus("customName")

        };
        $scope.saveIngredient = function(name,id){
            focus("mainQuery");
            ParseConnector.getNdbItem(id).success(function(data){
                var ingredient = data.report.food;
                var nutrients = ingredient.nutrients;
                //console.log('nutrient, ingredien:',nutrients, ingredient.fg);
                ParseConnector.saveIng({name:name,ndbno:id,nutrients:nutrients, fg:ingredient.fg}).success(function() {
                    //console.log('after save',data);
                    ParseConnector.getAll().success(function(data){
                        $timeout(function(){

                            $scope.customIngredients = data;
                        },0);

                    });
                })
            });


        };




}])
    .controller('IngredientReportCtrl', ['$rootScope','$scope', '$http', '$routeParams', 'returnPercentage',function($rootScope,$scope,$http,$routeParams, returnPercentage){
      $http.get('http://api.nal.usda.gov/ndb/reports/?ndbno='+ $routeParams.ndbno +'&type=f&format=json&api_key=z4jl046RdF4ydQqwBhipZbHkjsrKP27W94A5eIyf').success(function(data){
          $scope.measureMultiplier = .01;
          $scope.ingredientReport = data;
          //console.log($scope.ingredientReport);
          var nutrients =   $scope.ingredientReport.report.food.nutrients;//All nutrients and measure for an ingredient

          //console.log('nuts',nutrients);
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
          var topNuts = [208,204,606,695,601,307,205,291,269,203,318,401,328,323,430,404,405,406,415,417,418,301,303,304,305,306,307,309,312,315,317,601];
        $scope.topNuts = _.filter(nutrients, function(nutrients){
            return _.contains(topNuts, nutrients.nutrient_id)
        });
          console.log('the carbs:',$scope.topNuts);
          $scope.chartInfo = _.map($scope.topNuts,function(newC){
              return {y:newC.value, name:newC.name};
          });
          $scope.chartInfoName = _.map($scope.chartInfo,function(newN){
              console.log(newN.name);
              return newN.name
          });
          //console.log($scope.chartInfo);


         $scope.vitamins =
            $scope.returnPercentage = function(n,d){
              return returnPercentage(n,d);
          };

          var nutrientArray = $scope.chartInfo;
          var categories = $scope.chartInfoName;
          console.log(categories);
          $scope.calculateNutrients = function(){

          };
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
                  {
                      data: nutrientArray,
                      tooltip: {
                          pointFormat: '<p>{point.y}</p>'

                      }
                  }
              ],

              title: {
                  text:'Nutrition Breakdown'
              },
              xAxis: {
                  categories:categories
              },
              loading: false

          };
          console.log('measurement',$scope.measurement);

      });
        $scope.convertToNumber = function(){
            $scope.measureMultiplier = ($scope.measurement.eqv)/100;
            //calculateNutrients();

        };
      //console.log($routeParams.ndbno);
    }])
    .factory('returnPercentage',function(){

        return function(n,d){
          return (n/d).toFixed(2) + '%';
        }
    })
    .factory('focus',function($timeout,$window){
        return function(id){
            $timeout(function(){
                var element = $window.document.getElementById(id);
                if(element){
                    element.focus();
                    element.select();
                }
            })
        }
    });