vlocity.cardframework.registerModule.controller('anthemQLIFlyoutCardController', ['$scope', function($scope) {
    
    $scope.Math = window.Math;

    $scope.toFloat = function(obj){

        return obj.Product2.Coinsurance__c;
    }

    $scope.getDisplayActions = function(obj, actionName) {
        
        if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
            return false;
        }else{
            var profileValue = obj['LoggedInUserProfile__c'];
            var returnValue = false;
            if(profileValue != 'Underwriting' && profileValue != 'View Info Only'){
                returnValue = true;
            }else{
                if(actionName == 'ProgramConfiguration' || actionName == 'ProductConfigurationApprovals')
                    returnValue = true;
            }
            return returnValue;
        }
    };
    
    $scope.getDisplayValueForProgramActions = function(obj, actionName) {
        
        if  (
                !obj.hasOwnProperty('ParentQuoteLineItem__r') 
                && 
                !obj.ParentQuoteLineItem__r.hasOwnProperty('Product2') 
                && 
                !obj.ParentQuoteLineItem__r.Product2.hasOwnProperty('Bundle__c') 
                && 
                !obj.ParentQuoteLineItem__r.Product2.hasOwnProperty('Name')
            ) 
        {
            return false;
        }
        else
        {
            var bundleValue = obj.ParentQuoteLineItem__r.Product2['Bundle__c'];
            var productName = obj.Product2['Name'];
            var vactWiseChild = obj.ActWiseChildQuote__c;
            ////Michael Addition Start (Team Olmpians)
            var isSelectedPlan = obj.Is_HSA_Selected_Plan__c;	
            var productNameInJson = obj.Product2['%vlocity_namespace%__AttributeDefaultValues__c'];	
            //console.log('@@@ productNameInJson : '+productNameInJson);	
            if(productNameInJson != null && productNameInJson != '')	
            {	
                var otherCDHPType = JSON.parse(productNameInJson, function (key, value) {	
                    if (key == "OTHER_cdhProductType") {	
                        return value.toUpperCase();	
                    } else {	
                        return value;	
                    }	
                });	
                if(otherCDHPType.OTHER_cdhProductType!=null && otherCDHPType.OTHER_cdhProductType!= ''){	
                    //console.log('@@@ obj : '+obj.OTHER_cdhProductType);	
                    //console.log(obj.OTHER_cdhProductType.includes("HRA"));	
                    //console.log(obj.OTHER_cdhProductType.includes("hra"));	
                    if(otherCDHPType.OTHER_cdhProductType.includes("hra") || otherCDHPType.OTHER_cdhProductType.includes("HRA")){	
                        isSelectedPlan = true;	
                    }	
                }	
            }

            //End

            console.log('@@@ actionName : '+actionName);
            console.log('@@@ productName : '+productName);
            console.log('@@@ bundleValue : '+bundleValue);
            console.log('@@@ vactWiseChild : '+vactWiseChild);
            
            if(actionName == 'AddCommercialClinical' && obj.Product2['Category__c'] == 'Plan')
            {
                return true;
            }
            
            //console.log("inside function - actionName--> " + actionName);
            if(
                    (actionName == 'ProgramConfiguration' && bundleValue == 'Variable' && productName != 'ANTHEM HEALTH GUIDE') 
                    || 
                    (actionName == 'ProductConfigurationApprovals' && productName == 'ANTHEM HEALTH GUIDE')
                )
            {
                return true;
            }
			
            if(actionName == 'Delete Program')
            {
                if(bundleValue == 'Variable')
                    return true;
                else if(
                            (bundleValue == 'Fixed') && 
                            (productName == 'Integrated Health Model' || productName == 'Health and Wellness: Custom Care Management Unit (CCMU)' || productName == 'Mercer Health Advantage' || productName == 'BOLD')
                        )
                     return true;
            }
            //if(actionName == 'ProductConfigurationMedicalActWise' && vactWiseChild != null && vactWiseChild !='' && vactWiseChild != 'undefined'){
            if(actionName == 'ProductConfigurationMedicalActWise' && isSelectedPlan == true){    
                return true;
            }
            return false;
        }
    };

    //Below function added by Olympians Team
    $scope.getDisplayFieldsBasedOnBundleForActWise = function(obj, fieldlabel) {	
        var isActWiseIntegrated = obj.Is_HSA_Selected_Plan__c;	
        var productNameInJson = obj.Product2['%vlocity_namespace%__AttributeDefaultValues__c'];	
        //console.log('@@@ productNameInJson : '+productNameInJson);	
        if(productNameInJson != null && productNameInJson != '')	
        {	
            var otherCDHPType = JSON.parse(productNameInJson, function (key, value) {	
                if (key == "OTHER_cdhProductType") {	
                    return value.toUpperCase();	
                } else {	
                    return value;	
                }	
            });	
            if(otherCDHPType.OTHER_cdhProductType!=null && otherCDHPType.OTHER_cdhProductType!= ''){	
                //console.log('@@@ obj : '+obj.OTHER_cdhProductType);	
                //console.log(obj.OTHER_cdhProductType.includes("HRA"));	
                //console.log(obj.OTHER_cdhProductType.includes("hra"));	
                if(otherCDHPType.OTHER_cdhProductType.includes("hra") || otherCDHPType.OTHER_cdhProductType.includes("HRA")){	
                    isActWiseIntegrated = true;	
                }	
            }	
        }	
        if(isActWiseIntegrated == true)	
            return true;	
        else	
            return false;	
    };

    $scope.getDisplayValueForPlanActions = function(obj, actionName) 
    {
        if(obj.Product2['Category__c'] == 'Plan')
        return true;
    };

    $scope.getDisplayValueForModifyPlanActions = function(obj, actionName) 
    {
        var dt1 = new Date("2020-01-01");
        var finaldt1 = dt1.toUTCString();
        var dt2 = new Date(obj['OpportunityEffectiveDate__c']);
        var finaldt2 = dt2.toUTCString();
        var flag = obj['OpportunityEffectiveDate__c'] >= '2020-01-01';
        console.log('Flag:'+flag);
        var Isgroupexist = obj.ParentQuoteLineItem__r.Quote['IsGroupNumberExist__c'];
        console.log('@@@ Group Exist:'+Isgroupexist);	
        console.log('@@@ obj[Pooled_Non_Pooled__c] : '+obj['Pooled_Non_Pooled__c']);

        if
        ( obj.Product2['Category__c'] == 'Plan' &&
            (
                (
                    (obj['IsPartOfAMigration__c'] == 'Yes' || obj['IsPartOfAMigration__c'] == 'TRUE') 
                    && 
                    (
                        (
                            (obj['OpportunityEffectiveDate__c'] == obj['Date_Migrated_to_WGS__c']) 
                            && 
                            (
                                obj['Opportunity_Type__c'] == 'New Business Local' || 
                                obj['Opportunity_Type__c'] == 'In Group Add Product Local' 
                            )
                        )
                        || 
                        obj['OpportunityEffectiveDate__c'] > obj['Date_Migrated_to_WGS__c']
                    )
                )
                || 
                (
                    (obj['IsPartOfAMigration__c'] != 'Yes' && obj['IsPartOfAMigration__c'] != 'TRUE') 
                    && 
                    (
                        (
                            obj['ClaimsPlatform__c'] == 'WGS 2.0' && 
                            (
                                (
                                    obj['Situs_State_Abbrev__c']!='CA' && 
                                    obj['Situs_State_Abbrev__c']!='CO' && 
                                    obj['Situs_State_Abbrev__c']!='NV' &&
                                    obj['Situs_State_Abbrev__c']!='CT' &&
                                    obj['Situs_State_Abbrev__c']!='ME' &&
                                    obj['Situs_State_Abbrev__c']!='NH'
                                ) 
                                ||
                                (
                                    (
                                        (
                                            obj['Situs_State_Abbrev__c']=='CA' 
                                            && 
                                            obj['Pooled_Non_Pooled__c'] == 'Non-Pooled'
                                        )
                                        || 
                                        obj['Situs_State_Abbrev__c']=='CO' || 
                                        obj['Situs_State_Abbrev__c']=='NV' || obj['Situs_State_Abbrev__c']=='CT' ||
                                        obj['Situs_State_Abbrev__c']=='ME' || obj['Situs_State_Abbrev__c']=='NH'
                                    )
                                    &&  flag 
                                )
                            )
                        )
                    )
                )
                ||
                (
                    obj['Opportunity_Type__c'] == 'New Business Local' && 
                    Isgroupexist == false &&  ((obj['Situs_State_Abbrev__c'] !='CO' && obj['Situs_State_Abbrev__c'] !='NV'  && 
                    obj['Situs_State_Abbrev__c'] !='CA' &&  obj['Situs_State_Abbrev__c'] !='CT' && 
                    obj['Situs_State_Abbrev__c'] !='ME' && obj['Situs_State_Abbrev__c'] !='NH') || 
                    (flag && (obj['Situs_State_Abbrev__c'] =='CO' || 
                    obj['Situs_State_Abbrev__c'] =='NV' || obj['Situs_State_Abbrev__c'] =='CT'|| 
                    obj['Situs_State_Abbrev__c'] =='NH'|| obj['Situs_State_Abbrev__c'] =='ME' ||  
                    (obj['Situs_State_Abbrev__c'] =='CA' && 
                    obj['Pooled_Non_Pooled__c'] == 'Non-Pooled')) ))
                )
            )
        )
        return true;
    };
    // Adding View Plan button as part of PRDCRM-49301 - Gladiators
    $scope.getDisplayValueForViewPlanActions = function(obj, actionName) 
    {
       
        if( obj.Product2['Category__c'] == 'Plan' )
        return true;

    };
    
    $scope.getDisplayFieldsBasedOnBundle = function(obj, fieldlabel) {

        if(!obj.hasOwnProperty('ParentQuoteLineItem__r') && !obj.ParentQuoteLineItem__r.hasOwnProperty('Product2') && !obj.ParentQuoteLineItem__r.Product2.hasOwnProperty('Bundle__c')) {
            return false;
        }
        else
        {
            var bundleValue = obj.ParentQuoteLineItem__r.Product2['Bundle__c'];
            var returnValue = false;

            console.log('### : '+obj.Product2['Category__c']);
            console.log('### fieldlabel : '+fieldlabel);
            console.log('###  : '+obj['Package_has_been_attached__c']);

            if( obj.Product2['Category__c'] == 'Plan' && 
                fieldlabel == 'A H&W package has been selected' && 
                (obj['Package_has_been_attached__c'] == 'Yes' || obj['Package_has_been_attached__c'] == 'AutoAssociated')
            )
            {
                returnValue = true;
            }

            if( obj.Product2['Category__c'] == 'Plan' && 
                fieldlabel == 'A H&W package has not been selected yet' && 
                (obj['Package_has_been_attached__c'] == 'No' || obj['Package_has_been_attached__c'] == '')
            )
            {
                returnValue = true;
            }
            
            
            if(fieldlabel == 'Status' && obj.Product2['Category__c'] != 'Plan') {
                return true;
            }

			if(obj['Opportunity_Type__c'] == 'Renewal Local' &&  obj.Product2['Category__c'] == 'Plan' &&
			((fieldlabel == 'Custom Contract Code' && obj['Plan_Type__c']!='Standard' && obj['%vlocity_namespace%__ContractCode__c']!=null) 
            || (fieldlabel == 'Contract Code' && obj['Plan_Type__c']=='Standard') 
            || (fieldlabel == 'Contract Code' && obj['Plan_Type__c']!='Standard' && obj['%vlocity_namespace%__ContractCode__c']==null)  
            ||fieldlabel == 'Plan Type' || fieldlabel == 'Network' || fieldlabel == 'Co-Insurance' || fieldlabel == 'Deductible' || fieldlabel == 'HPCC Code' ||  fieldlabel == 'Single INN Provider Co-pay'))//GLD - 202.1- PRDCRM-56357-added Single INN Provider Copay
			{ 
                return true;
            }
            //GLD - 202.1- PRDCRM-56357 [Build] Creating and Displaying the Fields on Medical QLI (Single INN Provider Copay, Coinsurance, CC)
            //GLD - 202.2- [Build] Displaying the Fields on Medicalplan QLI (Plan type, Network, HPCC code,Deductible)
            if(
                obj.Product2['Category__c'] == 'Plan' && 
                obj['Opportunity_Type__c'] != 'Renewal Local' && 
                (
                    (fieldlabel == 'Custom Contract Code' && obj['Plan_Type__c']!='Standard' && obj['%vlocity_namespace%__ContractCode__c']!=null) 
                    || (fieldlabel == 'Contract Code' && obj['Plan_Type__c']=='Standard') 
                    || (fieldlabel == 'Contract Code' && obj['Plan_Type__c']!='Standard' && obj['%vlocity_namespace%__ContractCode__c']==null)  
                    || fieldlabel == 'Co-Insurance'  ||  fieldlabel == 'Single INN Provider Co-pay' ||  fieldlabel == 'Plan Type' ||  fieldlabel == 'Network' ||  fieldlabel == 'HPCC Code' ||  fieldlabel == 'Deductible' 
                )
            )
            { 
                return true;
            }  

			else if(bundleValue == 'Fixed' && fieldlabel == 'CPL Codes') {
                returnValue = true;
            } else if(
                bundleValue == 'Variable' && 
                    (
                        fieldlabel != 'A H&W package has been selected' &&
                        fieldlabel != 'A H&W package has not been selected yet' &&
                        fieldlabel != 'Contract Code' &&
                        fieldlabel != 'Plan Type' && 
                        fieldlabel != 'Network' && 
                        fieldlabel != 'Co-Insurance' && 
                        fieldlabel != 'Deductible' && 
                        fieldlabel != 'HPCC Code' &&
                        fieldlabel != 'Custom Contract Code' &&
                        fieldlabel != 'Single INN Provider Co-pay'
                    )
                ) 
                {
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

    $scope.changeFormat = function(obj){
        if((obj['Single_INN_provider_co_pay__c']).includes(',')){
            return true;
        }else{
            return false;
        }
    };

    /*$scope.getActWiseDisplayBackground = function(obj, actionName) {
        console.log("--- actionName="+actionName);
        var vstyle = "";
        var vstage = obj.ActWiseChildQuote__r.IC_ProductStage__c;
        var vcompletionMarker = obj.ActWiseChildQuote__r.CompletionMarker__c;
        var vplComplete = obj.ActWiseChildQuote__r.PLComplete__c;
        console.log("--- vstage="+vstage);
        console.log("--- vcompletionMarker="+vcompletionMarker);
        console.log("--- vplComplete="+vplComplete);
        if(vstage == 'Sold' && vcompletionMarker == 'Complete') {
            vstyle = 'background:green;color:white;';
        } else if(vstage == 'Lost' && vcompletionMarker == 'Complete') {
            vstyle = 'background:red;color:white;'
        }
        console.log("--- vstyle="+vstyle);

        return vstyle;
        
    };*/
    
}]);