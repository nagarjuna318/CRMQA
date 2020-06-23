vlocity.cardframework.registerModule.controller('deductible_coins_step_controller', ['$scope', function($scope) {


   $scope.shouldDisableNext = function(bpTree){
       var next_disable_flag = true
       
       if((bpTree.response.primary_selection && bpTree.response.secondary_selection) || bpTree.response.skip_selection){
           next_disable_flag = false
       }

       return next_disable_flag
   }



}]);