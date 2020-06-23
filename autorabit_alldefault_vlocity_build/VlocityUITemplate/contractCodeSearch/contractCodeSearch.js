vlocity.cardframework.registerModule.controller('contractCntrl', ['$scope', function($scope) {

  $scope.search = '';
  $scope.names = [];
  var contractCodesArray = [];


  $scope.removeFromSelected = function(x){
    var index = $scope.names.indexOf(x);
    $scope.names.splice(index, 1);
    $scope.getSelectedCCArrayFormat($scope.names);
    // baseCtrl.prototype.$scope.bpTree.response.contractCodeTemplate1 =   ($scope.names.length > 0) ?  true: false;
    $scope.bpTree.response.contractCodeTemplate1 =   ($scope.names.length > 0) ?  true: false;

  }

  $scope.getSelectedContracts =function(){
    if($scope.names.includes($scope.search)){
      $scope.search = '';
      $scope.contracts = '';
      return;
    }
    if(contractCodesArray.includes($scope.search)){
      $scope.names.push($scope.search);
      // baseCtrl.prototype.$scope.bpTree.response.contractCodeTemplate1 =   ($scope.names.length > 0) ? true : false;
      $scope.bpTree.response.contractCodeTemplate1 =   ($scope.names.length > 0) ? true : false;
      $scope.getSelectedCCArrayFormat($scope.names);
      $scope.search = '';
      $scope.contracts = '';
    }
  }

  $scope.getSelectedCCArrayFormat = function(ccArray){
    ccString = '';
    ccArray.forEach(function(item, index){
      ccString =  ccString + 'Contract_Code__c:' + item + ',';
    });
    $scope.bpTree.response.selectedContractCodeString  = ccString.substring(0, ccString.length - 1);
  }


  $scope.checkForMedical= function(){ 
    return ($scope.bpTree.response["AP-FamilySelection"].Non_Medical_SelectedCheck && !$scope.bpTree.response["AP-FamilySelection"]["Block-ContractCode"].Medical_SelectedCheck) ? true : false;
  }

  $scope.showContracts=function(){
    var ContractCodes = JSON.parse($scope.bpTree.response.MedicalProduct);
    ContractCodes.forEach(function(item, index){
      contractCodesArray.push(item.ContractCode);
    });
    console.log(ContractCodes);
    var temp = $scope.search;
    if(temp.length >=3){
      $scope.contracts= ContractCodes;
    } else {
      $scope.contracts= [];
    }
    $scope.getSelectedContracts();
  }
}]);