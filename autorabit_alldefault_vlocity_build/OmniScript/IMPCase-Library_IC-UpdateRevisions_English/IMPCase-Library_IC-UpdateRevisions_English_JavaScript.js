jQuery( function() { jQuery('body').on('change', '#RevisionType', function()
{
   var newRevisionType = jQuery('#RevisionType').val();
   var newRevisionReason =  jQuery('#RevisionReasons').val();
    var sCombined = newRevisionType +  newRevisionReason;
  //alert ("newRevisionType " + newRevisionType);
   //alert ("newRevisionReason " + newRevisionReason);
   var slength = baseCtrl.prototype.$scope.bpTree.response.AddRevisionReasons.RevisionBlock.length;
  //alert ("slength = " + slength );  
   var svalue ='';
  var sCount = 0;
     for (i=0; i < slength; i++) {
     svalue =  baseCtrl.prototype.$scope.bpTree.response.AddRevisionReasons.RevisionBlock[i].RevisionType + baseCtrl.prototype.$scope.bpTree.response.AddRevisionReasons.RevisionBlock[i].RevisionReasons
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



jQuery( function() { jQuery('body').on('change', '#RevisionReasons', function()
{
   console.log("Triggered");
   var newRevisionType = jQuery('#RevisionType').val();
   var newRevisionReason =  jQuery('#RevisionReasons').val();
    var sCombined = newRevisionType +  newRevisionReason;
  //alert ("newRevisionType " + newRevisionType);
   //alert ("newRevisionReason " + newRevisionReason);
   var slength = baseCtrl.prototype.$scope.bpTree.response.AddRevisionReasons.RevisionBlock.length;
  //alert ("slength = " + slength );  
   var svalue ='';
  var sCount = 0;
     for (i=0; i < slength; i++) {
     svalue =  baseCtrl.prototype.$scope.bpTree.response.AddRevisionReasons.RevisionBlock[i].RevisionType + baseCtrl.prototype.$scope.bpTree.response.AddRevisionReasons.RevisionBlock[i].RevisionReasons
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

    var scope = angular.element(jQuery('#RevisionReasons')).scope(); 
     scope.$apply( function() { scope.selectValue = ''; }); }); });