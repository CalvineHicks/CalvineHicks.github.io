app.controller('HomeController', function HomeController($scope, $http, UserInformation) {
  $scope.userInformation = UserInformation.data;

  $scope.submitted = false;

  function findSelectedOptionByName(name, availableOptions){
    for(var i = 0; i<availableOptions.length; i+= 1){
        if(availableOptions[i].name == name){
            return availableOptions[i];
        }
    }
    return null;
  };

  $scope.reasonForSearchData = {
    availableOptions: [
      {id: '1', name: 'Want affordable option'},
      {id: '2', name: 'Want to find item easily'},
      {id: '3', name: 'Could not find item elsewhere'}
    ],
    selectedOption: {id: '1', name: 'Want affordable option'} //This sets the default value of the select in the ui
    };

    if($scope.userInformation.reasonForSearchData){
        var selected = findSelectedOptionByName($scope.userInformation.reasonForSearchData, $scope.reasonForSearchData.availableOptions);
        if(selected)
            $scope.reasonForSearchData.selectedOption = {id: selected.id, name : selected.name};
    }

  $scope.$watch('reasonForSearchData.selectedOption', function(newVal, oldVal){
    if($scope.reasonForSearchData.selectedOption){
        UserInformation.setReasonForSearchData($scope.reasonForSearchData.selectedOption.name);
    }
  });

  $scope.areaOfNeedData = {
    availableOptions: [
      {id: '1', name: 'Education'},
      {id: '2', name: 'Employment'},
      {id: '3', name: 'Everyday Living'}
    ]
    };

  $scope.$watch('areaOfNeedData.selectedOption', function(newVal, oldVal){
    if($scope.areaOfNeedData.selectedOption){
        UserInformation.setAreaOfNeedData($scope.areaOfNeedData.selectedOption.name);
    }
  });

    if($scope.userInformation.areaOfNeedData){
        var selected = findSelectedOptionByName($scope.userInformation.areaOfNeedData, $scope.areaOfNeedData.availableOptions);
        if(selected)
            $scope.areaOfNeedData.selectedOption = {id: selected.id, name : selected.name};
    }
  
  $scope.typeOfAtDeviceData = {
    availableOptions: [
      {id: '1', name: 'Computers and Related'},
      {id: '2', name: 'Daily Living'},
      {id: '3', name: 'Environmental Adaptations'},
      {id: '4', name: 'Hearing'},
      {id: '5', name: 'Learning, Cognition and Developmental'},
      {id: '6', name: 'Mobility, Seating and Positioning'},
      {id: '7', name: 'Recreation, Sports and Leisure'},
      {id: '8', name: 'Speech Communications'},
      {id: '9', name: 'Vehicle Modifications and Transportation'},
      {id: '10', name: 'Vision'}
    ]
    };

    if($scope.userInformation.typeOfAtDeviceData){
        var selected = findSelectedOptionByName($scope.userInformation.typeOfAtDeviceData, $scope.typeOfAtDeviceData.availableOptions);
        if(selected)
            $scope.typeOfAtDeviceData.selectedOption = {id: selected.id, name : selected.name};
    }

  
  $scope.$watch('typeOfAtDeviceData.selectedOption', function(newVal, oldVal){
    if($scope.typeOfAtDeviceData.selectedOption){
        UserInformation.setTypeOfAtDeviceData($scope.typeOfAtDeviceData.selectedOption.name);
    }
  });

  if($scope.userInformation.queryString){
    $scope.queryString = $scope.userInformation.queryString
  }

  $scope.$watch('queryString', function(newVal, oldVal){
      if($scope.queryString){
        UserInformation.setQueryString($scope.queryString);
      }
    });

  if($scope.userInformation.zipCode){
    $scope.zipCode = $scope.userInformation.zipCode
  }

  $scope.$watch('zipCode', function(newVal, oldVal){
    if($scope.zipCode){
      UserInformation.setZipCode($scope.zipCode);
    }
  });

  $scope.searchRedirect = function(){
    window.location.href = encodeURI("#/at/"+$scope.reasonForSearchData.selectedOption.name+"/"+$scope.areaOfNeedData.selectedOption.name+"/"+$scope.typeOfAtDeviceData.selectedOption.name+"/"+$scope.zipCode+"/"+$scope.queryString);
  };   
});