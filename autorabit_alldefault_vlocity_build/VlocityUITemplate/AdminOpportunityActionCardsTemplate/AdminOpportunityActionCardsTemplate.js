vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    
    $scope.display_because_national_profile = false

    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
		
        if(!obj.hasOwnProperty('LoggedInUserProfile__c') || !obj.hasOwnProperty('AnthemEntityTransform__c')) {
            return true;
        } else {
            var profileValue = obj['LoggedInUserProfile__c'];
            var AnthemEntityTransform = obj['AnthemEntityTransform__c'];
            var openProduct = obj['Quotes.records[0].No_of_open_Products__c'];
            var callidusApproval = obj['Stage_Ready_For_Callidus_Approval__c'];

            console.log(obj.hasOwnProperty('Quotes'));
            console.log("inside getDisplayActionsBasedonProfile - openProduct--> " + openProduct);
            console.log("inside getDisplayActionsBasedonProfile - callidusApproval--> " + callidusApproval);
            
            if (obj['AnthemEntityTransform__c'] === 'National'){
                    $scope.display_because_national_profile = true
                }

            var returnValue = true;
            return returnValue;
        };
		if(actionname == 'Send Document using Docusign' && profileValue=='System Administrator') 
		{
                return true;
                console.log("Send Docu Return value -actionname and profile value ",+actionname, +profileValue);

         } 
		
    };
    
}]);