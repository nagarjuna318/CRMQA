vlocity.cardframework.registerModule.controller('anthemOpportunityCardController', ['$scope', function($scope) {
    
    $scope.getIconBasedOnRecordType = function(obj, type) {
        if(!obj.hasOwnProperty('RecordType') && !obj.RecordType.hasOwnProperty('Name')) {
            return false;
        }else{
            
            var recordType = obj.RecordType['Name'];
            console.log("inside getIconBasedOnRecordType - recordType--> " + recordType);
            var returnValue = false;
            if(recordType == 'New Business' && type == 'New Business')
                returnValue = true;
            else if(recordType == 'Renewal' && type == 'Renewal')
                returnValue = true;
            else if(recordType == 'In Group Change' && type == 'In Group Change')
                returnValue = true;
            else if(recordType == 'In Group Add Product' && type == 'In Group Add Product')
                returnValue = true;
            console.log("inside getIconBasedOnRecordType - returnValue--> " + returnValue);
            return returnValue;
        }
    };
    
    $scope.getHeaderColor = function(obj) {
        if(!obj.hasOwnProperty('Probability') && !obj.hasOwnProperty('StageName')) {
            return 'default';
        }else{
            var probabilityValue = obj['Probability'];
            var stageValue = obj['StageName'];
            var returnValue = 'default';
            
            //Checks Stage values first and if Stage values does not match, then looks for Probabilty
            if(stageValue == 'Change Cancelled' || stageValue == 'Closed Dead' || stageValue == 'Closed Lost')
                return 'closed';
            else if (stageValue == 'Customer Termed')
                return 'customerTermed';
            else if (stageValue == 'Jeopardy')
                return 'jeopardy';
            
            //If stages dont match, check for Probability
            if(probabilityValue > 0 && probabilityValue <= 20)
                returnValue = 'p0to20';
            else if(probabilityValue > 20 && probabilityValue <= 40)
                returnValue = 'p21to40';
            else if(probabilityValue > 40 && probabilityValue <= 60)
                returnValue = 'p41to60';
            else if(probabilityValue > 60 && probabilityValue <= 80)
                returnValue = 'p61to80';
            else if(probabilityValue > 80 && probabilityValue <= 99)
                returnValue = 'p81to99';
            else if(probabilityValue == 100)
                returnValue = 'p100';
            return returnValue;
        }
    };
    
    $scope.getColorValueForLoseLives = function(obj) {
        if(!obj.hasOwnProperty('Add_or_Lose_Lives__c')) {
            return '#16325C';
        }else{
            var addlooseValue = obj['Add_or_Lose_Lives__c'];
            var returnValue = '#16325C';
            if(addlooseValue == 'Lose Lives')
                returnValue = '#ea5555';
            return returnValue;
        }
    };
    
    /*$scope.getDisplayValueForAddProduct = function(obj) {
        if(!obj.hasOwnProperty('Probability')) {
            return 'none';
        }else{
            var probabilityValue = obj['Probability'];
            var returnValue = 'none';
            if(probabilityValue > 0 && probabilityValue < 100)
                returnValue = 'block';
            //console.log("inside getDisplayValueForAddProduct - returnValue--> " + returnValue);
            return returnValue;
        }
    };*/
}]);