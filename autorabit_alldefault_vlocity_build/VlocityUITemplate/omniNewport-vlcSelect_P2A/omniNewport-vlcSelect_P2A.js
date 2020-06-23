vlocity.cardframework.registerModule.controller('SelectController', ['$scope', '$rootScope', function($scope, $rootScope){
    $scope.test = function(bpTree, control){
        console.log(control)

        console.log(bpTree)
        // control.children[0].eleArray[0].propSetMap.HTMLTemplateId = "omniNewport-vlcTypeAhead_P2A"
    }


}]);