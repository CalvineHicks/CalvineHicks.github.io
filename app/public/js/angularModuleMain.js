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