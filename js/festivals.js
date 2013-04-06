// FESTIVALS_CONTAINER


// Queries the local Database for all festivals
function createFestivalsContainer(){
    createSearchPage();

    db.transaction(function queryFestivals(tx) {
		tx.executeSql('SELECT * FROM FESTIVALS', [], queryFestivalsSuccess, errorQueryCB);
    }, errorCB);
}

// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {

    $('#festivals_carousel').remove();
    $('#festivals').append('' +
        '<div id="festivals_carousel" class="carousel" data-role="carousel">' +
            '<div id="festivals_page" class="page" data-role="page" >' +
                '<div id="festivals_scroll_wrapper" class="scroll_wrapper">' +
                    '<ul id="festivals_buttons" class="festival_list"></ul>' +
                '</div>' +
            '</div>' +
            '<div id="search_page" class="page" data-role="page">' +
                '<form class="input_wrap">' +
                    '<input id="search_input" class="input_field" type="text" placeholder="Nome de uma banda...">' +
                    '<div id="search_button" class="input_button"><h1>0</h1></div>' +
                '</form>' +
                '<div id="search_scroll_wrapper" style="max-height:390px;max-width:100%;">' +
                    '<ul id="search_list" class="list" data-role="list"></ul>' +
                '</div>' +
            '</div>' +
        '</div>');

	$('#festivals_carousel').css('display', 'block');
    incrementHistory("#festivals");

    var len = results.rows.length;
    for (var i=0; i<len; i++){
        var festival = results.rows.item(i);
		var festival_id = festival.id;

        $('#festivals_buttons').append('<li id="festival_' + festival_id +'" class="item"></li>');
        $('#festival_'+festival_id).append('<a href="#"><img src="' + festival.logo + '"></a>');

        $('#festival_'+festival_id).bind('click', function(){
            createFestivalContainer(this.id.replace("festival_", ""));
        });
    }

    $('#festivals_buttons').scroller();

    // Inits carousel for festivals_container
    $('#festivals_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#festivals_nav_item').removeClass('not_current');
                $('#search_nav_item').addClass('not_current next');
            }
            else if(index == 1){
                $('#search_nav_item').removeClass('not_current next');
                $('#festivals_nav_item').addClass('not_current prev');
            }
        }
    });
}
