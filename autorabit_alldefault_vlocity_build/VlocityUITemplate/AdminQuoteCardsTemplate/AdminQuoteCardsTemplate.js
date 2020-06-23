vlocity.cardframework.registerModule.controller('anthemCardsController', ['$scope', function($scope){
    $scope.display_because_national_profile = false

    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        var returnValue = false;
        try {
            var profileValue = obj['LoggedInUserProfile__c'];
            var grsProfileRT = obj['Is_GRS_Profile_With_Correct_Record_Type__c'];
            console.log("--- QuoteCardsTemplate profileValue = " + profileValue);
            console.log("--- GRS Profile ? = " + grsProfileRT);

            if (obj['AnthemEntityTransform__c'] === 'National'){
                    $scope.display_because_national_profile = true
                }

            if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
                returnValue = true;
            }else{
				returnValue = true;
            }
            if(actionname == 'Capture Group Information' && (profile == 'GRS' || profile == 'GRS Dual')) {
                 console.log('@@@Admin' + actionname);
                 returnValue = true;
            }
        } catch(e) {
            console.log("--- error getDisplayActionsBasedonProfile="+e);
        }
        return returnValue;
    };
}]);