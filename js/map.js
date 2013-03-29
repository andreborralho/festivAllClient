// MAP_CONTAINER


// Queries the local Database for a map
function createMapContainer(festival_map) {
    incrementHistory("#festival");

    $('#header_title').bind('click', function(){
        $('#header_title').unbind();

        createFestivalContainer(current_festival_id);
        changeContainers("#festival", current_festival_name, "");
    });

    $('#map_page').html('<img src="' + festival_map +'">');
}
