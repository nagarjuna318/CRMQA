vlocity.cardframework.registerModule.factory('SearchCriteria', [function() {
    return {
        Text : ''
    }
}]);

vlocity.cardframework.registerModule.controller('ins-product-selection-single-select-controller', ['$scope', '$rootScope', '$timeout', '$q', '$sldsModal', 'SearchCriteria', function($scope, $rootScope, $timeout, $q, $sldsModal, SearchCriteria) {


    $scope.selectedProducts = 0

    $scope.selected_programs_Names = []

    $scope.prep_programs_list = function(bpTree, control){

        if(control.name == "FixList"){
            var selected_programs_list = bpTree.response.ProgramList
            selected_programs_list.forEach(function(program, index){
                    $scope.selected_programs_Names.push(program.Name)
            });
        }
    }

    $scope.myOnSelectItem = function(ctrl, p, indx, item, bool){

        var items_ls = ctrl.vlcSI['recSet']

        items_ls.forEach(function(thing, index){
            thing.vlcSelected = false
        });

        $scope.onSelectItem(ctrl, p, indx, item, bool)


    }

    $scope.selectCheck = function(baseCtrl, bpTree, control, pObj, indx, thisObj){
      

        if(control.name == "FixList"){

            if($scope.selected_programs_Names.includes(pObj.Name)){
                $scope.onSelectItem(control, pObj, indx, thisObj, true)
            } 
        }else{

            if(bpTree.response.ProductSelection.Parent_Product != null){
                var selectedParentArray = bpTree.response.ProductSelection.Parent_Product.SelectedParentProduct;

                for(var j = 0; j < selectedParentArray.length; j++){
                    var selectedProd = selectedParentArray[j]

                    if(pObj.Name == selectedProd.Name){
                        $scope.onSelectItem(control, pObj, indx, thisObj, true)
                    }

                }

            }
            
        }
    }

}]);