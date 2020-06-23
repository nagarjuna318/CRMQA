vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        if(!obj.hasOwnProperty('LoggedinProfile__c') || !obj.hasOwnProperty('Commissions_Approval_Status__c')) {
            return true;
        }else{
            var profileValue = obj['LoggedinProfile__c'];
            var ApprovalStatus =obj['Commissions_Approval_Status__c'];
             
            var returnValue = false;
            console.log("actionname = " + actionname + " profileValue= "+profileValue  + " ApprovalStatus= "+ApprovalStatus);
		    if(actionname == 'ReviseInternalCommissions' && (profileValue == 'National Sales' || profileValue == 'National Sales Dual' || profileValue=='System Administrator') && (ApprovalStatus == 'Rejected' || ApprovalStatus == 'Rejected - Final Comp')) {
                returnValue = true;
                
      	    	 console.log("test2",+returnValue);
			 }
            //console.log("inside getDisplayActionsBasedonProfile - returnValue--> " + returnValue);
            return returnValue;
        }
    };
    
}]);