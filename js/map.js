// MAP_CONTAINER


// Queries the local Database for a map
function createMapContainer(festival_map) {
    $('.page_title').text("Mapa");
    $('#map_page').html('<img src="' + festival_map +'">');
}
