vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        var returnValue = false;
        if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
            return true;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
             console.log("profileValue = " + profileValue);
            if(profileValue == 'Underwriting' || profileValue == 'View Info Only' || profileValue == 'Underwriting Dual' || profileValue == 'View Info Only	Dual')
                returnValue = false;
            if(actionname == 'Capture HCR Plan Grids' && ((profileValue == 'National Sales' || profileValue == 'Local Sales' || profileValue == 'National Sales Dual' || profileValue == 'Local Sales Dual' || profileValue=='System Administrator')))
	    {
	          console.log("Capture HCR Plan Grids");
	    	  returnValue = true;
           }
            return returnValue;
        }
    };
}]);