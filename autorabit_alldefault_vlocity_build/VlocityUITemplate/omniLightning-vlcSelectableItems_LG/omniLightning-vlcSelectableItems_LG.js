vlocity.cardframework.registerModule.controller('qli_selectable_items', ['$scope', '$rootScope', '$timeout', '$q', function($scope, $rootScope, $timeout, $q) {

    

    $scope.qli_arr = []
    $scope.bpTreeResp = {}

    $scope.insQliSelectionInit = function(bpTree, control) {
        
        var checkExist = setInterval(function() {
        //    console.log("hello world!")
            if(typeof bpTree.response.CountOfFailedPlans !== "undefined" && bpTree.response['ContractResvFail']) {

                $scope.bpTreeResp = bpTree.response

                var failed_plans = []
                var success_plans = !$scope.bpTreeResp['ContractResv']? [] : $scope.bpTreeResp['ContractResv']

                if(!Array.isArray(success_plans)){
                    success_plans = [success_plans]
                }

                for(var i = 0; i < $scope.bpTreeResp.CountOfFailedPlans; i++){
                    if(!Array.isArray($scope.bpTreeResp['ContractResvFail']) && typeof $scope.bpTreeResp['ContractResvFail'] == "object"){
                        failed_plans.push($scope.bpTreeResp['ContractResvFail'])
                    }else{
                        failed_plans.push($scope.bpTreeResp['ContractResvFail'].shift())
                    }
                }

                $scope.qli_arr = success_plans.concat(failed_plans)
                $scope.$apply()
                console.log($scope.qli_arr)
                clearInterval(checkExist);
            }else if(typeof bpTree.response.CountOfFailedPlans !== "undefined" && bpTree.response.CountOfFailedPlans == 0 && bpTree.response['ContractResv']){
                $scope.bpTreeResp = bpTree.response
                var success_plans = !$scope.bpTreeResp['ContractResv']? [] : $scope.bpTreeResp['ContractResv']
                if(!Array.isArray(success_plans)){
                    success_plans = [success_plans]
                }
                $scope.qli_arr = success_plans
                $scope.$apply()
                clearInterval(checkExist);

            }
        
        }, 100);

    
    }
    



}])