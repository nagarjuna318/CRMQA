vlocity.cardframework.registerModule.controller('deduct_coins_checkbox_controller', ['$scope', '$timeout', '$q', '$rootScope', '$interval', function($scope, $timeout, $q, $rootScope, $interval) {
    
    deductible_options = []
    coins_options = []
    
    function deselectDeductibleOptions(){
        angular.forEach(deductible_options, function(item, key){
            item.selected = false
        })
    }

    function deselectCoinsOptions(){
            angular.forEach(coins_options, function(item, key){
                item.selected = false
            })
    }
    
    function getChildInBpTree(omniscript_children_array, name){
        var return_item = {}
        angular.forEach(omniscript_children_array, function(item, key){
            if(item.eleArray[0].name === name){
                return_item = item.eleArray[0]
            }
        })

        return return_item
    }

    function deselectAllOptions(bpTree){
        var deductible_coins_step = {}
        var deductible_coins_block = {}
        var deductible_element = {}
        var coins_element = {}

        angular.forEach(bpTree.children, function(child, index){
            if(child.name ==="Select_Deductible_Amount_and_Coinsurance_Rate"){
                deductible_coins_step = child
            }
        })


        deductible_coins_block = getChildInBpTree(deductible_coins_step.children, "Deductible_Coinsurance_Block")
        deductible_element = getChildInBpTree(deductible_coins_block.children, "Deductible_Amount")
        coins_element = getChildInBpTree(deductible_coins_block.children, "Coinsurance_Rate")

        deductible_options = deductible_element.propSetMap.options
        coins_options = coins_element.propSetMap.options


        deselectDeductibleOptions()
        deselectCoinsOptions()

        bpTree["SummaryOfExtract"] = {}
        bpTree["SummaryOfExtract_Keys"] = []
        bpTree.response.secondary_selection = null
        bpTree.response.primary_selection = null

        if(bpTree.response["coins_extract"]){
            delete bpTree.response["coins_extract"]
        }

        if(bpTree.response["deductible_extract"]){
            delete bpTree.response["deductible_extract"]
        }

    }

    $scope.myaggregate = function(bpTree, item, control_index, control_parent_index, bool, bool){

        

        if(typeof bpTree.response.skip_selection === "undefined"){
            bpTree.response.skip_selection = true
        }else{
            bpTree.response.skip_selection = !bpTree.response.skip_selection
        }

        deselectAllOptions(bpTree)
        $scope.aggregate(item, control_index, control_parent_index, bool, bool)
    }




}]);