vlocity.cardframework.registerModule.controller('anthemQLIFlyoutCardController', ['$scope', function($scope) {
    
    $scope.getDisplayActions = function(obj, actionName) {
        
        if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
            return false;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            var returnValue = false;
            if(profileValue != 'Underwriting' && profileValue != 'View Info Only' && profileValue != 'Underwriting Dual' && profileValue != 'View Info Only	Dual'){
                returnValue = true;
            }else{
                if(actionName == 'ProgramConfiguration')
                    returnValue = true;
            }
            return returnValue;
        }
    };
    
    $scope.getDisplayValueForProgramActions = function(obj, actionName) {
        
        if(!obj.hasOwnProperty('ParentQuoteLineItem__r') && !obj.ParentQuoteLineItem__r.hasOwnProperty('Product2') && !obj.ParentQuoteLineItem__r.Product2.hasOwnProperty('Bundle__c') && !obj.ParentQuoteLineItem__r.Product2.hasOwnProperty('Name')) {
            return false;
        }else{
            var bundleValue = obj.ParentQuoteLineItem__r.Product2['Bundle__c'];
            var productName = obj.ParentQuoteLineItem__r.Product2['Name'];
            //console.log("inside function - actionName--> " + actionName);
            if(actionName == 'ProgramConfiguration' && bundleValue == 'Variable'){
                return true;
            }
            if(actionName == 'Delete Program'){
                if(bundleValue == 'Variable')
                    return true;
                else if((bundleValue == 'Fixed') && (productName == 'Integrated Health Model' || productName == 'Health and Wellness: Custom Care Management Unit (CCMU)' || productName == 'Mercer Health Advantage' || productName == 'BOLD'))
                     return true;
            }
            return false;
        }
    };
    
    $scope.getDisplayFieldsBasedOnBundle = function(obj, fieldlabel) {
        
        if(!obj.hasOwnProperty('ParentQuoteLineItem__r') && !obj.ParentQuoteLineItem__r.hasOwnProperty('Product2') && !obj.ParentQuoteLineItem__r.Product2.hasOwnProperty('Bundle__c')) {
            return false;
        }else{
            var bundleValue = obj.ParentQuoteLineItem__r.Product2['Bundle__c'];
            var returnValue = false;
            if(bundleValue == 'Fixed' && fieldlabel == 'CPL Codes')
                returnValue = true;
            else if(bundleValue == 'Variable'){
                returnValue = true;
            }
            return returnValue;
        }
    };
    
}]);