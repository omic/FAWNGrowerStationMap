//var myApp = angular.module('myApp',[]);

//myApp.directive('myDirective', function() {});
//myApp.factory('myService', function() {});

function MyCtrl($scope) {

    
    $scope.counter = 1;
$scope.change = function () {
     $scope.counter++;
  
};
}