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
        alert('video name :' + video_name);

        $('#band_videos_page').append('<div id="video_' + video_id + '"></div>'); //TODO: POR A CLASSE DO DIV DE CADA VIDEO
        $('#video_' + video_id).append('<a href="#" onclick="window.plugins.videoPlayer.play(\'http://www.youtube.com/watch?v=' + video_url + '\');">' + video_name + '</a>');

        //$('.video_name').text(video_name);
        //$('video_description').text(video_description);
    }
    //inits the show_carousel
    $('#show_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#show_nav_item').removeClass('not_current');
                $('#videos_nav_item').addClass('not_current next');
            }
            else if(index == 1){
                $('#videos_nav_item').removeClass('not_current next');
                $('#show_nav_item').addClass('not_current prev');
            }
        }
    });
    //initShow();

}