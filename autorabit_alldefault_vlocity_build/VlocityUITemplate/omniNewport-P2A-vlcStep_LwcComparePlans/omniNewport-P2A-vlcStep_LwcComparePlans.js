vlocity.cardframework.registerModule.controller('testvlcStepController', ['$scope', 'LWC', function($scope, LWC) {

    $scope.lwc = LWC

    $scope.helloworld = function(){
        console.log("bpTree_Test")
    }

    $scope.mynextRepeater = function(bpTree, control, childObj, childNextIndex, childIndexInParent){
        console.log("TEST!!!!")
    }



}]);