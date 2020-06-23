let insSgpsCustomEventName;
/**
 * Evaluates when the stepInitKey in the OS Set Values step changes
 * @param {Object} control Element control
 */
baseCtrl.prototype.shouldReinitTemplate = function(control) {
    const bpTreeResponse = baseCtrl.prototype.$scope.bpTree.response;
    const insSgpsKey = baseCtrl.prototype.$scope.bpTree.propSetMap.insSgpsKey;
    const insSgpsNode = bpTreeResponse[insSgpsKey];
    const stepInitKey = control.name + 'Init';
    if (insSgpsNode[stepInitKey] !== bpTreeResponse[stepInitKey]) {
        return true;
    }
};
/**
 * Triggers reinitialization of step's template, with option to reinitialize shared cart data as well
 * @param {Object} control Element control
 */
baseCtrl.prototype.reinitTemplate = function(control) {
    const bpTreeResponse = baseCtrl.prototype.$scope.bpTree.response;
    const insSgpsKey = baseCtrl.prototype.$scope.bpTree.propSetMap.insSgpsKey;
    const insSgpsNode = bpTreeResponse[insSgpsKey];
    if (insSgpsNode.insSgpsCartInit !== bpTreeResponse.insSgpsCartInit) {
        control.cartReinit = true;
    }
    const event = new CustomEvent(insSgpsCustomEventName, {'detail': control});
    document.dispatchEvent(event);
};


vlocity.cardframework.registerModule.filter('unique', function() {
    return function(collection, keyname) {
    // we define our output and keys array;
    var output = [],
      keys = [];

    // we utilize angular's foreach function
    // this takes in our original collection and an iterator function
    angular.forEach(collection, function(item) {
      // we check to see whether our object exists
      var key = item[keyname];
      // if it's not already part of our keys array
      if (keys.indexOf(key) === -1) {
        // add it to our keys array
        keys.push(key);
        // push this item to our final output array
        output.push(item);
      }
    });
    // return our array which should be devoid of
    // any duplicates
    return output;
  };
});

vlocity.cardframework.registerModule.factory('SearchCriteria', [function() {
    return {
        Text : ''
    }
}]);

vlocity.cardframework.registerModule.service('DfilterService', function(){
    
    var year_filter = false;
    var plan_type_filter = false;
    var network_type_filter = false;
    var deductible_type_filter = false;
    var deductible_amt_filter = false;
    var coinsurance_filter = false;
    var rider_filter = false;
    var service_control = {};
    var plan_list = {};
    var number_of_filters = 0;
    var typesMasterDict = {}

    var master_filter_on = false;


    var code_list = {"Portfolio_Year__c" : year_filter, "Product_Family__c" : network_type_filter, "Network__c" : plan_type_filter, "OTHER_cdhProductType" : deductible_type_filter, "inn_deductibleSingle_inn":deductible_amt_filter, "inn_defaultCoinsurance_inn":coinsurance_filter, "OTHER_riderName":rider_filter}


    var filter_map = {};
    var filter_map_tracker = {};
    
    
    var dynamic_filter_conditions = [];
    var dynamic_filters = {};

    //order by index in filter conditions first // maybe!

    function compare(a,b) {
      if (a.Index < b.Index)
        return -1;
      if (a.Index > b.Index)
        return 1;
      return 0;
    }

    var inequality_operators = {
        "≤" : function(){return "<="},
        "≥" : function(){return ">="},
        "=" : function(){return "="}
    }

    function setMasterFilter(){

        var keys = Object.keys(filter_map_tracker);
        var updated_master_filter = false;

        for(var k = 0; k < keys.length; k++){
            var key = keys[k]
            var inner_obj = filter_map_tracker[key]

            var inner_keys = Object.keys(inner_obj)

            for(var w = 0; w < inner_keys.length; w++){
                var inner_key = inner_keys[w]
                var bool = inner_obj[inner_key]

                if(bool){
                    updated_master_filter = bool
                }

            }


        }

        master_filter_on = updated_master_filter

    }

    return {

        setTypeMasterDict : function(dictObj){

            typesMasterDict = dictObj

        },

        getTypeMasterDict : function(){

            return typesMasterDict
        },

        setFilterMap : function(isForRiders, riders_list){
            
            if(!isForRiders){

                if(riders_list.length > 0 && riders_list[0].FieldName === "Network__c"){
                    riders_list.forEach(function(item, index){
                        
                        if(typeof filter_map["Network__c"] === "undefined"){
                            filter_map["Network__c"] = [item.Value]
                        }else if(!filter_map["Network__c"].includes(item.Value)){
                            filter_map["Network__c"].push(item.Value)
                        }

                    })

                }else{
                    for(var j = 0; j < dynamic_filter_conditions.length; j++){    

                        var dyanmice_filter = dynamic_filter_conditions[j]
                        var dynamic_filter_fieldName = dyanmice_filter.FieldName
                        var operator = dyanmice_filter.Operator
                        var valueLabel = dyanmice_filter.ValueLabel
                        var value = dyanmice_filter.Value
                        var newObj = {}
                        newObj[inequality_operators[operator]()] = value

                        if(typeof filter_map[dynamic_filter_fieldName] === "undefined"){
                            filter_map[dynamic_filter_fieldName] = []
                        }

                        if(operator === "="){
                            filter_map[dynamic_filter_fieldName].push(value)
                        }else if(typeof filter_map[dynamic_filter_fieldName][valueLabel] === "undefined"){
                            filter_map[dynamic_filter_fieldName][valueLabel] = [newObj]
                        }else{
                            filter_map[dynamic_filter_fieldName][valueLabel].push(newObj)
                        }    
                    }   
                }
                 
            }else{

                filter_map["OTHER_riderName"] = riders_list
            }

            
        },
       
        getNumberOfFilters : function(){
            return number_of_filters
        },

        increaseNumberOfFilters : function(){
            number_of_filters = number_of_filters + 1;
        },

        decreaseNumberOfFilters : function(){
            number_of_filters = number_of_filters - 1;
        },

        resetFilterMapTracker : function(){

            for(var key in filter_map_tracker){
                for(var innerKey in filter_map_tracker[key]){
                    filter_map_tracker[key][innerKey] = false
                }
            }
        },

        setFilterMapTracker : function(isForRiders, riders_list){

                var fmt = {}

                if(!isForRiders){

                    if(riders_list.length > 0 && riders_list[0].FieldName === "Network__c"){

                
                        riders_list.forEach(function(rider, index){
                            if(typeof(filter_map_tracker["Network__c"]) === "undefined"){
                                filter_map_tracker["Network__c"] = {}
                                filter_map_tracker["Network__c"][rider.Value] = false
                            }else{
                                filter_map_tracker["Network__c"][rider.Value] = false
                            }
                        })


                    }else{
                        for(var j = 0; j < dynamic_filter_conditions.length; j++){    

                            var dyanmice_filter = dynamic_filter_conditions[j]
                            var dynamic_filter_fieldName = dyanmice_filter.FieldName
                            var operator = dyanmice_filter.Operator
                            var valueLabel = dyanmice_filter.ValueLabel
                            var value = dyanmice_filter.Value
                            var value_bool = false;
                            var newObj = {}
                            newObj[value] = value_bool

                            var valueLablObj = {}
                            valueLablObj[valueLabel] = value_bool

                            if(typeof fmt[dynamic_filter_fieldName] === "undefined"){
                                fmt[dynamic_filter_fieldName] = {}
                            }

                            if(operator === "="){
                                fmt[dynamic_filter_fieldName][value] = value_bool;
                            }else if(typeof fmt[dynamic_filter_fieldName][valueLabel] === "undefined"){
                                fmt[dynamic_filter_fieldName][valueLabel] = value_bool;
                            }else{
                                continue;
                            }
                        }

                        filter_map_tracker = fmt

                    }
                    

                }else{
                    filter_map_tracker["OTHER_riderName"] = {}
                    riders_list.forEach(function(rider, index){
                        filter_map_tracker["OTHER_riderName"][rider] = false
                    })

                }
            
                

                // fmt["OTHER_riderName"] = {"Yes" : false, "No" : false};   

                

            
        },

        getFilterSectionBool : function(filter_code, value_label){
            //summarizes each filter category booleans to the category level//
            return filter_map_tracker[filter_code][value_label]
;

        },

        getFilterMap : function(){
            return filter_map
        },

        getFilterMapTracker: function(){
            return filter_map_tracker
        },

        getFilterMapTracker_summary : function(){
            var summary = {};
            var fmt_keys = Object.keys(filter_map_tracker)

            for(var i = 0; i < fmt_keys.length; i++){
                var key = fmt_keys[i];
                var fmt_obj = filter_map_tracker[key]
                var sect_bool = false
                var fmt_obj_keys = Object.keys(fmt_obj)

                for(var j = 0; j < fmt_obj_keys.length; j++){
                    var inner_key = fmt_obj_keys[j];

                    sect_bool = sect_bool || fmt_obj[inner_key]


                }

                summary[key] = sect_bool

            }

            return summary

        },

        setFilterConditions : function(json, full_reset, is_for_Networks){

            if(is_for_Networks){

                dynamic_filter_conditions = json



            }else{
                if(!full_reset){
                    var entity_filters = json.EntityFilter;
                    var entity_filter_conditions = json.EntityFilterCondition;

                    entity_filters.forEach(function(filterObj, index){
                        dynamic_filters[filterObj["Name"]] = filterObj["Id"]
                    });

                    dynamic_filter_conditions = entity_filter_conditions;
                    var name_arr = [];

                    dynamic_filter_conditions.forEach(function(filterCond, index){
                        if(filterCond["FieldName"] == "Network__c" && filterCond["EntityFilterId"] != dynamic_filters["Network Type1"]){
                            filterCond["EntityFilterId"] = dynamic_filters["Network Type1"]
                        }else if(filterCond["FieldName"].search(":") > 0){
                            var name_arr = filterCond["FieldName"].split(":");
                            filterCond["FieldName"] = name_arr[name_arr.length-1]
                        }
                    });

                    dynamic_filter_conditions.sort(compare)         

                }else{
                    dynamic_filter_conditions = json
                }



            }
            
            


        },

        getMasterFilter : function(){
            return master_filter_on
        },

        resetMasterFilters : function(){
            setMasterFilter();
            return master_filter_on;
        },

        getFilterConditions : function(){
            return dynamic_filter_conditions;

        },

        getEntityFilters : function(){
            return dynamic_filters;

        },        

        getCodeFilter : function(filter_code){
            return code_list[filter_code]
        },

        getCodeList : function(){
            return code_list;
        },

        updateFilterMapTracker : function(filter_code, valueLabel, bool){
                
            filter_map_tracker[filter_code][valueLabel] = bool

            setMasterFilter();
        },

        //Deprecate
        setCodeFilter : function(filter_code, bool){
            code_list[filter_code] = bool
            setMasterFilter();
        },
        ////

        setControl : function(control){
            service_control = control;
            plan_list = control[control.name].unselectedNewPlans;
        },

        getServiceControl : function(){
            return service_control;
        },

        getPlanList : function(){
            return plan_list;
        }


    }

    
});


