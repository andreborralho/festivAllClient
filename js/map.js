// MAP_CONTAINER


// Queries the local Database for a map
function createMapContainer(festival_map) {

    $('#header_link').unbind().bind('click', function(){
        createFestivalContainer(current_festival_id);
        changeContainers("#before_festival", current_festival_name, "");
    });

    $('#map_page').html('<img src="' + festival_map +'">');
}
