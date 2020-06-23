vlocity.cardframework.registerModule.controller('anthem_card_canvas_ctrlr', ['$scope', function($scope) {

    $scope.show_action_panel = "false"

    $scope.check_layout = function(cards){
        if(cards){
            let card_layout_name_array = cards[0].layoutName.split(".")
            if(card_layout_name_array[card_layout_name_array.length - 1].includes("INS")){
                $scope.show_action_panel = true
            }else{
                $scope.show_action_panel = false
            }
        }
    }


}]);