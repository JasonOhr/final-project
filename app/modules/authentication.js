//Parse.initialize('6eWfrF9o99R8oPUNvFW6mXu6iJVoBzMS0c3dMZiu','HSHbAZxn8igmoF6wpVOQ7QfoQhKeekL4IJguGNbS')

angular.module('authenticateModule',["highcharts-ng"])
    .controller('AuthenticateCtrl',['$rootScope','$scope','Userservice',function($rootScope,$scope,Userservice){
        var localLoggedIn = localStorage.getItem('localLoggedIn') || false;
        console.log('localLoggedIn?', localLoggedIn);
        //console.log($rootScope.isLoggedIn);
        if(!localLoggedIn){
            console.log('here?');
            $scope.user = {'username': '','password': '','email': '','firstName': '','lastName':''};
        }else {
            $scope.user = JSON.parse(localLoggedIn);
            $rootScope.isLoggedIn = true;

            console.log('am i logged in now',$scope.user);
            console.log('main log in',$rootScope.isLoggedIn);
        }



        //$scope.registerUserMode = false;
        //$scope.showRegistrationForm = function(){ $scope.registerUserMode = true;}
        $scope.signIn = function(){
            $scope.user.username = $scope.user.email;
            console.log('creds:',$scope.user);
            Userservice
                .login($scope.user)
                .then(function(response) {
                    console.log('im the response: ',response.data);
                    $scope.user.firstName = response.data.firstName;
                    $scope.user.lastName = response.data.lastName;
                    $scope.user.sessionToken = response.data.sessionToken;
                    $rootScope.isLoggedIn = true;
                    $rootScope.currentUser = $scope.user.sessionToken;
                    localStorage.setItem('localLoggedIn',JSON.stringify(response.data));
                    console.log('check local: ', localStorage.getItem('localLoggedIn'));

                },function(error){
                    console.log(error.data.code);
                    alert('those credentials is wrong');
                })
        };
        $scope.logOut = function(){
            localStorage.removeItem('localLoggedIn');
            $rootScope.isLoggedIn = false;


            Userservice
                .logout($scope.user)
                .then(function(){
                    localStorage.removeItem('localLoggedIn');
                    $scope.user = {};
                })
        };

        //$scope.doLogin = function(){
        //    console.log('creds: ',$scope.userCredentials);
        //    Userservice
        //        .login($scope.userCredentials)
        //        .then(function(response){
        //            console.log('Successful login: ',response);
        //            $rootScope.isLoggedIn = true;
        //            var currentUser = Parse.User.current();
        //            $rootScope.currentUser = currentUser.toJSON();
        //            $rootScope.$apply();
        //        }, function(reason){
        //            console.log('Failed', reason);
        //            $rootScope.isLoggedIn = false;
        //        });
        //};
        $scope.doRegister = function(){
            Userservice
                .register($scope.user)
                .then(function(response){
                    console.log('Successful',response);
                },function(reason){
                    console.log('Failed: ',reason);
                },function(update){
                    console.log('notified: ',update);
                });
        };

    }])
    .service('Userservice',['$rootScope','$http',function($rootScope,$http){
        return{
            login: function(credentials){
                var username = credentials.username;
                var password = credentials.password;
                return $http.get('https://api.parse.com/1/login?username='+ username + '&password=' + password,{
                    headers: {
                        'X-Parse-Application-Id': '6eWfrF9o99R8oPUNvFW6mXu6iJVoBzMS0c3dMZiu',
                        'X-Parse-REST-API-Key': 'HSHbAZxn8igmoF6wpVOQ7QfoQhKeekL4IJguGNbS'
                    }
                });
            },
            logout: function(credentials){
                console.log('howdy',credentials.sessionToken);
              return $http.post('https://api.parse.com/1/logout',{},{
                  headers: {
                      'X-Parse-Application-Id': '6eWfrF9o99R8oPUNvFW6mXu6iJVoBzMS0c3dMZiu',
                      'X-Parse-REST-API-Key': 'HSHbAZxn8igmoF6wpVOQ7QfoQhKeekL4IJguGNbS',
                      'X-Parse-Session-Token': credentials.sessionToken
                  }
              })
            },
            register: function(credentials){
                //var user = new Parse.User();
                for(var property in credentials){
                    user.set(property,credentials[property]);
                }
                return user.signUp(null);
            }
        };
    }]);