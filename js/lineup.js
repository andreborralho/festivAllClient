// LINEUP_CONTAINER


// Inits carousel for lineup_container
var lineup_carousel;
function initLineup() {
    lineup_carousel=$("#lineup_carousel").carousel({
        preventDefaults:false
    });
}

// Queries the local Database for a show
function createLineupContainer(festival_id){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM SHOWS WHERE ID='+show_id, [], queryLineupSuccess, errorQueryCB);
        tx.executeSql('SELECT * FROM VIDEOS WHERE SHOW_ID='+show_id, [], queryShowVideosSuccess, errorQueryCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryLineupSuccess(tx, results) {

    var show = results.rows.item(0);
    $('.show_title').text(show.name);
    $('.show_title').bind('click', function(){
        changeContainers("#festival");
        //createFestivalContainer(this.id.replace("festival_", ""));
    });

    $('#show_photo').html('<img src="' + show.photo + '">');
    $('#show_description').html(show.description);
    initLineup();
}
