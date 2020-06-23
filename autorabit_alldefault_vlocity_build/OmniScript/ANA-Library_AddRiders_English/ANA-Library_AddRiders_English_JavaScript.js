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
		var ProductStage = jQuery('#ProductStage').val()
		if (ProductStage =='Dead' || ProductStage =='Lost' || ProductStage == 'IGAP Dead' || ProductStage == 'IGAP Lost') 
		{
			jQuery('#Probability').val('0%').change();
		}
		else if(ProductStage =='In Progress' || ProductStage =='IGAP In Progress') 
		{
			jQuery('#Probability').val('10%').change(); 
		}
		else if(ProductStage == 'Sold' || ProductStage == 'IGAP Sold' || ProductStage == 'Renewed' || ProductStage == 'Termed') 
		{
			jQuery('#Probability').val('100%').change(); 
		}
		else
		{
			jQuery('#Probability').val('0%').change();
		}
		var scope = angular.element(jQuery('#Probability')).scope(); 
		scope.$apply( function() { scope.selectValue = ''; }); 
	}); });