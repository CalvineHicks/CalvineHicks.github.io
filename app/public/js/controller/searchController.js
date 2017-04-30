app.controller('SearchController', function SearchController($scope, $http) {
  console.log('blah')

  $scope.advancedSearchInput = '';

  $scope.advancedSearch = function(){
    $http({
      method: 'GET',
      headers: {
        'Content-Type' : 'text/html'
      },
      url: 'http://localhost:8080/ebay/?queryString='+$scope.advancedSearchInput
    }).then(function successCallback(response) {
        console.log(response);
        console.log('test');
      }, function errorCallback(response) {
        console.log('error');
        console.log(response);
      });
  };
});