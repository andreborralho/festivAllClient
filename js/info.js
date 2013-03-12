// INFO_CONTAINER


// Inits carousel for info_container
var info_carousel;
function initInfo() {
	info_carousel=$('#info_carousel').carousel({
		preventDefaults:false
	});				
}
// Queries the local Database for a show
function createInfoContainer(festival_id){
    initInfo();

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM FESTIVALS WHERE ID='+festival_id, [], queryInfoSuccess, errorCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryInfoSuccess(tx, results) {

    var festival = results.rows.item(0);
    $('#tickets_page').append(festival.tickets);
    $('#transports_page').append(festival.transports);
}
