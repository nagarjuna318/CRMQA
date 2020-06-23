vlocity.cardframework.registerModule.controller('anthemQuoteLineItemParentController', ['$scope', function($scope) {
    
    /*$scope.getHeaderColor = function(obj) {
        if(!obj.hasOwnProperty('CompletionMarker__c')) {
            return 'default';
        }else{
            var completionStatus = obj['CompletionMarker__c'];
            var returnValue = 'default';
            if(completionStatus == 'Complete')
                returnValue = 'green';
            else if(completionStatus == 'Not Complete')
                returnValue = 'yellow';
            else if(completionStatus == 'Cloned From Renewal but needs Validation')
                returnValue = 'red';
            return returnValue;
        }
    };*/
    
    $scope.getIconColor = function(obj, iconStaus) {
        if(!obj.hasOwnProperty('CompletionMarker__c')) {
            return false;
        }else{
            var completionStatus = obj['CompletionMarker__c'];
            var returnValue = false;
            if(completionStatus == 'Configured' && iconStaus == 'Configured')
                returnValue = true;
            else if(completionStatus == 'Not Configured' && iconStaus == 'Not Configured')
                returnValue = true;
            else if(completionStatus == 'Cloned from Renewal but needs Validation' && iconStaus == 'Cloned from Renewal but needs Validation')
                returnValue = true;
            return returnValue;
        }
    };
    
    $scope.getApprovalStatusColor = function(obj) {
        if(!obj.hasOwnProperty('ProductLineApprovalStatus__c')) {
            return 'grey';
        }else{
            var completionStatus = obj['ProductLineApprovalStatus__c'];
            var returnValue = 'grey';
            if(completionStatus == 'Submitted for Approval')
                returnValue = 'yellow';
            else if(completionStatus == 'Approved')
                returnValue = 'green';
            else if(completionStatus == 'Rejected')
                returnValue = 'red';
            return returnValue;
        }
    };
    
    /*$scope.getDisplayValueForBundle = function(obj) {
        
        if(!obj.hasOwnProperty('Product2') && !obj.Product2.hasOwnProperty('Bundle__c')) {
            return 'none';
        }else{
            var bundleValue = obj.Product2['Bundle__c'];
            var returnValue = 'none';
            if(bundleValue == 'Variable' || bundleValue == 'Fixed')
                returnValue = 'block';
            return returnValue;
        }
    };*/
    
    $scope.converttoNumberFormat = function(obj, fieldlabel) {
        var value = '';
        if(fieldlabel == 'Subscribers')
            value = obj['Subscribers__c'];
        else if(fieldlabel == 'Members')
            value = obj['Members__c'];
        else if(fieldlabel == 'Current Subscribers')
            value = obj['CurrentSubscribers__c'];
        else if(fieldlabel == 'Current Members')
            value = obj['CurrentMembers__c'];
        if(value !== undefined){
            value = String(value);
            value = value.replace(new RegExp("^(\\d{" + (value.length%3?value.length%3:0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
            value = value.replace(/\s/g, ",");
        }
        return value;
    };
    
     $scope.getDisplayValueForAddProgram = function(obj) {
        
        if(!obj.hasOwnProperty('Product2') && !obj.Product2.hasOwnProperty('Bundle__c')) {
            return false;
        }else{
            var bundleValue = obj.Product2['Bundle__c'];
            var EditMode = obj.Product2['DoNotEditBundle__c']; 
            var returnValue = false;
            if((bundleValue == 'Variable') && (EditMode === false))
                returnValue = true;
            return returnValue;
        }
    };
    
    $scope.getDisplayValueForMassUpdate = function(obj) {
        
        if(!obj.hasOwnProperty('Product2') && !obj.Product2.hasOwnProperty('Bundle__c')) {
            return false;
        }else{
            var bundleValue = obj.Product2['Bundle__c'];
            var returnValue = false;
            if(bundleValue == 'Variable')
                returnValue = true;
            return returnValue;
        }
    };
    
    $scope.getDisplayActions = function(obj, actionName) {
        
        if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
            return false;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            var returnValue = false;
            if(profileValue != 'Underwriting' && profileValue != 'View Info Only'){
                returnValue = true;
            }else{
                if(actionName == 'Product Configuration' || actionName == 'ProductConfigurationForLG' ||actionName == 'Capture_Plan_Benefits_LG' || actionName == 'ProductConfigurationApprovals' || actionName == 'ProductConfigurationMedical'|| actionName == 'ProductConfigurationProductSelectionDetails')
                    returnValue = true;
            }
            return returnValue;
        }
    };
  
    
    $scope.getDisplayProductConfigure = function(obj, actionName) {
        
        if(!obj.hasOwnProperty('Cards_Product_Config_Action_Name__c')) {
            return false;
        }else{
            var recordTypeActionName = obj['Cards_Product_Config_Action_Name__c'];
            var returnValue = false;
            if(actionName == recordTypeActionName)
                returnValue = true;
            return returnValue;
        }
    };
    
    $scope.getDisplayApprovalFields = function(obj) {
        
        if(!obj.hasOwnProperty('Cards_Display_Approvals__c')) {
            return false;
        }else{
            var displayApproval = obj['Cards_Display_Approvals__c'];
            var returnValue = false;
            if(displayApproval == 'true')
                returnValue = true;
            //console.log("inside function - returnValue--> " + returnValue);
            return returnValue;
        }
    };
    
    $scope.getDisplayApprovalActions = function(obj, actionName) {
        
        if(!obj.hasOwnProperty('RecordType__c') && !obj.hasOwnProperty('ProductLineApprovalStatus__c') && !obj.hasOwnProperty('AHGProductLineReadyforApproval__c') && !obj.hasOwnProperty('IHMProductLineReadyforApproval__c') && !obj.hasOwnProperty('Cards_Display_Approvals__c') && !obj.hasOwnProperty('CCMUProductLineReadyforApproval__c') && !obj.hasOwnProperty('ANACustomNetworksReadyForApproval__c') && !obj.hasOwnProperty('OnsiteClinicsProductLineReadyforAp__c')) {
            return false;
        }else{
            var recordTypeName = obj['RecordType__c'];
            var approvalStatus = obj['ProductLineApprovalStatus__c'];
            var displayApprovalFlag = obj['Cards_Display_Approvals__c'];
            var readyForApprovalAHG = obj['AHGProductLineReadyforApproval__c'];
            var readyForApprovalIHM = obj['IHMProductLineReadyforApproval__c'];
            var readyForApprovalCCMU = obj['CCMUProductLineReadyforApproval__c'];
            var readyForApprovalANA = obj['ANACustomNetworksReadyForApproval__c'];
            var readyForApprovalOC = obj['OnsiteClinicsProductLineReadyforAp__c'];
            var returnValue = false;
            
            if(actionName == 'SubmitApproval' && displayApprovalFlag == 'true'){
                if(approvalStatus != 'Submitted for Approval' && approvalStatus != 'Approved'){
                    if(recordTypeName == 'Anthem Health Guide' && readyForApprovalAHG === true)
                        returnValue = true;
                    else if(recordTypeName == 'Integrated Health Model' && readyForApprovalIHM === true)
                        returnValue = true;
                    else if(recordTypeName == 'CCMU/Maternity Solution' && readyForApprovalCCMU === true)
                        returnValue = true;
                    else if(recordTypeName == 'ANA Custom Networks' && readyForApprovalANA === true)
                        returnValue = true;
                    else if(recordTypeName == 'Onsite Clinics' && readyForApprovalOC === true)
                        returnValue = true;
                }
            }if(actionName == 'Recall Approval Request' && displayApprovalFlag == 'true'){
                if(approvalStatus == 'Submitted for Approval' || approvalStatus == 'Approved')
                     returnValue = true;
            }
            //console.log("inside function - returnValue--> " + returnValue);
            return returnValue;
        }
    };

    $scope.getCapturePlanActions = function(obj, actionName) 
    {
        var AccountSitusState = obj.Quote.Account['Situs_State_Abbrev__c'];
        var RecordType = obj.Quote.Opportunity['RecordTypeName__c'];
        var OpportunityEffectiveDate = obj.Quote.Opportunity['CloseDate'];
        var flag = OpportunityEffectiveDate < '2020-01-01';
       
        console.log('In capture'+obj['AnthemEntity__c']);
        if(obj.Quote['IsGroupNumberExist__c'] != true)
        {
            var ClaimSystem = '';
            var IsPartOfAMigration = '';
        }
        else
        {
            var ClaimSystem = obj.Quote.GroupNumber__r['ClaimSystem__c'];
            var IsPartOfAMigration = obj.Quote.GroupNumber__r['IsPartOfAMigration__c'];
        }

		var sixState = 'OH, MO, IN, KY, WI, VA';
		var threeState = 'CT, ME, NH';
        var Otherstates = 'CO, CA, NV, GA, NY';
		var opportunityRecordTypes_NonMigrating = 'Renewal Local, In Group Change Local';
		var opportunityRecordTypes_Migrating = 'Renewal Local, In Group Change Local, In Group Add Product Local';
        var opportunityRecTypes_NonMigrating_NonWGS = 'Renewal Local, In Group Change Local, In Group Add Product Local,New Business Local'; //Changed as part of 38774 (Gladiators)
        var MigrationFlag = (IsPartOfAMigration == null || IsPartOfAMigration == '' || IsPartOfAMigration == "");

		if(obj['Product_Type__c']  ==  'Medical')
		{

            console.log('@@@ actionName : '+actionName);

            if(actionName == 'LG_AddRemoveRider')
            {
                return true;
            }

			if( actionName == 'Capture_Plan_Benefits_LG' 
                && 
                (
                    ( 	
                        obj.Quote['IsGroupNumberExist__c']==true 
                        && 
                        ( 
                            (
                                (	
                                    IsPartOfAMigration == 'Yes' 
                                    || 
                                    IsPartOfAMigration =='TRUE'
                                )
                                &&
                                ClaimSystem != 'WGS 2.0'
                                && 
                                obj.Quote.Opportunity['CloseDate'] < obj.Quote.GroupNumber__r['Date_Migrated_to_WGS__c']
                                && 
                                opportunityRecordTypes_Migrating.includes(RecordType)					
                            )
                            ||
                            /*Changed as part of 40595 (Gladiators)*/
                            (
                                (
                                    (IsPartOfAMigration != 'Yes' )  
                                    && 
                                    (IsPartOfAMigration != 'TRUE' )
                                ) 
                                && 
                                ClaimSystem == 'WGS 2.0'
                                &&
                                flag == true
                                &&
                                threeState.includes(AccountSitusState)					
                                && 
                                opportunityRecTypes_NonMigrating_NonWGS.includes(RecordType)
                            )
                            ||
                            //Changed as part of 38774 (Gladiators)
                            (
                                (
                                    (IsPartOfAMigration != 'Yes' )  
                                    && 
                                    (IsPartOfAMigration != 'TRUE' )
                                ) 
                                &&
                                (
                                    ClaimSystem != 'WGS 2.0'
                                    &&
                                    ClaimSystem != ''
                                    &&
                                    ClaimSystem != null
                                )
                                &&					
                                opportunityRecTypes_NonMigrating_NonWGS.includes(RecordType)
                            )
                        )
                    )
                    || 
                    /*Changed as part of 40595 (Gladiators)*/
                    (
                        threeState.includes(AccountSitusState) 
                        && 
                        obj.Quote['IsGroupNumberExist__c']==false 
                        && 
                        RecordType == 'New Business Local' 
                        && 
                        flag == true 
                    )
                )
            )
            return true;

            if(	actionName == 'AddPlanLG_P2A'  
                    && 
                    (
                        (obj.Quote['IsGroupNumberExist__c'] == true &&
                        (
                            ( 
                                (   
                                    ((IsPartOfAMigration == 'Yes' || IsPartOfAMigration =='TRUE') && ClaimSystem != 'WGS 2.0' )
                                    && 
                                    (
                                        (
                                            obj.Quote.Opportunity['CloseDate'] == obj.Quote.GroupNumber__r['Date_Migrated_to_WGS__c'] &&
                                            (
                                                (
                                                    RecordType == 'In Group Add Product Local' || 
                                                    RecordType ==  'New Business Local'|| 
                                                    RecordType ==  'In Group Change Local'
                                                )
                                                ||
                                                (RecordType == 'Renewal Local'&& obj['LG_Plan_Config_Exception__c'] == true)
                                            )
                                        ) 
                                        || 
                                        obj.Quote.Opportunity['CloseDate'] > obj.Quote.GroupNumber__r['Date_Migrated_to_WGS__c']
                                    )
                                ) 
                                || 
                                (
                                    ((IsPartOfAMigration == 'Yes' || IsPartOfAMigration =='TRUE') && ClaimSystem == 'WGS 2.0' )
                                    && 
                                    (
                                        obj.Quote.Opportunity['CloseDate'] == obj.Quote.GroupNumber__r['Date_Migrated_to_WGS__c'] &&
                                        RecordType == 'Renewal Local'
                                    )
                                )
                            ) 
                            ||
                            (
                                (IsPartOfAMigration != 'Yes' && IsPartOfAMigration !='TRUE') && 
                                (
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
                            )
                        )
                    ) 
                    || 
                    (
                        RecordType == 'New Business Local' 
                        && 
                        obj.Quote['IsGroupNumberExist__c'] == false 
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
                && // PRDCRM-50783 -GLD - L&T-Remove Add Plan link from the QLI card/Hide Plan Mass Update button
                (
                    obj['AnthemEntity__c'] != 'Labor and Trust'
                ) 
            )
            return true;
		}
    };

}]);