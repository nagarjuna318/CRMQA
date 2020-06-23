vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    
    $scope.display_because_national_profile = false

    $scope.getDisplayActionsBasedonProfile = function(obj) {
        try {
            if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
                return true;
            }else{
                var profileValue = obj['LoggedInUserProfile__c'];
                var returnValue = true;

                if (obj['AnthemEntityTransform__c'] === 'National'){
                    $scope.display_because_national_profile = true
                }
                if(profileValue == 'View Info Only' ||  profileValue == 'View Info Only Dual') {
                    returnValue = false;
                }                    
                //console.log("inside getDisplayActionsBasedonProfile - returnValue--> " + returnValue);
                return returnValue;
            }
        } catch(e) {
            console.log("--- error getDisplayActionsBasedonProfile="+ e);
        }
    };
}]);