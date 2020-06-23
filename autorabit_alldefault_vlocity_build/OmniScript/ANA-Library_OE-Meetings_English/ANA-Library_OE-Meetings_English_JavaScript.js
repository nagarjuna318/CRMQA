jQuery( function() { jQuery('#OE_nextBtn').on('click', function()
{
       	jQuery('#StepValidation').val('').change();
       	var slength = baseCtrl.prototype.$scope.bpTree.response.OE.MeetingEntry.length;
       	if(slength>1) {
	     var svalue ='';  var sMessage = "Please Review The Respective Meeting's Required Fields: ";
             var j = 0; var icount = 0;
	     for (i=0; i < slength; i++){
	         j = i+1;
	         svalue =  baseCtrl.prototype.$scope.bpTree.response.OE.MeetingEntry[i].StepNextValidation; 
	        if (svalue == true){
	              icount  = icount  + 1;
	   	      sMessage = sMessage + "Meeting  " + j  + "; " ;
	        }
	      }
	     if (icount > 0){
	     		jQuery('#StepValidation').val(sMessage).change();
             }
       }
 	var scope = angular.element(jQuery('#OE_nextBtn')).scope(); 
   	scope.$apply( function() { scope.selectValue = '';
   }); }); });