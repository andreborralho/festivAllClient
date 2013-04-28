window.onload = initDisplays;
window.menuIsUp = false;
var history_array = [];
var carousel_pages = {"festivals":0, "before_festival":0};

//Loading
function initDisplays(){
    $('.container').hide();
    $('#loaderSplash').show();
    //set screen width and height according to device
    setHeightAndWidth();
}

function initFestivalsDisplay(){
    $('#loaderSplash').hide();
    $('#festivals').show();

    var container_height = $('#header').height()-2 + "px";
    $('#header').css('height', container_height);
}

function setHeightAndWidth(){
    var screen_height = window.innerHeight;
    var screen_width = window.innerWidth;
    $('body').css('height', screen_height + 'px').css('width', screen_width + 'px');
}

//Navigation
function changeContainers(page, title, subtitle){
    var header_title_selector = $('#header_title');

    $('.container').hide();
    $(page).show();

    //$('.container').css('opacity','0');
    //$(page).css('opacity','1');

    incrementHistory(page);

    if(page == "#festivals"){
        header_title_selector.removeClass('heading1').addClass('heading0');
        header_title_selector.html('<img id="logo" alt="FestivAll" src="img/logo.png"> FestivAll');
        $('#header_subtitle').empty();

        refreshNavBar('festivals', ["#festivals", "#search"]);
    }
    else if(page == "#before_festival"){
        $('#header_subtitle').empty();
        header_title_selector.removeClass('heading0').addClass('heading1');

        if(title == undefined)
            header_title_selector.text(current_festival_name);
        else
            header_title_selector.text(title);

        refreshNavBar('before_festival', ["#festival", "#shows"]);
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
    /*else if(page =="#menu"){
     header_title_selector.removeClass('heading1').addClass('heading0');
     header_title_selector.html('<img id="logo" alt="FestivAll" src="img/logo.png"> FestivAll');
     $('#header_subtitle').empty();
     }*/
    else if(page =="#feedback"){
        header_title_selector.removeClass('heading0').addClass('heading1').empty().text("Menu");
        $('#header_subtitle').text("Feedback");


    }
    else if(page =="#about_us"){
        header_title_selector.removeClass('heading0').addClass('heading1').empty().text("Menu");
        $('#header_subtitle').text("Quem somos");
    }

    else if(page =="#search_results"){
        header_title_selector.removeClass('heading0').addClass('heading1').empty().text(search_token);
        $('#header_subtitle').text("Resultados da Pesquisa");

        $('#header_link').unbind().bind('click', function(){
            changeContainers("#festivals", "", "");
            softkeyboard.show();
        });
    }
    else{
        header_title_selector.removeClass('heading0').addClass('heading1').text(title);
        $('#header_subtitle').text(subtitle);
    }
}

function refreshNavBar(key, pages){
    if(carousel_pages[key] == 0){
        $(pages[0] + '_nav_item').addClass('current').removeClass('not_current');
        $(pages[1] + '_nav_item').addClass('not_current next').removeClass('current');
    }
    else if(carousel_pages[key] == 1){
        $(pages[0] + '_nav_item').addClass('not_current prev').removeClass('current');
        $(pages[1] + '_nav_item').addClass('current').removeClass('not_current next');
    }
}


function backButton(){
    history_array.pop();
    var history_popped = history_array.pop();

    if(history_popped == undefined)
        confirmExit();
    else
        changeContainers(history_popped);
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
        'Queres mesmo bazar?', // message
        onConfirm, // callback to invoke with index of button pressed
        'Sair', // title
        'Voltar,Sair' // buttonLabels
    );
}
