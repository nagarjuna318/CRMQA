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
            var returnValue = false;
            if(profileValue != 'Underwriting' && profileValue != 'View Info Only')
                returnValue = true;
            //console.log("inside function - profileValue--> " + profileValue);
            return returnValue;
        }
    };
	
	$scope.showAddProduct = function(obj, actionName) {

        var AccountSitusState = obj.Account['Situs_State_Abbrev__c'];
        //var IsPartOfAMigration = obj.GroupNumber__r['IsPartOfAMigration__c'];
        var OpportunityEffectiveDate = obj.Opportunity['CloseDate'];
        var flag = OpportunityEffectiveDate < '2020-01-01';
        var RecordType = obj.Opportunity['RecordTypeName__c'];
        //var ClaimSystem = obj.GroupNumber__r['ClaimSystem__c'];
        if(obj['IsGroupNumberExist__c']!=true)
        {
        var ClaimSystem = '';
        var IsPartOfAMigration = '';
        }
        else
        {
        var ClaimSystem = obj.GroupNumber__r['ClaimSystem__c'];
        var IsPartOfAMigration = obj.GroupNumber__r['IsPartOfAMigration__c'];
        }
		var sixState = 'OH, MO, IN, KY, WI, VA';
		var threeState = 'CT, ME, NH';
        var Otherstates = 'CO, CA, NV, GA, NY';
		var opportunityRecordTypes_NonMigrating = 'Renewal Local, In Group Change Local';
		var opportunityRecordTypes_Migrating = 'Renewal Local, In Group Change Local, In Group Add Product Local';
        var opportunityRecTypes_NonMigrating_NonWGS = 'Renewal Local, In Group Change Local, In Group Add Product Local,New Business Local'; //Changed as part of 38774 (Gladiators)

         var MigrationFlag = (IsPartOfAMigration == null || IsPartOfAMigration == '' || IsPartOfAMigration == "");
        
        if( actionName == 'AddProduct_LG' && (
          (obj['IsGroupNumberExist__c']==true && (( (IsPartOfAMigration == 'Yes' || IsPartOfAMigration =='TRUE') && 
             (opportunityRecordTypes_Migrating.includes(RecordType) && 
		            obj.Opportunity['CloseDate'] < obj.GroupNumber__r['Date_Migrated_to_WGS__c']  
                    ))
                    
                    /*Changed as part of 38774 (Gladiators)*/
                    || 
                    (((IsPartOfAMigration != 'Yes' )  && (IsPartOfAMigration != 'TRUE' )) && (opportunityRecTypes_NonMigrating_NonWGS.includes(RecordType) && 
		            ClaimSystem != 'WGS 2.0' )) || 
                    /*Changed as part of 40595 (Gladiators)*/
                    (threeState.includes(AccountSitusState) && (((IsPartOfAMigration != 'Yes' )  && (IsPartOfAMigration != 'TRUE' )) && (opportunityRecTypes_NonMigrating_NonWGS.includes(RecordType) && 
		            ClaimSystem == 'WGS 2.0' && flag == true )))
                    
                    )) || /*Changed as part of 40595 (Gladiators)*/
                    (threeState.includes(AccountSitusState) && obj['IsGroupNumberExist__c']==false && 
                    RecordType == 'New Business Local' && flag == true ))) 
                    return true;

        if(
            actionName == 'AddPlanProductLG_P2A'  && 
			(
                (
                    obj['IsGroupNumberExist__c'] == true 
                    &&
                    (

                        (   
                            (
                                IsPartOfAMigration =='TRUE' 
                                || 
                                IsPartOfAMigration == 'Yes'
                            )  
                            && 
                            (
                                (
                                    obj.Opportunity['CloseDate'] == obj.GroupNumber__r['Date_Migrated_to_WGS__c']  &&
                                    (        
                                            (
                                                RecordType == 'In Group Add Product Local' 
                                                || 
                                                RecordType ==  'New Business Local'
                                                || 
                                                RecordType ==  'In Group Change Local'
                                                
                                            )
                                    
                                        ||
                                        (
                                            RecordType == 'Renewal Local' 
                                            && 
                                            obj['LG_Plan_Config_Exception__c'] == true
                                        )
                                    )
                                )
                                
                                || 
                                obj.Opportunity['CloseDate'] > obj.GroupNumber__r['Date_Migrated_to_WGS__c']
                            ) 
                        ) 
                        ||
                        (
                            (
                                IsPartOfAMigration != 'Yes' 
                                && 
                                IsPartOfAMigration !='TRUE'
                            ) 
                            && 
                            ( /*Changed as part of 40595 (Gladiators)*/
                                ClaimSystem == 'WGS 2.0'
                                && 
                                (
                                    (
                                        sixState.includes(AccountSitusState) 
                                        || 
                                        Otherstates.includes(AccountSitusState)
                                    ) 
                                    || 
                                    (
                                        threeState.includes(AccountSitusState) 
                                        && 
                                        !flag
                                    )
                                )
                            )
                        ) /*Changed as part of 40595 (Gladiators)*/
                    )
                ) 
                || 
                (
                    RecordType == 'New Business Local' 
                    && 
                    obj['IsGroupNumberExist__c'] == false 
                    && 
                   (
                                    (
                                        sixState.includes(AccountSitusState) 
                                        || 
                                        Otherstates.includes(AccountSitusState)
                                    ) 
                                    || 
                                    (
                                        threeState.includes(AccountSitusState) 
                                        && 
                                        !flag
                                    )/*Changed as part of 40595 (Gladiators)*/
                                )
                )
            )
        )
        {
            return true;
        }        
		
        if(actionName != 'AddPlanProductLG_P2A' && actionName != 'AddProduct_LG')
        {
            return true;
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