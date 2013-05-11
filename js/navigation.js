window.onload = initDisplays;
window.menuIsUp = false;
var history_array = [];
//var carousel_pages = {"festivals":0};

//Loading
function initDisplays(){
    //set screen width and height according to device
    setHeightAndWidth();
    $('#loaderSplash').addClass("visible_splash");
}

function setHeightAndWidth(){
    var screen_height = window.innerHeight;
    var screen_width = window.innerWidth;
    $('body').css('height', screen_height + 'px').css('width', screen_width + 'px');
}

function initFestivalsDisplay(){
    $('#loaderSplash').removeClass("visible_splash");
    $('#festivals').addClass('visible');

    var container_height = $('#header').height()-2 + "px";
    $('#header').css('height', container_height);
}


//Navigation
function changeContainers(page, title, subtitle){
    var header_title_selector = $('#header_title');

    $('.container').removeClass("visible");
    $(page).addClass("visible");

    incrementHistory(page);

    if(page == "#festivals"){
        header_title_selector.removeClass('heading1').addClass('heading0');
        header_title_selector.html('<img id="logo" alt="FestivAll" src="img/logo.png"> FestivAll');
        $('#header_subtitle').empty();
        $('#header_link').unbind();
    }
    else if(page == "#before_festival"){
        $('#header_subtitle').empty();
        header_title_selector.removeClass('heading0').addClass('heading1');

        if(title == undefined)
            header_title_selector.text(current_festival_name);
        else
            header_title_selector.text(title);
    }
    else if(page == "#during_festival"){
        $('#header_subtitle').empty();
        header_title_selector.removeClass('heading0').addClass('heading1');

        if(title == undefined)
            header_title_selector.text(current_festival_name);
        else
            header_title_selector.text(title);
    }
    else if(page == "#shows"){
        $('#header_subtitle').text("Bandas");
        header_title_selector.removeClass('heading0').addClass('heading1');

        if(title == undefined)
            header_title_selector.text(current_festival_name);
        else
            header_title_selector.text(title);
    }
    else if(page == "#lineup"){
        $('#header_subtitle').text("Cartaz");
        header_title_selector.removeClass('heading0').addClass('heading1');

        if(title == undefined)
            header_title_selector.text(current_festival_name);
        else
            header_title_selector.text(title);
    }
    else if(page =="#feedback"){
        header_title_selector.removeClass('heading0').addClass('heading1').empty().text("Menu");
        $('#header_subtitle').text("Feedback");
    }
    else if(page =="#about_us"){
        header_title_selector.removeClass('heading0').addClass('heading1').empty().text("Menu");
        $('#header_subtitle').text("Quem somos");
    }
    else if(page =="#search"){
        header_title_selector.removeClass('heading0').addClass('heading1').empty().text("Menu");
        $('#header_subtitle').text("Pesquisa");
    }

    else if(page =="#search_results"){
        header_title_selector.removeClass('heading0').addClass('heading1').empty().text(search_token);
        $('#header_subtitle').text("Resultados da Pesquisa");

    }
    else{
        header_title_selector.removeClass('heading0').addClass('heading1').text(title);
        $('#header_subtitle').text(subtitle);
    }
}

function backButton(){
    if(menuIsUp){
        menuIsUp = false;
        $('#menu').removeClass('active_menu');
    }
    else{
        history_array.pop();
        var history_popped = history_array.pop();

        if(history_popped == undefined)
            confirmExit();
        else
            changeContainers(history_popped);
    }
}

function incrementHistory(page){
    history_array.push(page);
}

function fixHeaderLink(page){
    var history_popped = history_array.pop();
    while(history_popped != page){
        history_popped = history_array.pop();
    }
}

// process the confirmation dialog result
function onConfirm(button) {
    if(button==2)
        navigator.app.exitApp();
}
// Show a custom confirmation dialog
function confirmExit() {
    navigator.notification.confirm(
        'Queres mesmo sair?', // message
        onConfirm, // callback to invoke with index of button pressed
        'Sair', // title
        'Voltar,Sair' // buttonLabels
    );
}

function bindClickToNavBar(nav_items, carousel){
    var nav_item = "";
    for(var i=0; i<nav_items.length; i++){
        nav_item = nav_items[i];

        (function (i, nav_item, nav_items, carousel){
            $(nav_item).unbind().bind('click', function(){

                if(i == 0){
                    $(nav_items[i]).addClass('current').removeClass('not_current prev');
                    $(nav_items[i+1]).addClass('not_current next').removeClass('current');
                    $(nav_items[i+2]).addClass('hidden').removeClass('current');
                }
                else if(i == 1){
                    $(nav_items[i-1]).addClass('not_current prev').removeClass('current hidden');
                    $(nav_items[i]).addClass('current').removeClass('not_current next prev');
                    $(nav_items[i+1]).addClass('not_current next').removeClass('current hidden');
                }
                else if(i == 2){
                    $(nav_items[i-2]).addClass('hidden').removeClass('current');
                    $(nav_items[i-1]).addClass('not_current prev').removeClass('current');
                    $(nav_items[i]).addClass('current').removeClass('not_current next');
                }

                carousel.onMoveIndex(i, 200);
            });
        })(i, nav_item, nav_items, carousel);
    }
}




/*
// SWIPE BAR
function createSwipeBar(){
    
    $('li').unbind().bind('click', function() {
        $('li a').removeClass('current');
        $(this).find('a').addClass('current');
    });





    //nav Width
    var ul = $('.swipe_bar_list');
    var nav_width = ul.width();

    ul.find('li:eq(0)').unbind().bind('click', function() {
        ul.removeClass('middle last').addClass('first');
    });

    ul.find('li:eq(1)').unbind().bind('click', function() {
        ul.removeClass('first last').addClass('middle').css('margin-left', '-' + nav_width / 2);
    });

    ul.find('li:eq(2)').unbind().bind('click', function() {
        ul.removeClass('first middle').addClass('last');
    });

}*/