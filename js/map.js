// MAP_CONTAINER


// Queries the local Database for a map
function createMapContainer(festival_map) {
    incrementHistory("#festival");

    $('.page_title').text("Mapa");

    $('.column').bind('click', function(){
        $('.column').unbind();

        changeContainers("#festival");
        createFestivalContainer(current_festival_id);
    });

    $('#map_page').html('<img src="' + festival_map +'">');
}
