var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider,$locationProvider) {
    $routeProvider.when("/", {
        templateUrl : "views/home.html"
    })
    .when("/Search", {
        templateUrl : "views/search.html"
    })
    .when("/AboutUs", {
        templateUrl : "views/aboutUs.html"
    })
    .when("/Resources", {
        templateUrl : "views/resources.html"
    })
    .when("/ContactUs", {
        templateUrl : "views/contactUs.html"
    });
    $locationProvider.hashPrefix('');
});

app.controller('scrollLinks', function($scope, $location, $anchorScroll) {
   $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
   }
});

app.controller('cookieController', ['$scope', function($scope) {
$scope.reasonForSearchData = {
    availableOptions: [
      {id: '1', name: ''},
      {id: '2', name: 'Want affordable option'},
      {id: '3', name: 'Want to find item easily'},
      {id: '4', name: 'Could not find item elsewhere'}
    ],
    selectedOption: {id: '1', name: ''} //This sets the default value of the select in the ui
    };
$scope.areaOfNeedData = {
    availableOptions: [
      {id: '1', name: ''},
      {id: '2', name: 'Education'},
      {id: '3', name: 'Employment'},
      {id: '4', name: 'Everyday Living'}
    ],
    selectedOption: {id: '1', name: ''} //This sets the default value of the select in the ui
    };
$scope.typeOfAtDeviceData = {
    availableOptions: [
      {id: '1', name: ''},
      {id: '2', name: 'Computers and Related'},
      {id: '3', name: 'Daily Living'},
      {id: '4', name: 'Environmental Adaptations'},
      {id: '5', name: 'Hearing'},
      {id: '6', name: 'Learning, Cognition and Developmental'},
      {id: '7', name: 'Mobility, Seating and Positioning'},
      {id: '8', name: 'Recreation, Sports and Leisure'},
      {id: '9', name: 'Speach Communications'},
      {id: '10', name: 'Vehicle Modifications and Transportation'},
      {id: '11', name: 'Vision'}
    ],
    selectedOption: {id: '1', name: ''} //This sets the default value of the select in the ui
    };
$scope.$watch('reasonForSearchData.selectedOption', function(newVal, oldVal){
    console.log("Setting Reason for Search Cookie to:"+newVal.name);
    setCookie("reasonForSearch",$scope.reasonForSearchData.selectedOption.name, 1000);
  });
$scope.$watch('areaOfNeedData.selectedOption', function(newVal, oldVal){
    console.log("Setting Area of Need Cookie to:"+newVal.name);
    setCookie("areaOfNeedData",$scope.reasonForSearchData.selectedOption.name, 1000);
  });
$scope.$watch('typeOfAtDeviceData.selectedOption', function(newVal, oldVal){
    console.log("Setting Type of AT Device to:"+newVal.name);
    setCookie("typeOfAtDeviceData",$scope.reasonForSearchData.selectedOption.name, 1000);
  });
}]);
