vlocity.cardframework.registerModule.controller('riders_selectable_items_controller', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {



	$scope.plan_to_rider_tracker = {}
	$scope.planid_to_rider_id = []

   $scope.setScopeItems = function(bpTree, control){

        $scope.bpResp = bpTree.response
        $scope.bpRiders = $scope.bpResp['Rider_Selection']['Rider_Info']
        $scope.ctrl = control.vlcSI['recSet']

    }

	$scope.checkForArray = function(bpTreeObject){

        var returnObj = {}
        
        if(!Array.isArray(bpTreeObject)){
            if(typeof bpTreeObject == "undefined"){
                returnObj = []
            }else{
                returnObj = [bpTreeObject]
            }
        }else{
            returnObj = bpTreeObject
        }

        return returnObj

    }

    $scope.rider_select = function(bpTree, control, plan, riderObj){
    	
    	var global_riders = $scope.checkForArray(bpTree.response['Rider_Info'])
    	var plans_list = bpTree.response['Rider_Selected_to_Plans']
    	var planId = plan.Id

    	var riders_list = [...plan.Custom_Riders_List]

    	if(!plan[planId + ":" + riderObj.Id]){
    		riders_list.forEach(function(rider_element, rider_index){

				if(rider_element.Id == riderObj.Id){
					plan.Custom_Riders_List.splice(rider_index, 1)
				}
			})

    	}else{
    		plan.Custom_Riders_List.push(riderObj)
    	}


    }

    $scope.rider_select_row = function(bpTree, control, plan){
    	var global_riders = $scope.checkForArray(bpTree.response['Rider_Info'])
    	var plans_list = bpTree.response['Rider_Selected_to_Plans']
    	var planId = plan.Id

    	plan.Custom_Riders_List = !plan.row ? [] : [...global_riders]

    	global_riders.forEach(function(rider_element, rider_index){
    			
    		plan[planId + ":" + rider_element.Id] = plan.row
				
    	})

    	
    }


    $scope.rider_select_all = function(bpTree, control){
    	var global_riders = $scope.checkForArray(bpTree.response['Rider_Info'])
    	var plans_list = bpTree.response['Rider_Selected_to_Plans']


    	plans_list.forEach(function(plan, plan_index){

    		var planId = plan.Id

    		plan.row = $scope.all_plan_to_rider_selected
    		
    		var riders_list = [...plan.Custom_Riders_List]


    		plan.Custom_Riders_List = !$scope.all_plan_to_rider_selected ? [] : [...global_riders]


    		global_riders.forEach(function(grider_element, grider_index){
    				
    			plan[planId + ":" + grider_element.Id] = $scope.all_plan_to_rider_selected

    		})
	

    	})

		



    }



}])