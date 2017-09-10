app.controller('NavController', function NavController($scope, $http, UserInformation) {

 $scope.userInformation = UserInformation.data;
 $scope.userInformationValid = function(){ return UserInformation.isValid()};
  console.log(UserInformation.isValid());

    $scope.searchRedirect = function(){
        console.log('searchRedirect');
        window.location.href = encodeURI("#/at/"+$scope.userInformation.reasonForSearchData+"/"+$scope.userInformation.areaOfNeedData+"/"+$scope.userInformation.typeOfAtDeviceData+"/"+$scope.userInformation.zipCode+"/"+$scope.userInformation.queryString);
    };
});