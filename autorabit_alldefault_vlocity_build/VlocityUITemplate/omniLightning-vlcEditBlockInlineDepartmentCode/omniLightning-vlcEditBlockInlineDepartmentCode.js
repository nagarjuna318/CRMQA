vlocity.cardframework.registerModule.service('editDepartmentService', function($q) {
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

vlocity.cardframework.registerModule.controller('DeleteDepartmentCtrl', ['$scope', '$timeout', 'editDepartmentService', 
function($scope, $timeout, editDepartmentService) { 
    $(document).ready(function(){
        console.log('Testing*********'); 
    })

    $scope.deleteDepartment=function(i){
       // console.log('*************item:' + $scope.bpTree.response.EmployeeClassStep.EditEmployeeBlock[i].EmployeeClassId);
        if(i===undefined && $scope.bpTree.response.DepartmentCode.DepartmentBlockCode != undefined){
            i = $scope.bpTree.response.DepartmentCode.DepartmentBlockCode.DepartmentId;
            console.log('+++ i : ' + i);
        } 
        $timeout(function(){
            angular.element('#alert-ok-button').click(function(){
                console.log('++++++++++t');
                if(!!i){
                    editDepartmentService.deleteRecord(i).then((response) => {
                    console.log('+++++Testing+++++');
                });
                }
               
            });
        },0); 
    }
}]);