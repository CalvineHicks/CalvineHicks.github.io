app.controller('HomeController', function HomeController($scope, $http) {
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
      {id: '1', name: 'Education'},
      {id: '2', name: 'Employment'},
      {id: '3', name: 'Everyday Living'}
    ]
    };
  
  $scope.typeOfAtDeviceData = {
    availableOptions: [
      {id: '1', name: 'Computers and Related'},
      {id: '2', name: 'Daily Living'},
      {id: '3', name: 'Environmental Adaptations'},
      {id: '4', name: 'Hearing'},
      {id: '5', name: 'Learning, Cognition and Developmental'},
      {id: '6', name: 'Mobility, Seating and Positioning'},
      {id: '7', name: 'Recreation, Sports and Leisure'},
      {id: '8', name: 'Speach Communications'},
      {id: '9', name: 'Vehicle Modifications and Transportation'},
      {id: '10', name: 'Vision'}
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
    window.location.href = encodeURI("#/at/"+$scope.reasonForSearchData.selectedOption.name+"/"+$scope.areaOfNeedData.selectedOption.name+"/"+$scope.typeOfAtDeviceData.selectedOption.name+"/"+$scope.zipCode+"/"+$scope.queryString);
  };   
});