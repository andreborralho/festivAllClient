// SHOW_CONTAINER


// Inits carousel for show_container
var show_carousel;
function initShow() {
	show_carousel=$("#show_carousel").carousel({
		preventDefaults:false
	});				
}

// Queries the local Database for a show
function createShowContainer(show_id){
    initShow();

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM SHOWS WHERE ID='+show_id, [], queryShowSuccess, errorQueryCB);
        tx.executeSql('SELECT * FROM VIDEOS WHERE SHOW_ID='+show_id, [], queryShowVideosSuccess, errorQueryCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryShowSuccess(tx, results) {

    var show = results.rows.item(0);
    $('.show_title').text(show.name);

}
