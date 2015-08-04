/**
 * Created by firewaterjoe on 7/15/15.
 */
angular.module('ingredientGraph',[])
    .controller('IngredientCtrl',['$rootScope','$http','$scope',function($rootScope,$http,$scope){
        var nutrients = $rootScope.chartInfo;

        //console.log('the nuts', nutrients);

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
    }])
    .directive('ingredientChart',function(){
        return {
            link: function(scope, el, attrs) {
                var nutrients = scope[attrs["options"]];
                var chartConfig;


                //var options = scope.$eval(attrs.ingredientChart);
                //console.log(options);
                //options.chart.renderTo = el[0];
                //new Highcharts.Chart(options);
            }
        }

    });





