// SHOW_CONTAINER


// Queries the local Database for a show
function createShowContainer(show_id){

    db.transaction(function (tx) {
        tx.executeSql('SELECT SHOWS.*, STAGES.NAME AS stage_name, DAYS.DATE AS day_date,' +
            ' FESTIVALS.ID AS festival_id, FESTIVALS.NAME AS festival_name' +
            ' FROM SHOWS INNER JOIN STAGES ON SHOWS.STAGE_ID = STAGES.ID INNER JOIN DAYS ON SHOWS.DAY_ID = DAYS.ID' +
            ' INNER JOIN FESTIVALS ON SHOWS.FESTIVAL_ID = FESTIVALS.ID' +
            ' WHERE SHOWS.ID='+show_id, [], queryShowSuccess, errorQueryCB);
        tx.executeSql('SELECT * FROM VIDEOS WHERE SHOW_ID='+show_id, [], queryShowVideosSuccess, errorQueryCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryShowSuccess(tx, results) {

    var show = results.rows.item(0);
    current_festival_id = show.festival_id;

    $('#header_title').bind('click', function(){
        $('#header_title').unbind();
        createFestivalContainer(show.festival_id);
        changeContainers("#festival", current_festival_name, "");
    });

    show_visited = true;
    incrementHistory("#festival");

    var show_day = show.day_date.slice(8,10);
    var numeric_month = show.day_date.slice(5,7);
    var show_month = changeNumberToMonth(numeric_month);

    $('.page_title').text(show.festival_name);

    $('#show_photo').html('<img width="100%" src="' + show.photo + '">');
    $('#show_stage').text(show.stage_name);

    $('#show_date').text(show_day + " de " + show_month);
    $('#show_time').text(show.time.slice(11,16));

    if(show.description == "null"){
        $('#show_description').html("Descrição da banda ainda não dísponivel.");}
    else{
        var description_html_tags = show.description.replace(/\r\n/g, "<br>");
        $('#show_description').html(description_html_tags);
    }

    //inits the show_carousel
    $('#show_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#show_nav_item').removeClass('not_current');
                $('#videos_nav_item').addClass('not_current next');
            }
            else if(index == 1){
                $('#videos_nav_item').removeClass('not_current next');
                $('#show_nav_item').addClass('not_current prev');
            }
        }
    });
}
