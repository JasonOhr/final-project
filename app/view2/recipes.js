'use strict';

angular.module('nutritionApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipes', {
    templateUrl: 'view2/recipes.html',
    controller: 'RecipeCtrl'
  });
}])

.controller('RecipeCtrl', ['$scope','ParseConnector','$http','focus',function($scope,ParseConnector,$http,focus) {
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
        var macroNuts =[208, 203, 204, 606, 605, 601, 307, 205, 291, 269];
        var customNuts = macroNuts.concat(topNuts);
        focus("searchIng");
        $scope.qty = 1;
        $scope.measureMultiplier = .01;
        $scope.recipe = [];
        $scope.recipe.ingredients = [];
        $scope.recipe.totalled = [{ing:5}];
        $scope.measurement = [];
       // console.log($scope.customIngredients);

        $scope.addIngredient = function(ndb,name,nutrients){

            var id = $scope.recipe.ingredients.length +1;
            //console.log('nutrients',nutrients);
            var preMeasure = nutrients[0].measures;
            if(preMeasure[0].eqv !== 1){
                var grams = {eqv: 1, label: 'g',qty:1};
                preMeasure.unshift(grams);
            }
            nutrients =  $scope.attachRda(customNuts,nutrients);
            //console.log('dude',dude);
            $scope.recipe.ingredients.push({id:id,name:name,ndbno:ndb,nutrients:nutrients,measures:preMeasure})
            //$scope.customIngredients;
            //console.log('hi',$scope.recipe.ingredients);


        };

        $scope.removeIng = function(id){
            //console.log('hi trying',id);
            //console.log($scope.recipeIngredients.id);
            $scope.recipe.ingredients = _.reject($scope.recipe.ingredients,function(ing){
                return ing.id === id; //returns all but the rejected ingredient w/this id
            });


        };
        $scope.attachRda = function(nuts,nutrients){
            return _.chain(nutrients)
                .filter(function(nutrients){
                    return _.contains(nuts,nutrients.nutrient_id);
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
            var totalledNuts = JSON.parse(JSON.stringify($scope.recipe.ingredients.totalled));
            _.map(totalledNuts,function(newC){
                newC.value = (newC.value * $scope.measureMultiplier * $scope.measurement.qty)/newC.rda;
                newC.value = Math.round(newC.value*100)/100;
            })
        };
        $scope.addNutrientsToTotal = function(nTotal, oTotal){
            console.log('ntotal',nTotal);
            if(oTotal !== undefined){

                $scope.recipe.ingredients.totalled = _.map(oTotal,function(old){
                    //console.log('aTotal',old.y)
                    if(old.name == undefined){
                        //console.log('hoho');
                        return {name:nTotal.name, y:nTotal.y, rda:nTotal.rda, nutrient_id:nTotal.nutrient_id};
                    }else {
                        //console.log('bad year');
                        //console.log('yes', nTotal);
                        var nue = _.findWhere(nTotal, {name: old.name});
                        if (nue) {
                            //console.log('cool', nue, old.y, nue.y);
                            var y = old.y + nue.y;
                            return {name: old.name, y: y, rda:old.rda,nutrient_id:old.nutrient_id};
                        } else {
                            return old;
                        }
                    }
                });
            } else {
                $scope.recipe.ingredients.totalled = _.map(nTotal,function(n){

                        console.log('new year');
                        return { name:n.name, y:n.y, rda: n.rda,nutrient_id:n.nutrient_id};

                });
            }

            console.log('newTotal',$scope.recipe.ingredients.totalled);
            $scope.calculateChart(topNuts,$scope.recipe.ingredients.totalled)

        };
        $scope.calculateTotalNutrients = function(eqv,qty,nutrients){
            //This is used to calculate the ingredients nutritional values once added and
           console.log('eqv,qty',nutrients)
            var totalledNuts = JSON.parse(JSON.stringify(nutrients));
            //clone needed to keep original content correct
            var totalled = _.map(totalledNuts,function(newC){
                //console.log('rda',newC.rda);
                //console.log('value per',newC);
                newC.value = (newC.value * qty * eqv / 100);
                //this converts to percentage RDA. I removed the div by 100 in multiplier to skip step of converting back to %
                newC.value = Math.round(newC.value*100)/100;
                //this converts to 2 decimals
                return {name:newC.name, y:newC.value,rda:newC.rda, nutrient_id:newC.nutrient_id};

            });
            $scope.addNutrientsToTotal(totalled, $scope.recipe.ingredients.totalled)

        };

        $scope.calculateChart = function(nutArray,nutrientTotal){
            //console.log($scope.measureMultiplier);
            var totalNuts = _.filter(nutrientTotal, function (nutrients) {
                return _.contains(nutArray, nutrients.nutrient_id);
                //this returns a list of the 'top' nutrients for an ingredient
            });
            //var totalledNuts = JSON.parse(JSON.stringify($scope.recipe.ingredients));
            //clone needed to keep original content correct
            $scope.chartConfig.series[0].data = _.map(totalNuts,function(newC){
                //console.log('rda',newC.rda);
                console.log('value per',newC);
                newC.value = (newC.y)/newC.rda;
                //this converts to percentage RDA. I removed the div by 100 in multiplier to skip step of converting back to %
                newC.value = Math.round(newC.value*100);
                //this converts to 2 decimals
                var dude = {y:newC.value, name:newC.name};
                console.log(dude);
                return dude;
                //this builds a new object for highcharts to easily consume and ensures it refreshes
            });
            //console.log('clog some stuff',$scope.chartConfig.series[0].data);
        };

        $scope.calculatePlaque = function(nutArray,nutrientTotal){
            //console.log($scope.measureMultiplier);
            var totalNuts = _.filter(nutrientTotal, function (nutrients) {
                return _.contains(nutArray, nutrients.nutrient_id);
                //this returns a list of the 'top' nutrients for an ingredient
            });
            //var totalledNuts = JSON.parse(JSON.stringify($scope.recipe.ingredients));
            //clone needed to keep original content correct
            $scope.chartConfig.series[0].data = _.map(totalNuts,function(newC){
                //console.log('rda',newC.rda);
                console.log('value per',newC);
                newC.value = (newC.y)/newC.rda;
                //this converts to percentage RDA. I removed the div by 100 in multiplier to skip step of converting back to %
                newC.value = Math.round(newC.value*100);
                //this converts to 2 decimals
                var dude = {y:newC.value, name:newC.name};
                console.log(dude);
                return dude;
                //this builds a new object for highcharts to easily consume and ensures it refreshes
            });
            //console.log('clog some stuff',$scope.chartConfig.series[0].data);
        };

        $scope.convertToNumber = function(id,item,qty){
            //item
            //console.log('info',id,qty,item);
            var nutrients = $scope.recipe.ingredients[id].nutrients;
            //console.log('ing list',ingredient);
            //item.eqv is the number of grams of an items measure

            $scope.calculateTotalNutrients(item.eqv,qty, nutrients);

        };

        $scope.chartConfig =   {

            options: {
                chart: {
                    backgroundColor: 'rgba(250,250,250,.5)',
                    borderColor: '#000000',
                    borderWidth: 1,
                    borderRadius: 5,
                    type: 'column',
                    shadow: false
                },
                labels: {
                    step:5
                },
                plotOptions: {
                    column: {
                        borderColor: '#16542B',
                        color: '#238708',
                        dataLabels: {
                            enabled: true,
                            format: '{y} %'
                        }
                    }
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
    //.directive('singleIngredient',[ function(){
    //    return {
    //
    //        scope: {
    //            ingredient : '=',
    //            qty : '=qty',
    //            measurement : '=measurement',
    //            'removeIng': '&onRemove',
    //            'convertToNumber': '&onChange'
    //
    //
    //        },
    //        restrict: "AE",
    //        transclude: true,
    //        template: ' <ul><li ng-repeat="item in ingredient" >' +
    //
    //            '<input ng-model="qty" size="4" >{{item.name}}' +
    //            '<select  ng-options="item.label for item in ingredient[{{item.id - 1}}].measures" ng-model="measurement" ng-change="convertToNumber()"></select>' +
    //
    //            '<span</span>' +
    //            '</li></ul>'
    //
    //    }
    //}]);