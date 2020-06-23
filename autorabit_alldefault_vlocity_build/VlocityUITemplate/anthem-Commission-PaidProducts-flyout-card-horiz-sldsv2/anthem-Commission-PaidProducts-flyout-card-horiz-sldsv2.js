vlocity.cardframework.registerModule.controller('anthemCommissionPaidProductsController', ['$scope', function($scope) {
    $scope.getDisplayActions = function(obj) {
        var returnValue = true;
        console.log('--- anthemCommissionPaidProductsController getDisplayActions');
        if(!$scope.showHeader) {
            $scope.showOTher = true;
            returnValue = false;
            console.log('--- anthemCommissionPaidProductsController showHeader');
        }
            console.log('--- anthemCommissionPaidProductsController returnValue='+returnValue);
            return returnValue;
        
    };
}]);