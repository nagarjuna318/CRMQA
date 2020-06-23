vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        var returnValue = false;
        if(!obj.hasOwnProperty('Logged_In_User_Profile__c')) {
            console.log("2");
            return true;
        }else{
            var profileValue = obj['Logged_In_User_Profile__c'];
            var PermissionSet = obj['Permission_set__c'];
            console.log("1");
            console.log(profileValue);
            if(actionname == 'Create_Open_Enrollments' ) {
                if (PermissionSet == 'OESubmitMeetings' || profileValue === 'National Sales' || profileValue === 'System Administrator'  || profileValue === 'National Sales Dual'|| profileValue === 'Local Sales' || profileValue === 'Local Sales Dual') {
                    returnValue = true;
                }
                else {
                 returnValue = false;
                }
            }
       
            return returnValue;
        }
    };
}]);