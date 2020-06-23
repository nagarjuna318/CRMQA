vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    $scope.display_because_national_profile = false
    $scope.getDisplayAllActions = function(obj, actionname) {
        if(!obj.hasOwnProperty('LoggedInUserProfile__c') && !obj.hasOwnProperty('RecordType') && !obj.RecordType.hasOwnProperty('Name')) {
            return true;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            if (obj['AnthemEntityTransform__c'] === 'National'){
                    $scope.display_because_national_profile = true
                }
            var recordTypeValue = obj.RecordType['Name'];
            var PermissionSet = obj['Permission_set__c'];
            var returnValue = true;
            return returnValue;
        }
    };
    
}]);