// VIDEOS_CONTAINER

//Success callback for the query of all the videos of a given show
function queryShowVideosSuccess(tx, results){

    var videos = results.rows;
    var len = videos.length;

    for(var i = 0; i <len; i++){
        var video = videos.item(i);
        var video_name = video.name;
        var video_url = video.url;
        var video_id = video.id;

        $('#band_videos_page').append(''+
            '<div id="video_' + video_id + '" class="row">' +
                '<a href="#" onclick="window.plugins.videoPlayer.play(\'http://www.youtube.com/watch?v=' + video_url + '\');">' +
                    '<img src="http://img.youtube.com/vi/4hpEnLtqUDg/default.jpg">' +
                    '<div class="column">' +
                        '<h3>' + video_name + '</h3>' +
                    '</div>' +
                '</a>' +
            '</div>'
        );
    }

    //keep the navbar on first page
    $('#show_nav_item').addClass('current').removeClass('not_current');
    $('#videos_nav_item').addClass('not_current next').removeClass('current');

    initShowCarousel();
}

function initShowCarousel(){
    $('#show_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#show_nav_item').addClass('current').removeClass('not_current');
                $('#videos_nav_item').addClass('not_current next').removeClass('current');
            }
            else if(index == 1){
                $('#show_nav_item').addClass('not_current prev').removeClass('current');
                $('#videos_nav_item').addClass('current').removeClass('not_current next');
            }
        }
    });
}