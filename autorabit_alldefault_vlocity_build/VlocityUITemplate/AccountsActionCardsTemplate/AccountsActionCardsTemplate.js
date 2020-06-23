vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){

    $scope.display_because_national_profile = false
    
    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        if(!obj.hasOwnProperty('LoggedInUserProfile__c') && !obj.hasOwnProperty('RecordType') && !obj.RecordType.hasOwnProperty('Name')) {
            return true;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            var recordTypeValue = obj.RecordType['Name'];
            var returnValue = true;
			 if(actionname == 'CreateOpportunity' && (recordTypeValue == 'Brokerage' || recordTypeValue == 'Service Provider'))
                returnValue = false;
			if(actionname == 'Add Contact' && recordTypeValue == 'Service Provider')
                returnValue = false;
            if(actionname == 'Submit DNC Preferences' && (recordTypeValue == 'Brokerage' || recordTypeValue == 'Service Provider'))
                returnValue = false;    
            if(actionname == 'New Action Request Form' && profileValue == 'Specialty')
                returnValue = false;
            if(profileValue == 'Underwriting' || profileValue == 'Underwriting Dual' || profileValue == 'View Info Only' || profileValue == 'View Info Only	Dual')
                returnValue = false;
            if(actionname == 'CreateGroupOutsourcing' ) {
                if (profileValue == 'National Sales' || profileValue == 'System Administrator' || profileValue == 'National Sales Dual' ||
                    profileValue == 'Specialty Dual' || profileValue == 'Specialty' || profileValue == 'National Implementations' || 
                    profileValue == 'National Implementations Dual' ) {
                        if (obj['AnthemEntityTransform__c'] === 'National'  ){
                            $scope.display_because_national_profile = true
                        }
                    returnValue = true;
                }
                else {
                 returnValue = false;
                }
            }
            if(actionname == 'Create_Open_Enrollment_Meetings' ) {
                if (profileValue == 'National Sales' || profileValue == 'System Administrator' || profileValue == 'National Sales Dual' || profileValue == 'Local Sales Dual'|| profileValue == 'Local Sales') {
                    returnValue = true;
                }
                else {
                 returnValue = false;
                }
            }
            if(actionname == 'Create_Open_Enrollment_Meetings' ) {
                if (profileValue == 'National Sales' || profileValue == 'System Administrator' || profileValue == 'National Sales Dual' || profileValue == 'Local Sales Dual'|| profileValue == 'Local Sales') {
                    returnValue = true;
                }
                else {
                 returnValue = false;
                }
            }
            //console.log("inside getDisplayActionsBasedonProfile - returnValue--> " + returnValue);
            return returnValue;
        }
    };
    
}]);