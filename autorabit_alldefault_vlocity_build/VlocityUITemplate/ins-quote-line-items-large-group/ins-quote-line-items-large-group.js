/* jshint esversion: 6 */
vlocity.cardframework.registerModule.controller('insQLILargeGroupController', ['$scope', '$rootScope', '$timeout', '$q', '$filter', 'insQLILargeGroupService', function($scope, $rootScope, $timeout, $q, $filter, insQLILargeGroupService) {
    'use strict';
    $scope.row = {};
    $rootScope.isLoaded = true;
    $scope.showAll = false;
    $scope.isOpen = {};
    $scope.subgroups = ['Other', 'In-Network', 'Out-Of-Network'];
    $scope.showSwitch = {};
    $scope.switchMap = {}; //used for coverage level switches for each network subgroup
    $scope.coverageAccordion = {
        activePanels: []
    };

    //The logic of the switch UI relies upon admin defined attributes with '_covered' post fixed to the code
    //In this method we maintain two maps: switchCatMap to keep track of what categories have switch attributes (_covered)
    //                                      subgroupMap: map of all True/False values for every subgroup
    // we deicided the value of the product switch by && the values of subgroupMap (T && T && F = False) which is expected
    /*
     * @param {Object} coverage  - current coverage to parse
     * @param {Array} coverages  - list of coverages - if coverage doesn't have any _covered attributes remove from list
     */
    $scope.showProduct = function(coverage, coverageArray) {
        let switchCatMap = {}; //map of {categoryId: {'In-Network' : attr, 'Out-Of-Network' : attr}} - to keep track of which categories have '_covered' attrs
        let subgroupMap = {};

        for (let i = 0; i < coverage.attributeCategories.records.length; i++) {
            const category = coverage.attributeCategories.records[i];
            for (let j = 0; j < category.productAttributes.records.length; j++) {
                const attr = category.productAttributes.records[j];
                if (attr.code.indexOf('_covered') > -1) {
                    $scope.showSwitch[coverage.productId] = true;
                    let key = attr.attributeGroupType || 'Other';
                    if (!switchCatMap[category.id]) {
                        switchCatMap[category.id] = {};
                    }
                    if (!subgroupMap[key]) {
                        subgroupMap[key] = [];
                    }
                    if (attr.userValues === null) {
                        attr.userValues = false;
                    }
                    switchCatMap[category.id][key] = attr.userValues;
                    subgroupMap[key].push(attr.userValues);
                }
            }
        }

        if (coverage.attributeCategories.records.length > 0) { //if coverage has attributeCategories determine switch value, else we will hide in UI
            $scope.switchMap[coverage.productId] = {};
            for (let subgroup in subgroupMap) {
                let isCovered;
                if (subgroupMap[subgroup].length > 1) { // more than one value - && values together
                    for (let i = 0; i < subgroupMap[subgroup].length - 1; i++) {
                        isCovered = subgroupMap[subgroup][i] || subgroupMap[subgroup][i + 1];
                    }
                } else { //if only one value map['In-Network'][True] set to true
                    isCovered = subgroupMap[subgroup][0];
                }
                $scope.switchMap[coverage.productId][subgroup] = isCovered; //set switchMap @coverageId to outcome
            }
        }
    };

    //If coverage does not return action in backend, make our own object
    /*
     * @param {String} method  - remote method
     * @param {Object} coverage - for Id
     */
    let setActionObj = function(method, coverage) {
        let action = {
            updateChildLine: {
                rest: {
                    'params': {},
                    'method': method,
                    'link': null
                }
            }
        };
        action.updateChildLine.remote = {
            params: {
                'quoteId': $rootScope.quoteId,
                'reprice': false,
                'quoteLineId': coverage.Id,
                'methodName': method,
                'attributeValues': {}
            }
        };
        return action;
    };

    // Function to set all attributeUserValues for attribute '_covered' to ng-model of switch - save to backend
    /*
     * @param {Object} coverage
     * @param {String} subgroup  - check attribute.userValue if attr.groupType = subgroup & code includes '_covered'
     */
    $scope.setCovered = function(coverage, subgroup) {
        $rootScope.isLoaded = false;
        let attributeMap = {};
        if (coverage.attributeCategories) {
            for (let i = 0; i < coverage.attributeCategories.records.length; i++) {
                let category = coverage.attributeCategories.records[i];
                for (let j = 0; j < category.productAttributes.records.length; j++) {
                    let attr = category.productAttributes.records[j];
                    if (attr.code.indexOf('_covered') > -1 && subgroup === attr.attributeGroupType) {
                        attr.userValues = $scope.switchMap[coverage.productId][subgroup]; //userValue sync up
                        attributeMap[attr.code] = attr.userValues; //set inputMap
                    }
                }
            }
        }
        let action = coverage.actions;
        if (!action) {
            action = setActionObj('updateChildLine', coverage);
        }
        action.updateChildLine.remote.params.attributeValues = attributeMap;
        insQLILargeGroupService.invokeAction(action.updateChildLine, $scope).then(function(response) {
            if (response) {
                $rootScope.notification.active = true;
                $rootScope.notification.type = 'success';
                $rootScope.notification.message = 'updated ' + coverage.productName + ' successfully';
                $timeout(function() {
                    $rootScope.notification.active = false;
                }, 2000);
            }
        });
    };

    // Toggle between add and remove child line on checkbox click
    /*
     * @param {Object} coverage
     */
    $scope.addRemoveChildLine = function(coverage) {
        if (coverage.isSelected) {
            $scope.addQLI(coverage);
        } else {
            $scope.removeQLI(coverage);
        }
    };

    // Expand all coverage accordions
    /*
     * @param {Array} coverages - if coverage has attrCategories - push to active panel
     */
    $scope.expandAll = function(coverages) {
        angular.forEach(coverages, function(coverage, i) {
            if (i === 0) {
                $scope.coverageAccordion.activePanels = [];
            }
            $scope.coverageAccordion.activePanels.push(i);
            if (coverage.attributeCategories && coverage.attributeCategories.records.length > 0) {
                $scope.decideOverflowClass(coverage, i);
            }
        });
        $rootScope.$broadcast('vloc-ins-expand-all', coverages);
    };

    // Collapse All coverage accordions
    /*
     * @param {Array} coverages - empty out activePanels list
     */
    $scope.collapseAll = function(coverages) {
        $scope.coverageAccordion.activePanels = [];
        angular.forEach(coverages, function(coverage, i) {
            if (coverage.attributeCategories && coverage.attributeCategories.records.length > 0) {
                $scope.decideOverflowClass(coverage, i);
            }
        });
        $rootScope.$broadcast('vloc-ins-collapse-all', coverages);
    };

    // On load check product records  - add in class if needed
    /*
     * @param {Object} checkProduct
     * @param {Integer} index
     */
    $scope.checkElement = function(checkProduct, index) {
        let productId = checkProduct.productId;
        if (checkProduct.attributeCategories.records.length > 0) {
            if (!$rootScope.checkElementLastProductId || ($rootScope.checkElementLastProductId && $rootScope.checkElementLastProductId !== productId)) {
                $rootScope.checkElementLastProductId = angular.copy(scope.productId);
                $scope.coverageAccordion.activePanels = [];
            }
            $rootScope.checkElementLastProductId = angular.copy(productId);
            $timeout(function() {
                if (element[0].className.indexOf('ng-hide') < 0 && !$scope.coverageAccordion.activePanels.length) {
                    checkProduct.push(index);
                    $(element).addClass('in');
                    decideOverflowClass(checkProduct, index);
                }
            });
        }
    };

    // Decide Overflow Class for Accordian
    /*
     * @param {Object} coverage
     * @param {Integer} index
     */
    $scope.decideOverflowClass = function(coverage, index) {
        if ($scope.coverageAccordion.activePanels.indexOf(index) > -1) {
            $timeout(function() {
                coverage.overflowUnset = true;
            }, 400);
        } else {
            coverage.overflowUnset = false;
        }
    };

    /*
     * Add Optional Coverage as QLI
     * Backend expects an attributeMap {code : value, code: value}
     * @param {Object} coverage
     */
    $scope.addQLI = function(coverage) {
        $rootScope.isLoaded = false;
        let attributeMap = {};
        if (coverage.attributeCategories) {
            for (let i = 0; i < coverage.attributeCategories.records.length; i++) {
                let category = coverage.attributeCategories.records[i];
                for (let j = 0; j < category.productAttributes.records.length; j++) {
                    let attr = category.productAttributes.records[j];
                    if (attr.userValues && attr.userValues.value) {
                        attributeMap[attr.code] = attr.userValues.value;
                    } else {
                        attributeMap[attr.code] = attr.userValues;
                    }
                }
            }
        }
        const inputMap = {
            rootLineId: $rootScope.rootLineId,
            prodRecordType: 'CoverageSpec',
            productId: coverage.productId,
            attributeValues: attributeMap,
        };
        const optionsMap = {
            reprice: false
        };
        insQLILargeGroupService.invokeRemoteMethod($scope, 'InsurancePCRuntimeHandler', 'addChildLine', inputMap, 'created quote line item successfully', optionsMap, coverage);
    };

    /*
     * Remove optional QLI
     * @param {Object} coverage
     */
    $scope.removeQLI = function(coverage) {
        $rootScope.isLoaded = false;
        const inputMap = {
            quoteLineId: coverage.Id,
            itemRecordType: 'CoverageSpec',
            minCount: 1
        };
        const optionsMap = {
            reprice: false
        };
        insQLILargeGroupService.invokeRemoteMethod($scope, 'InsurancePCRuntimeHandler', 'deleteChildLine', inputMap, 'deleted quote line item successfully', optionsMap);
    };

    //Listenter that executes updateQLI fn after rules have been evluated
    /**
     * @param {Object} e event
     * @param {Object} data containing product and attribute sent from insRules directive for updateQLI
     */
    $rootScope.$on('fire-onsave-event', function(e, data) {
        console.log('fire-onsave-event', data);
        $scope.updateQLI(data.product, data.attribute);
    });

    //Update QLI
    /**
     * @param {Object} coverage
     * @param {Object} attribute - attribute that has been changed
     */
    $scope.updateQLI = function(coverage, attribute) {
        let action = coverage.actions;
        if (!action) {
            action = setActionObj('updateChildLine', coverage);
        }
        if (attribute.code.indexOf('_covered') > -1) {
            $scope.showProduct(coverage);
        }
        action.updateChildLine.remote.params.attributeValues[attribute.code] = attribute.userValues;
        insQLILargeGroupService.invokeAction(action.updateChildLine, $scope).then(function(response) {
            if (response) {
                $rootScope.notification.active = true;
                $rootScope.notification.type = 'success';
                $rootScope.notification.message = 'updated ' + coverage.productName + ' successfully';
                $timeout(function() {
                    $rootScope.notification.active = false;
                }, 2000);
            }
        }); //call InvokeAction instead of InvokeRemoteMethod bc it handles reprice
    };

    //Toggle overflow class
    /**
     * @param {Event} event
     */
    $scope.toggleOverflow = function(event) {
        var toggleEl = $(event.currentTarget).next();
        if (toggleEl.hasClass('overflow-unset')) {
            toggleEl.removeClass('overflow-unset');
        } else {
            $timeout(function() {
                toggleEl.addClass('overflow-unset');
            }, 400);
        }
    };

}]);

