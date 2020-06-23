function hideSetValues(){
    console.info("hideSetValues");
    var el = document.getElementById('ConfigureProgramSetValues');
    el.setAttribute('style', 'display:none !important');
}

function showSetValues(){
    console.info("showSetValues");
    var el = document.getElementById('ConfigureProgramSetValues');
    el.setAttribute('style', 'display:flex !important');
}

$(document).ready(function(){
    $("#AP-ProductSelection_prevBtn").click(function(){
     var scope = angular.element("#searchvariablefield").scope();
      scope.searchvariablefield = '';
    });
})

var flag=false;

    baseCtrl.prototype.$scope.CatSelection = function() {
   var preSelect = jQuery('#Situs_State_Abbrev').val();
  var anthementity = jQuery('#AnthemEntity_Abbrev').val();
  var labouracct =  "LaborAccounts";

//alert('Anthem Entity: '+anthementity);

  if(anthementity == 'Labor and Trust')
  {
//alert('Yes we are inside with: '+labouracct);

     setTimeout( function() {
jQuery('#AP-MarketSelection[value='+labouracct+']').trigger('click').trigger('click').trigger('select').trigger('change');
           }, 250);
        
     
  }
  else
  {
   if (preSelect && (anthementity != 'Labor and Trust')) 
   {
//alert('NO NO NO  we areNoT inside for Anthem Entity: '+anthementity);

        setTimeout( function() {
           jQuery('#AP-MarketSelection[value='+preSelect+']').trigger('click').trigger('click').trigger('select').trigger('change');
           }, 250);
    }
    }
    }

	jQuery( function() { jQuery('body').on('change', '#ProductStage', function()
                  {
					var ProductStage = jQuery('#ProductStage').val();
                    var CatselectVal= jQuery('#AP-CatSelection').val();
                    var productFamilyVal=jQuery('#AP-ProductFamilySelection_Val').val();
					var financing = jQuery('#QLD-Financing').val();
					//alert ("financing:"+financing);

					if (ProductStage =='Dead' || ProductStage =='Lost' || ProductStage == 'IGAP Dead' || ProductStage == 'IGAP Lost' ||ProductStage == 'Declined to Quote' ||ProductStage == 'Termed') 
					{
									  jQuery('#Probability').val('0%').change();
									  jQuery('#QLD-Upsell').val('').change();
					}
					else if(ProductStage =='In Progress' || ProductStage =='IGAP In Progress') 
					{
									  jQuery('#Probability').val('10%').change();
									  jQuery('#QLD-Upsell').val('').change();
					}
					else if(ProductStage == 'Jeopardy') 
					{
									  jQuery('#Probability').val('50%').change();
									  jQuery('#QLD-Upsell').val('').change();
					}
					else if(ProductStage == 'Sold' || ProductStage == 'IGAP Sold' || ProductStage == 'Not renewing in Current Period') 
					{
									  jQuery('#Probability').val('100%').change();
									  jQuery('#QLD-Upsell').val('').change();
					}
					else if(ProductStage == 'Renewed' && (CatselectVal == 'JAA/MCS' || productFamilyVal == 'Network Lease'))
					{
								  jQuery('#Probability').val('100%').change();
								  if(CatselectVal == 'JAA/MCS')
								  {
								    jQuery('#QLD-Upsell').val('No').change();	
								  }	
                                  else if(productFamilyVal == 'Network Lease' && (financing == 'JAA (Jointly Administered Arrangement)' || financing == 'MCS Network Rental'))
								  {
									jQuery('#QLD-Upsell').val('No').change();  
								  }
																  
					}
					else if(ProductStage == 'Renewed' && CatselectVal !='JAA/MCS' ) 
					{
								 jQuery('#Probability').val('100%').change();
								  jQuery('#QLD-Upsell').val('').change(); 
					}
					else
					{
									  jQuery('#Probability').val('0%').change();
									  jQuery('#QLD-Upsell').val('').change();
					}
					var scope = angular.element(jQuery('#Probability')).scope(); 
					scope.$apply( function() { scope.selectValue = ''; }); 
                  }
				 
); });
 jQuery( function() { jQuery('body').on('change', '#QLD-Financing', function()
                  {
					var ProductStage = jQuery('#ProductStage').val();
                    var CatselectVal= jQuery('#AP-CatSelection').val();
                    var productFamilyVal=jQuery('#AP-ProductFamilySelection_Val').val();
					var financing = jQuery('#QLD-Financing').val();
					
                    if (CatselectVal == 'Dental' && productFamilyVal == 'Network Lease' && (financing == 'JAA (Jointly Administered Arrangement)' || financing == 'MCS Network Rental'))
					{
									//jQuery('#QLD-Upsell').val('No').change();  
									jQuery('#Benefit_Period').val('Benefit Year').change();  
									jQuery('#QLD-ProductTermYearsLeft').val('1').change();  
									jQuery("[id='QLD-RX Vendors']").val('Other').change();
									
					}
					
					else
					{
									//jQuery('#QLD-Upsell').val('').change(); 
									jQuery('#Benefit_Period').val('').change();  
									jQuery('#QLD-ProductTermYearsLeft').val('').change();  
                                                                        jQuery("[id='QLD-RX Vendors']").val('').change();
					}
					
                  }
); });