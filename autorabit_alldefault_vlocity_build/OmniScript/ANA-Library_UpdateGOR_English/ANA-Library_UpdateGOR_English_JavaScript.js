jQuery( function() { jQuery('body').on('change', '#Group', function() {
    var array = jQuery('#GroupNumberF');
    var slen =  array.length;
    console.log ("slen = " + slen);
    var sGroup = "";
    if (slen>0) {
       for (var i = 0; i <slen; i ++) {
         var sGroupF =  array.eq(i).val();
         console.log ("sGroupF = " + sGroupF);
          if (i <slen -1) {
               sGroup = sGroup + sGroupF + ',';
          }
         else {
            sGroup = sGroup + sGroupF ;
          }
       } 
     }
      console.log ("sGroup = " + sGroup);
      if ( sGroup != "" &&  sGroup != null){
           baseCtrl.prototype.$scope.bpTree.response.AccountGroupInfo.GroupNumber =sGroup;
           baseCtrl.prototype.$scope.$apply();
          $('#GroupNumber').val(baseCtrl.prototype.$scope.bpTree.response.AccountGroupInfo.GroupNumber).trigger('input').trigger('change');          
      }
 var scope = angular.element(jQuery('#Group')).scope(); 
             scope.$apply( function() { scope.selectValue = ''; })
}); });