app.controller('SearchController', function SearchController($scope, $http) {

  $scope.advancedSearchInput = 'chair';
    $scope.zipCode = '80202';
    $scope.city = 'Denver';
    $scope.state = 'CO';
    $scope.results = [];
    $scope.craigslistResults = [];
    $scope.ebayResults = [];

  $scope.advancedSearch = function(){
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
      url: 'http://localhost:8080/ebay/?queryString='+$scope.advancedSearchInput
    }).then(function successCallback(response) {
        $scope.ebayResults = response['data'];
        for(var i in $scope.ebayResults){
            $scope.ebayResults[i]['site'] = 'Ebay';
        }
        $scope.results = $scope.results.concat($scope.ebayResults);
      }, function errorCallback(response) {
        console.log('error');
        console.log(response);
      });

    $http({
      method: 'GET',
      headers: {
        'Content-Type' : 'text/html'
      },
      url: 'http://localhost:8080/craigslist/?city='+$scope.city+'&queryString='+$scope.advancedSearchInput
      }).then(function successCallback(response) {
        $scope.craigslistResults = response['data'];
        for(var i in $scope.craigslistResults){
            $scope.craigslistResults[i]['site'] = 'Craigslist';
        }
        $scope.results = $scope.results.concat($scope.craigslistResults);
      }, function errorCallback(response) {
        console.log('error');
        console.log(response);
      });

    $scope.loadingResults=false;
  };


    $scope.includeCraigslist = true;
    $scope.includeEbay = true;

  $scope.zipCodeToCity = debounce(function(){
    $http({
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json'
          },
          url: 'http://localhost:8080/getZip/?zipCode='+$scope.zipCode
        }).then(function successCallback(response) {
            console.log(response);
            if(response['data']['city']){
                $scope.city = response['data']['city'];
            }
            if(response['data']['state']){
                $scope.state = response['data']['state'];
            }
          }, function errorCallback(response) {
            console.log('error');
            console.log(response);
          });
  }, 500, false);

  $scope.toggleResults = function(){
    $scope.results = [];
    if($scope.includeCraigslist){
        $scope.results = $scope.results.concat($scope.craigslistResults);
    }
    if($scope.includeEbay){
        $scope.results = $scope.results.concat($scope.ebayResults);
    }
  };

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