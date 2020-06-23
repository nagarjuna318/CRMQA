vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){

    $scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
        if(!obj.hasOwnProperty('LoggedInUserProfile__c') || !obj.hasOwnProperty('AnthemEntityTransform__c')) {
            return true;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            var AnthemEntityTransform = obj['AnthemEntityTransform__c'];
            var openProduct = obj['Quotes.records[0].No_of_open_Products__c'];
            var callidusApproval = obj['Stage_Ready_For_Callidus_Approval__c'];
            var situs = obj['SitusFormula__c'];
            
            
            console.log(obj.hasOwnProperty('Quotes'));
            console.log("inside getDisplayActionsBasedonProfile - openProduct--> " + openProduct);
            console.log("inside getDisplayActionsBasedonProfile - callidusApproval--> " + callidusApproval);
            var returnValue = false;
            console.log("Situs ="+situs + "actionname = " + actionname + " profileValue= "+profileValue + " openProduct="+openProduct+" callidusApproval="+callidusApproval);
			 if(actionname == 'Product Playbook' && AnthemEntityTransform == 'National') {
                returnValue = true;
                console.log("test1",+returnValue);
             }
             if(actionname == 'Send Document using Docusign'&& situs=='Georgia' && (profileValue=='System Administrator'|| profileValue=='Local Sales Dual'|| profileValue=='Local Sales' || profileValue=='SFDC Program Management'|| profileValue=='Specialty Dual'|| profileValue=='Specialty' || profileValue=='System Admin IT' || profileValue=='System Integration Internal') ) 
		    {
                returnValue = true;
                console.log("Send Docu Return value -> ",+returnValue);
                console.log("Action Name -> ",+actionname);
                console.log('Situs State->',+situs);
             } 

            if(actionname == 'Attest' && (profileValue=='System Administrator'|| profileValue=='Local Sales Dual'|| profileValue=='Local Sales'|| profileValue=='SFDC Program Management') && situs == 'California') {
                returnValue = true;
                console.log("attest",+returnValue);
             } 
            if(actionname == 'TrueComp' && (profileValue == 'National Sales'  || profileValue == 'National Sales Dual'|| profileValue=='System Administrator'|| profileValue=='Local Sales Dual'|| profileValue=='Local Sales'|| profileValue=='SFDC Program Management')) {
                returnValue = true;
                console.log("test3",+returnValue);

                }else if(actionname == 'CreateInternalCommission' && (profileValue == 'National Sales' || profileValue == 'National Sales Dual' || profileValue=='System Administrator') && !obj.hasOwnProperty('Quotes')  && callidusApproval===true) {
                returnValue = true;
      	    	 console.log("test2",+returnValue);
			 }
            console.log("inside getDisplayActionsBasedonProfile - returnValue--> " + returnValue);
            return returnValue;
        }        
    };

}]);