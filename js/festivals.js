// FESTIVALS_CONTAINER
var festivals_carousel;

// Queries the local Database for all festivals
function createFestivalsContainer(){
    db.transaction(function queryFestivals(tx) {
		tx.executeSql('SELECT * FROM FESTIVALS', [], queryFestivalsSuccess, errorQueryCB);
    }, errorCB);
}


// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {

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