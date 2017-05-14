app.controller('GuidedSearchController', ['$scope', '$http', '$routeParams', function GuidedSearchController($scope, $http, $routeParams) {
        $scope.queryString = $routeParams.queryString;
        $scope.category = $routeParams.category;
        $scope.subCategory = $routeParams.subCategory;
        $scope.zipCode = '80202';
        $scope.city = 'Denver';
        $scope.state = 'CO';
        $scope.results = [];
        $scope.craigslistResults = [];
        $scope.ebayResults = [];
        $scope.maxPrice = 10;
        $scope.minPrice = 0;

      $scope.guidedSearch = function(){
        console.log('performing guided search');
        $scope.loadingResults=true;
        $scope.loadingResultsProgress=20;
        $scope.ebayResults = [];
        $scope.craigslistResults = [];
        $scope.results = [];
        $scope.results.length = 0;

        $scope.sortType     = 'price'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.sortSelected = 'price:false';

        $scope.sortSelect = function(){
            var args = $scope.sortSelected.split(':');
            $scope.sortType     = args[0];
            $scope.sortReverse  = (args[1] == 'true');
        };

        $http({
          method: 'GET',
          headers: {
            'Content-Type' : 'text/html'
          },
          url: 'http://localhost:8080/ebay/?queryString='+$scope.queryString
        }).then(function successCallback(response) {
            $scope.ebayResults = response['data'];
            for(var i in $scope.ebayResults){
                $scope.ebayResults[i]['site'] = 'Ebay';
            }
            $scope.results = $scope.results.concat($scope.ebayResults);
        console.log($scope.results);
          }, function errorCallback(response) {
            console.log('error');
            console.log(response);
          });

        $http({
          method: 'GET',
          headers: {
            'Content-Type' : 'text/html'
          },
          url: 'http://localhost:8080/craigslist/?city='+$scope.city+'&queryString='+$scope.queryString
          }).then(function successCallback(response) {
            $scope.craigslistResults = response['data'];
            for(var i in $scope.craigslistResults){
                $scope.craigslistResults[i]['site'] = 'Craigslist';
            }
            $scope.results = $scope.results.concat($scope.craigslistResults);
        console.log($scope.results);
          }, function errorCallback(response) {
            console.log('error');
            console.log(response);
          });

        $scope.loadingResults=false;
      };


        $scope.guidedSearch();
        $scope.includeCraigslist = true;
        $scope.includeEbay = true;

        $scope.greaterThan = function(prop, val){
            return function(item){
              return (item[prop] == null || isNaN(item[prop]) || item[prop] > val);
            }
        }

        $scope.lessThan = function(prop, val){
            return function(item){
              return (item[prop] == null || isNaN(item[prop]) || item[prop] < val);
            }
        }

        $scope.isANumber = function(item){
            return !isNaN(item)
        };
}]);