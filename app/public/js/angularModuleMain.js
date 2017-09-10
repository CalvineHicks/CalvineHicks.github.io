var app = angular.module("myApp", ['ngRoute', 'ngCookies']);
app.config(function($routeProvider,$locationProvider) {
    $routeProvider.when("/", {
        templateUrl : "views/home.html",
        controller: 'HomeController'
    })
    .when("/at/:category/:subCategory/:queryString", {
            templateUrl : "views/atGuidedSearch.html",
            controller: 'GuidedSearchController'
        })
    .when("/at/:zipCode/:queryString", {
            templateUrl : "views/atGuidedSearch.html",
            controller: 'GuidedSearchController'
        })
    .when("/at/:reasonForSearch/:areaOfNeed/:typeOfATDevice/:zipCode/:queryString", {
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

//This factory allows us to persist the same fields accross controllers
app.factory('UserInformation', function($cookies){

    this.data = {
                   reasonForSearchData : "",
                   areaOfNeedData : "",
                   typeOfAtDeviceData : "",
                   queryString : "",
                   zipCode : ""
               }

    if($cookies.get('reasonForSearchData')){
        this.data.reasonForSearchData = $cookies.get('reasonForSearchData');
    }
    if($cookies.get('areaOfNeedData')){
        this.data.areaOfNeedData = $cookies.get('areaOfNeedData');
    }
    if($cookies.get('typeOfAtDeviceData')){
        this.data.typeOfAtDeviceData = $cookies.get('typeOfAtDeviceData');
    }
    if($cookies.get('zipCode')){
        this.data.zipCode = $cookies.get('zipCode');
    }

    return {
        //use the data obj to access the current state of the fields
        data : this.data,
        //use setters to set fields within a controller, also saves to cookies
        setReasonForSearchData(val){
            this.data.reasonForSearchData = val;
            $cookies.put('reasonForSearchData', val);
        },
        setAreaOfNeedData(val){
            this.data.areaOfNeedData = val;
            $cookies.put('areaOfNeedData', val);
        },
        setTypeOfAtDeviceData(val){
            this.data.typeOfAtDeviceData = val;
            $cookies.put('typeOfAtDeviceData', val);
        },
        setQueryString(val){
            this.data.queryString = val;
        },
        setZipCode(val){
            this.data.zipCode = val;
            $cookies.put('zipCode', val);
        },
        //is valid will check that all the fields have a value
        isValid : function(){
            if
                (this.data.reasonForSearchData && this.data.areaOfNeedData && this.data.typeOfAtDeviceData && this.data.queryString && this.data.zipCode){
                    return true
                    }
            return false
        }
    };
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

/*
*   Directive to listen for 'Enter' key presses on inputs
*/
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});