vlocity.cardframework.registerModule.filter("myTestFilter", function() {
        
        return function(input, search) {

            console.log(input, search)
            return input
            
      };
});

vlocity.cardframework.registerModule.controller('insOsSmallGroupPlanSelectionCtrl', ['$scope', '$rootScope', '$timeout', '$q', '$sldsModal', 'DfilterService', 'SearchCriteria', function($scope, $rootScope, $timeout, $q, $sldsModal, DfilterService, SearchCriteria) {
    'use strict';
    const cartPageSize = 50; //set limit on selected plans in upper portion of the screen.
    let bpTreeResponse;
    let scp;
    let remotePageSize;
    let remoteRespCount = 0;
    let remoteAttribute = [];
    let selectCollapseDict = [];
    $scope.selected_btns = true;
    $scope.expand_all = false;
    $scope.page_dict = {};
    $scope.currentPage = 0;
    $scope.searchCriteria = SearchCriteria;

    $scope.typesMasterDict = {}

    $scope.filter_conditions = []

    $scope.currencyCode = '$';
    if (baseCtrl.prototype.$scope.bpTree.oSCurrencySymbol) {
        $scope.currencyCode = baseCtrl.prototype.$scope.bpTree.oSCurrencySymbol;
    }

    function reinitEventHandler(e) {
        const control = e.detail;
        document.removeEventListener(insSgpsCustomEventName, reinitEventHandler);
        $scope.insSelectionInit(baseCtrl.prototype, control, control.cartReinit);
    }

    function set_network_and_rider_filters(control, resp, first_pass){
        var filter_conditions_copy = DfilterService.getFilterConditions();
        var local_typesMasterDict = DfilterService.getTypeMasterDict();
        var filterConditions_before_riders = filter_conditions_copy.length > 0 ? filter_conditions_copy.filter(function(filter_cond){
                return filter_cond.FieldName != "Riders" &&  filter_cond.FieldName != "Network__c"
            }) : []

            if(first_pass){
                if("Riders" in local_typesMasterDict){
                    delete local_typesMasterDict["Riders"]
                }
    
                if("Network Type" in local_typesMasterDict){
                    delete local_typesMasterDict["Network Type"]
                }
            }
        
            $scope.typesMasterDict = local_typesMasterDict

            if(control[control.name].totalPlans > 0){
                var network_list = []
                var network_list_tracker = []
                var plan_list_for_networks = [...resp[control.name].ratedProducts.records]


                plan_list_for_networks.forEach(function(inner_plan, inner_plan_index){
                    var new_filter_cond = {}

                    if(!network_list_tracker.includes(inner_plan.Network__c)){
                        new_filter_cond.EntityFilterId = "a2O1K000002F69XUAS"
                        new_filter_cond.FieldName = "Network__c"
                        new_filter_cond.FieldType = "string"
                        new_filter_cond.Index = inner_plan_index
                        new_filter_cond.IsNot = false
                        new_filter_cond.Operator = "="
                        new_filter_cond.Type =  "Field"
                        new_filter_cond.Value = inner_plan.Network__c
                        new_filter_cond.is_checked =  false 

                        filterConditions_before_riders.push(new_filter_cond)
                        network_list.push(new_filter_cond)
                    }

                    network_list_tracker.push(inner_plan.Network__c)


                })

                $scope.filter_conditions = filterConditions_before_riders
                DfilterService.setTypeMasterDict(local_typesMasterDict)
                DfilterService.setFilterConditions(filterConditions_before_riders, false, true)

                // var network_list_distinct = [...new Set(network_list)]

                DfilterService.setFilterMap(false, network_list);
                DfilterService.setFilterMapTracker(false, network_list);
                $scope.prepTypes("Network Type", "a2O1K000002F69XUAS", true);

            }

            
            
            $scope.filter_conditions = filterConditions_before_riders
            $scope.prepTypes("Riders", "a2O2a000000YUZ9EAO", true);
            
            DfilterService.setTypeMasterDict(local_typesMasterDict)
            DfilterService.setFilterConditions(filterConditions_before_riders, true, false)



            // var filterConditions_before_riders = $scope.filter_conditions
            var filterAttrValues_raw = control[control.name].filterAttrValues
            var all_riders_vals = []

            Object.keys(filterAttrValues_raw).forEach(function(attr){

                if(attr.includes("OTHER_riderName")){
                    var value_list = filterAttrValues_raw[attr].listOfValues
                    value_list.forEach(function(val, index){

                        all_riders_vals.push(val)
                    })
                }
            });

            var riders_distinct = [...new Set(all_riders_vals)]


            // Add this only if riders_distinct is not empty
            var none_rider_obj = {}
                none_rider_obj.EntityFilterId = "a2O2a000000YUZ9EAO"
                none_rider_obj.FieldName = "Riders"
                none_rider_obj.FieldType = "string"
                none_rider_obj.Index = -1
                none_rider_obj.IsNot = false
                none_rider_obj.Operator = "="
                none_rider_obj.Type =  "Field"
                none_rider_obj.Value = "None"
                none_rider_obj.is_checked =  false 

            filterConditions_before_riders.push(none_rider_obj)
            // Add this only if riders_distinct is not empty

            riders_distinct.forEach(function(rider, index){
                var new_filter_cond = {}
                new_filter_cond.EntityFilterId = "a2O2a000000YUZ9EAO"
                new_filter_cond.FieldName = "Riders"
                new_filter_cond.FieldType = "string"
                new_filter_cond.Index = index
                new_filter_cond.IsNot = false
                new_filter_cond.Operator = "="
                new_filter_cond.Type =  "Field"
                new_filter_cond.Value = rider
                new_filter_cond.is_checked =  false 

                filterConditions_before_riders.push(new_filter_cond)

            })

            DfilterService.setFilterConditions(filterConditions_before_riders, true, false)
            DfilterService.setFilterMap(true, riders_distinct);
            DfilterService.setFilterMapTracker(true, riders_distinct);
            $scope.prepTypes("Riders", "a2O2a000000YUZ9EAO", true);

            DfilterService.setTypeMasterDict(local_typesMasterDict)
                

        angular.forEach(control[control.name].filterAttrValues, function(filter) {
            filter.listOfValues = _.uniq(filter.listOfValues).sort();
        });

    }
    

    // Template initialization
    /**
     * @param {Object} baseCtrl OS baseCtrl
     * @param {Object} control Element control
     * @param {Boolean} [initializeCart] Flag when user moves back and forth from template step
     */
    $scope.insSelectionInit = function(baseCtrl, control, initializeCart) {
        // debugger;
        $scope.chkval = true;
        $scope.totalSelected=0;
        $scope.searchCriteria.Text = ""

        insSgpsCustomEventName = 'vloc-os-ins-small-group-selection-' + control.name + Math.round((new Date()).getTime() / 1000);
        // Listens for template reinit
        document.addEventListener(insSgpsCustomEventName, reinitEventHandler);

        // OS dataJSON object
        bpTreeResponse = baseCtrl.$scope.bpTree.response;
        delete bpTreeResponse.lastRecordId;
        // OS scope
        scp = baseCtrl.$scope;
        console.log('insSelectionInit control', control);
        // Determines minimum number of plans that should be added to the page each time you request more
        remotePageSize = control.propSetMap.remoteOptions.pageSize;
        //remotePageSize = 6;
        // This key is defined in the OS Script Configuration JSON
        const insSgpsKey = baseCtrl.$scope.bpTree.propSetMap.insSgpsKey;
        // This creates a custom node in the dataJSON to track plan selections across multiple OS steps
        bpTreeResponse[insSgpsKey] = bpTreeResponse[insSgpsKey] || {};
        $scope.insSgpsNode = bpTreeResponse[insSgpsKey];
        // This key must be defined in an OS Set Values step before the template step
        $scope.insSgpsNode.insSgpsCartInit = bpTreeResponse.insSgpsCartInit;
        const stepInitKey = control.name + 'Init';
        $scope.insSgpsNode[stepInitKey] = bpTreeResponse[stepInitKey];
        $scope.insSgpsNode.selectedPlansMap = initializeCart ? {} : $scope.insSgpsNode.selectedPlansMap || {};
        $scope.insSgpsNode.cartCompareSelectMap = initializeCart ? {} : $scope.insSgpsNode.cartCompareSelectMap || {};


        // Set up filter attribute from remote properties
        remoteAttribute = control.propSetMap.remoteOptions.Attributes.split(",");
  
    
        // $scope.insSgpsNode.selectedPlansMap = $scope.insSgpsNode.selectedPlansMap || {};
        // $scope.insSgpsNode.cartCompareSelectMap = initializeCart ? {} : $scope.insSgpsNode.cartCompareSelectMap || {};
        // $scope.insSgpsNode.cartCompareSelectMap = $scope.insSgpsNode.cartCompareSelectMap || {};
        // Initialize data on the first OS step this template is used
        if (!$scope.insSgpsNode.cartPlans || initializeCart) {
            // debugger;
            $scope.insSgpsNode.cartPlans = [];
            const selectableItems = control.vlcSI[control.itemsKey];
            if (selectableItems.length) {
                // Initialization if renewal OS
                renewalInit(selectableItems);
            }
        }
        control[control.name] = {};
        formatCart(0, true);
        
        // DfilterService.setFilterConditions($scope.bpTree.response.DynamicFilters);
        // DfilterService.setFilters($scope.bpTree.response.DynamicFilters);
        // var dfilters = DfilterService.getFilters();

        // Initial call to get available plans, wrapped in timeout so $rootScope.loading gets set after page is ready
        $timeout(function() {
            remoteInvoke(control)
            .then(function(remoteResp) {
                console.log('insSelectionInit remoteResp', remoteResp);
                control[control.name].unselectedNewPlans = [];
                control[control.name].selectedFilters = {};
                control[control.name].filterAttrValues = remoteResp[control.name].filterAttrValues || {};
                control[control.name].filtersAvailable = _.isEmpty(control[control.name].filterAttrValues) ? false : true;
                control[control.name].newCompareSelectMap = {};
                control[control.name].totalPlans = remoteResp[control.name].ratedProducts.totalSize;
                
                set_network_and_rider_filters(control, remoteResp, true)

                const newPlans = remoteResp[control.name].ratedProducts.records;

                $scope.formatNewPlans(newPlans, control);
                DfilterService.setControl(control);
                dataJsonSync();
            })
            .catch(angular.noop);
        }, 0);  

        
    };

    $scope.prepTypes = function(filter_type, code, need_checkbox){


        for(var i = 0; i < $scope.filter_conditions.length; i++){

            if(need_checkbox){
                $scope.filter_conditions[i].is_checked = !need_checkbox;
            }

            if($scope.filter_conditions[i].EntityFilterId === code){
                if(typeof $scope.typesMasterDict[filter_type] ==='undefined'){
                    $scope.typesMasterDict[filter_type] = [$scope.filter_conditions[i]];
                }else if(!$scope.typesMasterDict[filter_type].includes($scope.filter_conditions[i])){
                    $scope.typesMasterDict[filter_type].push($scope.filter_conditions[i]);   
                }
            }else{
                continue;
            }
            
        }

    };



    // Requests additional plans based on lastRecordId
    /**
     * @param {Object} control Element control
     */
    $scope.getMorePlans = function(control) {
        var morePlans = {} 
        bpTreeResponse.lastRecordId = control[control.name].lastRecordId;
        remoteInvoke(control)
        .then(function(remoteResp) {
            console.log('getMorePlans remoteResp', remoteResp);
            set_network_and_rider_filters(control, remoteResp, false)
            const newPlans = remoteResp[control.name].ratedProducts.records;
            morePlans = remoteResp.PlanList.ratedProducts.records
            $scope.formatNewPlans(newPlans, control);
        })
        .catch(angular.noop);

        return morePlans;
    };


    $scope.shiftPlans = function(control, page_num){
        var plan_keys = Object.keys($scope.page_dict)
        var next_page = page_num + 1;

        if($scope.page_dict[page_num][0].length == 0 && page_num != 1){
            delete $scope.page_dict[page_num];
            $scope.currentPage = page_num - 1;
            return $scope.page_dict[$scope.currentPage][0]
            // control[control.name].unselectedNewPlans = $scope.page_dict[page_num][0]
        }else if(typeof $scope.page_dict[next_page] === 'undefined'){
            //doesn't exist
            return control[control.name].unselectedNewPlans;
        }else{
            //does exist
            var shifted_plan = $scope.page_dict[next_page][0].shift();
            if($scope.page_dict[next_page][0].length == 0){
                delete $scope.page_dict[next_page]
            }
            
            $scope.page_dict[$scope.currentPage][0].push(shifted_plan);
            return $scope.page_dict[$scope.currentPage][0]

        }

    };
  

    $scope.unshiftPlans = function(plan, control, page_num){
        //var plan_keys = Object.keys($scope.page_dict)
        var next_page = page_num + 1;

        //if($scope.page_dict[$scope.currentPage][0].length <= remotePageSize){
            $scope.page_dict[page_num][0].unshift(plan);
            
            if($scope.page_dict[page_num][0].length > remotePageSize){
                var last_plan = $scope.page_dict[page_num][0].pop()
                if(typeof $scope.page_dict[next_page] === 'undefined'){
                    $scope.page_dict[next_page] = {0: [last_plan]}
                }else{
                    $scope.unshiftPlans(last_plan,control,next_page);            
                }                
            }

        //}
    
        return $scope.page_dict[$scope.currentPage][0]
    
    };

    $scope.openAlertModal = function(plan, control) {
    $scope.isSelectable = false;
    $sldsModal({
        backdrop: 'static',
        title: 'MAX NUMBER OF PLANS REACHED',
        scope: $scope,
        showLastYear: true,
        animation: true,
        templateUrl: control.propSetMap.modalConfigurationSetting.modalHTMLTemplateId,
        show: true,
        content: "You have reached your maximum allowed number of 25 selected plans. In order to add this plan you must first deselect another."
    });
    };

    // templateUrl: control.propSetMap.modalConfigurationSetting.modalHTMLTemplateId,

    // Add new plan to cart
    /**
     * @param {Object} plan Selected plan
     * @param {Number} planIndex Index in displayedPlans
     * @param {Object} control Element control
     */
    $scope.addNewPlan = function(plan, planIndex, control) {

        var current_unselected_plans = control[control.name].unselectedNewPlans

        if($scope.insSgpsNode.cartPlans.length == 25){
            $scope.openAlertModal(plan, control);
            return;
        }

        plan.selected = true;
        
        if(plan.vlcCompSelected){
            delete control[control.name].newCompareSelectMap[plan.Id]
            $scope.insSgpsNode.cartCompareSelectMap[plan.Id] = plan;
        }

        $scope.insSgpsNode.selectedPlansMap[plan.Id] = plan;

        control[control.name].unselectedNewPlans = current_unselected_plans.filter(function(item){
            return item.Id != plan.Id
        })

        // control[control.name].unselectedNewPlans.splice(planIndex, 1);
        control[control.name].totalPlans -= 1;

        $scope.insSgpsNode.cartPlans.unshift(plan);
        formatCart(0, true);
        dataJsonSync();

    };

    $scope.deselectAll = function(control){

        $scope.selected_btns = true;
        var selected_plans_len = $scope.insSgpsNode.displayedCartPlans.length
        
        var cartPlans = $scope.insSgpsNode.cartPlans
        var displayedCart = $scope.insSgpsNode.displayedCartPlans
        
       for(var i = 0; i < selected_plans_len; i++){

            var plan_inner = displayedCart[i];
            delete $scope.insSgpsNode.selectedPlansMap[plan_inner.Id];

            displayedCart[i].selected = false;
            $scope.insSgpsNode.cartPlans.splice(plan_inner.originalIndex, 1);
            formatCart(plan_inner.originalIndex, true);
            control[control.name].unselectedNewPlans.unshift(plan_inner);
            
       }

       dataJsonSync();


    }

    // Handle renewal plans and new plans in cart
    /**
     * @param {Object} plan Cart plan
     * @param {Object} control Element control
     */
    $scope.toggleCartPlan = function(plan, control) {
        // Flag to determine whether to select or deselect
        const deselecting = plan.selected;
        if (deselecting) {
            if (plan.renewal) {
                // Renewal plans get tracked if they are being deleted
                $scope.insSgpsNode.renewalPlansToDelete[plan.Id] = true;
            } else {
                // Add non-renewal plan back to bottom list
                delete $scope.insSgpsNode.selectedPlansMap[plan.Id];
                // if(plan.vlcCompSelected && plan.selected){
                //     delete $scope.insSgpsNode.cartCompareSelectMap[plan.Id]
                // }

                control[control.name].totalPlans = control[control.name].totalPlans + 1;
                $scope.insSgpsNode.cartPlans.splice(plan.originalIndex, 1);
                
                if($scope.insSgpsNode.cartPlans.length == 0){
                    $scope.selected_btns = true;
                }

                formatCart($scope.insSgpsNode.displayedCartPlans[0].originalIndex, true);


                
                control[control.name].unselectedNewPlans.unshift(plan);
                // if (plan.vlcCompSelected) {
                //     // Move compare flag to unselected plan map if compare box is checked
                //     $scope.toggleNewCompareSelect(plan, control);
                //     $scope.toggleCartCompareSelect(plan);
                // }
            }
        } else {
            // If plan is being renewed nothing needs to be tracked
            delete $scope.insSgpsNode.renewalPlansToDelete[plan.Id];
        }
        plan.selected = !plan.selected;
        dataJsonSync();
    };


    $scope.myFilter = function(array, expression, comparator, anyPropertyKey){
        let res_arr = []
        if (!remoteAttribute){
            return array;
        }else{
            for(var j = 0; j < remoteAttribute.length; j++){
                if(array.code==remoteAttribute[j]){
                    return array;
                }
            }
        }

    } 

    $scope.expand_collapse_tiles = function(){
        $scope.expand_all = !$scope.expand_all;
        for(var i = 0; i < $scope.insSgpsNode.displayedCartPlans.length; i++){
            $scope.expandSelectedPlans($scope.insSgpsNode.displayedCartPlans[i])
       }

    }

    $scope.countSelected = function(){
        
      $scope.selected_btns = false;

       for(var i = 0; i < $scope.insSgpsNode.displayedCartPlans.length; i++){
            selectCollapseDict[$scope.insSgpsNode.displayedCartPlans[i]];
            angular.element("#accord-parent-div-" + $scope.insSgpsNode.displayedCartPlans[i].Id).addClass('transition','height 2s');
       }

    }


    $scope.expandSelectedPlans = function(plan){

        if(plan.open == undefined){
            plan.open = true;
            
        }else{
            plan.open = !plan.open;
        }
    }


    // Toggles whether filters dropdown is open
    $scope.toggleFiltersDropdown = function() {
        $scope.openFilterDropdown = !$scope.openFilterDropdown;
    };

    // Toggles selected filter and makes remote call to refresh list of available products
    /**
     * @param {String} filterKey Name of filter type
     * @param {String} value User selected filter value
     * @param {Object} control Element control
     */
    $scope.toggleFilter = function(filterKey, value, control) {
        control[control.name].lastResultReached = false;
        control[control.name].selectedFilters[filterKey] = control[control.name].selectedFilters[filterKey] || [];
        control[control.name].newCompareSelectMap = {};
        const valueIndex = control[control.name].selectedFilters[filterKey].indexOf(value);
        if (valueIndex > -1) {
            control[control.name].selectedFilters[filterKey].splice(valueIndex, 1);
            if (!control[control.name].selectedFilters[filterKey].length) {
                delete control[control.name].selectedFilters[filterKey];
            }
        } else {
            control[control.name].selectedFilters[filterKey].push(value);
        }
        delete bpTreeResponse.lastRecordId;
        delete control[control.name].lastRecordId;
        remoteInvoke(control)
        .then(function(remoteResp) {
            console.log('toggleFilter remoteResp', remoteResp);
            control[control.name].unselectedNewPlans = [];
            const newPlans = remoteResp[control.name].ratedProducts.records;
            formatNewPlans(newPlans, control);
        })
        .catch(angular.noop);
    };



        // Dedupes and sets tiers for new plans
    /**
     * @param {Array} newPlans Plans returned from remote method
     * @param {Object} control Element control
     */

    //  function formatNewPlans(newPlans, control) {
    //     const newLastRecordId = newPlans ? newPlans[newPlans.length - 1].Id : null;
    //     if (!newPlans || control[control.name].lastRecordId === newLastRecordId) {
    //         console.log('last result reached');
    //         control[control.name].lastResultReached = true;
    //         remoteRespCount = 0;
    //         return;
    //     }
    //     control[control.name].lastRecordId = newLastRecordId;
    //     angular.forEach(newPlans, function(plan) {
    //         if (isNewPlan(plan)) {
    //             formatPlan(plan);
    //             control[control.name].unselectedNewPlans.push(plan);
    //             remoteRespCount += 1;
    //         }
    //     });
    //     if (remoteRespCount < remotePageSize) {
    //         $scope.getMorePlans(control);
    //     } else {
    //         remoteRespCount = 0;
    //     }
    // }   

    $scope.formatNewPlans = function(newPlans, control) {
            
        const newLastRecordId = newPlans ? newPlans[newPlans.length - 1].Id : null;

        if (!newPlans || control[control.name].lastRecordId === newLastRecordId) {
            console.log('last result reached');
            control[control.name].lastResultReached = true;
            remoteRespCount = 0;
            return;
        }
        control[control.name].lastRecordId = newLastRecordId;
        // control[control.name].unselectedNewPlans = [x];


        angular.forEach(newPlans, function(plan) {
            var rider_plans_total = []

            if (isNewPlan(plan) && plan.attributeCategories) {

                // plan.attributeCategories.records, function(attributeCategory) {
                // angular.forEach(attributeCategory.productAttributes.records



                for(var i = 0; i < plan.attributeCategories.records.length; i++){
                    var attribute = plan.attributeCategories.records[i]

                    for(var j = 0; j < attribute.productAttributes.records.length; j++){
                        var prod_attr = attribute.productAttributes.records[j]
                            prod_attr.formattedValues = [];

                        if(prod_attr.code === "inn_deductibleSingle_inn" || prod_attr.code === "inn_outOfPocketSingle_inn" || prod_attr.code === "PCP_copayAmount_2_inn" || prod_attr.code === "inn_deductibleFamily_inn" || prod_attr.code === "inn_outOfPocketFamily_inn" || prod_attr.code === "oon_deductibleSingle_oon" || prod_attr.code === "oon_deductibleFamily_oon" || prod_attr.code === "oon_outOfPocketSingle_oon" || prod_attr.code === "oon_outOfPocketFamily_oon" ){
                            var parsed_val_curr = parseInt(prod_attr.userValues)
                            prod_attr.dataType = "currency"
                            prod_attr.userValues = parsed_val_curr
                            prod_attr.formattedValues.push(parsed_val_curr);
                            
                        }else if(prod_attr.code === "inn_defaultCoinsurance_inn" || prod_attr.code === "oon_defaultCoinsurance_oon" || prod_attr.code === "PCP_coinsurancePercentage_2_inn" || prod_attr.code === "PCP_coinsurancePercentage_2_oon" || prod_attr.code === "SCP_coinsurancePercentage_12_inn" || prod_attr.code === "SCP_coinsurancePercentage_12_oon" || prod_attr.code === "UCARE_coinsurancePercentage_33_inn" || prod_attr.code === "UCARE_coinsurancePercentage_33_oon" || prod_attr.code === "EMRM_coinsurancePercentage_43_inn"){
                            var parsed_val_per = parseFloat(prod_attr.userValues) * 100
                            prod_attr.dataType = "percent"
                            prod_attr.userValues = parsed_val_per
                            prod_attr.formattedValues.push(parsed_val_per);

                        }else if(prod_attr.label === "Rider Plan Name"){
                            rider_plans_total.push(prod_attr.userValues)
                        }

                    }
                }

                plan.rider_list = rider_plans_total;
                // formatPlan(plan);
                //New 3/31/2019
                plan.visible = true;
                //
                control[control.name].unselectedNewPlans.push(plan);
                remoteRespCount += 1;
            }
        });
        // while(remoteRespCount < control[control.name].totalPlans){
        //     $scope.getMorePlans(control);
        //     remoteRespCount++;
        // control[control.name].totalPlans
        if (remoteRespCount < control[control.name].totalPlans) {
            $scope.getMorePlans(control);
        } else {
            remoteRespCount = 0;
        }
    }

    // Helper method to display number of selected filters
    /**
     * @param {Object} control Element control
     */
    $scope.selectedFiltersCount = function(control) {
        let count = 0;
        angular.forEach(control[control.name].selectedFilters, function(array) {
            count += array.length;
        });
        return count;
    };

    // Helper method to display filter checkbox
    /**
     * @param {String} filterKey Filter type
     * @param {String} value Filter value
     * @param {Object} control Element control
     */
    $scope.isFilterSelected = function(filterKey, value, control) {
        if (control[control.name].selectedFilters[filterKey] && control[control.name].selectedFilters[filterKey].indexOf(value) > -1) {
            return true;
        }
    };





    // Gets called when clicking next/previous directional buttons at top
    /**
     * @param {String} direction Prev or Next
     */
    $scope.paginateItems = function(direction) {
        const currentIndex = $scope.insSgpsNode.displayedCartPlans[0].originalIndex;
        let newIndex = 0;
        if (direction === 'prev') {
            newIndex = currentIndex - cartPageSize;
        } else if (direction === 'next') {
            newIndex = currentIndex + cartPageSize;
        }
        formatCart(newIndex);
    };

    // Count how many cart plans are selected
    $scope.selectedPlansCount = function() {
        let count = 0;
        angular.forEach($scope.insSgpsNode.cartPlans, function(plan) {
            if (plan.selected) {
                count += 1;
            }
        });
        return count;
    };

    $scope.removeInsSgpsNode = function(planId){
        delete $scope.insSgpsNode.cartCompareSelectMap[planId]
    };

    $scope.decrTotalCount = function(){
        $scope.totalSelected--;
    };

    $scope.visiblePlansCount = function(visiblePlans) {
        // var num = 0
        
        // var criteria = $scope.searchCriteria

        var plansls = DfilterService.getPlanList()
        var filtered_plans  = plansls.filter(function(plan){return plan.visible == true})
        var intersection_ls = visiblePlans.filter(value => filtered_plans.includes(value))

        return intersection_ls.length

        // let count = 0;
        // for(var i = 0; i < plansls.length; i++){
        //     var plan = plansls[i]
        //     if(plan.visible){
        //         count+=1;
        //     }
        // };

        // if($scope.visible_plans.length){
        //     num = 0
        // }else if($scope.visible_plans.length < count){
        //     num = $scope.visible_plans.length
        // }else{
        //     num = count;
        // }        

        // return count

        // if(!$scope.visible_plans.length){
        //     return 0
        // }else{
        //     return $scope.visible_plans.length < count? $scope.visible_plans.length : count;    
        // }

    

    };



    //Launch compare modal - right now it is a fixed template but this is exposed js, to-do: use OS modal template
    $scope.openCompareModal = function(plan, control) {
        if (plan) {
            $scope.modalRecords = [plan, plan.originalPlan.records[0]];
            $scope.isSelectable = false;
        } else {
            const newPlans = _.values(control[control.name].newCompareSelectMap);
            const cartPlans = _.values($scope.insSgpsNode.cartCompareSelectMap);
            $scope.modalRecords = newPlans.concat(cartPlans);
            $scope.isSelectable = true;
        }
        $sldsModal({
            backdrop: 'static',
            title: 'Compare Plans',
            scope: $scope,
            showLastYear: true,
            animation: true,
            templateUrl: control.propSetMap.modalHTMLTemplateId,
            show: true
        });
    };

    //Launch compare modal - right now it is a fixed template but this is exposed js, to-do: use OS modal template
    $scope.openDetailModal = function(plan, control) {
        $scope.modalRecords = [plan];//modalProducts = list of product and last years
        $scope.isSelectable = false;
        $sldsModal({
            backdrop: 'static',
            title: 'View Details',
            scope: $scope,
            showLastYear: true,
            animation: true,
            templateUrl: control.propSetMap.modalHTMLTemplateId,
            show: true
        });
    };


     // Adds unselected new plan to list (specific to each step) for compare modal
    /**
     * @param {Object} plan Unselected new plan
     * @param {Object} control Element control
     */
    $scope.toggleNewCompareSelect = function(plan, control) {
        if (!control[control.name].newCompareSelectMap[plan.Id]) {
            if($scope.totalSelected == 5){
                plan.vlcCompSelected = false;
                return;
            }
            control[control.name].newCompareSelectMap[plan.Id] = plan;
            plan.vlcCompSelected = true;
            if (plan) {
              $scope.totalSelected++;
              console.log(' $scope.totalSelected:'+ $scope.totalSelected);
             }
             else {
            $scope.totalSelected--;
            console.log(' $scope.totalSelected else:'+ $scope.totalSelected);
            }
            if($scope.totalSelected >1)
            {
            $scope.chkval = false;
            }
        } else {
             $scope.totalSelected--;
            delete control[control.name].newCompareSelectMap[plan.Id];
            plan.vlcCompSelected = false;
            if($scope.totalSelected ==1)
            {
            $scope.chkval = true;
            }
        }

        DfilterService.setControl(control)

    };



        // Adds cart plan to list (shared across steps) for compare modal
    /**
     * @param {Object} plan Cart plan (either new or renewal)
     */
    $scope.toggleCartCompareSelect = function(plan, control) {
        if (!$scope.insSgpsNode.cartCompareSelectMap[plan.Id]) {

            $scope.insSgpsNode.cartCompareSelectMap[plan.Id] = plan;
            plan.vlcCompSelected = true;
            //$scope.chkval = false;
            if (plan) {
              $scope.totalSelected++;
              console.log(' $scope.totalSelected:'+ $scope.totalSelected);
             }
             else {
            $scope.totalSelected--;
            console.log(' $scope.totalSelected else:'+ $scope.totalSelected);
            }
            if($scope.totalSelected >1)
            {
            $scope.chkval = false;
            }
            
        }
       else {

           $scope.totalSelected--;
           console.log(' $scope.totalSelected unchecking:'+ $scope.totalSelected);
            delete $scope.insSgpsNode.cartCompareSelectMap[plan.Id];
            plan.vlcCompSelected = false;
            if($scope.totalSelected ==1)
            {
            $scope.chkval = true;
            }
        }
    };



    $scope.clearSelection = function(control){
        var planls = DfilterService.getPlanList();
        var selected_planls = $scope.insSgpsNode.cartPlans
        var c = control

        for(var i = 0; i < planls.length; i++){
            var plan = planls[i]
            //plan.vlcCompSelected = false;
            if(plan.vlcCompSelected){
                $scope.toggleNewCompareSelect(plan, control)
            }
            
        }

        for(var j = 0; j < selected_planls.length; j++){
            var s_plan = selected_planls[j]

            if(s_plan.vlcCompSelected){
                $scope.toggleCartCompareSelect(s_plan)
            }
        }
        control[control.name].newCompareSelectMap = {}
        $scope.insSgpsNode.cartCompareSelectMap = {}
        $scope.totalSelected = 0;

    };

    $scope.toggleModalPlan = function(plan, control) {

        // toggleModalPlan(product.productData, control)
        
        if (plan.selected || plan.renewal) {
            $scope.toggleCartPlan(plan, control);
        } else {
            plan.selected = true;
            const unselectedNewPlans = control[control.name].unselectedNewPlans;
            // Find index in new plans to splice and move into cart
            for (let i = 0; i < unselectedNewPlans.length; i++) {
                const newPlan = unselectedNewPlans[i];
                if (plan.Id === newPlan.Id) {
                    $scope.addNewPlan(plan, i, control);
                    break;
                }
            }
        }
    };

    // Initialize data for renewal OS
    /**
    * @param {Object} selectableItems control.vlcSI[control.itemsKey]
    */
    function renewalInit(selectableItems) {
        $scope.insSgpsNode.renewalPlansToDelete = {};
        angular.forEach(selectableItems, function(plan) {
            plan.selected = true;
            plan.renewal = true;
            
            formatPlan(plan);
            if ($scope.insSgpsNode.renewalPlansToDelete[plan.Id]) {
                plan.selected = false;
            }
        });
        Array.prototype.push.apply($scope.insSgpsNode.cartPlans, selectableItems);
    }

    // Set tier for default icon color
    /**
    * @param {Object} plan
    */
    function setTierClass(plan) {
        const name = plan.Name || plan.productName;
        if (plan[baseCtrl.prototype.$scope.nsPrefix + 'Tier__c']) {
            plan.tierClass = plan[baseCtrl.prototype.$scope.nsPrefix + 'plan.TierClass__c'].toLowerCase();
        } else if (name.toLowerCase().indexOf('gold') > -1) {
            plan.tierClass = 'gold';
        } else if (name.toLowerCase().indexOf('silver') > -1) {
            plan.tierClass = 'silver';
        } else if (name.toLowerCase().indexOf('bronze') > -1) {
            plan.tierClass = 'bronze';
        }
    };

    // Index cart items
    /**
    * @param {Number} newIndex Starting index of cart plans subset
    * @param {Boolean} [reindex] Flag to refresh original indexes
    */
    function formatCart(newIndex, reindex) {
        if (reindex) {
            angular.forEach($scope.insSgpsNode.cartPlans, function(plan, i) {
                plan.originalIndex = i;
            });
        }
        $scope.insSgpsNode.displayedCartPlans = $scope.insSgpsNode.cartPlans.slice(newIndex, newIndex + cartPageSize);
        $scope.insSgpsNode.prevDisabled = newIndex === 0 ? true : false;
        $scope.insSgpsNode.nextDisabled = newIndex + cartPageSize >= $scope.insSgpsNode.cartPlans.length ? true : false;
    }

    //Format plan, calls setTierClass, loops through attributes to format
    /** 
    * @param {Object} plan 
    */
    function formatPlan(plan){
        setTierClass(plan);
        if (plan.attributeCategories && plan.attributeCategories.records) {
            angular.forEach(plan.attributeCategories.records, function(attributeCategory) {
                angular.forEach(attributeCategory.productAttributes.records, function(productAttribute) {
                    if(productAttribute.values && productAttribute.userValues && (productAttribute.multiselect || productAttribute.inputType === 'radio' || productAttribute.inputType === 'dropdown')){
                        productAttribute.formattedValues = [];
                        let selected = [];
                        if(!productAttribute.userValues.length){ //userValues can be a single value
                            selected.push(productAttribute.userValues);
                        }
                        for(let i = 0; i < productAttribute.userValues.length; i++){//could have an array of Objs or an array of Strings/Integers 
                            let value = productAttribute.userValues[i];
                            let valueType = typeof value;
                            if (valueType !== 'object'){ 
                                selected.push(value);
                            } else {
                                for(let key in value){ //multiselect checkbox - get keys with true [{value1: true}, {value2: false}]
                                    if(value[key]){
                                        selected.push(key);
                                    }
                                }
                            }
                        }
                        for(let i = 0; i < selected.length; i++){
                            for(let j = 0; j < productAttribute.values.length; j++){
                                if(selected[i].toString() === productAttribute.values[j].value.toString()){
                                    productAttribute.formattedValues.push(productAttribute.values[j].label);
                                }
                            } 
                        }
                    }

                });
            });
        }
    }

    // Check if new plan is already being tracked
    /**
     * @param {Object} plan
     */
    function isNewPlan(plan) {
        for (let i = 0; i < $scope.insSgpsNode.cartPlans.length; i++) {
            const cartPlan = $scope.insSgpsNode.cartPlans[i];
            if (plan.Id === cartPlan.Id || plan.Id === cartPlan.productId) {
                return false;
            }
        }
        return true;
    }

    // Calls OmniScript buttonClick method, which invokes remote method defined on the Selectable Items action
    /**
     * @param {Object} control Element control} control
     */
    function remoteInvoke(control) {
        const deferred = $q.defer();
        $rootScope.loading = true;
        bpTreeResponse.attributeFilters = control[control.name].selectedFilters;
        scp.buttonClick(bpTreeResponse, control, scp, undefined, 'typeAheadSearch', undefined, function(remoteResp) {
            deferred.resolve(remoteResp);
        });
        return deferred.promise;
    }

    // Keep plan selections in sync across OS steps
    function dataJsonSync() {
        $scope.insSgpsNode.selectedPlans = [];
        angular.forEach($scope.insSgpsNode.selectedPlansMap, function(selectedPlan) {
            $scope.insSgpsNode.selectedPlans.push(selectedPlan);
        });
        // For renewal OS - need to track quote line item ids for deletion from quote
        if (!_.isEmpty($scope.insSgpsNode.renewalPlansToDelete)) {
            $scope.insSgpsNode.unselectedIds = Object.keys($scope.insSgpsNode.renewalPlansToDelete);
        }
    }
}]);

