vlocity
  .cardframework
  .registerModule
  .controller('recordListController', RecordListController);

RecordListController.$inject = ['$scope', '$rootScope', '$filter', '$log', '$sce'];
function RecordListController($scope, $rootScope, $filter, $log, $sce) {
    // Patch for v101 upgrade
    if (!Array.isArray($scope.records)) {
        $scope.records = [$scope.records];              
    }
  // Public Fields
  var _this = this;
  _this.totals = {};
  _this.hasRollup = {};
  _this.showTotals = false;
  _this.previewMode = false;
  _this.fieldsLimit = undefined;
  _this.previewFieldsOffset = undefined;
  _this.recordActions = [];
  
  // Filtering
  _this.filterableFields = [];
  _this.filterByField = {};
  _this.filterByValue = {};
  _this.initialToDate = new Date(); 
  _this.initialFromDate = new Date();
  _this.initialFromDate.setMonth(_this.initialToDate.getMonth() - 13);
  _this.filterByValue.toDate = _this.initialToDate;
  _this.filterByValue.fromDate = _this.initialFromDate;
  
  // Sorting
  _this.sortableFields = [];
  _this.orderBy = $scope.orderBy || '';
  _this.orderReverse = $scope.orderReverse ||false;

  // Public Methods
  _this.init = init;
  _this.sortTable = sortTable;
  _this.filterRecords = filterRecords;
  _this.normalizeObjectPath = normalizeObjectPath;
  _this.toggleSelection = toggleSelection;
  _this.getFlyoutData = getFlyoutData;
  _this.performAction = performAction;

  
  // Method Definitions
  function init() {
    // Custom Path

    if (angular.isDefined($scope.data.jsonPath)) {
      $scope.records = _.get($scope.records, $scope.data.jsonPath);
    }

    // Record Actions
    angular.forEach($scope.data.recordActions, function(actionIndex) {
      _this.recordActions = _this.recordActions.concat($scope.data.actions.splice(actionIndex, 1));
    });
    
    // Filterable Fields
    if (angular.isDefined($scope.data.filterableFields)) {
      setupFilterableFields();
    }
    
    // Sortable Fields
    if ($scope.data.sortableFields) {
      setupSortableFields($scope.data);
    }
    // Rollup Fields
    if ($scope.data.rollupFields !== undefined) {
      setRollupTypes($scope.data)
      if($scope.data.subtractFields){
          calculateTotals($scope.records,true);
      } else {
          calculateTotals($scope.records);
      }
    }
    
    // Preview Flyout
    if ($scope.data.flyout) {
      _this.previewMode = true;
    }
    // Preview Fields

    if ($scope.data.previewFieldsAfter !== undefined) {
      setupPreviewMode($scope.data);
    } else {
      _this.fieldsLimit = $scope.data.fields.length;
    }
    
  }


  function getNoralizedControllerName(layoutName) {
      $log.debug('attempting getNoralizedControllerName', layoutName);
      return $.camelCase(layoutName.replace(/[^a-zA-Z0-9 :]/g, '-'));
  }
  // Currently rollup fields are based on type "field.type".
  // TBD Individually specify fields to rollup by name.
  function setRollupTypes(data) {
    _this.showTotals = true;
    if (angular.isArray(data.rollupFields)) {
      angular.forEach(data.rollupFields, function(val) {
        _this.hasRollup[val] = true;
      }); 
    } else {
      _this.hasRollup[data.rollupFields] = true;
    }
  }

  /**
   * no longer used - delete this code in R3
   * calculate the value of customerPaidAmount for each record
   */
  function calculateOutofExpense(){
    angular.forEach($scope.records, function(value, key) {
		if($scope.records[key].extension.inNetworkFeeAmount.amount == 0.00 || $scope.records[key].extension.inNetworkFeeAmount.amount == {})
		   $scope.records[key].extension.customerPaidAmount.amount = $scope.records[key].extension.originalFeeAmount.amount - $scope.records[key].extension.benefitPaidAmount.amount; 
        else
			$scope.records[key].extension.customerPaidAmount.amount = $scope.records[key].extension.inNetworkFeeAmount.amount - $scope.records[key].extension.benefitPaidAmount.amount; 
	  });
  }
  
  /**
   * setupFilterableFields
   * @description filterable fields can be enabled by setting either the literal value 'all',
   * a single fields name, or an array of field names.
   */
  function setupFilterableFields() {
    switch (true) {
      case angular.isString($scope.data.filterableFields) && $scope.data.filterableFields.toLowerCase() === 'all' :
        // property is 'all' meaning all fields should be filterable
        _this.filterableFields = ['all'];
        break;
      case angular.isString($scope.data.filterableFields) :
        // property is a single field name
        var field = $filter('filter')($scope.data.fields, {name: $scope.data.filterableFields}, true)[0];
        if (field) {
          _this.filterableFields.push(field);
        }
        break;
      case angular.isArray($scope.data.filterableFields) :
        // property is an array
        angular.forEach($scope.data.filterableFields, function(fieldName) {
          var field = $filter('filter')($scope.data.fields, {name: fieldName}, true)[0];
          if (field) {
            _this.filterableFields.push(field);
          }
        });
        break;
      default :
        $log.error('Unexpected filterable fields defined', $scope.data.filterableFields);
        break;
    }

    if (!angular.isDefined(_this.filterableFields)) {
      $log.error('No field names were matched for assigned filterable fields:',$scope.data.filterableFields);
    } else {
      _this.filterByField = _this.filterableFields[0];
    }
  }

  function setupSortableFields(data) {
    switch (true) {
    
      case (typeof data.sortableFields == 'string' && data.sortableFields.toLowerCase() == 'all'):
        angular.forEach(data.fields, function(field) {
          _this.sortableFields.push(field.name);
        });  
        break;
      
      case angular.isArray(data.sortableFields):
        _this.sortableFields = data.sortableFields;
        break;
      
      default:
        console.warn('sortableFields must either be an array of field names, or the string: \'all\'');
        break;
    }
    if (angular.isDefined($scope.data.defaultSort)) {
      var defaultSort = $scope.data.defaultSort;
      if (/^-/.test(defaultSort)) {
        _this.orderReverse = true;
        sortTable(defaultSort.substr(1));
      } else {
        sortTable(defaultSort);
      }
    }
  }

  function calculateTotals(records,subtract) {
    angular.forEach(records, function(row) {
      angular.forEach($scope.data.fields, function(field) {
        if (_this.hasRollup[field.type]) {
          var val = _.get(row, field.name);
          // console.info('calc totals label', field.label, val);
          if (!isNaN(val)) {
            if (_this.totals[field.label] === undefined) {
              _this.totals[field.label] = 0;
            }
            if(subtract){
                _this.totals[field.label] -= parseFloat(val);
            } 
            else{
                _this.totals[field.label] += parseFloat(val);
            }
          }

        }
      });
    });

  }



  function filterRecords(records) {
     if (!$scope.data.filterableFields || !_this.filterByField || !angular.isDefined(_this.filterByValue)) {
       return records;
     } else {
       var field = normalizeObjectPath(_this.filterByField.name);
       if (_this.filterByField.type === 'date' || _this.filterByField.type === 'date time') {
         return $filter('vsDateRange')(records, field, (_this.filterByValue.fromDate)? _this.filterByValue.fromDate.setDate(_this.filterByValue.fromDate.getDate() - 1) : undefined, _this.filterByValue.toDate);
       } else if (_this.filterByField == 'all') {
         return $filter('filter')(records, _this.filterByValue.query);
       } else {
         return $filter('filter')(records, makePredicate(field,_this.filterByValue.query));
       }
     }
  }

  function getFlyoutData(path) {
    _this.flyoutData =  _.get($scope, path);
  }

  function makePredicate(path, match) {
    return buildObject(path.split('.'), match);
  }
  // Todo, make this a filter
  function buildObject(path, initial) {
    obj = {};
    obj[path.pop()] = initial;
    if (path.length) {
      return buildObject(path, obj);
    } else {
      return obj;
    }
  }

  function normalizeObjectPath(path) {
    if (/\[/g.test(path)) {
      // "['this']['is']['an']['object']" = this.is.an.object
      path = path.replace(/(\[')(\w+)('\])/g, '$2.').replace(/\.$/, '');
    }
    return path;
  }
  

  function performAction() {
    var thisArgs = arguments;
    if (thisArgs[0] && thisArgs[0].hasExtraParams && thisArgs[0].extraParams.methodName) {
      peformControllerAction(thisArgs[0].extraParams);
    } else {
      $scope.performAction.apply(_this, thisArgs);
    }

  }

  function peformControllerAction(params) {
    let method = _.get($scope, params.methodName);
    if (method) {
      method.call(this, params);
    } else {
      console.warn('Method ' + params.methodName  + ' not found.', params);
    }
  }

  function sortTable(fieldName) {
    if (/\[/g.test(fieldName)) {
      fieldName = normalizeObjectPath(fieldName);
    }
    if (_this.orderBy == fieldName) {
      _this.orderReverse = !_this.orderReverse;
    } else {
      _this.orderReverse = _this.orderReverse || false;
    }
    
    _this.orderBy = fieldName;
  } 

  function setupPreviewMode(data) {
    _this.previewMode = true;
    _this.fieldsLimit = data.previewFieldsAfter;
    _this.previewFieldsOffset = (_this.fieldsLimit < data.fields.length)? (data.fields.length - _this.fieldsLimit) : 0;
  }
  
  /**
   * 
   * @param {*} selection 
   */
  function toggleSelection(selection) {
    if (_this.selectedRecord == selection) {
       
      delete _this.selectedRecord;
    } else {
      _this.selectedRecord = selection;
    }
  }

}