vlocity.cardframework.registerModule.factory('insQLILargeGroupService', ['$http', 'dataSourceService', 'dataService', '$q', '$rootScope', 'InsValidationHandlerService', '$timeout', function($http, dataSourceService, dataService, $q, $rootScope, InsValidationHandlerService, $timeout) {
    'use strict';
    let REMOTE_CLASS = 'InsurancePCRuntimeHandler';
    let DUAL_DATASOURCE_NAME = 'Dual';
    let insideOrg = false;
    let errorContainer = {};

    let refreshList = function(type) {
        const message = {
            event: 'reload'
        };
        $rootScope.$broadcast('vlocity.layout.ins-quote-line-items-large-group.events', message);
        $rootScope.isLoaded = true;
    };

    function getDualDataSourceObj(actionObj) {
        let datasource = {};
        let temp = '';
        let nsPrefix = fileNsPrefix().replace('__', '');

        if (actionObj.remote && actionObj.remote.remoteClass) {
            temp = REMOTE_CLASS;
            REMOTE_CLASS = actionObj.remote.remoteClass;
        }
        if (actionObj) {
            datasource.type = DUAL_DATASOURCE_NAME;
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.inputMap = actionObj.remote.params || {};
            datasource.value.remoteClass = REMOTE_CLASS;
            datasource.value.remoteMethod = actionObj.remote.params.methodName;
            datasource.value.endpoint = actionObj.rest.link;
            datasource.value.methodType = actionObj.rest.method;
            datasource.value.body = actionObj.rest.params;
        } else {
            console.log('Error encountered while trying to read the actionObject');
        }
        if (temp) {
            REMOTE_CLASS = temp;
        }
        return datasource;
    }

    return {
        invokeRemoteMethod: function(scope, remoteClass, remoteMethod, inputMap, message, optionsMap, coverage) {
            let deferred = $q.defer();
            let nsPrefix = fileNsPrefix().replace('__', '');
            let datasource = {};
            console.log('Calling: ', remoteMethod);
            datasource.type = 'Dual';
            datasource.value = {};
            datasource.value.remoteNSPrefix = nsPrefix;
            datasource.value.remoteClass = remoteClass;
            datasource.value.remoteMethod = remoteMethod;
            datasource.value.inputMap = inputMap;
            datasource.value.optionsMap = optionsMap;
            datasource.value.apexRemoteResultVar = 'result.records';
            datasource.value.methodType = 'GET';
            datasource.value.endpoint = '/services/apexrest/' + nsPrefix + '/v2/campaigns/';
            datasource.value.apexRestResultVar = 'result.records';

            // no need to pass forceTk client below because on desktop, dual datasource will use ApexRemote
            // and on Mobile Hybrid Ionic, dual datasource will use ApexRest via forceng
            console.log('datasource', datasource);
            dataSourceService.getData(datasource, scope, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    if (coverage) {
                        coverage.Id = data.result.newLineItem.records[0].fields.Id.fieldValue;
                    }
                    $rootScope.notification.active = true;
                    $rootScope.notification.type = 'success';
                    $rootScope.notification.message = message;
                    $timeout(function() {
                        $rootScope.notification.active = false;
                    }, 2000);
                    refreshList();
                },
                function(error) {
                    console.error(error);
                    deferred.reject(error);
                    InsValidationHandlerService.throwError(error);
                    refreshList();
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        },
        /**Action : Use this method when the actions are straight forward based on actionObj.
         * {[object]} actionObj [Pass the action object]
         * rn {promise} [Result data]
         */
        invokeAction: function(actionObj, scope) {
            console.log(actionObj);
            let deferred = $q.defer();
            let datasource = getDualDataSourceObj(actionObj);
            dataSourceService.getData(datasource, null, null).then(
                function(data) {
                    console.log(data);
                    deferred.resolve(data);
                    if (data.result.calculatedPrice) { //If Reprice
                        if (scope.records.Id) {
                            let key = scope.records.Id;
                            if (scope.records.Id.fieldValue) {
                                key = scope.records.Id.fieldValue;
                            }
                            scope.records.TotalPrice.fieldValue = data.result.calculatedPrice[key];
                        }
                        for (let i = 0; i < scope.records.childProducts.records.length; i++) {
                            let key = scope.records.childProducts.records[i].Id;
                            if (typeof(key) === 'object') {
                                key = key.fieldValue;
                            }
                            if (key) {
                                scope.records.childProducts.records[i].TotalPrice.fieldValue = data.result.calculatedPrice[key];
                            }
                            if (scope.records.childProducts.records[i].childProducts) {
                                for (let j = 0; j < scope.records.childProducts.records[i].childProducts.records.length; j++) {
                                    let k = scope.records.childProducts.records[i].childProducts.records[j].Id;
                                    if (typeof(k) === 'object') {
                                        k = k.fieldValue;
                                    }
                                    if (k) {
                                        scope.records.childProducts.records[i].childProducts.records[j].TotalPrice.fieldValue = data.result.calculatedPrice[k];
                                    }
                                }
                            }
                        }
                    }
                    $rootScope.isLoaded = true;
                },
                function(error) {
                    deferred.reject(error);
                    console.log(error);
                    InsValidationHandlerService.throwError(error);
                    $rootScope.isLoaded = true;
                });
            return deferred.promise;
        }
    };
}]);

vlocity.cardframework.registerModule.factory('InsValidationHandlerService', ['$rootScope', '$sldsModal', '$timeout', function($rootScope, $sldsModal, $timeout) {
    'use strict';
    return {
        throwError: function(error) {
            let statusCode = '';
            let errorMsgTitle = 'There has been an Error';
            if ($rootScope.vlocity.customLabels && $rootScope.vlocity.customLabels.INSProdSelectErrorTitle && $rootScope.vlocity.customLabels.INSProdSelectErrorTitle[$rootScope.vlocity.userLanguage]) {
                errorMsgTitle = $rootScope.vlocity.customLabels.INSProdSelectErrorTitle[$rootScope.vlocity.userLanguage];
            }
            if (!error.message) {
                error.message = 'No error message.';
            }
            if (error.statusCode) {
                statusCode = '(' + error.statusCode + '): ';
            }
            if (typeof error.type === 'string') {
                error.type = error.type.charAt(0).toUpperCase() + this.slice(1) + ' ';
            } else {
                error.type = '';
            }
            if (error.message.indexOf('Logged in?') > -1) {
                error.message = 'You have been logged out of Salesforce. Please back up any changes to your document and refresh your browser window to login again.';
                error.type = '';
                statusCode = '';
            }
            $rootScope.notification.active = true;
            $rootScope.notification.type = 'error';
            $rootScope.notification.message = error.type + statusCode + error.message;
            $timeout(function() {
                $rootScope.isLoaded = true;
            }, 500);
        }
    };
}]);