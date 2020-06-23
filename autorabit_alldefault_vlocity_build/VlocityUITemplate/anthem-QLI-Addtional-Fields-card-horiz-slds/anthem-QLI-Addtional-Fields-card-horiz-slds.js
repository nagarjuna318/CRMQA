vlocity.cardframework.registerModule.controller('anthemQLIAdditionalFieldsController', ['$scope', function($scope) {
    
    $scope.converttoNumberFormat = function(obj, fieldlabel) {
        var value = '';
        if(fieldlabel == 'Initial Subscribers')
            value = obj['InitialSubscribers__c'];
        else if(fieldlabel == 'Initial Members')
            value = obj['InitialMembers__c'];
        if(value !== undefined){
            value = String(value);
            value = value.replace(new RegExp("^(\\d{" + (value.length%3?value.length%3:0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
            value = value.replace(/\s/g, ",");
        }
        return value;
    };
    
}]);