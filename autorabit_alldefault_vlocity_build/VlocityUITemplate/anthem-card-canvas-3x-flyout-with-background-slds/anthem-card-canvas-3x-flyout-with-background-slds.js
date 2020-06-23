vlocity.cardframework.registerModule.controller('flyoutController', ['$scope', function($scope) {

    

    $scope.checkForProgram = function(cards){
        //return true if: Opportunity Type is "Renewal Local" && Category__c is Plan
        //else return false

        //1) Check if any objects exist at all on first card
        //2) Check for opportunity type on first card.obj.Quote_Line_Items__r.records[0].Opportunity_Type__c &&
        //      card.obj.Quote_Line_Items__r.records[0].Product2.Category__c

        if(!cards[0].obj){
            return false
        }else if(cards[0].obj.Quote_Line_Items__r.records[0].Product2.Category__c === "Plan"){ //GLD - 202.1- PRDCRM-56357 removing renewal checks- Creating and Displaying the Fields on Medical QLI (Single INN Provider Copay, Coinsurance, CC)
            return true
        }else{
            return false
        }

    }

}]);