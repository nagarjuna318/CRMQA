vlocity.cardframework.registerModule.controller('deduct-coins-multi-select-controller', ['$scope', '$timeout', '$q', '$rootScope', '$interval', function($scope, $timeout, $q, $rootScope, $interval) {

    const button_ids = ['#DR-DeductibleCount', '#DR-CoinsuranceCount'];
    const check_button_ids = ['#DR-DeductibleCount-CHECK', '#DR-CoinsuranceCount-CHECK'];
    const extract_names = ['deductible_extract', 'coins_extract'];
    const calculation_names = ['coins_rate_calc', 'deductible_rate_calc'];
    
    const deductible_map = {
        '$0-$1000' : 'OneK',
        '$1001-$2000' : 'TwoK',
        '$2001-$3000' : 'ThreeK',
        '$3001-$4000' : 'FourK',
        '$4001-$5000' : 'FiveK',
        '>=$5001' : 'GreaterThanFiveK'
    }
    
    const coins_map = {
        '0-9':'ZeroP',
        '10-19':'TenP',
        '20-29':'TwentyP',
        '30-39':'ThirtyP',
        '40-49':'FortyP',
        '>=50':'FiftyPAndGreater'
    }
    
    var button_choice, extract_choice, calculation_choice, check_button_choice;
    
    var summaryObj = {}
    var summaryObjKeys = []
    var deductible_options = [];
    var coins_options = [];
    
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
    
    $scope.showPlanCount = function(bpTree, option, control){
    
        return (bpTree.response.primary_selection && control.name !== bpTree.response.primary_selection) && (option.category in bpTree.SummaryOfExtract)
        
    }
    
    $scope.shouldDisable = function(bpTree, option, control){
    
        return (bpTree.response.primary_selection && control.name !== bpTree.response.primary_selection) && !$scope.showPlanCount(bpTree, option, control)
    
    }
    
    $scope.custom_init = function(bpTree, scp, control){
    
        setCategories(bpTree)
        $scope.init(scp, control)
    
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
    
    
    function setCategories(bpTree){
            // bpTree>children>loop until name === "Select_Deductible_Amount_and_Coinsurance_Rate" > 
            // children > indexInParent 2 > eleArray[0] > children > 0 & 1 > eleArray[0] > 
            // response > loop through each and add mapped values
    
            const bpChildren = bpTree.children;
            var element_object = {};
            var interim_block_element = {}
            var deductible_element = {}
            var coins_element = {}
        
            
    
            angular.forEach(bpChildren, function(child, child_key){
                if(child.name === "Select_Deductible_Amount_and_Coinsurance_Rate"){
                    element_object = child
                }
            })
    
            //WARNING - the index must be adjusted if the order of the block changes in the omniscript or it will break!
            //Make sure to double check this in all migration environments, might need to do this programmatically
            // deductible_options = element_object.children[2].eleArray[0].children[0].eleArray[0].propSetMap.options
            // coins_options = element_object.children[2].eleArray[0].children[1].eleArray[0].propSetMap.options
    
            interim_block_element = getChildInBpTree(element_object.children, "Deductible_Coinsurance_Block")
            deductible_element = getChildInBpTree(interim_block_element.children, "Deductible_Amount")
            coins_element = getChildInBpTree(interim_block_element.children, "Coinsurance_Rate")
    
            deductible_options = deductible_element.propSetMap.options
            coins_options = coins_element.propSetMap.options
    
    
            angular.forEach(deductible_options, function(item, key){
                item.category = deductible_map[item.value]
            })
    
            angular.forEach(coins_options, function(item, key){
                item.category = coins_map[item.name]
            })
        
            
    }
    
    
    function setButtonAndExtractChoices(control_name){
        if(control_name === "Deductible_Amount"){
            extract_choice = extract_names[0]
            calculation_choice = calculation_names[0]
            button_choice = button_ids[0]
        }else{
            extract_choice = extract_names[1]
            calculation_choice = calculation_names[1]
            button_choice = button_ids[1]
        }
    
    }
    
    function setTestButtonAndExtractChoices(control_name){
        if(control_name === "Deductible_Amount"){
            extract_choice = extract_names[0]
            calculation_choice = calculation_names[0]
            check_button_choice = check_button_ids[0]
        }else{
            extract_choice = extract_names[1]
            calculation_choice = calculation_names[1]
            check_button_choice = check_button_ids[1]
        }
    
    }
    
    function countDataRaptorResponse(bpTreeResponse, control_name){
        //loop through extract array and return object with cateogries : count
        setButtonAndExtractChoices(control_name)
        
        var obj_map = {}
    
        var loop_array = bpTreeResponse[extract_choice]
    
        angular.forEach(loop_array, function(extract_item, key){
            if(!obj_map[extract_item[calculation_choice]]){
                obj_map[extract_item[calculation_choice]] = 1
            }else{
                obj_map[extract_item[calculation_choice]] += 1
            }
        });
    
        return obj_map
    
    }

    function seeIfPlansArePresent(bpTree, control_name){
        setTestButtonAndExtractChoices(control_name)

        var interval_iteration = 0
        var check_for_extract = $interval(function(){

            if(!$rootScope.loading){
                $rootScope.loading = true
            }
            
            if(interval_iteration > 20 ){
                summaryObj = {}
                summaryObjKeys = []
                bpTree["SummaryOfExtract"] = summaryObj
                bpTree["SummaryOfExtract_Keys"] = summaryObjKeys
                bpTree.response.secondary_selection = null
                stop_check_interval()
            }
            
            if(bpTree.response[extract_choice]){
                bpTree.response.passed_test = true
                delete bpTree.response[extract_choice]
                stop_check_interval()
            }else{
                interval_iteration += 1
            }
            
            
            
        }, 100)
        var stop_check_interval = function(){
            $interval.cancel(check_for_extract)
            if(bpTree.response.passed_test){
                delete bpTree.response.passed_test
                actuallyGetPlans(bpTree, control_name)
            }else{
                $rootScope.loading = false
            }
            
            
            
        }


    }
    
    function getPlans(bpTree, control_name){
        setTestButtonAndExtractChoices(control_name)
        setButtonAndExtractChoices(control_name)
    
        $rootScope.loading = true

        var clickTestButton = $timeout(function() {
                angular.element(check_button_choice).triggerHandler('click');
        })

        clickTestButton.then(seeIfPlansArePresent(bpTree, control_name))


    
    
    }
    
    function actuallyGetPlans(bpTree, control_name){
    

        $timeout(function() {
            angular.element(button_choice).triggerHandler('click');
        }).then(function(){

            var check_for_extract = $interval(function(){
    
                if(bpTree.response[extract_choice]){
                    if(bpTree.response.AccountDetails.Situs_State_Abbrev === "CA" && bpTree.response.AccountDetails.Pooled_NonPooled === "Pooled"){
                        
                        if(Array.isArray(bpTree.response[extract_choice])){
                            var responsePlans = bpTree.response[extract_choice].filter(plan => plan.pooled_non_pooled_check === "Pooled")
                            bpTree.response[extract_choice] = responsePlans
                        }else{
                            if(bpTree.response[extract_choice].pooled_non_pooled_check !== "Pooled"){
                                bpTree.response[extract_choice] = []
                            }else{
                                var responseObj = bpTree.response[extract_choice]
                                bpTree.response[extract_choice] = [responseObj]
                            }
                        }
                        
                    }
                    summaryObj = countDataRaptorResponse(bpTree.response, control_name)
                    summaryObjKeys = Object.keys(summaryObj)
                    bpTree["SummaryOfExtract"] = summaryObj
                    bpTree["SummaryOfExtract_Keys"] = summaryObjKeys
                    console.log("Summary Object: ",summaryObj)
                    console.log("Summary Object Keys: ",summaryObjKeys)
                    stop_check_interval()
                }
                
            }, 100)
            var stop_check_interval = function(){
                $interval.cancel(check_for_extract)
                $rootScope.loading = false
                
            }
        })
    
    }
    
    
    $scope.myMultiSelect = function(bpTree, scp, control, option){

            if(bpTree.response.primary_selection && bpTree.response.primary_selection !== control.name){
                if(option.selected){
                    bpTree.response.secondary_selection = control.name    
                }else{
                    bpTree.response.secondary_selection = null    
                }

            }else if((!bpTree.response.primary_selection && bpTree.response.primary_selection_value !== option.value && option.selected) || 
                (bpTree.response.primary_selection === control.name && option.selected) || 
                (!bpTree.response.primary_selection)){
                    if(bpTree.response.primary_selection === "Deductible_Amount"){
                        deselectCoinsOptions()
                    }else if(bpTree.response.primary_selection === "Coinsurance_Rate"){
                        deselectDeductibleOptions()
                    }
                    bpTree.response.secondary_selection = null 
                    bpTree.response.primary_selection = control.name
                    bpTree.response.primary_selection_value = option.value
                    if(extract_choice){
                        delete bpTree.response[extract_choice]
                    }
    
                    getPlans(bpTree, control.name)

            }else if(bpTree.response.primary_selection === control.name && !option.selected) {
                    delete bpTree.response[extract_choice]
                    deselectDeductibleOptions()
                    deselectCoinsOptions()
                    bpTree.response.primary_selection = null
                    bpTree.response.secondary_selection = null
                    bpTree.response.primary_selection_value = null
    
            }
    
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
    
                    if(anthementity == 'Labor and Trust')
                      {
    
                         setTimeout( function() {
                                if(jQuery('#AP-MarketSelection[value='+labouracct+']').is(':visible')){
                                    jQuery('#AP-MarketSelection[value='+labouracct+']').trigger('click').trigger('click').trigger('select').trigger('change');
                                    bpTree.response.Situs_State = labouracct;
                                    bpTree.response["AP-FamilySelection"]["AP-MarketSelection"] = labouracct;
                                    bpTree.response["AP-FamilySelection"]["AP-MarketSelectionFinalvlaue"] = labouracct;
                                    bpTree.response.AccountDetails.Situs_State_Abbrev = labouracct;
                                }
    
    
                          }, 100);
                            
                         
                      }
                      else
                      {
                               if (preSelect && (anthementity != 'Labor and Trust')) 
                               {
    
                                    setTimeout( function() {
                                      if(jQuery('#AP-MarketSelection[value='+preSelect+']').is(':visible')){
                                        jQuery('#AP-MarketSelection[value='+preSelect+']').trigger('click').trigger('click').trigger('select').trigger('change');
                                        bpTree.response.Situs_State = preSelect;
                                        bpTree.response["AP-FamilySelection"]["AP-MarketSelection"] = preSelect;
                                        bpTree.response["AP-FamilySelection"]["AP-MarketSelectionFinalvlaue"] = preSelect;
                                        bpTree.response.AccountDetails.Situs_State_Abbrev = preSelect;
    
    
                                      }
                                       
                                       
                                       
                                       }, 100);
                                
                                }
                      }      
          
                      
        }
    
    }]);