vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
    
    var AddProductFlag = false;
    $scope.display_because_national_profile = false

    $scope.getDisplayActionsBasedonProfile = function(obj,actionname) {
        try {
            if(!obj.hasOwnProperty('LoggedInUserProfile__c')) {
                return true;
            }else{
                var profileValue = obj['LoggedInUserProfile__c'];
                var returnValue = true;
                if (obj['AnthemEntityTransform__c'] === 'National'){
                    $scope.display_because_national_profile = true
                }
                if(profileValue == 'Underwriting' || profileValue == 'View Info Only' || profileValue == 'Underwriting Dual' || profileValue == 'View Info Only Dual')
                    returnValue = false;
                //console.log("inside getDisplayActionsBasedonProfile - returnValue--> " + returnValue);
                console.log("@@@@@profileName" + profileValue);
                console.log("@@@@@actionName" + actionname);
               /* if(actionname == 'Capture Group Information' && (profileValue == 'Local Sales' || profileValue == 'Local Sales Dual' || profileValue == 'Local Implementations Dual' || profileValue == 'Local Implementations'))
                    {
                     console.log("@@@@@InsideIfprofilename" + profileValue);
                     console.log("@@@@@InsideIfactionname" + actionname);   
                    returnValue = false;
                    }*/
            return returnValue;
            }
        } catch(e) {
            console.log("--- error getDisplayActionsBasedonProfile="+ e);
        }
    };

    $scope.getDisplayActions = function(obj, actionName) 
	{
        console.log("@@@@@profileName123" + actionName);
        var AccountSitusState = obj.Account['Situs_State_Abbrev__c'];
        var profile = obj['LoggedInUserProfile__c'];
        var RecordType = obj.Opportunity['RecordTypeName__c'];
        var OpportunityEffectiveDate = obj.Opportunity['CloseDate'];
        var flag = OpportunityEffectiveDate < '2020-01-01';
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

        console.log('### actionName : '+actionName);
        console.log('### AccountSitusState : '+AccountSitusState);
        console.log('### IsPartOfAMigration : '+IsPartOfAMigration);
        console.log('### RecordType : '+RecordType);
        console.log('### ClaimSystem : '+ClaimSystem);
        console.log('### threeState.includes(AccountSitusState) : '+threeState.includes(AccountSitusState));
        console.log('### sixState.includes(AccountSitusState) : '+sixState.includes(AccountSitusState));
      /*  console.log('### opportunityRecordTypes.includes(RecordType) : '+opportunityRecordTypes.includes(RecordType));*/
        /*if(actionName == 'Capture Group Information' && (profile == 'Local Sales' || profile == 'Local Sales Dual' || profile == 'Local Implementations Dual' || profile == 'Local Implementations' || profile == 'Specialty Post Sales' || profile == 'Specialty Post Sales Dual' || profile == 'Specialty' || profile == 'Specialty Dual'))
        {
            console.log("$$$$$$InsideIfprofilename" + profile);
            console.log("$$$$$$InsideIfactionname" + actionName);   
            return false;
        }*/
        if(actionName == 'Capture Group Information' && (profile == 'GRS' || profile == 'GRS Dual') && (RecordType !=='GRS In Group Add Product' || RecordType !=='GRS In Group Change' || RecordType !=='GRS New Business' || RecordType !=='GRS Renewal'))
        {
            console.log("$$$$$$InsideIfprofilename" + profile);
            console.log("$$$$$$InsideIfactionname" + actionName);   
            return false;
        }else if(actionName == 'Capture Group Information' && (profile == 'Local Sales' || profile == 'Local Sales Dual' || profile == 'Local Implementations Dual' || profile == 'Local Implementations' || profile == 'Specialty Post Sales' || profile == 'Specialty Post Sales Dual' || profile == 'Specialty' || profile == 'Specialty Dual'))
        {
            console.log("$$$$$$InsideIfprofilename" + profile);
            console.log("$$$$$$InsideIfactionname" + actionName);   
            return false;
        }
		/*if(actionName == 'Group Number Request')
        {
             console.log('@@@CGIEnter' + actionName);
            return true;
        }*/
         

        console.log('### Check : '+(IsPartOfAMigration == null || IsPartOfAMigration == '' || IsPartOfAMigration == "") );
        var MigrationFlag = (IsPartOfAMigration == null || IsPartOfAMigration == '' || IsPartOfAMigration == "");
        console.log('### MigrationFlag : '+MigrationFlag);
        console.log('### AddProductFlag : '+AddProductFlag);
         console.log('### Flag : '+flag);
        console.log('@@@CGIEnter' + actionName);
         
      /*  if( actionName == 'AddProduct_LG' 
		    && (IsPartOfAMigration == 'No' || IsPartOfAMigration == '' ) 
		    && ClaimSystem != 'WGS 2.0' 
		    && opportunityRecTypes_NonMigrating_NonWGS.includes(RecordType))
		{	
			return true;			
		}*/

            /*Changed as part of 38774 (Gladiators)*/
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

        if( (actionName == 'CollabToolApplication') && obj['IsGroupNumberExist__c']==true &&
            (IsPartOfAMigration == 'Yes' || IsPartOfAMigration =='TRUE') && 
            (obj.GroupNumber__r['Date_Migrated_to_WGS__c'] == obj.Opportunity['CloseDate']) && 
            (RecordType == 'Renewal Local' )
        )  
        {
            return true;
        }

        if(actionName != 'AddPlanProductLG_P2A' && actionName != 'AddProduct_LG' && actionName != 'CollabToolApplication')
        {
            return true;
        }

        

        if(actionName == 'Generate Implementation Case LG' && (profileValue == 'Specialty Post Sales' || profileValue == 'Specialty Dual' || profileValue == 'Specialty' || profileValue == 'SFDC Program Management' || profileValue == 'Local Implementations Dual' || profileValue == 'Local Implementations' || profileValue == 'Local Sales' || profileValue == 'Local Sales Dual' || profileValue=='System Administrator' || profileValue=='API User' || profileValue=='SME' || profileValue=='SME Dual' || profileValue == 'Specialty Post Sales Dual' || profileValue=='Underwriting' || profileValue=='Underwriting Dual' ))
        {
            returnValue = true;
        }
//Plan Update Action - PRDCRM- 41009 

        if( 
            actionName == 'Plan Update' 
            && 
            (
                profileValue == 'Specialty Post Sales'
                || profileValue == 'Specialty Post Sales Dual'  
                || profileValue == 'Specialty Dual' 
                || profileValue == 'Specialty' 
                || profileValue == 'Local Implementations Dual' 
                || profileValue == 'Local Implementations' 
                || profileValue == 'Local Sales' 
                || profileValue == 'Local Sales Dual' 
                || profileValue == 'System Administrator' 
            )
        )
        {
            returnValue = true;
        }

    //Create CEP Case - PRDCRM-50823 - GLD - 201.2

        if( 
            actionName == 'Create CEP Case' 
            && 
            (
                profileValue == 'Specialty Post Sales'
                || profileValue == 'Specialty Post Sales Dual'  
                || profileValue == 'Specialty Dual' 
                || profileValue == 'Specialty' 
                || profileValue == 'Local Implementations Dual' 
                || profileValue == 'Local Implementations' 
                || profileValue == 'Local Sales' 
                || profileValue == 'Local Sales Dual' 
                || profileValue == 'System Administrator' 
                || profileValue == 'SME'
                || profileValue == 'SME Dual'
                || profileValue == 'SFDC Program Management'
            )
        )
        {
            returnValue = true;
        }
    };

}]);