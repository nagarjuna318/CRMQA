vlocity.cardframework.registerModule.controller('anthemCommisionCardController', ['$scope', function($scope) {
    
    $scope.getIconBasedOnRole = function(obj, type) {
        if( !obj.hasOwnProperty('Role__c')) {
            return false;
        }else{
            var Role = obj['Role__c'];
            var returnValue = false;
            if(Role == 'RVP' && type == 'RVP')
                returnValue = true;
            else if(Role == 'Account Manager' && type == 'Account Manager')
                returnValue = true;
            else if(Role == 'Regional Manager' && type == 'Regional Manager')
                returnValue = true;
             else   if(Role == 'Director/Sales AM' && type == 'Director/Sales AM')
                returnValue = true;
            else if(Role == 'Account Executive' && type == 'Account Executive')
                returnValue = true;
            else if(Role == 'Chief Client Officer' && type == 'Chief Client Officer')
                returnValue = true;
            console.log("inside getIconBasedOnRole - returnValue--> " + returnValue);
            return returnValue;
        }
    };
    
    $scope.getHeaderColor = function(obj) {
        
     if(!obj.hasOwnProperty('Role__c'))  {
            return 'default';
        }else{
            var Role = obj['Role__c'];
            var returnValue = 'default';
            
           if(Role=='RVP')
                returnValue = 'p0to20';
            else if(Role=='Account Manager')
            returnValue = 'p21to40';
            else if(Role=='Regional Manager')
                returnValue = 'p41to60';
                 if(Role=='Director/Sales AM')
                returnValue = 'p61to80';
            else if(Role=='Account Executive')
            returnValue = 'p81to99';
            else if(Role=='Chief Client Officer')
                returnValue = 'p100';
               return returnValue;
        }
    };
    
}]);