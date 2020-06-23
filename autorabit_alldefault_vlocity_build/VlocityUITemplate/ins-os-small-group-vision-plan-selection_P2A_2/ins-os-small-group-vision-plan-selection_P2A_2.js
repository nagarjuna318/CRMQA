let visioninsSgpsCustomEventName;
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

    // if(control.name === "PlanList"){
    //     const event = new CustomEvent(control.insSgpsCustomEventName, {'detail': control});
    //     document.dispatchEvent(event);
    // }else if(control.name === "VisionPlanSelection"){
    //     const event = new CustomEvent(visioninsSgpsCustomEventName, {'detail': control});
    //     document.dispatchEvent(event);
    // }

     if(control.name === "CCPlanList" && (typeof control.contractCodeinsSgpsCustomEventName !== 'undefined')){
        const event = new CustomEvent(control.contractCodeinsSgpsCustomEventName, {'detail': control});
        document.dispatchEvent(event);  
    }else if(control.name === "VisionPlanSelection" && (typeof control.visioninsSgpsCustomEventName !== 'undefined')){
        const event = new CustomEvent(control.visioninsSgpsCustomEventName, {'detail': control});
        document.dispatchEvent(event);  
    }else if(control.name === "PlanList" && (typeof control.insSgpsCustomEventName !== 'undefined')){
        const event = new CustomEvent(control.insSgpsCustomEventName, {'detail': control});
        document.dispatchEvent(event);  
    }

    
    
    
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


