vlocity.cardframework.registerModule.controller('anthemActionsController_quoteCards', ['$scope', function($scope){
	
    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        var returnValue = false;
        try {
            if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
                returnValue = true;
            }else{
    			console.log("--- QuoteCardsTemplate actionname = " + actionname);
                var profileValue = obj['LoggedInUserProfile__c'];
    			var cifProduct = obj['Castlight_Product_Quote__c'];
    			var engageProductStandard = obj['Engage_Alone_Product_Quote__c'];
    			var engageProductScoping = obj['Engage_Product_Quote__c'];
    			console.log("--- QuoteCardsTemplate profileValue = " + profileValue);
    			console.log("--- QuoteCardsTemplate engageProductStandard = " + engageProductStandard);
    			console.log("--- QuoteCardsTemplate engageProductScoping = " + engageProductScoping);

                if(profileValue == 'Underwriting' || profileValue == 'View Info Only' || profileValue == 'Underwriting Dual' || profileValue == 'View Info Only	Dual') {
                    returnValue = false;
                } 

  			  	if(actionname == 'Castlight Engage CIF' || actionname == 'Engage Scoping' || actionname == 'Engage Standard' || actionname == 'Engage Scoping And Engage Standard') {
  			  	    if((cifProduct !== null && cifProduct) 
  			  	    || (engageProductScoping !== null && engageProductScoping)
  			  	    || (engageProductStandard !== null && engageProductStandard)
  			  	    ) {
        			    console.log("--- QuoteCardsTemplate 1000 actionname" + actionname  + ' value=true');
	    			    returnValue = true;
  			  	    }
  			  	} else {
  			  	    return true;
  			  	}
            }
        } catch(e) {
            console.log("--- error getDisplayActionsBasedonProfile="+e);
        }
        return returnValue;
    };
}]);