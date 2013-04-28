//Menu button callback
function menuButton(e){
    if(!menuIsUp){
        menuIsUp = true;
        createMenuContainer();
    }
    else{
        menuIsUp = false;
        $('#menu').hide();
    }
}

function feedbackButton(){
    menuIsUp=false;
    createFeedbackContainer();
    $('#menu').hide();
    changeContainers('#feedback', 'Menu', 'Feedback');
}

function aboutUsButton(){
    menuIsUp=false;
    createAboutUsContainer();
    $('#menu').hide();
    changeContainers('#about_us', 'Menu', 'Quem somos');
}

function createMenuContainer(){
    $('#header_link').unbind().bind('click', function(){
        backButton();
    });

    $('#menu').show();

    $('#menu_home_link').unbind().bind('click', function(){
        $('#menu').hide();
        changeContainers('#festivals', '', '');
        fixHeaderLink('#festivals');
    });
    $('#menu_about_us_link').unbind().bind('click', function(){
        aboutUsButton();
    });
    $('#menu_feedback_link').unbind().bind('click', function(){
        feedbackButton();
    });
    $('#menu_exit_link').unbind().bind('click', function(){
        confirmExit();
    });

    $('#menu').not('#menu_container').bind('click', function(){
        $(this).hide();
        menuIsUp = false;
    });

}