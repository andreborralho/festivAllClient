// FESTIVALS_CONTAINER


// Queries the local Database for all festivals
function createFestivalsContainer(){
    db.transaction(function queryFestivals(tx) {
		tx.executeSql('SELECT * FROM FESTIVALS', [], queryFestivalsSuccess, errorQueryCB);
    }, errorCB);
}

function appendFestivalsHTML(){
    $('#festivals_carousel').remove();
    $('#festivals').append('' +
        '<div id="festivals_carousel" class="carousel" data-role="carousel">' +
            '<div id="festivals_page" class="page" data-role="page">' +
                '<div id="festivals_scroll_wrapper" class="scroll_wrapper">' +
                    '<ul id="festivals_buttons" class="festival_list"></ul>' +
                '</div>' +
            '</div>' +
            '<div id="search_page" class="page" data-role="page">' +
                '<form id="search_input_wrap" class="input_wrap">' +
                    '<input id="search_input" class="input_field" type="text" placeholder="Nome de uma banda...">' +
                    '<div id="search_button" class="input_button">' +
                        '<span class="icon_search"></span>' +
                    '</div>' +
                '</form>' +
            '</div>' +
        '</div>');
}

// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {
    appendFestivalsHTML();

	$('#festivals_carousel').css('display', 'block');
    incrementHistory("#festivals");

    var len = results.rows.length;
    for (var i=0; i<len; i++){
        var festival = results.rows.item(i);
		var festival_id = festival.id;

        $('#festivals_buttons').append('<li id="festival_' + festival_id +'" class="item"></li>');
        $('#festival_'+festival_id).append('<a href="#"><img src="' + festival.logo + '"></a>');

        $('#festival_'+festival_id).unbind().bind('click', function(){
            createFestivalContainer(this.id.replace("festival_", ""));
        });
    }

    $('#festivals_buttons').scroller();

    createSearchContainer();
    initFestivalsCarousel();
}

function initFestivalsCarousel(){
    festivals_carousel = $('#festivals_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            var softkeyboard = window.cordova.plugins.SoftKeyBoard;

            if(index == 0){
                $('#festivals_nav_item').addClass('current').removeClass('not_current');
                $('#search_nav_item').addClass('not_current next').removeClass('current');

                softkeyboard.hide();
            }
            else if(index == 1){
                $('#search_nav_item').addClass('current').removeClass('not_current next');
                $('#festivals_nav_item').addClass('not_current prev').removeClass('current');

                //document.getElementById('search_input').focus();

                softkeyboard.show();
                //$('#search_input').trigger('click');
            }
            carousel_pages.festivals = index;
        }
    });
}