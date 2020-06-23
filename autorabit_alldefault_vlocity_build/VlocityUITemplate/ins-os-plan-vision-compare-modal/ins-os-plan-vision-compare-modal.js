vlocity.cardframework.registerModule.controller('insOsPlanCompareModalCtrl_vision', ['$scope', '$rootScope', function($scope, $rootScope) {
    'use strict';

    // $scope variables
    $scope.currencyCode = '$';
    if (baseCtrl.prototype.$scope.bpTree.oSCurrencySymbol) {
        $scope.currencyCode = baseCtrl.prototype.$scope.bpTree.oSCurrencySymbol;
    }

    //Attribute Group Type Label Map
    $scope.attributeGroupTypeLabels = {
        'In-Network': '- In',
        'Out-Of-Network': '- Out'
    };


    /* Format userValue if date type
    * @params {Date} date obj or string (fn handles both)
    * @params {Boolean} isDateTime whether or not to display time
    */
    $scope.formatDate = function(date, isDatetime) {
        let formattedDate = null;
        if (!date) {
            console.error('This date is invalid', date);
            return formattedDate;
        } else {
            let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            if (moment) {
                monthNames = moment.months();
                formattedDate = moment(date).format('MMMM Do YYYY');
                if (isDatetime) {
                    formattedDate = moment(date).format('MMM. Do YYYY, h:mm a');
                }
            } else {
                const dateObj = new Date(date);
                if (Object.prototype.toString.call(dateObj) === '[object Date]') {
                    if (isNaN(dateObj.getTime())) {
                        if (typeof date === 'string' && date.indexOf('.') > -1) {
                            date = date.split('.')[0];
                            return $scope.formatDate(date);
                        }
                    }
                } else {
                    console.error('This date is invalid', date);
                }
                formattedDate = monthNames[dateObj.getUTCMonth()] + ' ' + dateObj.getUTCDate() + ' ' + dateObj.getUTCFullYear();

                if (isDatetime) {
                    formattedDate = formattedDate + ' ' + dateObj.toLocaleTimeString();
                }
            }
        }
        return formattedDate;
    };


    // Local functions

    // function getCategories(attributeRows){

    //     var category_list = ["Plan Details"]

    //     angular.forEach(attributeRows, function(attr){

    //         category_list.push(attr.categoryName)

    //     });

    //     return category_list

    // }

    function reformatContent(formattedContent){
        //Function for reformatting for sections in updated Compare Modal Style
        var re_formatted_content = formattedContent

        re_formatted_content.categorized_list = {"Plan Overview" : []}
        // var category_list = getCategories(formattedContent.attributeRows)
        let plan_overview_labels = ["Network", "Contract Code", "In Network Coinsurance", "In Network Deductible Single", "In Network Deductible Family", "In Network Coinsurance", "In Network Out of Pocket Max Single", "Co Pay - Primary Care Provider (INN)"]


        // re_formatted_content.plan_overview = []
        // re_formatted_content.plan_details = []


        var category = ""

        angular.forEach(formattedContent.attributeRows, function(product, productIterator){
            
            category = product.categoryName
            
            if (plan_overview_labels.includes(product.label)){
                re_formatted_content.categorized_list["Plan Overview"].push(product)
            }else if(!re_formatted_content.categorized_list[category]){
                re_formatted_content.categorized_list[category] = []
                re_formatted_content.categorized_list[category].push(product)
            }else{
                re_formatted_content.categorized_list[category].push(product)
            }



        });

        return re_formatted_content


    }

    function formatContent(products) {
        console.log('formatContent', products);
        var formattedContent = {
            topRow: [],
            attributeRows: [],
            attributeIndices: {}
        };
        angular.forEach(products, function(product, productIterator) {
            if (product[baseCtrl.prototype.$scope.nsPrefix  + 'RecordTypeName__c'] !== 'RatingFactSpec' && product.RecordTypeName__c !== 'RatingFactSpec') {
                formattedContent.topRow.push({
                    ProductCode: product.ProductCode,
                    Name: product.Name || product.productName,
                    Id: product.Id,
                    Price: product.Price,
                    disabledByRateBand: product.disabledByRateBand,
                    tier: product.tier,
                    productData: product
                });

                if(formattedContent.attributeRows.length == 0){
                    formattedContent.attributeRows.push({
                        label: "Network",
                        productCodes: [],
                        attributeValues: [{
                                    PlanId: product.Id,
                                    userValues: product.Network__c
                                }
                        ]
                        
                    });

                    formattedContent.attributeRows.push({
                        label: "Contract Code",
                        productCodes: [],
                        attributeValues: [{
                                    userValues: product.Contract_Code__c
                                }
                        ]
                        
                    });
                }else{
                    formattedContent.attributeRows[0].attributeValues.push(
                        {
                            PlanId: product.Id,
                            userValues: product.Network__c
                        }
                    );
                    formattedContent.attributeRows[1].attributeValues.push(
                        {
                            PlanId: product.Id,
                            userValues: product.Contract_Code__c
                        }
                    );
                }



                if (product.attributeCategories && product.attributeCategories.records) {

                    angular.forEach(product.attributeCategories.records, function(attributeCategory) {
                        if (attributeCategory.productAttributes && attributeCategory.productAttributes.records) {

                            angular.forEach(attributeCategory.productAttributes.records, function(productAttribute) {

                                if(!productAttribute.hidden){
                                    var attributeRowsLength;
                                    var prod_code = productAttribute.code

                                    if (formattedContent.attributeIndices.hasOwnProperty(productAttribute.code)) {
                                    
                                        if (!formattedContent.attributeRows[formattedContent.attributeIndices[productAttribute.code]][product.ProductCode]) {
                                            formattedContent.attributeRows[formattedContent.attributeIndices[productAttribute.code]].attributeValues[productIterator] = {
                                                PlanId: product.Id,
                                                ProductCode: product.ProductCode,
                                                attributeCode: productAttribute.code,
                                                userValues: productAttribute.userValues,
                                                dataType: productAttribute.dataType,
                                                inputType: productAttribute.inputType,
                                                attributeGroupType: productAttribute.attributeGroupType,
                                                hidden: productAttribute.hidden,
                                                formattedValues: productAttribute.formattedValues
                                            };
                                            formattedContent.attributeRows[formattedContent.attributeIndices[productAttribute.code]].productCodes.push(product.ProductCode);
                                        }
                                    } else {
                                        formattedContent.attributeRows.push({
                                            label: productAttribute.label,
                                            productCodes: [],
                                            attributeValues: Array.apply(null, Array(products.length)).map(function () {
                                                return {
                                                    PlanId: '',
                                                    ProductCode: '',
                                                    attributeCode: '',
                                                    userValues: '--',
                                                    dataType: null,
                                                    inputType: null
                                                };
                                            }),
                                            categoryDisplaySequence: attributeCategory.displaySequence,
                                            attributeDisplaySequence: productAttribute.displaySequence,
                                            attributeGroupType: productAttribute.attributeGroupType,
                                            categoryName: attributeCategory.Name
                                        });
                                        attributeRowsLength = formattedContent.attributeRows.length;
                                        formattedContent.attributeRows[attributeRowsLength - 1].attributeValues[productIterator] = {
                                            PlanId: product.Id,
                                            ProductCode: product.ProductCode,
                                            attributeCode: productAttribute.code,
                                            userValues: productAttribute.userValues,
                                            dataType: productAttribute.dataType,
                                            inputType: productAttribute.inputType,
                                            attributeGroupType: productAttribute.attributeGroupType,
                                            hidden: productAttribute.hidden,
                                            multiselect: productAttribute.multiselect,
                                            formattedValues: productAttribute.formattedValues
                                        };
                                        formattedContent.attributeRows[attributeRowsLength - 1].productCodes.push(product.ProductCode);
                                        formattedContent.attributeIndices[productAttribute.code] = attributeRowsLength - 1;
                                    }
                                }
                            });
                        }
                       


                    });
                }
            }
        });
        // Sort by category displaySequence first, then by attribute displaySequence, then by label
        formattedContent.attributeRows = formattedContent.attributeRows.sort(function(x, y) {
            if (x.categoryDisplaySequence === y.categoryDisplaySequence) {
                if (x.attributeDisplaySequence < y.attributeDisplaySequence) {
                    return -1;
                } else {
                    return 1;
                }
            } else if (x.categoryDisplaySequence < y.categoryDisplaySequence) {
                return -1;
            } else if (x.categoryDisplaySequence > y.categoryDisplaySequence) {
                return 1;
            } else {
                if (x.label < y.label) {
                    return -1;
                } else {
                    return 1;
                }
            }
        });
        return formattedContent;
    }

    /* Function to init compare modal - formattedConent and childConent are used to display the table
    * @params {obj} records list of products to formatted and displayed for comparison
    */
    $scope.initCompareModal = function(records) {
        // $scope.formattedContent = formatContent(records)
        $scope.formattedContent = records;
        // $scope.$apply();
    };


    //removeFromComparison
    //on click, pass productID
    //if(top row length is =0)
        //exit
    //else
        //ADD productID to all attribute value objects

        //loop through all attributeRows.attributeValues
            //if network or contract code, just pop based on id
        //loop through all productCodes and pop
    $scope.removeCompare = function(plan, control){
        var planid = plan.Id
        var formattedContent = $scope.formattedContent
        var modalRecords = $scope.modalRecords
        var formattedContent_keys = Object.keys(formattedContent);
        var attr_rows = []

        plan.productData.vlcCompSelected = false
        $scope.decrTotalCount()

        delete control[control.name].newCompareSelectMap[plan.productData.Id]

        if(plan.productData.selected){
            $scope.removeInsSgpsNode(plan.productData.Id)
            //delete $scope.insSgpsNode.cartCompareSelectMap[plan.productData.Id]
        }
            //$scope.toggleCartCompareSelect(plan.productData, control);

            attr_rows = formattedContent.attributeRows

            //delete from top row

            for(var w = 0; w < formattedContent.topRow.length; w++){
                var plan_w = formattedContent.topRow[w]

                if(planid === plan_w.Id){
                    $scope.formattedContent.topRow.splice(w,1)
                }
            }

           

            //delete attribute value object
            for(var i = 0; i < attr_rows.length; i++){
                var attr = attr_rows[i]
                var attr_vals = attr.attributeValues

                for(var j = 0; j < attr_vals.length; j++){
                    var attr_val_inner = attr_vals[j]

                    if(planid === attr_val_inner.PlanId){
                        $scope.formattedContent.attributeRows[i].attributeValues.splice(j, 1)
                    }

                }
            }

            if(formattedContent.topRow.length == 0){
                    $scope.$slideHide();
            }


        


    } 


    $scope.decideHtmlClasses = function() {
        var htmlClass = '';
        var constantClasses = 'slds-large-size--1-of-' + ($scope.formattedContent.topRow.length + 2) + ' slds-small-size--1-of-' + $scope.formattedContent.topRow.length + ' nds-large-size--1-of-' + ($scope.formattedContent.topRow.length + 2) + ' nds-small-size--1-of-' + $scope.formattedContent.topRow.length;
        if ($scope.formattedContent.topRow.length === 1) {
            htmlClass = constantClasses + ' slds-max-small-size--1-of-1 nds-max-small-size--1-of-1';
        } else if ($scope.formattedContent.topRow.length > 1) {
            htmlClass = constantClasses + ' slds-max-small-size--1-of-2 nds-max-small-size--1-of-2';
        }
        return htmlClass;
    };

    $scope.selectProductFromCompare = function(product) {
        var selectProductEvent = new CustomEvent('vloc-ins-os-product-details-compare-modal-select-product', {
            detail: {
                ProductCode: product.ProductCode
            }
        });
        document.dispatchEvent(selectProductEvent);
        $scope.cancel();
    };
}]);