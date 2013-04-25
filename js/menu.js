//Menu button callback
function menuButton(e){
    if(!menuIsUp){
        menuIsUp = true;
        createMenuContainer();
        changeContainers('#menu', '', '');
    }
    else{
        menuIsUp = false;
        backButton();
    }
}

function feedbackButton(){
    menuIsUp=false;
    createFeedbackContainer();
    changeContainers('#feedback', 'Menu', 'Feedback');
}

function aboutUsButton(){
    menuIsUp=false;
    createAboutUsContainer();
    changeContainers('#about_us', 'Menu', 'Quem somos');
}

function createMenuContainer(){
    $('#header_link').unbind().bind('click', function(){
        changeContainers('#festivals', '', '');
        fixHeaderLink('#festivals');

    });

    $('#menu_home_link').unbind().bind('click', function(){
        changeContainers('#festivals', '', '');
        fixHeaderLink('#festivals');

    });
    $('#menu_about_us_link').unbind().bind('click', function(){
        aboutUsButton();
    });
    $('#menu_feedback_link').unbind().bind('click', function(){
        feedbackButton();
    });
}