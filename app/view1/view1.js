'use strict';

angular.module('nutritionApp.ingredients', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
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
    .constant("activePageClass", 'current-page')
    .constant("ingredientPageCount",10)
    .controller('View1Ctrl', ['$scope','$timeout','$http','ParseConnector','focus','$filter','ingredientPageCount','activePageClass',function($scope,$timeout,$http,ParseConnector,focus,$filter,ingredientPageCount,activePageClass) {

        //$filter('limitTo')()
      $scope.selectedPage = 1;
      $scope.selectedPage2 = 1;
      $scope.pageSize = ingredientPageCount;
      $scope.selectPage = function(newPage,n){
          $scope.selectedPage = newPage;
      };
      $scope.selectPage2 = function(newPage,n){
          $scope.selectedPage2 = newPage;
      };
      $scope.getPageClass = function(page){
          var dude = $scope.selectedPage == page ? activePageClass : "";

          return dude
      };
      $scope.getPageClass2 = function(page){
           var dude = $scope.selectedPage2 == page ? activePageClass : "";

          return dude
      };
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
        focus("mainQuery");
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
        $scope.clearNewIngredient = function(){
          $scope.newIngredient.name = null;
            $scope.addIngredient = null;
            focus('mainQuery');
        };
        $scope.saveIngredient = function(name,id){
            focus("mainQuery");
            $scope.clearNewIngredient();
            ParseConnector.getNdbItem(id).success(function(data){
                var ingredient = data.report.food;
                console.log(ingredient);
                var nutrients = ingredient.nutrients;
                console.log('nutrient, ingredien:',nutrients, ingredient.fg);
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
        $http.get('ingredients/rda.json').success(function(data){
           $scope.rda = data;
        });
      $http.get('http://api.nal.usda.gov/ndb/reports/?ndbno='+ $routeParams.ndbno +'&type=f&format=json&api_key=z4jl046RdF4ydQqwBhipZbHkjsrKP27W94A5eIyf').success(function(data) {
          $scope.measureMultiplier = .01;
          $scope.ingredientReport = data;
          //console.log($scope.ingredientReport);
          var nutrients = $scope.ingredientReport.report.food.nutrients;//All nutrients and measure for an ingredient

          console.log('nuts',nutrients);
          var preMeasure = nutrients[0].measures;
          //var caloriesPerGram = Number((nutrients.value/100).toFixed.toFixed(2));
          //console.log('cal',caloriesPerGram);
          console.log('preMeasure',preMeasure);
          var grams = {eqv: 1, label: 'g',qty:1};
          preMeasure.unshift(grams);
          $scope.measure = preMeasure;
          $scope.measurement = $scope.measure[0];
          //$scope.convertToNumber();

          var carbNuts = [208, 291, 209, 269, 210, 211, 212, 213, 214, 289];
          var proteinNuts = [203, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 521];
          $scope.vitaminNuts = [318, 320, 321, 322, 334, 337, 338, 415, 417, 432, 431, 435, 418, 401];
          var topNuts = [318, 401, 328, 323, 430, 404, 405, 406, 415, 417, 418, 301, 303, 304, 305, 306, 307, 309, 312, 315, 317];
          var macroNuts =[208, 203, 204, 606, 605, 601, 307, 205, 291, 269];
          $scope.topNuts = _.filter(nutrients, function (nutrients) {
              return _.contains(topNuts, nutrients.nutrient_id);
              //this returns a list of the 'top' nutrients for an ingredient
          });
          $scope.macroNuts = _.filter(nutrients,function(nutrients){
              return _.contains(macroNuts,nutrients.nutrient_id);
          });
          $scope.macroNuts = _.chain($scope.macroNuts)
              //.filter(function (data) {
              //    var hey = _.pluck($scope.rda,'ndbno');
              //
              //    return   _.contains(hey, data.nutrient_id);//verifying the nutrient is present true/false
              //})
              .map(function(data){

                  var thang = _.find($scope.rda,function(rda){
                      //return the info of the ndbno numbers where they match so that I can add the rda amount into the object
                      return rda.ndbno===data.nutrient_id ;
                  });
                  data.rda = thang.rda;
                  data.name = thang.name;
                  //replaced the long stock nutrient name with a custom name
                  return data ;
              })
              .value();
          //console.log('macro',$scope.macroNuts);
          $scope.topNuts = _.chain($scope.topNuts)

              .filter(function (data) {
                  var hey = _.pluck($scope.rda,'ndbno');
                  return _.contains(hey, data.nutrient_id);//verifying the nutrient is present
               })
              .map(function(data){
                  
                  var thang = _.find($scope.rda,function(rda){
                      //return the info of the ndbno numbers where they match so that I can add the rda amount into the object
                     return rda.ndbno===data.nutrient_id ;
                  });
                    data.rda = thang.rda;
                    data.name = thang.name;
                  //replaced the long stock nutrient name with a custom name
                  return data ;
              })
              .value();
          //console.log('rda',$scope.rda)
          //console.log('top nuts',$scope.topNuts);


          $scope.chartInfoName = _.map($scope.chartInfo,function(newN){
              //console.log('newC',newC);
              return newN.name;
              //another array for highcharts to populate the x-axis
          });
          //console.log($scope.chartInfo);


         //$scope.vitamins =
         //   $scope.returnPercentage = function(n,d){
         //     return returnPercentage(n,d);
         // };

          //$scope.chartInfo;
          var categories = $scope.chartInfoName;
          //console.log('categories: ',$scope.chartInfoName);
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
                      name: 'Nutrients',
                      data: [],
                      tooltip: {
                          pointFormat: '<p>{point.y}%</p>'

                      }
                  }
              ],

              title: {
                  text:'Percentage of Recommended Daily Allowances'
              },
              xAxis: {
                  categories:categories

              },
              yAxis: {
                  tickAmount: 10,
                  title: {
                      text:"Percent"
                  }
              },
              loading: false

          };
          //console.log($scope.topNuts);
          $scope.calculateNutrients = function(){
              //console.log($scope.measureMultiplier);
              var topNuts = JSON.parse(JSON.stringify($scope.topNuts));
              //clone needed to keep original content correct
              $scope.chartConfig.series[0].data = _.map(topNuts,function(newC){
                  //console.log('rda',newC.rda);
                  console.log('value per',newC.name, newC.value);
                  newC.value = (newC.value * $scope.measureMultiplier * $scope.measurement.qty)/newC.rda;
                  //this converts to percentage RDA. I removed the div by 100 in multiplier to skip step of converting back to %
                  newC.value = Math.round(newC.value*100)/100;
                  //this converts to 2 decimals
                  return {y:newC.value, name:newC.name};
                  //this builds a new object for highcharts to easily consume and ensures it refreshes
              });
              //console.log('clog some stuff',$scope.chartConfig.series[0].data);
          };
          $scope.convertToNumber();

          //console.log('measurement',$scope.measurement);

      });
        $scope.convertToNumber = function(){
            $scope.measureMultiplier = ($scope.measurement.eqv);
            $scope.calculateNutrients();

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
    })
    .filter("range",function($filter){
        return function(data, page, size){
            if (angular.isArray(data) && angular.isNumber(page) && angular.isNumber(size)){
                var start_index = (page - 1) * size;
                if(data.length < start_index) {
                    return [];
                }else {
                    return $filter("limitTo")(data.splice(start_index),size)
                }
            }else {
                return data;
            }
        }
    })
    .filter("pageCount", function(){
        return function(data,size){
            if(angular.isArray(data)){
                var result = [];
                for (var i = 0;i < Math.ceil(data.length / size); i++){
                    result.push(i);
                }
                return result;
            }else {
                return data;
            }
        }
    });