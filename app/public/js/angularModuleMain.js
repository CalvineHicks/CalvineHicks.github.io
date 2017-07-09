var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider,$locationProvider) {
    $routeProvider.when("/", {
        templateUrl : "views/home.html",
        controller: 'SearchController'
    })
    .when("/at/:category/:subCategory/:queryString", {
            templateUrl : "views/atGuidedSearch.html",
            controller: 'GuidedSearchController'
        })
    .when("/at/:zipCode/:queryString", {
            templateUrl : "views/atGuidedSearch.html",
            controller: 'GuidedSearchController'
        })
    .when("/Search", {
        templateUrl : "views/search.html",
        controller: 'SearchController'
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

/*
*   This directive will allow navbar link clicks to change the page location
*/
app.directive('bsActiveLink', ['$location', function ($location) {
return {
    restrict: 'A', //use as attribute
    replace: false,
    link: function (scope, elem) {
        //after the route has changed
        scope.$on("$routeChangeSuccess", function () {
            var hrefs = ['/#' + $location.path(),
                         '#' + $location.path(), //html5: false
                         $location.path()]; //html5: true
            angular.forEach(elem.find('a'), function (a) {
                a = angular.element(a);
                if (-1 !== hrefs.indexOf(a.attr('href'))) {
                    a.parent().addClass('active');
                } else {
                    a.parent().removeClass('active');
                };
            });
        });
    }
}}]);

app.controller('cookieController', ['$scope', function($scope) {
$scope.reasonForSearchData = {
    availableOptions: [
      {id: '1', name: 'Want affordable option'},
      {id: '2', name: 'Want to find item easily'},
      {id: '3', name: 'Could not find item elsewhere'}
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
