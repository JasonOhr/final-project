/**
 * Created by firewaterjoe on 7/15/15.
 */
angular.module('ingredientGraph',[])
    .controller('IngredientCtrl',['$http','$scope',function($http,$scope){

    }])
    .directive('ingredientGraph',function(){
        return {
            restrict: 'E',
            scope:{
                ingredients: '=ingredientReport'
            },
            templateUrl: 'templates/ingredient-graph.html'

        }

    })
    .directive('psHighmap', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: { options: '='},
            controller: function ($scope, $element, $attrs) { },
            template: '<div style="margin: 0 auto">Loading</div>',
            link: function (scope, element, attrs) {

                var chart = createMap(scope, element);

                scope.$watch('options', function (options) {
                    if (options)
                        chart = createMap(scope, element);
                }, true);
            }
        }
    });

function createMap(scope, element) {
    var options = scope.options ? cloneObject(scope.options) : {};
    setDeepValue(options, 'title.text', $j(element).attr('title'));
    setDeepValue(options, 'xAxis.title.text', $j(element).attr('xaxis'));
    setDeepValue(options, 'yAxis.title.text', $j(element).attr('yaxis'));
    setDeepValue(options, 'chart.renderTo', $j(element)[0]);
    if (!options.series) {
        if (scope.series)
            options.series = scope.series;
        else
            options.series = [{ data: scope.data, type: $j(element).attr('type') }];
    }
    var chart = new Highcharts.Map(options);
    return chart;
}
;
