vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        var returnValue = false;
        if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
            return true;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
             console.log("profileValue = " + profileValue);
            if(profileValue == 'Underwriting' || profileValue == 'Underwriting Dual' || profileValue == 'View Info Only	Dual' || profileValue == 'View Info Only')
                returnValue = false;
            if(actionname == 'Capture HCR Details' && ((profileValue == 'National Sales' || profileValue == 'National Sales Dual' || profileValue == 'Local Sales Dual' || profileValue == 'Local Sales' || profileValue=='System Administrator')))
	    {
	          console.log("Capture HCR Details");
	    	  returnValue = true;
           }
           if(actionname == 'CreateAPR' && ((profileValue == 'Local Implementations' || profileValue == 'Local Implementations Dual' || profileValue=='System Administrator')))
	       {
	   	          console.log("Create Alphanumeric Prefix Request");
	   	    	  returnValue = true;
           }
            return returnValue;
        }
    };
}]);