let contractCodeinsSgpsCustomEventName;
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



// vlocity.cardframework.registerModule.factory('medical_plan_type_filter', [function() {
//     return {
//         planYear : ''
//     }
// }]);

vlocity.cardframework.registerModule.controller('insOsSmallGroupPlanSelectionCtrl1', ['$scope', '$rootScope', '$timeout', '$q', function($scope, $rootScope, $timeout, $q) {
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

    $scope.typesMasterDict = {}

    $scope.currencyCode = '$';
    if (baseCtrl.prototype.$scope.bpTree.oSCurrencySymbol) {
        $scope.currencyCode = baseCtrl.prototype.$scope.bpTree.oSCurrencySymbol;
    }

    function ccreinitEventHandler(e) {
        const control = e.detail;
        document.removeEventListener(contractCodeinsSgpsCustomEventName, ccreinitEventHandler);
        delete control.insSgpsCustomEventName
        $scope.insSelectionInit_contractCode(baseCtrl.prototype, control, control.cartReinit);
    }


    // addEventListener support for IE8
    function bindEvent(element, eventName, eventHandler) {
        console.log('@@@ bindEvent in Vlocity Template - addEventListener support for IE8');
        if (element.addEventListener){
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, eventHandler);
        }
    }

    // Template initialization
    /**
     * @param {Object} baseCtrl OS baseCtrl
     * @param {Object} control Element control
     * @param {Boolean} [initializeCart] Flag when user moves back and forth from template step
     */
    $scope.insSelectionInit_contractCode = function(baseCtrl, control, initializeCart) {
        // debugger;
        $scope.chkval = true;
        $scope.totalSelected=0;
        // medical_plan_type_filter.planYear = ''

        contractCodeinsSgpsCustomEventName = 'vloc-os-ins-small-group-selection-' + control.name + Math.round((new Date()).getTime() / 1000);
        control.contractCodeinsSgpsCustomEventName = 'vloc-os-ins-small-group-selection-' + control.name + Math.round((new Date()).getTime() / 1000);
        // Listens for template reinit
        document.addEventListener(contractCodeinsSgpsCustomEventName, ccreinitEventHandler);

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

        $scope.bpTree.response.undefined.selectedPlans = []


        // Initial call to get available plans, wrapped in timeout so $rootScope.loading gets set after page is ready
        $timeout(function() {
            remoteInvoke(control)
            .then(function(remoteResp) {
                console.log('insSelectionInit remoteResp', remoteResp);
                console.log('insSelectionInit control1 ', control);
                control[control.name].unselectedNewPlans = [];

                console.log('remoteResp[control.name].ratedProducts.records',);
                $scope.formatAllPlans(remoteResp.PlanList.ratedProducts.records, control);
                console.log('insSelectionInit control ', control);

            })
            .catch(angular.noop);
        }, 0);  

        
    };

    $scope.formatAllPlans = function(newPlans, control) {
            
        const newLastRecordId = newPlans ? newPlans[newPlans.length - 1].Id : null;
        console.log('insSelectionInit control formatNewPlans 209', control);
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
                            console.log('insSelectionInit control formatNewPlans 1136', control);

                        if(prod_attr.code === "inn_deductibleSingle_inn" || prod_attr.code === "inn_outOfPocketSingle_inn" || prod_attr.code === "PCP_copayAmount_2_inn" || prod_attr.code === "inn_deductibleFamily_inn" || prod_attr.code === "inn_outOfPocketFamily_inn" || prod_attr.code === "oon_deductibleSingle_oon" || prod_attr.code === "oon_deductibleFamily_oon" || prod_attr.code === "oon_outOfPocketSingle_oon" || prod_attr.code === "oon_outOfPocketFamily_oon" ){
                            var parsed_val_curr = parseInt(prod_attr.userValues)
                            prod_attr.dataType = "currency"
                            prod_attr.userValues = parsed_val_curr
                            prod_attr.formattedValues.push(parsed_val_curr);
                            console.log('insSelectionInit control formatNewPlans 1142', control);
                            
                        }else if(prod_attr.code === "inn_defaultCoinsurance_inn" || prod_attr.code === "oon_defaultCoinsurance_oon" || prod_attr.code === "PCP_coinsurancePercentage_2_inn" || prod_attr.code === "PCP_coinsurancePercentage_2_oon" || prod_attr.code === "SCP_coinsurancePercentage_12_inn" || prod_attr.code === "SCP_coinsurancePercentage_12_oon" || prod_attr.code === "UCARE_coinsurancePercentage_33_inn" || prod_attr.code === "UCARE_coinsurancePercentage_33_oon" || prod_attr.code === "EMRM_coinsurancePercentage_43_inn"){
                            var parsed_val_per = parseFloat(prod_attr.userValues) * 100
                            prod_attr.dataType = "percent"
                            prod_attr.userValues = parsed_val_per
                            prod_attr.formattedValues.push(parsed_val_per);
                            console.log('insSelectionInit control formatNewPlans 1150', control);

                        }else if(prod_attr.label === "Rider Plan Name"){
                            rider_plans_total.push(prod_attr.userValues)
                        }

                    }
                }

                // plan.rider_list = rider_plans_total;
                // formatPlan(plan);
                //New 3/31/2019
                plan.visible = true;
                //
                control[control.name].unselectedNewPlans.push(plan);
                remoteRespCount += 1;
            }
        });
         $scope.bpTree.response.undefined.selectedPlans = control[control.name].unselectedNewPlans;
        if (remoteRespCount < control[control.name].totalPlans) {
            $scope.getMorePlans(control);
        } else {
            remoteRespCount = 0;
        }
    }

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
}]);