// FESTIVALS_CONTAINER

// Queries the local Database for all festivals
function createFestivalsPage(){
    db.transaction(function queryFestivals(tx) {
		tx.executeSql('SELECT * FROM FESTIVALS', [], queryFestivalsSuccess, errorCB);
		}, errorCB);
}

// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {

    var len = results.rows.length;
    for (var i=0; i<len; i++){
        var festival = results.rows.item(i);
		var festival_id = festival.id;

        $('#festivals_buttons').append('<div id="festival_' + festival_id +'" class="festival_button" ></div>');
        $('#festival_'+festival_id).append('<img src="' + festival.logo + '" height="100%" width="100%"/>');

        $('#festival_'+festival_id).on('click', function(event){
            createFestivalPage(festival_id);
			changePage('#festival_container');
        });
    }
}


// FESTIVAL_CONTAINER

// Queries the local Database for a festival
function createFestivalPage(festival_id){
    db.transaction(function queryFestival(tx) {
        tx.executeSql('SELECT * FROM FESTIVALS WHERE ID='+festival_id, [], queryFestivalSuccess, errorCB);
        }, errorCB);
}
// Success callback for the the query of one festival
function queryFestivalSuccess(tx, results) {

    var festival = results.rows.item(0);
}


// Success callback for the the query all the shows of one festival
function queryFestivalShowsSuccess(tx, results) {

    var shows = results.rows;
	var len = shows.length;

	for (var i=0; i<len; i++){
		var show_id = shows.item(i).id;
		$('#shows_swipe_frame').append('<div id="show_' + show_id + '" class="show_entry" ></div>');
		$('#show_'+show_id).append('<div class="show_entry_name" >' + show.name + '</div>');
		
		
		$('#show_'+show_id).append('<div class="show_entry_stage" >' + show.name + '</div>');
		$('#show_'+show_id).bind('click', {show_id: show_id}, function(event){
            $('#festival_page').fadeOut(200);
            createShowPage(event.data.show_id);
        });
	}
}
