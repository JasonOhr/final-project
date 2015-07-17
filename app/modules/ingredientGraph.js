/**
 * Created by firewaterjoe on 7/15/15.
 */
angular.module('ingredientGraph',[])
    .controller('IngredientCtrl',['$http','$scope',function($http,$scope){
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
                            data: [
                                {name:'stuff',y:1, drilldown:'dudes'},
                                {name:'other',y:5.9, drilldown:'guys'},
                                {name:'other stuff',y:4,drilldown:'mofo'}]
                        },
                        { name: 'John',
                            data: [{y:5}, {y:15}, {y:3}] }
                    ],

            title: {
                text:'Hello'
            },
            loading: false
        //    chart: { type: 'column' },
        //    title: { text: 'Fruit Consumption' },
        //    yAxis: { categories: ['Apples', 'Bananas', 'Oranges'] },
        //    xAxis: { title: { text: 'Fruit eaten' } },
        //    series: [
        //        { name: 'Jane',
        //            data: [
        //                {name:'stuff',y:1, drilldown:'dudes'},
        //                {name:'other',y:5.9, drilldown:'guys'},
        //                {name:'other stuff',y:4,drilldown:'mofo'}]
        //        },
        //        { name: 'John',
        //            data: [{y:5}, {y:7}, {y:3}] }
        //    ],
        //    drilldown:{
        //        series: [{
        //            id:'dudes',
        //            data:[
        //                ['little',3],['big',6],['whatever',2]
        //            ]
        //        },{
        //            id:'guys',
        //            data:[
        //                ['girly',5],['big',6],['whatever',2]
        //            ]
        //        },{
        //            id:'mofo',
        //            data:[
        //                ['week',1],['big',6],['whatever',2]
        //            ]
        //        }
        //        ]
        //
        //
        //    }
        };
    }])
    .directive('ingredientChart',function(){
        //return {
        //    link: function(scope, el, attrs) {
        //        var options = scope.$eval(attrs.ingredientChart);
        //        console.log(options);
        //        options.chart.renderTo = el[0];
        //        new Highcharts.Chart(options);
        //    }
        //}

    });





