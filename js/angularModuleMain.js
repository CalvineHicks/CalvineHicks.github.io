var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider,$locationProvider) {
    $routeProvider.when("/", {
        templateUrl : "views/home.html"
    })
    .when("/Search", {
        templateUrl : "views/search.html"
    })
    .when("/FAQs", {
        templateUrl : "views/FAQs.html"
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