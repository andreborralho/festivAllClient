// FESTIVALS_CONTAINER


// Queries the local Database for all festivals
function createFestivalsContainer(){
    db.transaction(function queryFestivals(tx) {
        tx.executeSql('SELECT FESTIVALS.*, MIN(DAYS.date) as first_day ' +
                        'FROM DAYS INNER JOIN FESTIVALS ' +
                        'ON FESTIVALS.id = DAYS.festival_id ' +
                        'GROUP BY DAYS.festival_id ' +
                        'ORDER BY first_day', [], queryFestivalsSuccess, errorQueryCB);
                }, errorCB);
}



// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {
    if(isSynched)
        window.FestivallToaster.showMessage('Base de dados criada!');

    incrementHistory("#festivals");
    $('#festivals_buttons').empty();

    var len = results.rows.length;
    var festivals = results.rows;
    var ended_festivals = [];
    for (var i=0; i<len; i++){
        var festival = festivals.item(i);
        var festival_id = festival.id;

        checkIfAfterFestival(festival.id, ended_festivals, i, len);
    }
}

function checkIfAfterFestival(festival_id, ended_festivals, i, len){
    var current_time = new Date().getTime();
    db.transaction(function (tx) {
        tx.executeSql('SELECT *, FESTIVALS.id AS id, DAYS.id as day_id ' +
            'FROM FESTIVALS INNER JOIN DAYS ON FESTIVALS.ID = DAYS.FESTIVAL_ID ' +
            'WHERE FESTIVALS.ID='+festival_id, [], function(tx,results){
            var closing_time = getLastDayClosingTime(results.rows);
            var festival = results.rows.item(0);
            if (current_time > closing_time){
                ended_festivals.push(festival);
            }else{
                addFestivalToList(festival);
            }
            //add ended festivals and scroller
            if(i >= len-1){
                for(var j = 0; j <ended_festivals.length; j++){
                    addFestivalToList(ended_festivals[j]);
                }
                $('#festivals_buttons').scroller();
            }
        }, errorQueryCB);
    }, errorCB);
}

function addFestivalToList(festival){
    $('#festivals_buttons').append('' +
        '<li id="festival_' + festival.id +'" class="item">' +
        '<a href="#"><img class="festival_logo" src="' + festival.logo + '"></a>' +
        '</li>');

    $('#festival_'+festival.id).unbind().bind('click', function(){
        createFestivalContainer(this.id.replace("festival_", ""));
    });
}