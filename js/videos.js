// VIDEOS_CONTAINER

//Success callback for the query of all the videos of a given show
function queryShowVideosSuccess(tx, results){
    if(navigator.network.connection.type == Connection.NONE){
        $('#band_videos_scroller').append('Sem connexão à Internet é impossível mostrar os vídeos.');
    }else{

        var videos = results.rows;
        var len = videos.length;
        if(len >0 ){

        for(var i = 0; i <len; i++){
            var video = videos.item(i);
            var video_name = video.name;
            var video_url = video.url;
            var video_id = video.id;

            $('#band_videos_scroller').append(''+
                '<div id="video_' + video_id + '">' +
                    '<h3 class="video_name">' + video_name + '</h3>' +
                    '<a href="#" class="video_wrap" onclick="window.plugins.videoPlayer.play(\'http://www.youtube.com/watch?v=' + video_url + '\');">' +
                        '<span class="icon_videoplay"></span>' +
                        '<img class="video_img" src="http://img.youtube.com/vi/' + video_url + '/mqdefault.jpg">' +
                    '</a>' +
                '</div>'
            );
        }
        //init scroller
        $('#band_videos_scroller').scroller();

        //keep the navbar on first page
        $('#show_nav_item').addClass('current').removeClass('not_current');
        $('#videos_nav_item').addClass('not_current next').removeClass('current');

        initShowCarousel();
        }else{$('#band_videos_scroller').append('Não existe nenhum vídeo disponivel');}
    }
}

function initShowCarousel(){
    var show_carousel = $('#show_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            createPagingSwipeBar(index, ['#show_nav_item','#videos_nav_item']);
        }
    });

    bindClickToNavBar(['#show_nav_item','#videos_nav_item'], show_carousel);
}