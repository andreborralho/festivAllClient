// MAP_CONTAINER


// Queries the local Database for a map
function createMapContainer(festival) {

    $('#header_link').unbind().bind('click', function(){
        createFestivalContainer(current_festival_id);
        fixHeaderLink('#'+festival_container+'_festival');
    });

    $('#map_page').empty().append('<div id="map_scroll_wrapper" class="scroll_wrapper"><div>');
    $('#map_scroll_wrapper').append('' +
        '<div id="map_scroller">' +
            '<img alt="Mapa" src="">' +
        '</div>');

    //Check if the logo file exists
    var filename = festival.name + 'map.jpg';
    var hasMap = localStorage[filename];
    console.log('ADDING MAP: hasMap :' + hasMap + ', festival.map : ' + festival.map);
    var file_path = 'file:///data/data/com.festivall_new/'  + filename;
    var url = festival.map;
    //Ajax call to download logo if it is not stored
    if(hasMap == undefined || festival.map != hasMap){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
                var fileTransfer = new FileTransfer();
                fileTransfer.download(
                    url,
                    file_path,
                    function(entry) {
                        console.log('download success in festivals from url ' + url);
                        localStorage[filename] = url;
                        addMap(festival, file_path);
                    },
                    function(error) {
                        console.log("download error source " + error.source);
                        $('#map_scroll_wrapper').empty();
                        $('#map_scroll_wrapper').append('' +
                            '<div id="map_scroller" class="padded"><p>Mapa ainda não disponível.</p></div>');
                    }
                );
            });
        }, fail);
    }
    else{
        addMap(festival, file_path);
    }
}

function addMap(festival, file_path){
    var dummy = makeid();
    console.log('FETCHING LOGO :' + file_path);
    $('#map_scroller').empty();
    $('#map_scroller').append('<img alt="Mapa" src="' + file_path + '?dummy=' + dummy + '">');
    $('#map_scroller').scroller({
        verticalScroll:true,
        horizontalScroll:true
    });

}