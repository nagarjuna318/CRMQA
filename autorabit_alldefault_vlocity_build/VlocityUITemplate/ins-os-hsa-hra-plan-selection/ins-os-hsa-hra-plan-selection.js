var itemLst = [];
baseCtrl.prototype.selectProductPlan = function(p,prodPlan){

    var showAddPlanBLock = false;
    
    console.log('test ----->>>>>>');
    //console.log('p in List1 ----->>>>>>'+JSON.parse(p));
    console.log('p in List2 ----->>>>>>'+JSON.stringify(p));
    var str = JSON.stringify(p);
    var strTest = JSON.parse(str);
    console.log('parsed Content ----->>>>>>'+strTest);
    console.log('parsed Content 1 ----->>>>>>'+p["vlcSelected"]);

    for(var i=0; i<prodPlan.length; i++){
        
        if((prodPlan[i]["ActWiseChild"] == '' || prodPlan[i]["ActWiseChild"] == undefined) && prodPlan[i]["vlcSelected"] == false){
            showAddPlanBLock = true;
        }

    }
    console.log('showAddPlanBLock ----->>>>>>'+showAddPlanBLock);
    //baseCtrl.prototype.$scope.applyCallResp( { "PlanSelection": p } );

    //var vlSelected = p["vlcSelected"];

    itemLst.push(p);

    const result = Array.from(new Set(itemLst.map(s => s.Id)))
    .map(Id => {
    return {
        Id: Id,
        Name: itemLst.find(s => s.Id === Id).Name,
        ActWiseChild: itemLst.find(s => s.Id === Id).ActWiseChild,
        $$hashKey: itemLst.find(s => s.Id === Id).$$hashKey,
        vlcSelected: itemLst.find(s => s.Id === Id).vlcSelected
    };
    }); 
    // update starts
	/*var numbers = result ;
	var resultLst = [];
	numbers.forEach(myFunction);

	function myFunction(value) {
	  if(value.vlcSelected == true){
		resultLst.push(value);
		console.log('--> '+JSON.stringify(resultLst));
	  }
	}*/
	//update ends

    console.log('itemLst ----->>>>>>'+JSON.stringify(result));
    baseCtrl.prototype.$scope.applyCallResp( { "SelectedPlansForAct": result} );
    baseCtrl.prototype.$scope.applyCallResp( { "showAddPlanBLock": showAddPlanBLock} );
    //return p;
};