app.controller('NavController', function NavController($scope, $http, UserInformation) {

 $scope.userInformation = UserInformation.data;
 $scope.userInformationValid = function(){
    if(UserInformation.isValid()){
        return true;
    }
    else{
        alert('Please Input the Required Information Below Before Searching.');
        return false;
    }
 };

    $scope.searchRedirect = function(){
        window.location.href = encodeURI("#/at/"+$scope.userInformation.reasonForSearchData+"/"+$scope.userInformation.areaOfNeedData+"/"+$scope.userInformation.typeOfAtDeviceData+"/"+$scope.userInformation.zipCode+"/"+$scope.userInformation.queryString);
    };
});