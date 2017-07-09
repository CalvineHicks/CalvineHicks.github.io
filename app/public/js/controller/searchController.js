app.controller('SearchController', function SearchController($scope, $http) {

  $scope.advancedSearchInput = 'chair';
    $scope.zipCode = '';
    $scope.city = 'Denver';
    $scope.state = 'CO';
    $scope.results = [];
    $scope.craigslistResults = [];
    $scope.ebayResults = [];
  
  $scope.reasonForSearchData = {
    availableOptions: [
      {id: '1', name: 'Want affordable option'},
      {id: '2', name: 'Want to find item easily'},
      {id: '3', name: 'Could not find item elsewhere'}
    ],
    selectedOption: {id: '1', name: 'Want affordable option'} //This sets the default value of the select in the ui
    };
  
  $scope.areaOfNeedData = {
    availableOptions: [
      {id: '2', name: 'Education'},
      {id: '3', name: 'Employment'},
      {id: '4', name: 'Everyday Living'}
    ]
    };
  
  $scope.typeOfAtDeviceData = {
    availableOptions: [
      {id: '2', name: 'Computers and Related'},
      {id: '3', name: 'Daily Living'},
      {id: '4', name: 'Environmental Adaptations'},
      {id: '5', name: 'Hearing'},
      {id: '6', name: 'Learning, Cognition and Developmental'},
      {id: '7', name: 'Mobility, Seating and Positioning'},
      {id: '8', name: 'Recreation, Sports and Leisure'},
      {id: '9', name: 'Speach Communications'},
      {id: '10', name: 'Vehicle Modifications and Transportation'},
      {id: '11', name: 'Vision'}
    ]
    };

  $scope.$watch('reasonForSearchData.selectedOption', function(newVal, oldVal){
    setCookie("reasonForSearch",$scope.reasonForSearchData.selectedOption.name, 1000);
  });
  
  $scope.$watch('areaOfNeedData.selectedOption', function(newVal, oldVal){
    setCookie("areaOfNeedData",$scope.reasonForSearchData.selectedOption.name, 1000);
  });
  
  $scope.$watch('typeOfAtDeviceData.selectedOption', function(newVal, oldVal){
    setCookie("typeOfAtDeviceData",$scope.reasonForSearchData.selectedOption.name, 1000);
  });

  $scope.searchRedirect = function(){
    window.location.href = "#/at/"+$scope.zipCode+"/"+$scope.queryString;
  };   

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

  $scope.openResult = function(url){
    //window.open(url,'_blank');
    //window.open(url);

    var userStats = {};
    userStats['clickedLink'] = url;

    $http({
      method: 'GET',
      url: 'http://ip-api.com/json'
      }).then(function successCallback(response) {
        var data = response['data'];

        userStats['city'] = data['city'];
        userStats['state'] = data['region'];
        userStats['country'] = data['countryCode'];
        userStats['ipAddress'] = data['query'];

        console.log(JSON.stringify(userStats));
              $http({
                method: 'POST',
                url: 'http://localhost:8080/logUserSearch',
                data : userStats
                }).then(function successCallback(response) {
                  console.log('user stats saved');

                }, function errorCallback(response) {
                  console.log('error');
                  console.log(response);
                });

      }, function errorCallback(response) {
        console.log('error');
        console.log(response);
      });

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