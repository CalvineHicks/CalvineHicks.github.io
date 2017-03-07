var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider,$locationProvider) {
    $routeProvider.when("/", {
        templateUrl : "views/test1.html"
    })
    .when("/London", {
        templateUrl : "views/test2.html"
    });
    $locationProvider.hashPrefix('');
});