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

jQuery( function() { jQuery('body').on('change', '#QLD-Financing', function()
  {
	var CatselectVal= jQuery('#ProductCategoryFormula').val();
	var productFamilyVal=jQuery('#ProductFamilyFormula').val();
	var financing = jQuery('#QLD-Financing').val();
	
	if (
			CatselectVal == 'Dental' && 
			productFamilyVal == 'Network Lease' && 
			(financing == 'JAA (Jointly Administered Arrangement)' || financing == 'MCS Network Rental')
		) {
		//jQuery('#QLD-Upsell').val('No').change();
		jQuery('#QLD-ProductTermYearsLeft').val('1').change();  
		jQuery("[id='QLD-RX Vendors']").val('Other').change(); 
					
	}
	else if(
			CatselectVal == 'JAA/MCS' && 
			(financing == 'JAA (Jointly Administered Arrangement)' || financing == 'MCS Network Rental')
		) {
			
		jQuery('#QLD-ProductTermYearsLeft').val('1').change();  
		jQuery("[id='QLD-RX Vendors']").val('Other').change(); 
	}
	else
	{
		jQuery('#QLD-Upsell').val('').change();   
		jQuery('#QLD-ProductTermYearsLeft').val('').change();  
		jQuery("[id='QLD-RX Vendors']").val('').change(); 
	} 
  }); 
});