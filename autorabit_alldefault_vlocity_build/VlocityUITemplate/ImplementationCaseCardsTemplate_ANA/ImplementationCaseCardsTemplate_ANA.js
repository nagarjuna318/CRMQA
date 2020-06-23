vlocity.cardframework.registerModule.controller('anthemActionsController', ['$scope', function($scope){
$scope.display_because_national_profile = false
$scope.getDisplayActionsBasedonProfile = function(obj, actionname) {
	var returnValue = false;
	
	
	try {
		
		if(!obj.hasOwnProperty('LoggedInUserProfile__c')) 
		{
			returnValue = true;				
		}		
		else
		{
			console.log("Test 4");
			console.log("actionname" + actionname);
		
			try {
			var profileValue = obj['LoggedInUserProfile__c'];
			var ImplementationStatus = obj['Implementation_Status__c'];
			var AccountGroupSize = obj['Account_Group_Size__c'];
			var ClaimSystem= obj['Claim_system__c'];
			var ImplementationType = obj['Implementation_Type__c'];
			var CustomerMaster=obj['Customer_Master_Account__c'];
			var AutomationEligible=obj['Automation_Eligible__c'];
			var Fundingquestion=obj['Are_there_changes_to_Enrollment_Billing__c'];
			var Cobquestion =obj['Are_there_changes_to_COB__c'];
			var Eligibilityquestion = obj['Are_there_changes_to_Eligibility__c'];
			var Inprogresscount = obj['Revision_Status_InProgress__c'];
			var Pendingcount = obj['Revision_Status_Pending__c'];
			var AretheychangesBH = obj['Are_there_Changes_to_Behav_Health__c'];
			var Readycount = obj['Revision_Status_Ready__c'];
			var Salessupport = obj['SalesSupportEdit__c'];
			var AnthemEntity = obj['Anthem_Entity__c'];
			var recordTypeValue = obj.RecordType['Name'];
			var isAdminChecked = obj['Intake_Type_Admin_Change__c']; // Changed By: Gladiators - PRDCRM- 43330
			//Added By : Panthers- PRDCRM-44233
            var loadGroupStatus = null;
            var implTracking = obj.Implementations_Tracking__r;
			// added by : Synthesis - PRDCRM2-106
			var approvedByGroup = obj['Approved_by_Group__c'];

			if (obj['Anthem_Entity__c'].includes('National')){
                    $scope.display_because_national_profile = true
                }
				          
            if(implTracking != null || implTracking != undefined)
            {
                var implTrackingRecords = obj.Implementations_Tracking__r['records'];
                if(implTrackingRecords!=null && implTrackingRecords.length >0){
                    loadGroupStatus = implTrackingRecords[0].Load_Group_Status__c;
                }
            }
           //Added By : Panthers- PRDCRM-44233
			/*
			console.log("ImplementationStatus " + ImplementationStatus);
			console.log("COBQ " + Cobquestion);
			console.log("EligibilityQ " + Eligibilityquestion);
			console.log("FundingQ " + Fundingquestion);
			console.log("ClaimSystem " + ClaimSystem);
			console.log("ImplementationType " + ImplementationType);
			console.log("Inprogresscount " + Inprogresscount);
			console.log("AccountGroupSize"+ AccountGroupSize);
			console.log('AretheychangesBH'+ AretheychangesBH);
			console.log("approve by group:" + approvedByGroup);
			console.log("recordTypeValue:" + recordTypeValue);
			*/

				if(
					actionname== 'Impacted Product' 
					&& 
					(
						profileValue == 'Local Sales' || profileValue == 'Local Sales Dual' || 
						profileValue=='System Administrator' || profileValue=='Specialty' || profileValue=='Specialty Dual' ||
						profileValue == 'Local Implementations' || profileValue == 'Local Implementations Dual' ||
						profileValue == 'SME' || profileValue == 'SME Dual' || profileValue == 'Specialty Post Sales' ||
						profileValue == 'Specialty Post Sales Dual' || profileValue == 'Underwriting' || profileValue == 'Underwriting Dual'
					)
					&& 
					(AnthemEntity== 'Local/Large Group' || AnthemEntity== 'Labor and Trust')
					&&
					ImplementationStatus == 'Initiated'
					&& //changed as part of PRDCRM-36898 (Show Impacted product action only for change request off cycle)
					((ImplementationType == 'Change Request Off Cycle' && isAdminChecked == false) || ImplementationType == 'Full Group Term') // isAdminChecked added by Gladiators PRDCRM-43330
				)
				{
						 returnValue = true;
				}
				if(actionname == 'Reserve Contract Code' && (ImplementationStatus == 'Ready for Imps' ) && (ImplementationType == 'Change Request Off Cycle' ||ImplementationType == 'New Business' || ImplementationType == 'Renewal') && (profileValue=='Local Implementations' || profileValue=='Local Implementations Dual'|| profileValue=='Specialty Post Sales' || profileValue=='System Administrator'  || profileValue=='Specialty Post Sales Dual'||((profileValue == 'Local Sales' || profileValue == 'Local Sales Dual') && AnthemEntity== 'Labor and Trust' && ImplementationStatus == 'Ready for Imps'))&& (AnthemEntity== 'Local/Large Group' || AnthemEntity== 'Labor and Trust'))
				{
					returnValue = true;//developed as a part of PRDCRM-39841
				}

				if(actionname == 'CaptureImplementationDetails' && ((ImplementationStatus == 'Initiated'|| ImplementationStatus == 'Pending Response from AE')&&(profileValue == 'National Sales' || profileValue == 'Local Sales' || profileValue == 'National Sales Dual' || profileValue == 'Local Sales Dual' || profileValue=='System Administrator' || ((profileValue=='Specialty' || profileValue=='Specialty Post Sales' || profileValue=='Specialty Post Sales Dual') && (AnthemEntity== 'Local/Large Group' || AnthemEntity== 'Labor and Trust')))))
				{
					console.log("Test 5");
					returnValue = false;
				}
				if(actionname == 'Submit Implementation Case'  && (ImplementationStatus == 'Initiated'|| ImplementationStatus == 'Pending Response from AE') && (profileValue == 'National Sales' || profileValue == 'Local Sales' || profileValue == 'National Sales Dual' || profileValue == 'Local Sales Dual' || profileValue=='System Administrator' || profileValue=='Specialty' || profileValue=='Specialty Post Sales Dual' || profileValue=='Specialty Post Sales'  || profileValue=='Specialty Dual'))
				{
					returnValue = true;
				}
				if(actionname == 'Submit Implementation Case' && (ImplementationStatus == 'Initiated'|| ImplementationStatus == 'Pending Response from AE') && (profileValue == 'SME' || profileValue == 'SME Dual' ) && ImplementationType == 'Project' )
				{
					returnValue = true;
				}
				if(actionname == 'Submit Implementation Case LG'  && (ImplementationStatus == 'Initiated'|| ImplementationStatus == 'Pending Response from AE') 
					&& (profileValue == 'National Sales' || profileValue == 'Local Sales' || profileValue == 'National Sales Dual' 
						|| profileValue == 'Local Sales Dual' || profileValue=='System Administrator' || profileValue=='Specialty' 
						|| profileValue=='Specialty Dual' ) //Removed access to 'Specialty Post Sales' and 'Specialty Post Sales Dual'. changed by gladiators for PRDCRM-40121
					)
				{
				returnValue = true;
				}

				if(actionname == 'Cancel Implementation Case'  && (ImplementationStatus == 'Initiated') && (profileValue == 'National Sales' 
						|| profileValue == 'National Sales Dual' 
						|| profileValue=='System Administrator' 
						|| profileValue=='Specialty' 
						|| profileValue=='Specialty Post Sales Dual' 
						|| profileValue=='Specialty Post Sales'  
						|| profileValue=='Specialty Dual'))
				{
					returnValue = true;
				}



				if(actionname == 'Submit Implementation Case LG' && (ImplementationStatus == 'Initiated'|| ImplementationStatus == 'Pending Response from AE') && (profileValue == 'SME' || profileValue == 'SME Dual' ) && ImplementationType == 'Project' )
				{
					returnValue = true;
				}
				if(actionname == 'Intake Return' && ImplementationType!='Project' && (ImplementationStatus == 'Ready for Imps' &&(profileValue == 'National Implementations' || profileValue == 'Local Implementations' || profileValue == 'National Implementations Dual' || profileValue == 'Local Implementations Dual'|| profileValue=='System Administrator' || profileValue=='Specialty Post Sales' || profileValue=='Specialty Post Sales Dual'||((profileValue == 'Local Sales' || profileValue == 'Local Sales Dual') && AnthemEntity== 'Labor and Trust' && ImplementationStatus == 'Ready for Imps'))))
				{
					returnValue = true;
				}
				if(actionname == 'CreateAPR' && ImplementationType!='Project' 
				&& ImplementationStatus !='RFP Review Finalized' 
				&& ImplementationStatus !='Initiated'
				&& ImplementationStatus !='Canceled'
				&& ((profileValue == 'Local Implementations' || profileValue == 'National Implementations' || profileValue == 'National Implementations Dual' || profileValue == 'Local Implementations Dual' || profileValue=='System Administrator'||((profileValue == 'Local Sales' || profileValue == 'Local Sales Dual') && AnthemEntity== 'Labor and Trust' && ImplementationStatus == 'Ready for Imps'))))
				{
				  console.log("Create Alphanumeric Prefix Request");
				  returnValue = true;
				}
				
				
				if(	actionname == 'COB' && !(ImplementationStatus == 'Canceled' )
	&& (	ImplementationType == 'New Business' 
			|| (ImplementationType == 'Renewal' && Cobquestion =='Yes') 
			|| (ImplementationType == 'Change Request Off Cycle' && Cobquestion =='Yes')
	   ) 
	&& (	profileValue == 'National Sales' 
			|| profileValue == 'National Sales Dual' 
			|| profileValue=='System Administrator' 
	   ) 
	 && (	ClaimSystem =='WGS 2.0' 
	 		|| ClaimSystem =='NASCO'
	 	)
  )
{
	returnValue = true;
}

if (actionname == 'Eligibility' && !(ImplementationStatus == 'Canceled' )
&& (	ImplementationType == 'New Business' 
		|| (ImplementationType == 'Renewal' && Eligibilityquestion =='Yes') 
		|| (ImplementationType == 'Change Request Off Cycle' && Eligibilityquestion =='Yes')
   )
&& (	profileValue == 'National Sales' 
		|| profileValue == 'National Sales Dual' 
   )
&& (ClaimSystem =='WGS 2.0' || ClaimSystem =='NASCO')  
)
{
returnValue = true;
}		

if (actionname == 'Funding' && !(ImplementationStatus == 'Canceled' )
&& (	ImplementationType == 'New Business' 
		|| (ImplementationType == 'Renewal' && Fundingquestion =='Yes') 
		|| (ImplementationType == 'Change Request Off Cycle' && Fundingquestion =='Yes')
   )
&& (	profileValue == 'National Sales' 
		|| profileValue == 'National Sales Dual' 
   )
&& (ClaimSystem =='WGS 2.0') 
)
{
returnValue = true;
}	


if (actionname == 'Behavioral Health' && !(ImplementationStatus == 'Canceled' )
&& (	ImplementationType == 'New Business' 
		|| (  (  ImplementationType == 'Renewal' 
		         || ImplementationType == 'Change Request Off Cycle' 
              )  
			  &&
			  AretheychangesBH =='Yes - See Behavioral Health Related List For Changes'
           )  
   )
&& (	profileValue == 'National Sales' 
		|| profileValue == 'National Sales Dual' 
		|| profileValue=='System Administrator' 
   )
&& (ClaimSystem =='WGS 2.0') 
)
{
returnValue = true;
}	

				
				if(actionname == 'Revision' && (ImplementationStatus == 'Pending SME Review' || ImplementationStatus == 'Approved' || ImplementationStatus== 'RFP Review Finalized') && (Inprogresscount===0 && Pendingcount ===0 && Readycount===0) && (profileValue != 'SME' && profileValue != 'SME Dual'))
				{
					 returnValue = true;
				}
				
				
				if(actionname == 'Initiate SME Engagement' 
					&& 	ImplementationStatus !='RFP Review Finalized'
					&& 	ImplementationStatus !='Initiated'
					&& 	ImplementationStatus !='Canceled'
					&& (profileValue == 'National Implementations' || profileValue == 'National Implementations Dual' || profileValue == 'System Administrator'))
				{
					returnValue = true;
				}
          		if(actionname == 'Upload Documents' && (recordTypeValue == 'LG Local and National Renewals ReadOnly' || recordTypeValue == 'LG Renewals' || recordTypeValue == 'LG Full Group Term' || recordTypeValue == 'LG Full Group Term ReadOnly' || recordTypeValue == 'LG Renewal Lock'  || recordTypeValue == 'LG Renwal Unlock' || recordTypeValue == 'LG Change Request Off Cycle Unlock' || recordTypeValue == 'LG Local and National Change Request Off Cycle ReadOnly' || recordTypeValue == 'LG Change Request Off Cycle' || recordTypeValue == 'LG Change Request Off Cycle Lock' || recordTypeValue == 'LG New Business' || recordTypeValue == 'LG New Business ReadOnly' ||  recordTypeValue == 'LG New Business Unlock' || recordTypeValue == 'LG New Business Lock' || recordTypeValue == 'LG Local and National Pre Work ReadOnly' || recordTypeValue == 'LG Pre Work' || recordTypeValue == 'LG Pre Work Lock'|| recordTypeValue == 'LG Pre Work Unlock' || recordTypeValue == 'LG Labor and Trust') &&  (profileValue == 'Local Sales' || profileValue == 'Local Sales Dual' || profileValue=='System Administrator' || profileValue=='Specialty' || profileValue == 'Specialty Dual' || profileValue == 'Specialty Post Sales' || profileValue=='Specialty Post Sales Dual' || profileValue=='Local Implementation' || profileValue=='Local Implementation Dual'|| profileValue=='SME'|| profileValue=='SME Dual' ||((profileValue == 'Local Sales' || profileValue == 'Local Sales Dual') && AnthemEntity== 'Labor and Trust' && ImplementationStatus == 'Ready for Imps')) && (ImplementationStatus == 'Ready for Imps' || ImplementationStatus == 'Pending SME Review' || ImplementationStatus == 'Pending Response from AE' || ImplementationStatus == 'Revision Pending Response from Sales/Account Management' || ImplementationStatus == 'Approved'|| ImplementationStatus == 'Initiated'|| ImplementationStatus == 'Revision Pending Implementations Review'))   
				{
                    returnValue = true;
                }
				if(actionname == 'Load Group' && (AutomationEligible == true  && (recordTypeValue != "LG New Business" || (recordTypeValue == 'LG New Business' && approvedByGroup == true))) && (ImplementationType == 'Change Request Off Cycle' || ImplementationType == 'New Business') && (loadGroupStatus == null || loadGroupStatus!='Successfully Submitted to Customer Master') && (profileValue == 'Specialty Post Sales' || profileValue == 'API User' || profileValue == 'SFDC Program Management' || profileValue == 'Local Implementations Dual' || profileValue == 'Local Implementations' || profileValue=='System Administrator'|| profileValue=='Specialty Post Sales Dual' ||((profileValue == 'Local Sales' || profileValue == 'Local Sales Dual') && AnthemEntity== 'Labor and Trust' && ImplementationStatus == 'Ready for Imps'))) //Changed By : Panthers- PRDCRM-44233
                {
                    returnValue = true;
                }
				
				if(actionname == 'Final Rate Sheet Upload' && (recordTypeValue == 'LG Local and National Renewals ReadOnly' || recordTypeValue == 'LG Renewals' || recordTypeValue == 'LG Renewal Lock'  || recordTypeValue == 'LG Renwal Unlock' || recordTypeValue == 'LG Change Request Off Cycle Unlock' || recordTypeValue == 'LG Local and National Change Request Off Cycle ReadOnly' || recordTypeValue == 'LG Change Request Off Cycle' || recordTypeValue == 'LG Change Request Off Cycle Lock' || recordTypeValue == 'LG New Business' || recordTypeValue == 'LG New Business ReadOnly' ||  recordTypeValue == 'LG New Business Unlock' || recordTypeValue == 'LG New Business Lock' || recordTypeValue == 'LG Local and National Pre Work ReadOnly' || recordTypeValue == 'LG Pre Work' || recordTypeValue == 'LG Pre Work Lock'|| recordTypeValue == 'LG Pre Work Unlock' || recordTypeValue == 'LG Labor and Trust') &&  (profileValue == 'Underwriting' || profileValue == 'Underwriting Dual' || profileValue=='System Administrator' || profileValue=='Local Implementations' || profileValue=='Local Implementations Dual' || profileValue=='Specialty' || profileValue=='Specialty Dual' ||((profileValue == 'Local Sales' || profileValue == 'Local Sales Dual') && AnthemEntity== 'Labor and Trust' && ImplementationStatus == 'Ready for Imps')))   
				{
                    returnValue = true;
                }
				if(actionname == 'Account Structure Questionnaire' && ( AutomationEligible== true ) && (ImplementationType == 'Change Request Off Cycle' || ImplementationType == 'New Business') &&  (profileValue=='System Administrator' || profileValue=='Local Implementations' || profileValue=='Local Implementations Dual'|| profileValue=='Specialty Post Sales Dual' || profileValue=='Specialty Post Sales' || profileValue=='SFDC Program Management' || profileValue=='API User'||((profileValue == 'Local Sales' || profileValue == 'Local Sales Dual') && AnthemEntity== 'Labor and Trust' && ImplementationStatus == 'Ready for Imps'))) 
				{
                	if(approvedByGroup == true){
                    	returnValue = false;
					}else{
                    	returnValue = true;
					}
                }
				
			   /*
				if(actionname == 'Initiate SME Key Acc' && ImplementationStatus !='RFP Review Finalized'&& profileValue=='Local Sales' && AccountGroupSize == '51 - 99')
				{
					returnValue = true;
				}*/
			} catch(e) {
				console.log('--- error '+e);
			}
		}
	} catch(e2) {
		console.log("--- error e2="+ e2);
	}
	console.log("returnValue " + returnValue);
	return returnValue;
};

}]);