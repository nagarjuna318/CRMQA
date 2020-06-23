vlocity.cardframework.registerModule.controller('med-multi-select-controller', ['$scope', '$timeout', '$q', '$rootScope', function($scope, $timeout, $q, $rootScope) {

$scope.medMultiSelect = function(bpTree, scp, control, option){
        // var plans = control.propSetMap.options
        // $scope.onMultiSelect(scp, control, option);
        // $scope.previous_selected = option;
        
        // if(option.selected){
        //     option.selected = false
        // }


        // bpTree.response["AP-FamilySelection"]["AP-CatSelection"] = null;
        // bpTree.response["AP-FamilySelection"]["Medical_ProductType"] = null;
        // bpTree.response["AP-FamilySelection"]["AP-Plan_Message"] = true;

        // var non_med_products = bpTree.children[4].children[6].eleArray[0].response

        var bpChildren = bpTree.children
        var ap_family_selection_obj = {}
        var ap_family_selection_obj_children = []
        var eleArray_item_0 = {}
        var non_med_products = []

        angular.forEach(bpChildren, function(child, childIterator){
            if(child.name === "AP-FamilySelection"){
                ap_family_selection_obj = child
                ap_family_selection_obj_children = child.children
            }
        }); 

        angular.forEach(ap_family_selection_obj_children, function(ap_family_step, stepIterator){
            
            if(ap_family_step.eleArray[0].name === "Non_Medical_Product_Type"){
                eleArray_item_0 = ap_family_step.eleArray[0]
            }
        }); 

        non_med_products = eleArray_item_0.response
        
        angular.forEach(non_med_products, function(product, productIterator){
            if(product.selected){
                product.selected = false
            }
        }); 
        



}

}]);