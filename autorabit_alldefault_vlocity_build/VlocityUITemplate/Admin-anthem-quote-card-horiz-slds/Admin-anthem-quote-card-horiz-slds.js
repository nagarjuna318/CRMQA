vlocity.cardframework.registerModule.controller('anthemQuoteCardController', ['$scope', function($scope) {
    
    $scope.getBaseURL = function() {
        var url = location.href;  // entire url including querystring - also: window.location.href;
        var baseURL = url.substring(0, url.indexOf('/', 14));
    }
    
    $scope.getDisplayActions = function(obj) {
        
        if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
            return false;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            var returnValue = true;
            // if(profileValue != 'Underwriting' && profileValue != 'View Info Only' && profileValue != 'Underwriting Dual' && profileValue != 'View Info Only	Dual')
            //     returnValue = true;
            //console.log("inside function - profileValue--> " + profileValue);
            return returnValue;
        }
    };
    
    $scope.getIsDivisionNotBlank = function(obj) {
        
        if(!obj.hasOwnProperty('DivisionName__c')) {
            return false;
        }else{
            var divisionValue = obj['DivisionName__c'];
            var returnValue = false;
            if(divisionValue !== null)
                returnValue = true;
            return returnValue;
        }
    };
    
    $scope.getIsGroupNumberNotBlank = function(obj) {
        
        if(!obj.hasOwnProperty('GroupNumber__c')) {
            return false;
        }else{
            var groupNumberValue = obj['GroupNumber__c'];
            var returnValue = false;
            if(groupNumberValue !== null)
                returnValue = true;
            return returnValue;
        }
    };
    
    $scope.converttoNumberFormat = function(obj, fieldlabel) {
        var value = '';
        if(fieldlabel == 'Total Subscribers')
            value = obj['TotalSubscribers__c'];
        else if(fieldlabel == 'Total Members')
            value = obj['TotalMembers__c'];
        if(value !== undefined){
            value = String(value);
            value = value.replace(new RegExp("^(\\d{" + (value.length%3?value.length%3:0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
            value = value.replace(/\s/g, ",");
        }
        return value;
    };
    
    
    
}]);