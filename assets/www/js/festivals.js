function createFestivalsPage(){
    db.transaction(queryFestivals, errorCB);
}

function queryFestivals(tx) {
    tx.executeSql('SELECT * FROM FESTIVALS', [], queryFestivalsSuccess, errorCB);
}

// Query the success callback
function queryFestivalsSuccess(tx, results) {

    var len = results.rows.length;

    for (var i=0; i<len; i++){
        $('#mainButtons').append('<div id="festival_' + results.rows.item(i).id +'" class="mainButton"></div>');
        $('#festival_'+results.rows.item(i).id).append('<img src="' + results.rows.item(i).logo + '" height="100%" width="100%"/>');
    }
}