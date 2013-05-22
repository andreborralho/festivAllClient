// FESTIVALS_CONTAINER


// Queries the local Database for all festivals
function createFestivalsContainer(){
    db.transaction(function queryFestivals(tx) {
        tx.executeSql('SELECT * FROM FESTIVALS', [], queryFestivalsSuccess, errorQueryCB);
    }, errorCB);
}


// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {
    if(synched)
        window.FestivallToaster.showMessage('Base de dados criada!');
    incrementHistory("#festivals");

    var len = results.rows.length;
    for (var i=0; i<len; i++){
        var festival = results.rows.item(i);
        var festival_id = festival.id;

        $('#festivals_buttons').append('' +
            '<li id="festival_' + festival_id +'" class="item">' +
                '<a href="#"><img src="' + festival.logo + '"></a>' +
            '</li>');

        $('#festival_'+festival_id).unbind().bind('click', function(){
            createFestivalContainer(this.id.replace("festival_", ""));
        });
    }

    $('#festivals_buttons').scroller();
}