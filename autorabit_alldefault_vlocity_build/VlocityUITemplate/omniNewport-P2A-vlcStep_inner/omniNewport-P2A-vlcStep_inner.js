vlocity.cardframework.registerModule.controller('custom-inner-step-controller', ['$scope', '$rootScope', function($scope, $rootScope) {
// $scope.$watch('child.eleArray', function(){
//         console.log("market selection updated!!!")
//     })

// $scope.test = function(bpTree){
//     console.log("bpTree_Test")

// }

    $scope.myNextRepeater = function(child, childinex, parentindex){

        console.log(child)

        $scope.nextRepeater(childinex, parentindex);


    }


}]);