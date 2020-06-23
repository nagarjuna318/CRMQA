vlocity.cardframework.registerModule.controller('myBtnController', ['$scope', function($scope) {
    
    $scope.createCompetitorObj = function(bpTree, control){
        
        if(typeof(bpTree.response.CompetitorCheck) === "undefined"){
            bpTree.response.CompetitorCheck = 0
            //$scope.competitorCount = bpTree.response.CompetitorCheck;        
        }

    }

    

    $scope.myButtonClick = function(bpTree, bpObj, control, obj){

        // Check competitor Object
        // if(0) => check if AddComp2 is visible, if yes, click AddComp3, else Click
        // else{
        //     check if AddComp3 is visible, if yes, click AddComp2, else clcik add Comp3
        // }
        
        if(bpTree.response.CompetitorCheck == 0){
            if(bpTree.response.SelectServiceProvider.AddComp2){
                bpTree.response.SelectServiceProvider.AddComp3 = true
                // $scope.competitorCount++;
                bpTree.response.CompetitorCheck++;
                jQuery('#AddComp3').click()
            }else{
                bpTree.response.SelectServiceProvider.AddComp2 = true
                // $scope.competitorCount++;
                bpTree.response.CompetitorCheck++;
                jQuery('#AddComp2').click()
            }
        }else{
            if(bpTree.response.SelectServiceProvider.AddComp3){
                bpTree.response.SelectServiceProvider.AddComp2 = true
                // $scope.competitorCount++;
                bpTree.response.CompetitorCheck++;
                jQuery('#AddComp2').click()
            }else{
                bpTree.response.SelectServiceProvider.AddComp3 = true
                // $scope.competitorCount++;
                bpTree.response.CompetitorCheck++;
                jQuery('#AddComp3').click()
            }
        }
        // bpTree.response.SelectServiceProvider.AddComp2 = true
        // jQuery('#AddComp2').click()
        // $scope.buttonClick(bpObj, control, obj)

    }



}]);