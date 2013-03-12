// FESTIVAL_CONTAINER

// Inits carousel for festival_container
var festival_carousel;
function init_festival() {
    festival_carousel=$('#festival_carousel').carousel({
        preventDefaults:false
    });
}

// Queries the local Database for a festival
function createFestivalContainer(festival_id){
    init_festival();

    db.transaction(function (tx) {
        tx.executeSql('SELECT FESTIVALS.*, DAYS.DATE AS day_date ' +
            'FROM FESTIVALS INNER JOIN DAYS ON FESTIVALS.ID = DAYS.FESTIVAL_ID ' +
            'WHERE FESTIVALS.ID='+festival_id, [], queryFestivalSuccess, errorCB);
        }, errorCB);

	db.transaction(function (tx){
        tx.executeSql('SELECT SHOWS.*, STAGES.NAME AS stage_name, DAYS.DATE AS day_date ' +
            'FROM SHOWS INNER JOIN STAGES ON STAGES.ID = SHOWS.STAGE_ID INNER JOIN DAYS ON DAYS.ID = SHOWS.DAY_ID ' +
            'WHERE SHOWS.FESTIVAL_ID='+festival_id +' ORDER BY SHOWS.NAME', [], queryFestivalShowsSuccess, errorCB);
        }, errorCB);
}
// Success callback for the the query of one festival
function queryFestivalSuccess(tx, results) {

    var festival = results.rows.item(0);
    var festivals = results.rows;
    var festival_first_day = festival.day_date;

    var current_date = new Date().toDateString();


    $('.festival_title').text(festival.name);

    $('.festival_title').bind('click', function(){
        changeContainers("#festivals");
    });

    $('#festival_countdown').text();
    $('#festival_city').text(festival.city);

    $('#info_button').bind('click', function(){
        changeContainers("#info");
        createInfoContainer(festival.id);
    });

    $('#map_button').bind('click', function(){
        changeContainers("#map");
        createMapContainer(festival.map);
    });


    for (var i=0; i<festivals.length; i++){
        festival = festivals.item(i);
        $('#festival_days').append(festival.day_date +", ");

    }
}