vlocity.cardframework.registerModule.service('DfilterServiceVision', function(){
    
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
    var callback = null

    //order by index in filter conditions first // maybe!

    function compare(a,b) {
      if (a.Index < b.Index)
        return -1;
      if (a.Index > b.Index)
        return 1;
      return 0;
    }



    function valueMap(typeMasterObj, typeMasterKey){
        if(!filter_map[typeMasterKey]){
            filter_map[typeMasterKey] = [typeMasterObj.FieldName]
        }else{
            filter_map[typeMasterKey].push(typeMasterObj.FieldName)
        }

        if(!filter_map_tracker[typeMasterKey]){
            filter_map_tracker[typeMasterKey] = {}
            filter_map_tracker[typeMasterKey][typeMasterObj.FieldName] = false
        }else{
            filter_map_tracker[typeMasterKey][typeMasterObj.FieldName] = false
        }
        
    }

    function keyMap(typeDictKey){
        typesMasterDict[typeDictKey].map(x => valueMap(x, typeDictKey))
    }

    function setFilterMapAndTracker(){
        if(_.isEmpty(typesMasterDict) || !typesMasterDict){
            filter_map = {}
            filter_map_tracker = {}
        }else{
            Object.keys(typesMasterDict).map(keyMap)
        }
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

    function fmt_values_map(fmt_key, inner_key){
        filter_map_tracker[fmt_key][inner_key] = false
    }

    function fmt_key_map(fmt_key){
        Object.keys(filter_map_tracker[fmt_key]).map(inner_key => fmt_values_map(fmt_key, inner_key))
    }   

    function tmd_object_reset(tmd_obj){
        tmd_obj.is_checked = false
    }
    
    function tmd_key_map(tmd_key){
        typesMasterDict[tmd_key].map(tmd_object_reset)
    }

    return {

        regCallback : function(dataCallback){
              callback = dataCallback;
        },

        setTypeMasterDict : function(dictObj){
            //Wescraig
            typesMasterDict = dictObj
            setFilterMapAndTracker()
            //Check if dictObj is blank, if so, then make filterMap and filterMap tracker blank too

            if(null !== callback)
            {
                callback();
            }   
            

        },

        getTypeMasterDict : function(){

            return typesMasterDict
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

        resetTypeMasterDict : function(){
            Object.keys(typesMasterDict).map(tmd_key_map)
        
        },
        resetFilterMapTracker : function(){

            Object.keys(filter_map_tracker).map(fmt_key_map)

            // for(var key in filter_map_tracker){
            //     for(var innerKey in filter_map_tracker[key]){
            //         filter_map_tracker[key][innerKey] = false
            //     }
            // }
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


vlocity.cardframework.registerModule.factory('plan_type_filter', [function() {
    return {
        filter_val : '',
        exam_frequency_open: false,
        lens_frequency_open : false,
        frame_frequency_open : false,
        exam_frequency_val : '',
        lens_frequency_val : '',
        frame_frequency_val : '',
        frame_disable_condition : false,
        lens_disable_condition : false,
        exam_disable_condition : false,
        contact_lens_disable_condition : false
    }
}]);

vlocity.cardframework.registerModule.controller('VisioninsOsSmallGroupPlanSelectionCtrl', ['$scope', '$rootScope', '$timeout', '$q', '$sldsModal', 'DfilterServiceVision', 'SearchCriteria', 'LWC', 'plan_type_filter', function($scope, $rootScope, $timeout, $q, $sldsModal, DfilterServiceVision, SearchCriteria, LWC, plan_type_filter) {
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
    $scope.lwc = LWC
    $scope.typesMasterDict = {}
    

    $scope.filter_conditions = []

    $scope.currencyCode = '$';
    if (baseCtrl.prototype.$scope.bpTree.oSCurrencySymbol) {
        $scope.currencyCode = baseCtrl.prototype.$scope.bpTree.oSCurrencySymbol;
    }

    function visionreinitEventHandler(e) {
        const control = e.detail;
        document.removeEventListener(visioninsSgpsCustomEventName, visionreinitEventHandler);
        delete control.visioninsSgpsCustomEventName
        $scope.insSelectionInit(baseCtrl.prototype, control, control.cartReinit);
    }

        function bindEvent(element, eventName, eventHandler) {
        console.log('@@@ bindEvent in Vlocity Template - addEventListener support for IE8');
        if (element.addEventListener){
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, eventHandler);
        }
    }
    // // Listen to message from child window
    bindEvent(window, 'message', function (e) {
        if(!(e.data instanceof Object)) {
            var newValue = JSON.parse(e.data);
            if(newValue.closeWindow){
                for(var planId in newValue.change_dictionary){
                    bindEventTogglePlan(planId, newValue.change_dictionary[planId])
                }
                $scope.lwc.show_iframe = false
                $scope.$apply()
            }else if(newValue.data) {
                $timeout(function () {
                    $scope.applyCallResp( { "lwcData": newValue.data } );
                }, 1000);       
            }
        }
    });
    function bindEventTogglePlan(planId, status){
        var plan = {}
        if(status === "selected"){
            plan = $scope.temp_control_var[$scope.temp_control_var.name].unselectedNewPlans.filter(function(inner_plan){
                return inner_plan.Id === planId
            })[0]
            $scope.addNewPlan(plan, plan.originalIndex, $scope.temp_control_var)
        }else{
            plan = $scope.insSgpsNode.selectedPlans.filter(function(inner_plan){
                return inner_plan.Id === planId
            })[0]
            $scope.toggleCartPlan(plan, $scope.temp_control_var)
        }
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

        plan_type_filter.filter_val = ''

        plan_type_filter.exam_frequency_open = false
        plan_type_filter.exam_frequency_val = ''
        plan_type_filter.exam_disable_condition = false

        plan_type_filter.lens_frequency_open = false
        plan_type_filter.lens_frequency_val = ''
        plan_type_filter.lens_disable_condition = false
        
        plan_type_filter.frame_frequency_open = false
        plan_type_filter.frame_frequency_val = ''
        plan_type_filter.frame_disable_condition = false     
        
        plan_type_filter.contact_lens_disable_condition = false
        
        $scope.typesMasterDict = {}
        visioninsSgpsCustomEventName = 'vloc-os-ins-small-group-selection-' + control.name + Math.round((new Date()).getTime() / 1000);
        control.visioninsSgpsCustomEventName = 'vloc-os-ins-small-group-selection-' + control.name + Math.round((new Date()).getTime() / 1000);
        // Listens for template reinit
        document.addEventListener(visioninsSgpsCustomEventName, visionreinitEventHandler);

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
        $scope.insSgpsNode.cartCompareSelectMap = {}            
        control[control.name].newCompareSelectMap = {}
        $scope.insSgpsNode.cartPlans = []
        $scope.insSgpsNode.displayedCartPlans = []
        

        $scope.bpTree.response.undefined.selectedPlans = []
        $scope.bpTree.response.undefined.selectedPlansMap = {}
        $scope.bpTree.response.undefined.cartCompareSelectMap = {}
        $scope.bpTree.response.undefined.cartPlans = []
        $scope.bpTree.response.undefined.displayedCartPlans = []

        // Initial call to get available plans, wrapped in timeout so $rootScope.loading gets set after page is ready
        $timeout(function() {
            remoteInvoke(control)
            .then(function(remoteResp) {
            
                console.log('insSelectionInit remoteResp', remoteResp);
                control[control.name].unselectedNewPlans = [];
                control[control.name].selectedFilters = {};
                control[control.name].filterAttrValues = remoteResp["PlanList"].filterAttrValues || {};
                control[control.name].filtersAvailable = _.isEmpty(control[control.name].filterAttrValues) ? false : true;
                control[control.name].newCompareSelectMap = {};
                control[control.name].totalPlans = remoteResp["PlanList"].ratedProducts.totalSize;
                
                const newPlans = remoteResp["PlanList"].ratedProducts.records
        
                $scope.formatNewPlans(newPlans, control);
                DfilterServiceVision.setControl(control);
                DfilterServiceVision.setTypeMasterDict($scope.typesMasterDict)
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
            morePlans = remoteResp.PlanList.ratedProducts.records
            $scope.formatNewPlans(morePlans, control);
        })
        .catch(angular.noop);

        return morePlans;
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
        content: "You have reached your maximum allowed number of 10 selected plans. In order to add this plan you must first deselect another."
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

        if($scope.insSgpsNode.cartPlans.length == 10){
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
            
                // Add non-renewal plan back to bottom list
                delete $scope.insSgpsNode.selectedPlansMap[plan.Id];
                if(plan.vlcCompSelected){
                    delete $scope.insSgpsNode.cartCompareSelectMap[plan.Id]
                    control[control.name].newCompareSelectMap[plan.Id] = plan;
                }

                control[control.name].totalPlans = control[control.name].totalPlans + 1;
                $scope.insSgpsNode.cartPlans.splice(plan.originalIndex, 1);
                
                if($scope.insSgpsNode.cartPlans.length == 0){
                    $scope.selected_btns = true;
                }

                formatCart($scope.insSgpsNode.displayedCartPlans[0].originalIndex, true);


                
                control[control.name].unselectedNewPlans.unshift(plan);
                        
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


        // Dedupes and sets tiers for new plans
    /**
     * @param {Array} newPlans Plans returned from remote method
     * @param {Object} control Element control
     */


    function dropComma(userVal){
        return "$" + parseFloat(userVal)
    }

    function userValueInTypesMasterDict(newObj, arr){
        var checkFilter = arr.filter(filter_dict_obj => newObj.Value === filter_dict_obj.Value)
        return checkFilter.length > 0
    }


    $scope.val_freq_dictionary = {}

    function check_label_in_masterdictionary(prod_attr_label, userObj){
        if(prod_attr_label in $scope.typesMasterDict){
                if(!userValueInTypesMasterDict(userObj, $scope.typesMasterDict[prod_attr_label])){
                    $scope.typesMasterDict[prod_attr_label].push(userObj)
                }  
            }else{
                $scope.typesMasterDict[prod_attr_label] = [userObj]
            }
    }

    function vision_other_map(product_attr){
        if(product_attr.code === "VISION_OTHER_plansubtype"){
            //code may change as transformers name it, but structure is correct

            let full_service = {is_checked: false, Value: "Full Service", FieldName: "Full Service", is_enabled: false}
            let exam_only = {is_checked: false, Value: "Exam Only", FieldName: "Exam Only", is_enabled: false}
            let material_only = {is_checked: false, Value: "Materials Only", FieldName: "Materials Only", is_enabled: false}
            

            //double check label value when transformers' data is ready
            check_label_in_masterdictionary(product_attr.label, full_service)
            check_label_in_masterdictionary(product_attr.label, exam_only)
            check_label_in_masterdictionary(product_attr.label, material_only)

        }
    }

    function vision_frequency_map(product_attr, plan){
        switch(product_attr.code){
            case "VISION_frequency_exam":
                if(product_attr.userValues === "Unlimited"){
                    $scope.val_freq_dictionary[plan.Id]["exam_with_freq_val"]["freq"] = "Not Covered"
                }else{
                    $scope.val_freq_dictionary[plan.Id]["exam_with_freq_val"]["freq"] = product_attr.userValues
                }
                break;
            case "VISION_frequency_lens":
                if(product_attr.userValues === "Unlimited"){
                    $scope.val_freq_dictionary[plan.Id]["plens_with_freq_val"]["freq"] = "Not Covered"
                }else{
                    $scope.val_freq_dictionary[plan.Id]["plens_with_freq_val"]["freq"] = product_attr.userValues
                }
                break;
            case "VISION_frequency_frame":
                if(product_attr.userValues === "Unlimited"){
                    $scope.val_freq_dictionary[plan.Id]["frame_with_freq_val"]["freq"] = "Not Covered"
                }else{
                    $scope.val_freq_dictionary[plan.Id]["frame_with_freq_val"]["freq"] = product_attr.userValues
                }
                
                break;
            case "VISION_frequency_contactLens":
                if(product_attr.userValues === "Unlimited"){
                    $scope.val_freq_dictionary[plan.Id]["clens_with_freq_val"]["freq"] = "Not Covered"
                }else{
                    $scope.val_freq_dictionary[plan.Id]["clens_with_freq_val"]["freq"] = product_attr.userValues
                }
                break;

        }
        
        let userObjVal = ""

        switch(product_attr.userValues){
            case "Once every calendar year":
                userObjVal = "Once per CY"
                break;
            case "Once every other calendar year":
                userObjVal = "Once every two CY"
                break;
            case "Unlimited":
                userObjVal = "Not Covered"
                break;
        }

        let userObj = {
            "is_checked" : false,
            "Value" : !userObjVal? product_attr.userValues : userObjVal, 
            "FieldName" : product_attr.userValues,
            "is_enabled" : false
        }

        check_label_in_masterdictionary(product_attr.label, userObj)

    }

    function vision_inn_map(product_attr, plan){
        
        let userVal = dropComma(product_attr.userValues)

        switch(product_attr.code){
            case "VISION_INN_examcopay":
                $scope.val_freq_dictionary[plan.Id]["exam_with_freq_val"]["val"] = userVal
                break;
            case "VISION_INN_singlevisionlenscopay":
                $scope.val_freq_dictionary[plan.Id]["plens_with_freq_val"]["val"] = userVal
                break;            
            case "VISION_INN_frameallowance":
                $scope.val_freq_dictionary[plan.Id]["frame_with_freq_val"]["val"] = userVal
                break;
            case "VISION_INN_electivecontactlensallowance":
                $scope.val_freq_dictionary[plan.Id]["clens_with_freq_val"]["val"] = userVal
                break;

        }

        let userObj = {
            "is_checked" : false,
            "Value" : userVal, 
            "FieldName" : product_attr.userValues,
            "is_enabled" : false
        }

        check_label_in_masterdictionary(product_attr.label, userObj)

    }


    function compileFilterAttributes_helper(attributeRecord, plan){

        switch(attributeRecord.Code__c){
            case "VISION_OTHER":
                //grab plan sub type
                attributeRecord.productAttributes.records.map(vision_other_map)
                break;
            case "VISION_frequency":
                //grab frequencies
                attributeRecord.productAttributes.records.map(prod_attr => vision_frequency_map(prod_attr, plan))
                break;
            case "VISION_INN":
                //grab in network elements
                attributeRecord.productAttributes.records.map(prod_attr => vision_inn_map(prod_attr, plan))
                break;
        } 

    }
    
    function compileFilterAttributes(plan){
        plan["Exam_Copay_and_Frequency"] = "";
        plan["Prescription_Lens_Copay_and_Frequency"] = "";
        plan["Frame_Benefit_and_Frequency"] = "";
        plan["Contact_Lens_Benefit_and_Frequency"] = "";
        $scope.val_freq_dictionary[plan.Id] = {
            "exam_with_freq_val": {"val" : "", "freq" : ""},
            "plens_with_freq_val": {"val" : "", "freq" : ""},
            "clens_with_freq_val": {"val" : "", "freq" : ""},
            "frame_with_freq_val": {"val" : "", "freq" : ""}
        }
        plan.attributeCategories.records.map(attr_rec => compileFilterAttributes_helper(attr_rec, plan))
    }

    function assignVal_Freq(plan){
        let userObj = {
            "is_checked" : false,
            "Value" : "Not Covered", 
            "FieldName" : "Not Covered",
            "is_enabled" : false
        }

        let vals_to_filter_array = ["In Network Exam Copay", "In Network Singlevision Lens Copay", "In Network Frame Allowance", "In Network Elective Contact lens Allowance"]

        plan["Exam_Copay_and_Frequency"] = Object.values({...$scope.val_freq_dictionary[plan.Id]["exam_with_freq_val"]}).join(" ");
        if(plan["Exam_Copay_and_Frequency"].includes("Not Covered")){
            userObj["FieldName"] = "Not Covered.exam"
            check_label_in_masterdictionary("In Network Exam Copay", {...userObj})
        }

        plan["Prescription_Lens_Copay_and_Frequency"] = Object.values({...$scope.val_freq_dictionary[plan.Id]["plens_with_freq_val"]}).join(" ");
        if(plan["Prescription_Lens_Copay_and_Frequency"].includes("Not Covered")){
            userObj["FieldName"] = "Not Covered.prescription"
            check_label_in_masterdictionary("In Network Singlevision Lens Copay", {...userObj})
        }

        plan["Frame_Benefit_and_Frequency"] = Object.values({...$scope.val_freq_dictionary[plan.Id]["frame_with_freq_val"]}).join(" ");
        if(plan["Frame_Benefit_and_Frequency"].includes("Not Covered")){
            userObj["FieldName"] = "Not Covered.frame"
            check_label_in_masterdictionary("In Network Frame Allowance", {...userObj})
        }

        plan["Contact_Lens_Benefit_and_Frequency"] = Object.values({...$scope.val_freq_dictionary[plan.Id]["clens_with_freq_val"]}).join(" ");   
        if(plan["Contact_Lens_Benefit_and_Frequency"].includes("Not Covered")){
            userObj["FieldName"] = "Not Covered.clens"
            check_label_in_masterdictionary("In Network Elective Contact lens Allowance", {...userObj})
        }    

        // Object.keys($scope.typesMasterDict).map(dict_key => {
        //     if(vals_to_filter_array.includes(dict_key)){
        //         $scope.typesMasterDict[dict_key] = $filter('orderBy')($scope.typesMasterDict[dict_key], 'Value');
        //     }

        // })


    }

    

    $scope.formatNewPlans = function(newPlans, control) {
            
        const newLastRecordId = newPlans ? newPlans[newPlans.length - 1].Id : null;

        if (!newPlans || control[control.name].lastRecordId === newLastRecordId) {
            console.log('last result reached');
            control[control.name].lastResultReached = true;
            remoteRespCount = 0;
            return;
        }
        control[control.name].lastRecordId = newLastRecordId;

        newPlans.map(compileFilterAttributes)
        newPlans.map(assignVal_Freq)
        

        angular.forEach(newPlans, function(plan) {
            var rider_plans_total = []

            if (isNewPlan(plan) && plan.attributeCategories) {

                // formatPlan(plan);
                //New 3/31/2019
                plan.visible = true;
                //
                control[control.name].unselectedNewPlans.push(plan);
                remoteRespCount += 1;
            }
        });

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

        var plansls = DfilterServiceVision.getPlanList()
        var filtered_plans  = plansls.filter(function(plan){return plan.visible == true})
        var intersection_ls = visiblePlans.filter(value => filtered_plans.includes(value))

        return intersection_ls.length

    };

    $scope.temp_control_var = {}

    //Launch compare modal - right now it is a fixed template but this is exposed js, to-do: use OS modal template
    $scope.openCompareModal = function(control) {
        $scope.temp_control_var = control
        const newPlans = _.values(control[control.name].newCompareSelectMap);
        const cartPlans = _.values($scope.insSgpsNode.cartCompareSelectMap);
        var all_plans_to_compare = newPlans.concat(cartPlans);
        all_plans_to_compare.map((item, index) => format_content_for_detail_modal(item, index))
        formatted_content["OpptyId"] = $scope.bpTree.response.QuoteDetails.OpptyId
        formatted_content["ProductType"] = "Vision"
        formatted_content["Situs_State"] = $scope.bpTree.response.Situs_State
        $scope.lwc.show_iframe = true
        var iframeEl = document.getElementById('lwcIframe');
        iframeEl.contentWindow.postMessage(formatted_content, '*');
    };

    //Launch compare modal - right now it is a fixed template but this is exposed js, to-do: use OS modal template

    var formatted_content = {
        topRow: [],
        attributeRows: [],
        categorized_list : {}
    }

    var spd_obj = $scope.bpTree.response.SPD 

    var plan_overview_labels = ["Plan Detail", "Frequencies", "INN Detail", "OON Detail"]
    
    function oon_map(product_attr, compare_flag){
        let label_variable = ""
        switch(product_attr.code){
            case "VISION_OON_examreimbursement":
                label_variable = "Exam Reimbursement"
                break;
            case "VISION_OON_signlevisionlensreimbursement":
                label_variable = "Single Vision Reimbursement"
                break;
            case "VISION_OON_bifocallensreimbursement":
                label_variable = "Bifocal Lens Reimbursement"
                break;
            case "VISION_OON_trifocallensreimbursement":
                label_variable = "Trifocal Lens Reimbursement"
                break;
            case "VISION_OON_framereimbursement":
                label_variable = "Frame Reimbursement"
                break;
            case "VISION_OON_electivecontactlensreimbursement":
                label_variable = "Elective Contact Lens Reimbursement"
                break;
            case "VISION_OON_nonelectivecontactlensreimbursement":
                label_variable = "Nonelective Contact Lens Reimbursement"
                break;
        }
        if(!compare_flag){
            formatted_content.categorized_list["OON Detail"].push({
                    label: label_variable,
                    attributeValues : [
                        {
                            userValues: dropComma(product_attr.userValues)
                        }
                    ]
                })
        }else{
            formatted_content.categorized_list["OON Detail"].map(item => item.label === label_variable ? item.attributeValues.push(
                {
                    userValues: dropComma(product_attr.userValues)
                }
            ) : null)
        }
    }
    function inn_map(product_attr, compare_flag){
        let label_variable = ""
        switch(product_attr.code){
            case "VISION_INN_examcopay":
                label_variable = "Exam Copay"               
                break;
            case "VISION_INN_singlevisionlenscopay":
                label_variable = "Single Vision Lens Copay"
                break;
            case "VISION_INN_bifocallenscopay":
                label_variable = "Bifocal Lens Copay"
                break;
            case "VISION_INN_trifocallensecopay":
                label_variable = "Trifocal Lens Copay"
                break;
            case "VISION_INN_frameallowance":
                label_variable = "Frame Allowance"
                break;
            case "VISION_INN_electivecontactlensallowance":
                label_variable = "Elective Contact Lens Allowance"
                break;
            case "VISION_INN_nonelectivecontactlenscopay":
                label_variable = "Non Elective Contact Lens Copay"
                break;
        }
        if(!compare_flag){
            formatted_content.categorized_list["INN Detail"].push({
                label: label_variable,
                attributeValues : [
                    {
                        userValues: dropComma(product_attr.userValues)
                    }
                ]
            })
        }else{
            formatted_content.categorized_list["INN Detail"].map(item => item.label === label_variable ? item.attributeValues.push(
                {
                    userValues: dropComma(product_attr.userValues)
                }
            ) : null)
        }
    }

    function frequency_map(product_attr, compare_flag){
        let label_variable = ""
        switch(product_attr.code){
            case "VISION_frequency_exam":
                label_variable = "Exam Frequency"
                break;
            case "VISION_frequency_lens":
                label_variable = "Lens Frequency"
                break;
            case "VISION_frequency_frame":
                label_variable = "Frame Frequency"
                break;
            case "VISION_frequency_contactLens":
                label_variable = "Contact Lens Frequency"
                break;
        }
        if(!compare_flag){
            formatted_content.categorized_list["Frequencies"].push({
                label: label_variable,
                attributeValues : [
                    {
                        userValues: product_attr.userValues === "Unlimited" ? "Not Covered" : product_attr.userValues        
                    }
                ]
            })
        }else{
            formatted_content.categorized_list["Frequencies"].map(item => item.label === label_variable ? item.attributeValues.push(
                {
                    userValues: product_attr.userValues === "Unlimited" ? "Not Covered" : product_attr.userValues
                }
            ) : null)
        }
    }

    function SPD_helper(spd_value, compare_flag){
        if(spd_value !== "Id"){
            let spd_value_drop_c = spd_value.replace("__c", "")
            let spd_split_array =  spd_value_drop_c.split("_")
            
            if(!compare_flag){
                formatted_content.categorized_list["Standard Plan Discount"].push({  
                    label : spd_split_array.join(" "),
                    attributeValues : [
                        {
                            userValues: spd_obj[spd_value]    
                        }
                    ]                
                })
            }else{
                formatted_content.categorized_list["Standard Plan Discount"].map(item => item.label === spd_split_array.join(" ") ? item.attributeValues.push(
                    {
                        userValues: spd_obj[spd_value]    
                    }
                ) : null)
            }
            
            
        }
    }



    function format_content_for_detail_modal(plan, compare_flag){
       if(!compare_flag){
           formatted_content = {
            topRow: [],
            attributeRows: [],
            categorized_list : {}
            }
            plan_overview_labels.map(label => formatted_content.categorized_list[label] = [])
            formatted_content.categorized_list["Plan Detail"].push({  
                label : "Contract Code",
                attributeValues: []
            })
            formatted_content.categorized_list["Plan Detail"].push({
                label : "Participation Type",
                attributeValues: []
            })
            formatted_content.categorized_list["Plan Detail"].push({
                label : "Network",
                attributeValues: []
            })
       }
        formatted_content.topRow.push({
            Name: plan.Name || plan.productName,
            Id: plan.Id,
            Price: plan.Price,
            productData: plan
        });
        formatted_content.categorized_list["Plan Detail"].map(item => {
            switch(item.label){
                case "Contract Code":
                    item.attributeValues.push({
                        PlanId: plan.Id,
                        userValues : plan.Contract_Code__c
                    })
                    break;
                case "Participation Type":
                    item.attributeValues.push({
                        PlanId: plan.Id,
                        userValues : plan.ParticipationType__c === "Employer Paid" ? "Non-Voluntary" : plan.ParticipationType__c
                    })
                    break;
                case "Network":
                    item.attributeValues.push({
                        PlanId: plan.Id,
                        userValues : plan.Network__c
                    })
                    break; 
            }
        })
        //^will need to add value here for network once it comes through
        
       plan.attributeCategories.records.map(attr => {
            switch(attr.Code__c){
                case "VISION_INN":
                    attr.productAttributes.records.map(prod_attr => inn_map(prod_attr, compare_flag))
                    break;
                case "VISION_OON":
                    attr.productAttributes.records.map(prod_attr => oon_map(prod_attr, compare_flag))
                    break;
                case "VISION_frequency":
                    attr.productAttributes.records.map(prod_attr => frequency_map(prod_attr, compare_flag))
                    break;
            }
        
        })
        
        // Object.keys(spd_obj).map(key => SPD_helper(key, compare_flag))
        //returns array with plan in it
    }


    $scope.openDetailModal = function(plan, control) {
        format_content_for_detail_modal(plan)
        $scope.modalRecords = formatted_content;//modalProducts = list of product and last years
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
            if($scope.totalSelected == 4){
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

        DfilterServiceVision.setControl(control)

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
        var planls = DfilterServiceVision.getPlanList();
        planls.map(plan => plan.vlcCompSelected ? $scope.toggleNewCompareSelect(plan, control) : null)
        var selected_planls = $scope.insSgpsNode.cartPlans
        selected_planls.map(plan => plan.vlcCompSelected ? $scope.toggleCartCompareSelect(plan, control): null)
        var c = control
        for(var i = 0; i < planls.length; i++){
            var plan = planls[i]
            //plan.vlcCompSelected = false;
            if(plan.vlcCompSelected){
                $scope.toggleNewCompareSelect(plan, control)
            }else if(!plan.vlcCompSelected){
                plan.vlcCompSelected = false 
            }
            
        }
        for(var j = 0; j < selected_planls.length; j++){
            var s_plan = selected_planls[j]
            if(s_plan.vlcCompSelected){
                $scope.toggleCartCompareSelect(s_plan)
            }if(!s_plan.vlcCompSelected){
                s_plan.vlcCompSelected = false 
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

vlocity.cardframework.registerModule.controller('VisionDynamicFilterController', ['$scope', '$rootScope', '$http', 'DfilterServiceVision', 'SearchCriteria', '$timeout', '$q', 'plan_type_filter', function($scope, $rootScope, $http, DfilterServiceVision, SearchCriteria, $timeout, $q, plan_type_filter){
    'use strict';
    
    
    $scope.dataChangeCalback = function() {
        $scope.typesMasterDict = DfilterServiceVision.getTypeMasterDict();
    }
    DfilterServiceVision.regCallback($scope.dataChangeCalback);

    $scope.deductibleTypes = [];
    $scope.userValue = 0;
    $scope.plan_list = {};
    // $scope.planType = '';
    $scope.hasRiders = '';
    $scope.searchCriteria = SearchCriteria;
    $scope.planTypeFilter = plan_type_filter

    let bpTreeResponse
    let scp

    $scope.custom_value_sort = function(filter_obj){
        return parseFloat(filter_obj.FieldName)
    }

    $scope.toggleFrequency = function(freq_type){
        switch(freq_type){
            case 'Exam':
                plan_type_filter.exam_frequency_open = !plan_type_filter.exam_frequency_open
                break;
            case 'Lens':
                plan_type_filter.lens_frequency_open = !plan_type_filter.lens_frequency_open
                break;
            case 'Frame':
                plan_type_filter.frame_frequency_open = !plan_type_filter.frame_frequency_open
                break;
        }
        
    }

    $scope.insFilterUnit = function(baseCtrl, control) {
        bpTreeResponse = baseCtrl.$scope.bpTree.response;
        delete bpTreeResponse.lastRecordId;

        scp = baseCtrl.$scope;        
        $scope.filter_conditions = DfilterServiceVision.getFilterConditions();

        $scope.master_filterObject = DfilterServiceVision.getEntityFilters();

        DfilterServiceVision.setTypeMasterDict($scope.typesMasterDict)

        
        

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

        plan_type_filter.filter_val = ''

        plan_type_filter.exam_frequency_open = false
        plan_type_filter.exam_frequency_val = ''
        plan_type_filter.exam_disable_condition = false

        plan_type_filter.lens_frequency_open = false
        plan_type_filter.lens_frequency_val = ''
        plan_type_filter.lens_disable_condition = false
        
        plan_type_filter.frame_frequency_open = false
        plan_type_filter.frame_frequency_val = ''
        plan_type_filter.frame_disable_condition = false
        
        
        plan_type_filter.contact_lens_disable_condition = false

        plan_type_filter.exam_frequency_open = false
        plan_type_filter.lens_frequency_open = false
        plan_type_filter.frame_frequency_open = false

        plan_type_filter.exam_frequency_val = ''

        DfilterServiceVision.resetFilterMapTracker();
        DfilterServiceVision.resetTypeMasterDict()
        $scope.typesMasterDict = DfilterServiceVision.getTypeMasterDict()
        DfilterServiceVision.resetMasterFilters();

        $scope.searchCriteria.Text = ""
        
        $scope.filter_check()
    }



    $scope.planType_radio_select = function(label){

        // $scope.planYear = label;
        let planType_array = $scope.typesMasterDict['Plan subtype'];
        DfilterServiceVision.resetFilterMapTracker()
        plan_type_filter.exam_frequency_val = ''
        plan_type_filter.lens_frequency_val = ''
        plan_type_filter.frame_frequency_val = ''
        plan_type_filter.frame_disable_condition = false
        plan_type_filter.lens_disable_condition = false
        plan_type_filter.exam_disable_condition = false
        plan_type_filter.contact_lens_disable_condition = false


        planType_array.map(plan_type => {
            if(plan_type.Value == label){
                plan_type.is_checked = true
                switch(label){
                    case "Exam Only":
                        plan_type_filter.lens_frequency_val = "Not Covered"
                        plan_type_filter.frame_frequency_val = "Not Covered"
                        plan_type_filter.frame_disable_condition = true
                        plan_type_filter.lens_disable_condition = true
                        plan_type_filter.contact_lens_disable_condition = true
                        break;
                    case 'Materials Only':
                        plan_type_filter.exam_frequency_val = 'Not Covered'                        
                        plan_type_filter.exam_disable_condition = true
                        plan_type_filter.lens_disable_condition = false
                        break;
                    case 'Full Service':
                        plan_type_filter.lens_frequency_val = ""
                        plan_type_filter.frame_frequency_val = ""
                        plan_type_filter.frame_disable_condition = false
                        plan_type_filter.lens_disable_condition = false
                        break;
    

                }
               
            }else{
                plan_type.is_checked = false
            }
        })

        planType_array.map(plan_type => {
            // DfilterServiceVision.updateFilterMapTracker('Plan Sub Type', plan_type.FieldName, false);
            if(plan_type.Value == label){
                $scope.selectedFilter(plan_type, 'Plan subtype');
            }
        })
    }

    function exam_freq_map(freq_val){
        switch(freq_val){
            case "Once per CY":
                return "Once every calendar year";
            case "Once every two CY":
                return "Once every other calendar year";
            case "Not Covered":
                return "Unlimited";
        }
    }

    $scope.selectedFilter = function(filterObj, filter_type){
        $scope.plan_list = DfilterServiceVision.getPlanList();
        var filter_map = DfilterServiceVision.getFilterMap();
        var field_key = filterObj.FieldName;
        
        if(filter_type === 'Plan subtype'){
            DfilterServiceVision.updateFilterMapTracker(filter_type, field_key, filterObj.is_checked);
        }else if(filter_type.includes("Frequency")){
            let filter_type_split = filter_type.split(" ")
            
            $scope.toggleFrequency(filter_type_split[0])

            switch(filter_type_split[0]){
                case 'Exam':
            
                    if(plan_type_filter.exam_frequency_val !== filterObj.Value && plan_type_filter.exam_frequency_val !== ""){
                        DfilterServiceVision.updateFilterMapTracker(filter_type, exam_freq_map(plan_type_filter.exam_frequency_val), false);
                    }
                    plan_type_filter.exam_frequency_val = filterObj.Value
                    
                    break;
                case 'Lens':
                    if(plan_type_filter.lens_frequency_val !== filterObj.Value && plan_type_filter.lens_frequency_val !== ""){
                        DfilterServiceVision.updateFilterMapTracker(filter_type, exam_freq_map(plan_type_filter.lens_frequency_val), false);
                    }
                    plan_type_filter.lens_frequency_val = filterObj.Value
                    break;
                case 'Frame':
                    if(plan_type_filter.frame_frequency_val !== filterObj.Value && plan_type_filter.frame_frequency_val !== ""){
                        DfilterServiceVision.updateFilterMapTracker(filter_type, exam_freq_map(plan_type_filter.frame_frequency_val), false);
                    }
                    plan_type_filter.frame_frequency_val = filterObj.Value                
                    break;
            }         
            
            filterObj.is_checked = !filterObj.is_checked ? !filterObj.is_checked : filterObj.is_checked
            DfilterServiceVision.updateFilterMapTracker(filter_type, field_key, filterObj.is_checked);

            
        }else {
        
            filterObj.is_checked = !filterObj.is_checked;
            DfilterServiceVision.updateFilterMapTracker(filter_type, field_key, filterObj.is_checked);
        }
        
        $scope.filter_check()
        
    }

    $scope.filter_check = function(){

        //add parameter for deductible type, network type, and plan type distinction
        var planls = $scope.plan_list;
        var are_filters_active = DfilterServiceVision.getMasterFilter();
        var attribute_cats = [];
        var product_atts = [];
        var filter_map_tracker = DfilterServiceVision.getFilterMapTracker();
        
        var bool_map = {}
        var fmt_summary = DfilterServiceVision.getFilterMapTracker_summary();

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
        
        var filter_map = DfilterServiceVision.getFilterMap();
        var category_list = [];
        var conditions = [];
        var not_covered_bool = true
        



        for(var j = 0; j < attribute_cats.length; j++){
            var attr = attribute_cats[j]
            product_atts = attr.productAttributes.records

            for(var k = 0; k < product_atts.length; k++){
                var prod_attr = product_atts[k]
               //This will probably be what i need to match for when transformers provides full data 
                // var code = product_atts[k].code
                var userVal = product_atts[k].userValues
                if(field_name === prod_attr.label){
                    if(filter_val.includes("Not Covered")){
                        return !not_covered_bool
                    }
                    return filter_val === userVal
                }
                


            }

        }
        if(filter_val.includes("Not Covered")){
            return not_covered_bool
        }
        return false;
    }          





}]);