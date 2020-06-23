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

jQuery( function() { jQuery('body').on('change', '#Financing', function()
           {
            if (jQuery('#Financing').val()=='JAA (Jointly Administered Arrangement)') {
                   jQuery('#FMHPUWReviewDefault').val('JAA - Not Applicable').change();
             }
            else {
                     jQuery('#FMHPUWReviewDefault').val(null).change(); 
                  }
              var scope = angular.element(jQuery('#FMHPUWReviewDefault')).scope(); 
             scope.$apply( function() { scope.selectValue = ''; }); }); });