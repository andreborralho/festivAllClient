// SHOW_CONTAINER


// Inits carousel for show_container
var show_carousel;
function initShowCarousel() {
	show_carousel=$("#show_carousel").carousel({
		preventDefaults:false
	});				
}

// Queries the local Database for a show
function createShowContainer(show_id){
    //initShow();

    db.transaction(function (tx) {
        tx.executeSql('SELECT SHOWS.*, STAGES.NAME AS stage_name, DAYS.DATE AS day_date,' +
            ' FESTIVALS.ID AS festival_id, FESTIVALS.NAME AS festival_name' +
            ' FROM SHOWS INNER JOIN STAGES ON SHOWS.STAGE_ID = STAGES.ID INNER JOIN DAYS ON SHOWS.DAY_ID = DAYS.ID' +
            ' INNER JOIN FESTIVALS ON SHOWS.FESTIVAL_ID = FESTIVALS.ID' +
            ' WHERE SHOWS.ID='+show_id, [], queryShowSuccess, errorQueryCB);
        tx.executeSql('SELECT * FROM VIDEOS WHERE SHOW_ID='+show_id, [], queryShowVideosSuccess, errorQueryCB);
    }, errorCB);
    initShowCarousel();

}

// Success callback for the the query of one festival
function queryShowSuccess(tx, results) {

    var show = results.rows.item(0);
    current_festival_id = show.festival_id;

    $('.show_title').text(show.name);
    $('.column').bind('click', function(){
        $('.column').unbind();

        changeContainers("#festival");
        createFestivalContainer(show.festival_id);
    });
    incrementHistory("#festival");

    var show_day = show.day_date.slice(8,10);
    var numeric_month = show.day_date.slice(5,7);
    var show_month = changeNumberToMonth(numeric_month);

    $('.page_title').text(show.festival_name);

    $('#show_photo').html('<img width="100%" src="' + show.photo + '">');
    $('#show_stage').text(show.stage_name);

    $('#show_date').text(show_day + " de " + show_month);
    $('#show_time').text(show.time.slice(11,16));

    var description_html_tags = show.description.replace(/\r\n/g, "<br>");
    $('#show_description').html(description_html_tags);
}
