app.controller('GuidedSearchController', ['$scope', '$http', '$routeParams','UserInformation', function GuidedSearchController($scope, $http, $routeParams, UserInformation) {
        $scope.userInformation = UserInformation.data;

        $scope.city = '';
        $scope.state = '';
        $scope.results = [];
        $scope.totalResults = 0;
        $scope.walmartResults = [];
        $scope.craigslistResults = [];
        $scope.ebayResults = [];
    
        //TODO : fix max price so that it is unbounded to start
        $scope.maxPrice = '';
        $scope.minPrice = 0;   
        $scope.reasonForSearch = $routeParams.reasonForSearch;
        $scope.areaOfNeed = $routeParams.areaOfNeed;
        $scope.typeOfATDevice = $routeParams.typeOfATDevice;
        $scope.zipCode = $routeParams.zipCode;
        $scope.queryString = $routeParams.queryString;
        $scope.searchedString = $routeParams.queryString;
        $scope.sortType     = 'price'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.sortSelected = 'price:false';
        $scope.includeCraigslist = true;
        $scope.includeEbay = true;
        $scope.includeWalmart = true;

        if(!$scope.reasonForSearch && $scope.userInformation.reasonForSearchData){
            $scope.reasonForSearch = $scope.userInformation.reasonForSearchData;
        }
        if(!$scope.areaOfNeed && $scope.userInformation.areaOfNeedData){
                    $scope.areaOfNeed = $scope.userInformation.areaOfNeedData;
                }
                if(!$scope.typeOfATDevice && $scope.userInformation.typeOfAtDeviceData){
                            $scope.typeOfAtDeviceData = $scope.userInformation.typeOfAtDeviceData;
                        }
                        if(!$scope.zipCode && $scope.userInformation.zipCode){
                                    $scope.zipCode = $scope.userInformation.zipCode;
                                }
                                if(!$scope.queryString && $scope.userInformation.queryString){
                                            $scope.queryString = $scope.userInformation.queryString;
                                        }
    
        if(!isEmptyOrSpaces($scope.zipCode)){
            $scope.zipCodeToCity;
        }

        $scope.sortSelect = function(){
            var args = $scope.sortSelected.split(':');
            $scope.sortType     = args[0];
            $scope.sortReverse  = (args[1] == 'true');
        };

        $scope.guidedSearch = function(){
          if(!isEmptyOrSpaces($scope.queryString)) {
            $scope.loadingResults=true;
            $scope.loadingResultsProgress=20;
            $scope.results.length = 0;
            $scope.totalResults = 0;
            $scope.results = [];
            $scope.searchedString = $scope.queryString;


            //SEARCH EBAY
            $scope.ebayResults = [];
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
              if($scope.includeEbay){
                $scope.results = $scope.results.concat($scope.ebayResults);
                }
                $scope.totalResults += $scope.ebayResults.length;
              }, function errorCallback(response) {
                console.log('error');
                console.log(response);
              });

            //SEARCH CRAIGSLIST
            //City is required to do a search of craigslist
            if(!isEmptyOrSpaces($scope.city)){
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
                    if($scope.includeCraigslist){
                      $scope.results = $scope.results.concat($scope.craigslistResults);
                    }
                      $scope.totalResults += $scope.craigslistResults.length;
                    }, function errorCallback(response) {
                      console.log('error');
                      console.log(response);
                    });
            }
            
            //WALMART SEARCH
            //Iterate pages of walmart search since api is auto paginated
            //walmart returns many repeats of items, so filter those out.
            $scope.walmartResults = [];
            var walmartTempResults = [];
            for(var pageNum=1; pageNum<=5; pageNum++){
                    $http({
                        method: 'GET',
                        headers: {
                          'Content-Type' : 'text/html'
                        },
                        url: 'http://'+window.location.host+'/walmart/?pageNum='+pageNum+'&queryString='+$scope.queryString
                    }).then(function successCallback(response) {
                        walmartTempResults = response['data'];
                        for(var i in walmartTempResults){
                          walmartTempResults[i]['site'] = 'Walmart';
                          //check if an item with this ID already exists in results. If it doesnt exist yet, add the item.
                          if(!findItemInArrayByAttrVal('itemID', walmartTempResults[i]['itemID'], $scope.walmartResults)){
                            //add result to walmart list
                            $scope.walmartResults.push(walmartTempResults[i]);
                            if($scope.includeWalmart){
                               //add result to total result set if walmart results are to be included
                               $scope.results.push(walmartTempResults[i]);
                              }
                           //increment total results by 1
                           $scope.totalResults += 1;
                          }
                        }
                    }, function errorCallback(response) {
                        console.log('error');
                        console.log(response);
                    });
            }
            $scope.loadingResults=false;
          }
        };

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
              return (item[prop] == null || isNaN(item[prop]) || val === "" || item[prop] > val);
            }
        }

        $scope.lessThan = function(prop, val){
            return function(item){
              return (item[prop] == null || isNaN(item[prop]) || val === "" || item[prop] < val);
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
            $scope.guidedSearch();
          }, function errorCallback(response) {
            console.log('error');
            console.log(response);
            $scope.guidedSearch();
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
        userStats['userZip'] = $scope.zipCode;
        userStats['userCity'] = $scope.city;
        userStats['userState'] = $scope.state;
        
        //user entered questionairre
        userStats['reasonForSearch'] = $scope.reasonForSearch;
        userStats['areaOfNeed'] = $scope.areaOfNeed;
        userStats['typeOfATDevice'] = $scope.typeOfATDevice;

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

function isEmptyOrSpaces(str){
    return angular.isUndefined(str) || str === null || str.match(/^ *$/) !== null;
}