vlocity.cardframework.registerModule.controller('insOsConfirmationCtrl', ['$scope', '$rootScope', '$timeout', '$injector', function($scope, $rootScope, $timeout, $injector) {

    // $scope.test = function(bpTree, control){
    //     console.log(bpTree);
    //     console.log(control);
    // }
    let remoteAttribute =  ["inn_defaultCoinsurance_inn", "inn_deductibleSingle_inn", "inn_outOfPocketSingle_inn", "PCP_copayAmount_2_inn"]
    
    $scope.myFilter = function(array, expression, comparator, anyPropertyKey){
        let res_arr = []
        if (!remoteAttribute){
            return array;
        }else{
            for(var j = 0; j < remoteAttribute.length; j++){
                if(array.code==remoteAttribute[j]){
                    return array;
                }
            }
        }

    } 

}]);