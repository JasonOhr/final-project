'use strict';

angular.module('nutritionApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipes', {
    templateUrl: 'view2/recipes.html',
    controller: 'RecipeCtrl'
  });
}])

.controller('RecipeCtrl', ['$scope','ParseConnector','$http',function($scope,ParseConnector,$http) {
    $http.get('ingredients/rda.json').success(function(data){
       $scope.rda = data;//this needs to be moved to a service or similar
    });
    ParseConnector.getAll().success(function(data){
        //_.map(data.results,function(ing){
        //    var ndb = parseInt(ing.ndbno)
        //    return {ndbno:ndb}
        //});

        $scope.customIngredients = data.results;
        //console.log(data.results);
    }).success(function(){
        var topNuts = [318, 401, 328, 323, 430, 404, 405, 406, 415, 417, 418, 301, 303, 304, 305, 306, 307, 309, 312, 315, 317];
        var macroNuts =[208, 203, 204, 606, 695, 601, 307, 205, 291, 269];
        $scope.qty = 1;
        $scope.measureMultiplier = .01;
        $scope.recipeIngredients = [];
        $scope.recipeIngredients.totalled = [];
       // console.log($scope.customIngredients);

        $scope.addIngredient = function(ndb,name,nutrients){

            var id = $scope.recipeIngredients.length + 1;
            console.log('now here',nutrients[0].measures);
            var preMeasure = nutrients[0].measures;
            var grams = {eqv: 1, label: 'g',qty:1};
            preMeasure.unshift(grams);
            $scope.measure = preMeasure;
            $scope.measurement = nutrients[0].measures;
            $scope.topNuts = $scope.attachRda(topNuts,nutrients);
            console.log('im here',$scope.topNuts);
            //var totalledNuts =


            $scope.recipeIngredients.push({id:id,name:name,ndbno:ndb,nutrients:nutrients})
            //$scope.customIngredients;
            console.log($scope.recipeIngredients);

        };
        $scope.removeIng = function(id){
            //console.log($scope.recipeIngredients.id);
            $scope.recipeIngredients = _.reject($scope.recipeIngredients,function(ing){
                return ing.id === id; //returns all but the rejected ingredient w/this id
            });


        };
        $scope.attachRda = function(nuts,nutrients){
            return _.chain(nutrients)
                .filter(function(nutrients){
                    return _.contains(macroNuts,nutrients.nutrient_id);
                })
                .map(function(data){
                    var rdaInfo = _.find($scope.rda,function(rda){
                        //return the info of the ndbno numbers where they match so that I can add the rda amount into the object
                        return rda.ndbno===data.nutrient_id ;
                    });
                    data.rda = rdaInfo.rda;
                    data.name = rdaInfo.name;
                    //replaces the long stock nutrient name with the custom name in rda.json
                    return data ;
                })
                .value();



        };
        $scope.totalledNuts = function(){
            var totalledNuts = JSON.parse(JSON.stringify($scope.recipeIngredients.totalled));
            _.map(totalledNuts,function(newC){
                newC.value = (newC.value * $scope.measureMultiplier * $scope.measurement.qty)/newC.rda;
                newC.value = Math.round(newC.value*100)/100;
            })
        };
        $scope.calculateNutrients = function(){
            //console.log($scope.measureMultiplier);
            var totalledNuts = JSON.parse(JSON.stringify($scope.recipeIngredients.totalled));
            //clone needed to keep original content correct
            $scope.chartConfig.series[0].data = _.map(totalledNuts,function(newC){
                //console.log('rda',newC.rda);
                //console.log('value per',newC.value);
                newC.value = (newC.value * $scope.measureMultiplier * $scope.measurement.qty)/newC.rda;
                //this converts to percentage RDA. I removed the div by 100 in multiplier to skip step of converting back to %
                newC.value = Math.round(newC.value*100)/100;
                //this converts to 2 decimals
                return {y:newC.value, name:newC.name};
                //this builds a new object for highcharts to easily consume and ensures it refreshes
            });
            //console.log('clog some stuff',$scope.chartConfig.series[0].data);
        };
        $scope.convertToNumber = function(){
            $scope.measureMultiplier = ($scope.measurement.eqv);
            $scope.calculateNutrients();

        };
        $scope.chartConfig =   {

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
                //categories:categories

            },
            yAxis: {
                tickAmount: 10,
                title: {
                    text:"Percent"
                }
            },
            loading: false

        };

    });

}])
    .directive('singleIngredient',[ function(){

    }]);