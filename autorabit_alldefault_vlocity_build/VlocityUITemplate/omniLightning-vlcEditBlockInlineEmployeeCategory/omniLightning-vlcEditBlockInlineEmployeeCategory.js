vlocity.cardframework.registerModule.service('editEmployeeService', function($q) {
    function doGenericInvoke(className, methodName, inputMap) {
       const config = Object.assign({}, {escape: false});

	    return $q((resolve, reject) => {
			%vlocity_namespace%.BusinessProcessDisplayController.GenericInvoke2(
                className,
                methodName,
                angular.toJson(inputMap),
                {},
                (result, event) => {
                    if(event.status) {
                        return resolve(result);
                    } else {
                        return reject(event);
                    }
                }, config);
			})
			.then((result) => {
				result = JSON.parse(result);
				return $q((resolve, reject) => {
					if (result.error !== 'OK') {
						reject(result);
					} else {
						resolve(result);
					}
				})
			});
    }

    function deleteRecord(recordId) {
            const inputMap = {
				recordId: recordId
			};

            return doGenericInvoke(
                'LGA_AccountStructureOSRemoteService',
                'deleteEmployeeClasses',
                inputMap
            );

        return $q.resolve({});
    }

    return {
        deleteRecord: deleteRecord
    }
});

vlocity.cardframework.registerModule.controller('Deleteemployeecatogery', ['$scope', '$timeout', 'editEmployeeService', 
function($scope, $timeout, editEmployeeService) { 
    $(document).ready(function(){
        console.log('Testing*********'); 
    })

    $scope.test=function(i){
       // console.log('*************item:' + $scope.bpTree.response.EmployeeClassStep.EditEmployeeBlock[i].EmployeeClassId);
       
       if(i===undefined && $scope.bpTree.response.EmployeeClassStep.EditEmployeeBlock != undefined){
            i = $scope.bpTree.response.EmployeeClassStep.EditEmployeeBlock.EmployeeClassId;
            console.log('+++ i : ' + i);
        }
        $timeout(function(){
            angular.element('#alert-ok-button').click(function(){
                console.log('++++++++++t , i : ' + i);
                
                if(!!i){
                    editEmployeeService.deleteRecord(i).then((response) => {
                    console.log('+++++Testing+++++');
                });
                }
               
            });
        },0); 
    }
}]);