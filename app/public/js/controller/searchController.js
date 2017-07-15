app.controller('SearchController', function SearchController($scope, $http) {
      $scope.submitted = false;
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
    $scope.submitted = true;
    window.location.href = "#/at/"+$scope.zipCode+"/"+$scope.queryString;
  };   
});