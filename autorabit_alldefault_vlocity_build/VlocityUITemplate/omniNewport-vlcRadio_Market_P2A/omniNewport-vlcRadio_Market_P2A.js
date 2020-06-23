vlocity.cardframework.registerModule.controller('my-radio-select-controller', ['$scope', '$timeout', '$q', '$rootScope', function($scope, $timeout, $q, $rootScope) {

$scope.myAutoAdvance= function(bpTree, obj){

    bpTree.response.Situs_State = obj.value === "Labor Accounts"? "LaborAccounts" : obj.value;
    bpTree.response["AP-FamilySelection"]["AP-MarketSelection"] = obj.value === "Labor Accounts"? "LaborAccounts" : obj.value;
    bpTree.response["AP-FamilySelection"]["AP-MarketSelectionFinalvlaue"] = obj.value === "Labor Accounts"? "LaborAccounts" : obj.value;
    bpTree.response.AccountDetails.Situs_State_Abbrev = obj.value === "Labor Accounts"? "LaborAccounts" : obj.value;
    
    $scope.autoAdvance(obj.autoAdv)
};



}]);