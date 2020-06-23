vlocity.cardframework.registerModule.controller('testvlcStepController', ['$scope', function($scope) {


    $scope.helloworld = function(){
        console.log("bpTree_Test")
    }

    $scope.mynextRepeater = function(bpTree, control, childObj, childNextIndex, childIndexInParent){
        console.log("TEST!!!!")
    }



}]);