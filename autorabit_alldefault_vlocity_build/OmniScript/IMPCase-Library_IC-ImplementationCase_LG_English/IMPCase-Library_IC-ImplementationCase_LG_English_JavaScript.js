jQuery( function() { jQuery("body").on("keyup", "#BrokerageName", function() {

jQuery("[id='BrokerageName']").each(function(i,v){

if(jQuery("[id='BrokerageId']").eq(i).val()!=''){
 }
else{
      jQuery("[id='ConsultantName']").eq(i).val('').change();
      angular.element(jQuery("[id='ConsultantName']")).eq(i).triggerHandler('input');
    
    
}
}); 
  }); 
});