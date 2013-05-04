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
        $('#menu').hide();
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
        'Queres mesmo bazar?', // message
        onConfirm, // callback to invoke with index of button pressed
        'Sair', // title
        'Voltar,Sair' // buttonLabels
    );
}
