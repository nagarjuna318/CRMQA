var itemLst = [];

baseCtrl.prototype.checkProductPlan = function(p, prodVar){

    var isCreateNewConfig = false;

    var selectedPlanId;

    console.log('test ----->>>>>>');
    
     console.log('test Var ----->>>>>>'+JSON.stringify(prodVar));

    for(var i=0; i<prodVar.length; i++){
        console.log('test result ---->>>>> '+JSON.stringify(prodVar[i]));
        console.log(' p variable ---->>>>> '+prodVar[i]["vlcSelected"] + ' ------ result ID ---->>>>> '+prodVar[i]["Id"] + ' ----- P ID ----- >>>>>'+p["Id"]);
        if(prodVar[i]["Id"] != p["Id"]){
            prodVar[i]["vlcSelected"] = false;
        }

    }

    console.log('p in List2 ----->>>>>>'+JSON.stringify(p));
    var str = JSON.stringify(p);
    var strTest = JSON.parse(str);
    console.log('parsed Content ----->>>>>>'+strTest);
    console.log('parsed Content 1 ----->>>>>>'+p["vlcSelected"]);
    
    

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
    

    console.log('itemLst ----->>>>>>'+JSON.stringify(result));

    var isSelected = false;
    for(var i=0; i<result.length; i++){
        console.log('test result ---->>>>> '+JSON.stringify(result[i]));
        console.log(' p variable ---->>>>> '+result[i]["vlcSelected"] + ' ------ result ID ---->>>>> '+result[i]["Id"] + ' ----- P ID ----- >>>>>'+p["Id"]);
        if(result[i]["Id"] != p["Id"]){
            result[i]["vlcSelected"] = false;
        }
        else{
            selectedPlanId = p["ActWisePlanId"];

        }
        if(result[i]["Name"] === "Create New Configuration" && result[i]["vlcSelected"]){
            isCreateNewConfig = true;
        }
        else if(result[i]["Name"] === "Create New Configuration" && !result[i]["vlcSelected"]){
            isCreateNewConfig = false;
        }
        if(result[i]["vlcSelected"]){
            isSelected = true;
        }
        else if(!isSelected){
            // Do Nothing
        }        
    }
    console.log('itemLst modified ----->>>>>>'+JSON.stringify(result));

    console.log('isSelected ----->>>>>>'+isSelected);

    console.log('selectedPlanId ----->>>>>>'+selectedPlanId);

    baseCtrl.prototype.$scope.applyCallResp( { "ReconfigSelectedPlansForAct": result} );

    baseCtrl.prototype.$scope.applyCallResp( { "isCreateConfig": isCreateNewConfig} );

    baseCtrl.prototype.$scope.applyCallResp( { "selectedPlanId": selectedPlanId} );

    baseCtrl.prototype.$scope.applyCallResp( { "isSelectedReconfigPlan": isSelected} );


    return prodVar;
   
}