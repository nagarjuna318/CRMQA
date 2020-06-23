vlocity.cardframework.registerModule.controller('stepController', stepController);
  
function stepController($timeout) {
    this.focusFirstInput = (name) => {
        $timeout(() => {
            let firstInput = $(`#${name}`).find('input, select');
            if (firstInput.length) {
                firstInput[0].focus();
            }
        }, 500); 
    }
}