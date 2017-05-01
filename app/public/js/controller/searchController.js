app.controller('SearchController', function SearchController($scope, $http) {
  console.log('blah')

  $scope.advancedSearchInput = '';

  $scope.advancedSearch = debounce(function(){
    $scope.ebayResults = [];
    $scope.craigslistResults = [];
    $scope.results = [];
    $scope.results.length = 0;
    $http({
      method: 'GET',
      headers: {
        'Content-Type' : 'text/html'
      },
      url: 'http://localhost:8080/ebay/?queryString='+$scope.advancedSearchInput
    }).then(function successCallback(response) {
        $scope.ebayResults = response['data'];
        $scope.results = $scope.results.concat(response['data']);
      }, function errorCallback(response) {
        console.log('error');
        console.log(response);
      });

    $http({
      method: 'GET',
      headers: {
        'Content-Type' : 'text/html'
      },
      url: 'http://localhost:8080/craigslist/?city=denver&queryString='+$scope.advancedSearchInput
      }).then(function successCallback(response) {
        $scope.craigslistResults = response['data'];
        $scope.results = $scope.results.concat(response['data']);
      }, function errorCallback(response) {
        console.log('error');
        console.log(response);
      });
  }, 1000, false);
});

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};