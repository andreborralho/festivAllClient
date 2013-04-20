// MAP_CONTAINER


// Queries the local Database for a map
function createMapContainer(festival_map) {

    $('#header_link').unbind().bind('click', function(){
        header_link_pressed = true;
        createFestivalContainer(current_festival_id);
        changeContainers("#before_festival", current_festival_name, "");
    });

    $('#map_page').empty().append('<div id="map_scroll_wrapper" class="scroll_wrapper"><div>');

    $('#map_scroll_wrapper').append('' +
        '<div id="map_scroller">' +
            '<img alt="Mapa do Festival" src="' + festival_map +'">' +
        '</div>');

    $('#map_scroller').scroller({
        verticalScroll:true,
        horizontalScroll:true
    });
}
