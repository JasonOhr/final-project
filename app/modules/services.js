/**
 * Created by firewaterjoe on 7/9/15.
 */
angular.module('nutritionServices',[])
    .factory('ParseConnector',['$http',function($http){
        return {
            getAll:function(){
                return $http.get('https://api.parse.com/1/classes/custom_ingredients', {
                    headers: {
                        'X-Parse-Application-Id': '6eWfrF9o99R8oPUNvFW6mXu6iJVoBzMS0c3dMZiu',
                        'X-Parse-REST-API-Key': 'HSHbAZxn8igmoF6wpVOQ7QfoQhKeekL4IJguGNbS'
                    }
                });
            },
            get: function(id){
                return $http.get('https://api.parse.com/1/classes/custom_ingredients/'+ id, {
                    headers: {
                        'X-Parse-Application-Id': '6eWfrF9o99R8oPUNvFW6mXu6iJVoBzMS0c3dMZiu',
                        'X-Parse-REST-API-Key': 'HSHbAZxn8igmoF6wpVOQ7QfoQhKeekL4IJguGNbS'
                    }
                 });
            },
            getNdbItem: function(id){
              return $http.get('http://api.nal.usda.gov/ndb/reports/?ndbno='+ id +'&type=f&format=json&api_key=z4jl046RdF4ydQqwBhipZbHkjsrKP27W94A5eIyf');

            },
            saveIng:function(data){
                return $http.post('https://api.parse.com/1/classes/custom_ingredients/',data,{
                    headers: {
                        'X-Parse-Application-Id': '6eWfrF9o99R8oPUNvFW6mXu6iJVoBzMS0c3dMZiu',
                        'X-Parse-REST-API-Key': 'HSHbAZxn8igmoF6wpVOQ7QfoQhKeekL4IJguGNbS',
                        'Content-Type':'application/json'

                    }
                });
            }
        }
    }]);