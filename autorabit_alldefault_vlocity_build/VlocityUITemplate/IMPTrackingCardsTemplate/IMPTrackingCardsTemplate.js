vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        var returnValue = false;
        if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
            return true;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            var PermissionSet = obj['Permission_set__c'];
            var EBAPermissionSet = obj['EBA_Permission_Set__c'];
            var QLIFinJAA = obj['QLIFinJAA__c'];
            console.log("profileValue = " + profileValue);
            console.log("PermissionSet = " + PermissionSet);
            console.log("Action Name = " + actionname);
             console.log("QLIFinJAA = " + QLIFinJAA);
            if(actionname == 'CreateDIT' && QLIFinJAA === 0 && PermissionSet == 'DITSME') 
	        {
	            console.log("Create DIT");
	    	    returnValue = true;
            }
             if(actionname == 'Generate BPD Approval Record' && EBAPermissionSet == 'EBASME')
	        {
	            console.log("Capture Benefit Plan Design for Approval");
	    	    returnValue = true;
            }
            return returnValue;
        }
    };
}]);