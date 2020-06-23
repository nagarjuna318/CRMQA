vlocity.cardframework.registerModule.controller('IdCardActionsController', ['$scope', function($scope){
$scope.display_because_national_profile = false
$scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
    
    var returnValue = false;
    if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
        return true;
    }else{
        var profileValue = obj['LoggedInUserProfile__c'];
		var AutomationEligible=obj['Automation_Eligible__c'];
		var Stage=obj['Stage__c'];
        if (obj['AnthemEntityTransform__c'] === 'National'){
                $scope.display_because_national_profile = true
            }
        var IdCardTriggerValue = obj['ID_Cards_Trigger__c'];
            console.log("IdCardTriggerValue = " + IdCardTriggerValue);
            console.log("profileValue = " + profileValue);
            console.log("Stage777" + Stage);
        if(profileValue == 'Underwriting' || profileValue == 'View Info Only' || profileValue == 'Underwriting Dual' || profileValue == 'View Info Only	Dual')
            returnValue = false;
        if(actionname == 'CloneExistingIDCardRequirements' && ((profileValue == 'Local Implementations' || profileValue == 'National Implementations' || profileValue == 'SME' || profileValue == 'Local Implementations Dual' || profileValue == 'National Implementations Dual' || profileValue == 'SME Dual' || profileValue=='System Administrator')))
        {
            returnValue = true;
        }
        if(actionname == 'Trigger Id Cards' && (AutomationEligible == true &&(Stage == '03 Pending Approval to Trigger' || Stage == '04 ID Card Triggered' || Stage == '04 ID Card Re-triggered'))){
            console.log('@@@@inside if1111'+obj['LoggedInUserProfile__c']);
		if(profileValue == 'System Administrator' || profileValue == 'SME' || profileValue == 'SME Dual' || profileValue == 'Local Implementations' || profileValue == 'Local Implementations Dual' || profileValue == 'Local Sales' || profileValue == 'Local Sales Dual') {
				console.log('@@@@inside if222'+obj['LoggedInUserProfile__c']);
			    returnValue = true;
            }
			else{
                returnValue = false;  
            }
            
		}
        if(actionname == 'Add ID Card Design' && (AutomationEligible == true &&(Stage == '02 In Progress' || Stage == '03 Pending Approval to Trigger' || Stage == '03 Pending Correction' || Stage == '03 Pending Correction Returned'))){
            console.log('@@@@inside if444'+obj['LoggedInUserProfile__c']);
	    if(profileValue == 'System Administrator' || profileValue == 'SME' || profileValue == 'SME Dual' || profileValue == 'Local Implementations' || profileValue == 'Local Implementations Dual' || profileValue == 'Local Sales' || profileValue == 'Local Sales Dual') {
				console.log('@@@@inside if555'+obj['LoggedInUserProfile__c']);
			    returnValue = true;
            }else{
                returnValue = false;  
            }
            
        }
        
        return returnValue;
    }
};
}]);