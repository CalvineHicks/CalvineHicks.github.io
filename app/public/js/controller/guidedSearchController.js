app.controller('GuidedSearchController', ['$scope', '$http', '$routeParams', function GuidedSearchController($scope, $http, $routeParams) {
        $scope.queryString = $routeParams.queryString;
        $scope.category = $routeParams.category;
        $scope.subCategory = $routeParams.subCategory;
        $scope.zipCode = $routeParams.zipCode;
        $scope.city = '';
        $scope.state = '';
        $scope.results = [];
        $scope.resultNumber = $scope.results.length;
        $scope.walmartResults = [];
        $scope.craigslistResults = [];
        $scope.ebayResults = [];
        $scope.maxPrice = 10;
        $scope.minPrice = 0;   
        $scope.guidedSearch = function(){
        $scope.loadingResults=true;
        $scope.loadingResultsProgress=20;
        $scope.ebayResults = [];
        $scope.walmartResults = [];
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
          }, function errorCallback(response) {
            console.log('error');
            console.log(response);
          });

        if($scope.city == true){
            $scope.craigslistSearch();
        }

          for(var pageNum=1; pageNum<=5; pageNum++){
            $http({
                method: 'GET',
                headers: {
                  'Content-Type' : 'text/html'
                },
                url: 'http://'+window.location.host+'/walmart/?pageNum='+pageNum+'&queryString='+$scope.queryString
                }).then(function successCallback(response) {
                  $scope.walmartResults = response['data'];
                  for(var i in $scope.walmartResults){
                      $scope.walmartResults[i]['site'] = 'Walmart';
                  }
                  $scope.results = $scope.results.concat($scope.walmartResults);
                }, function errorCallback(response) {
                  console.log('error');
                  console.log(response);
                });
            }

        $scope.loadingResults=false;
      };

       $scope.craigslistSearch = function(){
              $scope.craigslistResults = [];

              $http({
                method: 'GET',
                headers: {
                  'Content-Type' : 'text/html'
                },
                url: 'http://'+window.location.host+'/craigslist/?city='+$scope.city+'&queryString='+$scope.queryString
                }).then(function successCallback(response) {
                  $scope.craigslistResults = response['data'];
                  for(var i in $scope.craigslistResults){
                      $scope.craigslistResults[i]['site'] = 'Craigslist';
                  }
                  $scope.results = $scope.results.concat($scope.craigslistResults);
                  console.log('craigslist search');
                }, function errorCallback(response) {
                  console.log('error');
                  console.log(response);
                });

       }


        $scope.guidedSearch();
        $scope.includeCraigslist = true;
        $scope.includeEbay = true;
        $scope.includeWalmart = true;

        $scope.toggleResults = function(){
            $scope.results = [];
            if($scope.includeCraigslist){
                $scope.results = $scope.results.concat($scope.craigslistResults);
            }
            if($scope.includeEbay){
                $scope.results = $scope.results.concat($scope.ebayResults);
            }
            if($scope.includeWalmart){
                $scope.results = $scope.results.concat($scope.walmartResults);
            }
        };

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

  $scope.zipCodeToCity = debounce(function(){

    $http({
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json'
          },
          url: 'http://localhost:8080/getZip/?zipCode='+$scope.zipCode
        }).then(function successCallback(response) {
            if(response['data']['city']){
                $scope.city = response['data']['city'];
            }
            if(response['data']['state']){
                $scope.state = response['data']['state'];
            }
            $scope.craigslistSearch();
          }, function errorCallback(response) {
            console.log('error');
            console.log(response);
          });
  }, 500, false);
  $scope.openResult = function(url){
    window.open(url,'_blank');
    window.open(url);

    var userStats = {};
    userStats['clickedLink'] = url;

    $http({
      method: 'GET',
      url: 'http://ip-api.com/json'
      }).then(function successCallback(response) {
        var data = response['data'];

        userStats['ipCity'] = data['city'];
        userStats['ipState'] = data['region'];
        userStats['ipCountry'] = data['countryCode'];
        userStats['ipAddress'] = data['query'];
        userStats['userCity'] = $scope.city;
        userStats['userState'] = $scope.state;
        
        //user entered questionairre
        userStats['reasonForSearch'] = $scope.reasonForSearchData.selectedOption;

          $http({
                method: 'POST',
                url: 'http://localhost:8080/logUserSearch',
                data : userStats
            });

      }, function errorCallback(response) {
        console.log('error');
        console.log(response);
      });
  };
}]);

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