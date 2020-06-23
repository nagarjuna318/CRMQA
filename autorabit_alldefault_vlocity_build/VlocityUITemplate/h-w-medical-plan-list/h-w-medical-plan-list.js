vlocity.cardframework.registerModule.controller('displayPlansOfQuote', ['$scope', function($scope) {

$scope.checkArray = function(bpTree, plans){
  if(!Array.isArray(plans)){
    bpTree.response.CoPlans = [plans]
    return [plans]
  }else{
    var trueArr=[];
    plans.forEach(function(element,index){
      if(bpTree.response.ContextId == element.Id){
        plans[index][element.Id] = true; 
      }
      if(plans[index][element.Id] == true){
        trueArr.push(element);
      }
    });
  }
  bpTree.response.trueArr = trueArr;
  return plans;
}

$scope.captureAllRows = function(bpTree,control){
  var qliArray =   [...bpTree.response['CoPlans']];

  if($scope.checkAll){
    trueArr=[];
    qliArray.forEach(function(element,index){
      qliArray[index][element.Id] = true; 
       trueArr.push(element);
    });
  }else if(!$scope.checkAll) {
    qliArray.forEach(function(element,index){
      qliArray[index][element.Id] = false;
    });
    trueArr =[];
  }
    bpTree.response.trueArr = trueArr;
}


$scope.captureClickedRow = function(bpTree,control,plan){

var qliArray =   [...bpTree.response['CoPlans']];

  if(plan[plan.Id] ===  true){
      trueArr.push(plan);
  }else if(plan[plan.Id] ===  false){
    trueArr.forEach(function(element,index){
      if(trueArr[index].Id === plan.Id){
        trueArr.splice(index, 1);
      }
    });  
  }
  bpTree.response.trueArr = trueArr;

  if(trueArr.length === qliArray.length){
    $scope.checkAll =  true;
  }else{
    $scope.checkAll =  false;
  }
}

}]);