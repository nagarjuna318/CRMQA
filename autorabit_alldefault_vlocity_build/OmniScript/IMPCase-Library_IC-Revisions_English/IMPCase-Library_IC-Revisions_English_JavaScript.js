jQuery( function() { jQuery('body').on('change', '#RevisionType', function()
{
   var newRevisionType = jQuery('#RevisionType').val();
   var newRevisionReason =  jQuery('#RevisionReason').val();
    var sCombined = newRevisionType +  newRevisionReason;
  //alert ("newRevisionType " + newRevisionType);
   //alert ("newRevisionReason " + newRevisionReason);
   var slength = baseCtrl.prototype.$scope.bpTree.response.RevisionsReasons.RevisionBlock.length;
  //alert ("slength = " + slength );  
   var svalue ='';
  var sCount = 0;
     for (i=0; i < slength; i++) {
     svalue =  baseCtrl.prototype.$scope.bpTree.response.RevisionsReasons.RevisionBlock[i].RevisionType + baseCtrl.prototype.$scope.bpTree.response.RevisionsReasons.RevisionBlock[i].RevisionReason
     if (sCombined == svalue) {
          sCount = sCount + 1;
   }

}
 //alert("sCount " + sCount );
   if (sCount >1){
      jQuery('#Text1').val('Yes') .change();
    }
else
{
  jQuery('#Text1').val('') .change();
}
    var scope = angular.element(jQuery('#RevisionType')).scope(); 
      scope.$apply( function() { scope.selectValue = ''; }); }); });



jQuery( function() { jQuery('body').on('change', '#RevisionReason', function()
{
   console.log("Triggered");
   var newRevisionType = jQuery('#RevisionType').val();
   var newRevisionReason =  jQuery('#RevisionReason').val();
    var sCombined = newRevisionType +  newRevisionReason;
  //alert ("newRevisionType " + newRevisionType);
   //alert ("newRevisionReason " + newRevisionReason);
   var slength = baseCtrl.prototype.$scope.bpTree.response.RevisionsReasons.RevisionBlock.length;
  //alert ("slength = " + slength );  
   var svalue ='';
  var sCount = 0;
     for (i=0; i < slength; i++) {
     svalue =  baseCtrl.prototype.$scope.bpTree.response.RevisionsReasons.RevisionBlock[i].RevisionType + baseCtrl.prototype.$scope.bpTree.response.RevisionsReasons.RevisionBlock[i].RevisionReason
     if (sCombined == svalue) {
          sCount = sCount + 1;
   }

}
 //alert("sCount " + sCount );
   if (sCount >1){
      jQuery('#Text1').val('Yes') .change();
    }
else
{
  jQuery('#Text1').val('') .change();
}

    var scope = angular.element(jQuery('#RevisionReason')).scope(); 
     scope.$apply( function() { scope.selectValue = ''; }); }); });