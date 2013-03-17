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
        tx.executeSql('SELECT * FROM DAYS WHERE ID='+festival_id + 'ORDER BY date', [], queryLineupSuccess, errorQueryCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryLineupSuccess(tx, results) {

    var days = results.rows;
    var days_length = days.length;

    for(var i = 0; i<days_length; i++){
        var day_numdays.item(i).date;
    }
}
