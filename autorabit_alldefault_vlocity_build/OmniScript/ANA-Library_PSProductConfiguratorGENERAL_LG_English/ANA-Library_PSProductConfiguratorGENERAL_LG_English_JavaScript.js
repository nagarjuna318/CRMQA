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
    $("#Benefit_Period").change(function(){
         var benefitperiod= jQuery('#Benefit_Period').val();
     if(benefitperiod != 'Plan Year'){
        jQuery('#Benefit_Year_Plan_Date').val('').trigger('change');
      }
    });
})