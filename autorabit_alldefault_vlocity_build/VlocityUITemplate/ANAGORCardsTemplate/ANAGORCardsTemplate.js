vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        var returnValue = false;
        if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
            return true;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            var Status = obj['Status__c'];
            var CreatedBy = obj['Group_Outsourcing_Record_Owner__c'];
             if (CreatedBy != null && CreatedBy != '') {
               CreatedBy  = CreatedBy.substr(0, 15);
             }
             console.log("CreatedBy=" + CreatedBy);
            var Submitter = obj['Submitter__c'];
            if (Submitter != null && Submitter != '') {
            Submitter  = Submitter.substr(0, 15);
            }
            var LoginUser = obj['LoggedInUserId__c'];
            
            if(actionname === 'UpdateGroupOutsourcing' && (profileValue === 'National Sales' || profileValue === 'System Administrator'  || profileValue == 'National Sales Dual') && (Status === 'New' || Status === 'Hold' || Status === 'Needs Revision' || Status === 'Recalled')) 
	        {
	            returnValue = true;
            }
            if(actionname === 'RecallGORApproval' && (profileValue === 'National Sales' || profileValue === 'System Administrator'  || profileValue == 'National Sales Dual') && Status === 'Submitted for Approval' && (LoginUser === CreatedBy || LoginUser === Submitter)) 
	        {
	            returnValue = true;
            }
            if(actionname === 'SubmitGroupOutsourcingApproval' && (   Status === 'New' || Status === 'Recalled' || Status === 'Needs Revision') && (LoginUser === CreatedBy || LoginUser === Submitter)) 
	        {
	            returnValue = true;
            }

             
            return returnValue;
        }
    };
}]);