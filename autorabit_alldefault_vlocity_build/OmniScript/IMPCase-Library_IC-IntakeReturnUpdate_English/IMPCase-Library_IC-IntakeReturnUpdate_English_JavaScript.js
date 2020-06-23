baseCtrl.prototype.$scope.reasonSelection = function(selectedValue, index) {
   console.info(selectedValue);
   console.info(index);

   var NeedFinalizedBenefits = jQuery('#NeedFinalizedBenefitsFM').val();
   var BenefitDiscrepancies = jQuery('#BenefitDiscrepanciesFM').val();
   var DocumentsNotAttached = jQuery('#DocumentsNotAttachedFM').val();
   var RateClarification = jQuery('#RateClarificationFM').val();
   var OpportunityUpdate = jQuery('#OpportunityUpdateFM').val();
   var MismatchDocuments = jQuery('#MismatchDocumentsFM').val();
   var MismatchEffectiveDate = jQuery('#MismatchEffectiveDateFM').val();
   var ReturnRequestedBySales = jQuery('#ReturnRequestedBySalesFM').val();

   //var selectedValue = jQuery('#ImpReasons').val();
   if (selectedValue.value == NeedFinalizedBenefits || selectedValue.value == BenefitDiscrepancies || selectedValue.value == DocumentsNotAttached || selectedValue.value == RateClarification || selectedValue.value == OpportunityUpdate || selectedValue.value == MismatchDocuments || selectedValue.value == MismatchEffectiveDate || selectedValue.value == ReturnRequestedBySales) 
   {
       alert('Intake Reason: "' + selectedValue.value + '" has been already selected');
       selectedValue.name = null;
       selectedValue.value = null;
   }
  baseCtrl.prototype.$scope.$apply();

   //if (preSelect && flag==false) 
   //{
     //jQuery('input:radio[id=AP-MarketSelection][value=' + preSelect + ']').parent().addClass('itemSelected');
     //baseCtrl.prototype.$scope.bpTree.response['AP-FamilySelection']['AP-MarketSelectionTest'] = preSelect;
     //baseCtrl.prototype.$scope.$apply();
   //}
}