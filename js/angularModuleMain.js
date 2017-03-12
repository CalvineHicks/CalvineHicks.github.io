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
    });
    $locationProvider.hashPrefix('');
});