vlocity.cardframework.registerModule.controller('riders_selectable_items_controller', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {



	$scope.plan_to_rider_tracker = {}
	$scope.planid_to_rider_id = []
    $scope.originally_associated_riders = {}
    $scope.global_list_of_rider_ids = []
    $scope.rider_counter

    $scope.empty_state_check = false

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

    $scope.rider_select_onload = function(bpTree, control){
        
        
        bpTree.response.Disassociated_Riders = []
        bpTree.response.Parent_QLI_Disassociated_Riders = []

        // if(typeof(bpTree.response.Rider_Info) == "undefined"){
        //     $scope.empty_state_check = !$scope.empty_state_check
        // }


        var disassoc_list = bpTree.response.Disassociated_Riders

        

        var association_list = []
        var association_list_copy = []

        var checkExist = setInterval(function() {

            
        
            if(typeof bpTree.response['Rider_Plan_Assoc'] !== "undefined") {
                var global_riders = $scope.checkForArray(bpTree.response['Rider_Info'])
                var plans_list = $scope.checkForArray(bpTree.response['ChildQLI'])
                //need to add logic in case this won't come in the reponse 
                association_list = $scope.checkForArray(bpTree.response['Rider_Plan_Assoc']) // will this ever be blank or not come at all?
                // association_list_copy = [...association_list]

                // $scope.rider_counter = 0


                //1) Assemble list of global rider ids

                global_riders.forEach(function(rider, index){
                    $scope.global_list_of_rider_ids.push(rider.Id)
                })

                //2) Check if all associated riders

                association_list.forEach(function(assoc, index){

                    if($scope.global_list_of_rider_ids.includes(assoc.Rider_Id)){

                        // $scope.originally_associated_riders[assoc.Rider_Id] = assoc

                        // $scope.rider_counter+=1
                        association_list_copy.push(assoc)

                        $scope.originally_associated_riders[assoc.Quote_Line_Item_ID + ":" + assoc.Rider_Id] = assoc

                        plans_list.forEach(function(plan, pIndex){
                            

                            if(plan.Id == assoc.Quote_Line_Item_ID){
                                plan[plan.Id + ":" + assoc.Rider_Id] = true
                                if(typeof plan.rider_counter == "undefined"){
                                    plan.rider_counter = 1
                                }else{
                                    plan.rider_counter+=1
                                }
                            }
                            

                        })

                        


                    }else{
                        //remove from association list and put in own array on bpTree
                        bpTree.response.Parent_QLI_Disassociated_Riders.push(assoc)
                        // association_list_copy.splice(index, 1);
                    }


                })



                bpTree.response['Rider_Plan_Assoc'] = association_list_copy

                //  plans_list.forEach(function(plan, pIndex){
                //     plan.rider_counter = $scope.rider_counter

                // })


                $scope.$apply()
                clearInterval(checkExist);
            }

        
        }, 100);

    }

    $scope.rider_select = function(bpTree, control, plan, riderObj){
        
        var global_riders = $scope.checkForArray(bpTree.response['Rider_Info'])
        var plans_list = $scope.checkForArray(bpTree.response['ChildQLI'])
        
        var association_list = $scope.checkForArray(bpTree.response['Rider_Plan_Assoc'])
        var association_list_copy = [...association_list]

        
        var disassoc_list = $scope.checkForArray(bpTree.response.Disassociated_Riders)
        var disassoc_list_copy = [...disassoc_list]

        if(!plan.Custom_Riders_List){
           plan.Custom_Riders_List = [] 
        }

        var rider_list = plan.Custom_Riders_List

        //1) Determine if should preselect

        if(!plan[plan.Id + ":" + riderObj.Id]){

            // false or non existent checked boxes

            // Check if rider id is in the originally associated list

            if(Object.keys($scope.originally_associated_riders).includes(plan.Id + ":" + riderObj.Id)){
                association_list.forEach(function(assoc, index){
                    if((assoc.Rider_Id == riderObj.Id) && (plan.Id == assoc.Quote_Line_Item_ID)){
                        association_list_copy.splice(index, 1)
                        if(typeof plan.rider_counter == "undefined"){
                            plan.rider_counter = 1
                        }else{
                            plan.rider_counter-=1
                        }
                    }
                })

                bpTree.response['Rider_Plan_Assoc'] = association_list_copy
                bpTree.response.Disassociated_Riders.push($scope.originally_associated_riders[plan.Id + ":" + riderObj.Id])

            }else{
                rider_list.forEach(function(rider_element, rider_index){

                    if(rider_element.Id == riderObj.Id){
                        plan.Custom_Riders_List.splice(rider_index, 1)
                        if(typeof plan.rider_counter == "undefined"){
                            plan.rider_counter = 1
                        }else{
                            plan.rider_counter-=1
                        }
                    }
                })

            }



        }else{

            if(Object.keys($scope.originally_associated_riders).includes(plan.Id + ":" + riderObj.Id)){

                disassoc_list.forEach(function(item, index){
                    if((item.Rider_Id == riderObj.Id) && (plan.Id == item.Quote_Line_Item_ID)){
                        disassoc_list_copy.splice(index, 1)
                        if(typeof plan.rider_counter == "undefined"){
                            plan.rider_counter = 1
                        }else{
                            plan.rider_counter+=1
                        }
                    }
                })

                bpTree.response.Disassociated_Riders = disassoc_list_copy

                bpTree.response['Rider_Plan_Assoc'].push($scope.originally_associated_riders[plan.Id + ":" + riderObj.Id])

                

            }else{
                plan.Custom_Riders_List.push(riderObj)
                if(typeof plan.rider_counter == "undefined"){
                    plan.rider_counter = 1
                }else{
                    plan.rider_counter+=1
                }
            }

            
        }


    }



    $scope.rider_select_row = function(bpTree, control, plan){
    	var global_riders = $scope.checkForArray(bpTree.response['Rider_Info'])
    	var plans_list = $scope.checkForArray(bpTree.response['ChildQLI'])

        var association_list = $scope.checkForArray(bpTree.response['Rider_Plan_Assoc'])
        var association_list_copy = [...association_list]

        var disassociation_list = $scope.checkForArray(bpTree.response['Disassociated_Riders'])
        var disassociation_list_copy = [...disassociation_list]

        if(!plan.Custom_Riders_List){
           plan.Custom_Riders_List = [] 
        }


        if(!plan.row){

            plan.Custom_Riders_List = []
            plan.rider_counter = 0
            var new_association_list = []

            association_list.forEach(function(assoc, item){
                if(plan.Id == assoc.Quote_Line_Item_ID){
                    bpTree.response['Disassociated_Riders'].push(assoc)    
                }else{
                    new_association_list.push(assoc)
                }
                
            })

            

            bpTree.response['Rider_Plan_Assoc'] = new_association_list


        }else{
            
            global_riders.forEach(function(elem, index){
                if(!Object.keys($scope.originally_associated_riders).includes(plan.Id + ":" + elem.Id) && plan.rider_counter != global_riders.length){
                    plan.Custom_Riders_List.push(elem)
                    if(typeof plan.rider_counter == "undefined"){
                        plan.rider_counter = 1
                    }else{
                        plan.rider_counter+=1
                    }
                }
            })

            // plan.Custom_Riders_List = [...global_riders]

            var new_disassociation_list = []

            disassociation_list.forEach(function(assoc, item){
                if(plan.Id == assoc.Quote_Line_Item_ID){
                    bpTree.response['Rider_Plan_Assoc'].push(assoc)
                    if(typeof plan.rider_counter == "undefined"){
                        plan.rider_counter = 1
                    }else{
                        plan.rider_counter+=1
                    }

                }else{
                    new_disassociation_list.push(assoc)
                }
                
            })

            bpTree.response['Disassociated_Riders'] = new_disassociation_list

        }


    	global_riders.forEach(function(rider_element, rider_index){
    			
    		plan[plan.Id + ":" + rider_element.Id] = plan.row
				
    	})

    	
    }


    $scope.rider_select_all = function(bpTree, control){
    	var global_riders = $scope.checkForArray(bpTree.response['Rider_Info'])
    	var plans_list = $scope.checkForArray(bpTree.response['ChildQLI'])

        var association_list = $scope.checkForArray(bpTree.response['Rider_Plan_Assoc'])
        var disassociation_list = $scope.checkForArray(bpTree.response['Disassociated_Riders'])

        if(!$scope.all_plan_to_rider_selected){

            association_list.forEach(function(assoc, item){
                bpTree.response['Disassociated_Riders'].push(assoc)
            })

            bpTree.response['Rider_Plan_Assoc'] = []

        }else{
            disassociation_list.forEach(function(assoc, item){
                bpTree.response['Rider_Plan_Assoc'].push(assoc)
            })

            bpTree.response['Disassociated_Riders'] = []
        }



    	plans_list.forEach(function(plan, plan_index){

            if(!plan.Custom_Riders_List){
               plan.Custom_Riders_List = [] 
            }

    		plan.row = $scope.all_plan_to_rider_selected

            if(!$scope.all_plan_to_rider_selected){

                plan.Custom_Riders_List = []
                
                plan.rider_counter=0


            }else{
                
                global_riders.forEach(function(elem, index){
                    if(!Object.keys($scope.originally_associated_riders).includes(plan.Id + ":" + elem.Id) && plan.rider_counter != global_riders.length){
                        plan.Custom_Riders_List.push(elem)
                    }
                })

                plan.rider_counter=global_riders.length


            }


            global_riders.forEach(function(rider_element, rider_index){
                    
                plan[plan.Id + ":" + rider_element.Id] = $scope.all_plan_to_rider_selected
                    
            })

            


    	})

		



    }



}])