vlocity.cardframework.registerModule.controller('my-multi-select-controller', ['$scope', '$timeout', '$q', '$rootScope', function($scope, $timeout, $q, $rootScope) {

$scope.clearSelections = function(control){
    var plans = control.propSetMap.options

    for(var i = 0; i < plans.length; i++){
        var plan = plans[i];

        if(!$scope.previous_selected){
            continue;
        }else{
            $scope.previous_selected = false
        }


    }
    

}

$scope.myMultiSelect = function(bpTree, scp, control, option){
        var plans = control.propSetMap.options
        
        if(control.name === "Non_Medical_Product_Type"){
            var bpChildren = bpTree.children
            var ap_family_selection_obj = {}
            var ap_family_selection_obj_children = []
            var eleArray_item_0 = {}
            var med_product = []

            angular.forEach(bpChildren, function(child, childIterator){
                if(child.name === "AP-FamilySelection"){
                    ap_family_selection_obj = child
                    ap_family_selection_obj_children = child.children
                }
            }); 

            angular.forEach(ap_family_selection_obj_children, function(ap_family_step, stepIterator){
                
                if(ap_family_step.eleArray[0].name === "Medical_ProductType"){
                    eleArray_item_0 = ap_family_step.eleArray[0]
                }
            }); 

            med_product = eleArray_item_0.response
            
            angular.forEach(med_product, function(product, productIterator){
                if(product.selected){
                    product.selected = false
                }
            }); 

        }
        
        


        if($scope.previous_selected){
            if($scope.previous_selected.value === option.value){
                $scope.CatSelection(bpTree);
                return;
            }
            $scope.CatSelection();
            $scope.previous_selected.selected = false;
            for(var i = 0; i < plans.length; i++){
                var plan = plans[i];

                if(plan.name === $scope.previous_selected.name){
                     control.propSetMap.options[i] = $scope.previous_selected
                }else{
                     continue;
                }


            }
        }
        $scope.CatSelection(bpTree);
        $scope.onMultiSelect(scp, control, option);
        $scope.previous_selected = option;
    
}

$scope.CatSelection = function(bpTree) {
   var preSelect = jQuery('#Situs_State_Abbrev').val();
  var anthementity = jQuery('#AnthemEntity_Abbrev').val();
  var labouracct =  "LaborAccounts";

//   bpTree.response.Situs_State = "NY"

//alert('Anthem Entity: '+anthementity);

  if(anthementity == 'Labor and Trust')
  {
//alert('Yes we are inside with: '+labouracct);

     setTimeout( function() {
            jQuery('#AP-MarketSelection[value='+labouracct+']').trigger('click').trigger('click').trigger('select').trigger('change');

            bpTree.response.Situs_State = labouracct;
            bpTree.response["AP-FamilySelection"]["AP-MarketSelection"] = labouracct;
            bpTree.response["AP-FamilySelection"]["AP-MarketSelectionFinalvlaue"] = labouracct;
            bpTree.response.AccountDetails.Situs_State_Abbrev = labouracct;

           }, 100);
        
     
  }
  else
  {
   if (preSelect && (anthementity != 'Labor and Trust')) 
   {

        setTimeout( function() {
           jQuery('#AP-MarketSelection[value='+preSelect+']').trigger('click').trigger('click').trigger('select').trigger('change');
        
            bpTree.response.Situs_State = preSelect;
            bpTree.response["AP-FamilySelection"]["AP-MarketSelection"] = preSelect;
            bpTree.response["AP-FamilySelection"]["AP-MarketSelectionFinalvlaue"] = preSelect;
            bpTree.response.AccountDetails.Situs_State_Abbrev = preSelect;
           
           
           }, 100);
    
    }
    }
    }

}]);