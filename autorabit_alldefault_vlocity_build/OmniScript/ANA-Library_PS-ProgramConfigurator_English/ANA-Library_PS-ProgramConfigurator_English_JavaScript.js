function hideSetValues(){
    console.info("hideSetValues");
    var el = document.getElementById('ConfigureProgramSetValues');
    el.setAttribute('style', 'display:none !important');
}

function showSetValues(){
    console.info("showSetValues");
    var el = document.getElementById('ConfigureProgramSetValues');
    el.setAttribute('style', 'display:flex !important');
}