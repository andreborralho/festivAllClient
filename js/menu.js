//Menu button callback
function menuButton(e){
    if(!menuIsUp){
        menuIsUp = true;
        createMenuContainer();
        changeContainers('#menu');
    }else{
        menuIsUp = false;
        backButton();
    }
}

function feedbackButton(){
    menuIsUp=false;
    createFeedbackContainer();
    changeContainers('#feedback', 'Menu', 'Feedback');
}

function aboutusButton(){
    menuIsUp=false;
    createAboutusContainer();
    changeContainers('#aboutus', 'Menu', 'About Us');
}

function createMenuContainer(){
    $('#header_link').unbind().bind('click', function(){
        changeContainers('#festivals');
    });
}