vlocity.cardframework.registerModule.controller('DynamicFilterController', ['$scope', '$rootScope', '$http', 'DfilterService', 'SearchCriteria', '$timeout', '$q', function($scope, $rootScope, $http, DfilterService, SearchCriteria, $timeout, $q){
    'use strict';
    $scope.typesMasterDict = DfilterService.getTypeMasterDict();
    $scope.deductibleTypes = [];
    $scope.userValue = 0;
    $scope.plan_list = {};
    $scope.planYear = '';
    $scope.hasRiders = '';
    $scope.searchCriteria = SearchCriteria;
    $scope.network_accordion_open = true;
    $scope.rider_accordion_open = true;


    let bpTreeResponse
    let scp

    

    $scope.insFilterUnit = function(baseCtrl, control) {
        // DfilterService.setFilters($scope.bpTree.response.DynamicFilters)
        // $scope.filters = DfilterService.getFilters();

        bpTreeResponse = baseCtrl.$scope.bpTree.response;
        delete bpTreeResponse.lastRecordId;
        // OS scope
        scp = baseCtrl.$scope;

        var bpTree_dynamic_filters = $scope.bpTree.response.DynamicFilters
        var raw_entity_filters = bpTree_dynamic_filters.EntityFilterCondition
        var filtered_entity_filters = raw_entity_filters.filter(function(item){
            return item.FieldName != "Network__c"
        })

        bpTree_dynamic_filters.EntityFilterCondition = filtered_entity_filters

        DfilterService.setFilterConditions(bpTree_dynamic_filters, false, false)
        // DfilterService.setFilterConditions($scope.bpTree.response.DynamicFilters)
        DfilterService.setFilterMap(false, []);
        DfilterService.setFilterMapTracker(false, []);

        
        $scope.filter_conditions = DfilterService.getFilterConditions();

        $scope.master_filterObject = DfilterService.getEntityFilters();

        $scope.prepTypes("Year", $scope.master_filterObject["Year"], true);
        $scope.prepTypes("Plan Type", $scope.master_filterObject["Plan Type"], true);
        // $scope.prepTypes("Network Type", $scope.master_filterObject["Network Type1"], true); 
        $scope.prepTypes("Deductible Type", $scope.master_filterObject["Deductible Type"], true);

        DfilterService.setTypeMasterDict($scope.typesMasterDict)

        
        

    };  

    function remoteInvoke(control) {
        const deferred = $q.defer();
        $rootScope.loading = true;
        bpTreeResponse.attributeFilters = control[control.name].selectedFilters;

        scp.buttonClick(bpTreeResponse, control, scp, undefined, 'typeAheadSearch', undefined, function(remoteResp) {
            deferred.resolve(remoteResp);    
        });
        return deferred.promise;
    }

    $scope.seeNetworks = function(){

        $scope.network_accordion_open = !$scope.network_accordion_open;

    }

    $scope.seeRiders = function(){
        $scope.rider_accordion_open = !$scope.rider_accordion_open;
    }

    $scope.clearFilters = function(){
        $scope.planYear = '';
        $scope.hasRiders = '';

        DfilterService.resetFilterMapTracker();
        DfilterService.resetMasterFilters();

        $scope.typesMasterDict = {};
        $scope.filter_conditions = DfilterService.getFilterConditions();

        $scope.master_filterObject = DfilterService.getEntityFilters();
        $scope.searchCriteria.Text = ""

        $scope.prepTypes("Year", $scope.master_filterObject["Year"], true);
        $scope.prepTypes("Plan Type", $scope.master_filterObject["Plan Type"], true);
        $scope.prepTypes("Network Type", "a2O1K000002F69XUAS", true); 
        $scope.prepTypes("Deductible Type", $scope.master_filterObject["Deductible Type"], true);
        $scope.prepTypes("Riders", "a2O2a000000YUZ9EAO", true);

        DfilterService.setTypeMasterDict($scope.typesMasterDict)



        $scope.filter_check()

        // $scope.network_accordion_open = !$scope.network_accordion_open
        // $scope.rider_accordion_open = !$scope.rider_accordion_open;

    }

    $scope.year_radio_select = function(label){

        $scope.planYear = label;
        var year_arr = $scope.typesMasterDict['Year'];

        for(var i = 0; i < year_arr.length; i++){
            var year_filter = year_arr[i]
            if(year_filter.Value === label){
                if(year_filter.is_checked){
                    break;
                }else{
                    $scope.selectedFilter(year_filter, 'Year');    
                }
                
            }

        }
    }

    $scope.riders_select = function(label){
        $scope.hasRiders = label;
        var riders_arr = $scope.typesMasterDict['Riders'];
    
        for(var i = 0; i < riders_arr.length; i++){
            var riders_filter = riders_arr[i]
            if(riders_filter.Value === label){
                if(riders_filter.is_checked){
                    break;
                }else{
                    $scope.selectedFilter(riders_filter, 'Riders');    
                }
                
            }
        }
        
        


    } 

    $scope.selectedFilter = function(filterObj, filter_type){
        $scope.plan_list = DfilterService.getPlanList();
        var filter_map = DfilterService.getFilterMap();
        var field_key = filterObj.FieldName;
        var category_list = []
        

        // filterObj.is_checked = !filterObj.is_checked;
        // DfilterService.updateFilterMapTracker(field_key, value_label_key, filterObj.is_checked);

        
        if(filter_type === 'Coinsurance Rate %' || filter_type === 'Deductible Amount'){
            var value_label_key = filterObj.ValueLabel
            filterObj.is_checked = !filterObj.is_checked;
            
            DfilterService.updateFilterMapTracker(field_key, value_label_key, filterObj.is_checked);

            $scope.filter_check()

        }else if(filter_type === 'Year'){
            var value_key = filterObj.Value
            var year_arr = $scope.typesMasterDict['Year'];

            //filterObj.is_checked = !filterObj.is_checked;

            // DfilterService.updateFilterMapTracker(field_key, value_key, filterObj.is_checked);
            var filter_map_tracker = DfilterService.getFilterMapTracker()
            //make sure master filter updates here

            if(value_key === "Next"){
                if(filter_map_tracker[field_key]["Current"] === true){
                    DfilterService.updateFilterMapTracker(field_key, "Current", false);
                    
                }   
            }else{
                if(filter_map_tracker[field_key]["Next"] === true){
                    DfilterService.updateFilterMapTracker(field_key, "Next", false);        
                }
            }

            filterObj.is_checked = !filterObj.is_checked;
            DfilterService.updateFilterMapTracker(field_key, value_key, filterObj.is_checked); 
            filterObj.is_checked = !filterObj.is_checked;
         

            category_list = filter_map[field_key]

            //function to look through aray of values and do something similar
            //to checkProduct, but with array. 
            $scope.filter_check()
        

        }
        else{
            field_key =  field_key == "Riders" ? "OTHER_riderName" : field_key
            var value_key = filterObj.Value
            filterObj.is_checked = !filterObj.is_checked;

            DfilterService.updateFilterMapTracker(field_key, value_key, filterObj.is_checked);
            //make sure master filter updates here

            category_list = filter_map[field_key]

            //function to look through aray of values and do something similar
            //to checkProduct, but with array. 
            $scope.filter_check()


        }
    

    }

    $scope.filter_check = function(){

        //add parameter for deductible type, network type, and plan type distinction
        var planls = $scope.plan_list;
        var are_filters_active = DfilterService.getMasterFilter();
        var attribute_cats = [];
        var product_atts = [];
        var filter_map_tracker = DfilterService.getFilterMapTracker();
        
        var bool_map = {}
        var fmt_summary = DfilterService.getFilterMapTracker_summary();

        var fmt_keys = Object.keys(filter_map_tracker);

        //if master filter is true
        if(are_filters_active){
            for(var p = 0; p < planls.length; p++){
                var show_plan = false;
                var plan = planls[p]

                for(var k = 0; k < fmt_keys.length; k++){
                    var key = fmt_keys[k]
                    var keys_inner = Object.keys(filter_map_tracker[key])
                    bool_map[key] = false                

                    for(var t = 0; t < keys_inner.length; t++){
                        var t_key = keys_inner[t]

                        if(filter_map_tracker[key][t_key] && $scope.checkPlan(plan, key, t_key)){
                            bool_map[key] = true;
                        }

                    }
                }
                var bmap_keys = Object.keys(bool_map)
            
                if(_.isEqual(fmt_summary, bool_map)){
                    show_plan = true;
                }
            
                plan.visible = show_plan
            
            }
        } else {
            for(var i = 0; i < planls.length; i++){
                planls[i].visible = true
            }
        }
    }

    $scope.checkPlan = function(plan, field_name, filter_val){

        var attribute_cats = [];
        var product_atts = [];
        attribute_cats = plan.attributeCategories.records;
        
        var filter_map = DfilterService.getFilterMap();
        var category_list = [];
        var conditions = [];

        var inequality_compare = {
            ">=" : function(x, y){return x >= y},
            "<=" : function(x, y){return x <= y}
        };




        if(field_name == "Network__c" || field_name == "Product_Family__c"){
            var user_val = plan[field_name]
            return (filter_val === user_val);
        }

        if(field_name === "Portfolio_Year__c"){
            var d = new Date();
            var curr_year = d.getFullYear();
            var plan_year = parseInt(plan[field_name])

            if(filter_val === "Current"){                
                return curr_year == plan_year
            }else{
                return plan_year > curr_year
            }

        }

        if(field_name === "OTHER_riderName"){
            if(filter_val == "None"){
                return plan.rider_list.length == 0
            }else if(typeof plan.rider_list != "undefined"){
                return plan.rider_list.includes(filter_val)
            }

        }


            
        for(var j = 0; j < attribute_cats.length; j++){
            var attr = attribute_cats[j]
            product_atts = attr.productAttributes.records

            for(var k = 0; k < product_atts.length; k++){
                var code = product_atts[k].code
                var user_val = product_atts[k].userValues

                if(filter_val === "None"){
                    if(code === field_name){
                        return false;
                    }
                }

                // if(filter_val === "None"){
                //     // if(code === "OTHER_cdhProductType"){
                //     //     return false;
                //     // }else if(k == product_atts.length -1){
                //     //     return true;
                //     // }else{
                //     //     continue;
                //     // }
                //     if(code === "OTHER_cdhProductType"){
                //         console.log(code, user_val)


                // }
                


                if(field_name === "OTHER_cdhProductType"){

                    if(code === field_name && filter_val === user_val){
                        return true;
                    }
                    
                }

                // if(field_name === "OTHER_riderName"){
                //     if(code.includes(field_name)){
                //         return (filter_val === user_val);
                //     }
                    


                    // if(filter_val === "Yes"){
                    //     if(code.includes(field_name) && user_val){
                    //         return true;
                    //     }
                    // }else{
                    //     if(code.includes(field_name) && user_val){
                    //         return false;
                    //     }
                    // }
                // }

                if(field_name == "inn_deductibleSingle_inn" || field_name == "inn_defaultCoinsurance_inn"){

                    category_list = filter_map[field_name][filter_val]
                    
                    for(var i = 0; i < category_list.length; i++){
                        conditions.push(category_list[i])
                    };

                    if(code === field_name){
                        if(conditions.length > 1){
                            var cond1 = conditions[0]
                            var cond2 = conditions[1]
                            
                            var cond_keys1 = Object.keys(cond1)
                            var cond_keys2 = Object.keys(cond2)

                            var cond1_val = cond1[cond_keys1[0]]
                            var cond2_val = cond2[cond_keys2[0]]

                            return (inequality_compare[cond_keys1[0]](parseInt(user_val), parseInt(cond1_val)) && inequality_compare[cond_keys2[0]](parseInt(user_val), parseInt(cond2_val)))

                        }else{
                            var cond1 = conditions[0]
                            var cond_keys1 = Object.keys(cond1)
                            var cond1_val = cond1[cond_keys1[0]]
                            return (inequality_compare[cond_keys1[0]](parseInt(user_val), parseInt(cond1_val)))
                            
                        }  

                    }

                }
                

            }

            if(filter_val === "None"){
                if(j == attribute_cats.length -1){
                    return true;
                }
            }

        }
        // if(field_name === "OTHER_riderName"){
        //     if(filter_val === "No"){
        //         return true;
        //     }
        // }
        return false;
    }          


    $scope.add_new_plan = function(planls, plan, code, value_label){
        if(planls.length == 0){
            DfilterService.setMasterBool(true);
            planls.push(plan)
            DfilterService.setnewPlanMap(0, code, value_label);

        }else{
            planls.push(plan);
            DfilterService.setnewPlanMap(planls.length-1, code, value_label);    
        }

        return planls

    }



    $scope.prepTypes = function(filter_type, code, need_checkbox){


        for(var i = 0; i < $scope.filter_conditions.length; i++){

            if(need_checkbox){
                $scope.filter_conditions[i].is_checked = !need_checkbox;
            }

            if($scope.filter_conditions[i].EntityFilterId === code){
                if(typeof $scope.typesMasterDict[filter_type] ==='undefined'){
                    $scope.typesMasterDict[filter_type] = [$scope.filter_conditions[i]];
                }else if(!$scope.typesMasterDict[filter_type].includes($scope.filter_conditions[i])){
                    // if(!$scope.typesMasterDict[filter_type].includes($scope.filter_conditions[i]))
                    $scope.typesMasterDict[filter_type].push($scope.filter_conditions[i]);   

                }
            }else{
                continue;
            }
            
        }

    };

    function parseFieldName(name){
        var name_arr = name.split(":");
        return name_arr
    };

    function check_plan(plan, code){

        for(var i = 0; i < plan.attributeCategories.records.length; i++){
            var attr = plan.attributeCategories.records[i]
            if(check_attribute(attr, code)){
                return true;
            }
        }


    };

    function check_attribute(attribute, code){
        for(var i = 0; i < attribute.productAttributes.records.length; i++){
            var attr = attribute.productAttributes.records[i]
            if(check_prod_attr(attr, code)){
                return true
            }
        }
    };

    function check_prod_attr(attr, code){
        if(attr.code === code){
            $scope.userValue = parseInt(attr.userValues);
            return true;
        }else{
            return false;
        }
    }





}]);