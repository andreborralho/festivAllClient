// SHOW_CONTAINER

//Success callback for the query of all the videos of a given show
function queryShowVideosSuccess(tx, results){

    var videos = results.rows;
    var len = videos.length;

    for(var i = 0; i <len; i++){
        var video = videos.item(i);
        var video_name = video.name;
        var video_url = video.url;
        var video_id = video.id;
        //var video_description = 

// TUDO FODIDO
        $('#band_videos_page').append('<div id="video_' + video_id + '"></div>'); //TODO: POR A CLASSE DO DIV DE CADA VIDEO

        $('#video_' + video_id).append('<iframe width="260" height="100" ' +
            'src="http://www.youtube.com/embed/"' + video_url + '" frameborder="0" allowfullscreen></iframe>');

        //$('.video_name').text(video_name);
        //$('video_description').text(video_description);
    }
    //initShow();

}