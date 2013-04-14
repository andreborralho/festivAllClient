//Menu button callback
function menuButton(){
    if(menuIsUp){
        menuIsUp = false;
        //takes down menu z-index

        //feedback test
        createFeedbackContainer();
        changeContainers('#feedback');
    }else{
        menuIsUp = true;
        //to-do
    }
}