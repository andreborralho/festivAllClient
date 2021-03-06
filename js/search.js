var search_token;
var current_page;

document.onkeypress = processKey;
function processKey(e){
    if (e.keyCode == 13){
        if(current_page == 'search'){
            //festivals_carousel.refreshItems();
            search_token = $('#search_input').val().replace(" ","");
            createSearchResultsContainer(search_token);
            return false;
        }
        if(current_page == 'feedback'){
            submitFeedback();
            return false;
        }
    }
    return true;
}

function createSearchContainer(){
    current_page = "search";

    $('#search_button').unbind().bind('click', function(){
        search_token = $('#search_input').val().replace(" ","");
        createSearchResultsContainer(search_token);
    });

    $('#header_link').unbind().bind('click', function(){
        backButton();
    });

}

function createSearchResultsContainer(search_token){
    db.transaction(function(tx){
        tx.executeSql('SELECT SHOWS.ID AS show_id, SHOWS.NAME AS show_name, SHOWS.TIME AS show_time,' +
            ' FESTIVALS.ID AS festival_id, FESTIVALS.NAME AS festival_name, STAGES.NAME AS stage_name, DAYS.DATE AS day_date' +
            ' FROM SHOWS INNER JOIN FESTIVALS ON SHOWS.FESTIVAL_ID = FESTIVALS.ID' +
            ' INNER JOIN STAGES ON SHOWS.STAGE_ID = STAGES.ID INNER JOIN DAYS ON SHOWS.DAY_ID = DAYS.ID' +
            ' WHERE UPPER(REPLACE(SHOWS.NAME, " ", "")) LIKE UPPER("%' + search_token + '%") OR' +
            ' UPPER(REPLACE(FESTIVALS.NAME, " ", "")) LIKE UPPER("%' + search_token + '%")' +
            ' ORDER BY FESTIVALS.NAME', [], querySearchSuccess, errorQueryCB);
    }, errorCB);
}

function querySearchSuccess(tx, results) {
    $('#search_results_page').empty().append('' +
        '<div id="search_scroll_wrapper" class="scroll_wrapper">' +
            '<ul id="search_list" class="list" data-role="list"></ul>' +
        '</div>');

    $('#header_link').unbind().bind('click', function(){
        backButton();
    });

    var search_list_selector =  $('#search_list');
    var shows = results.rows;
    var show, show_day, numeric_month, show_month, show_time;
    var festival_name, festival_name_previous;

    search_list_selector.empty();

    if(shows.length == 0)
        search_list_selector.text("Não foram encontrados resultados");
    else
        for(var i = 0; i<shows.length; i++){
            show = shows.item(i);

            show_day = show.day_date.slice(8,10);
            numeric_month = show.day_date.slice(5,7);
            show_month = changeNumberToMonthAbrev(numeric_month);
            show_time = show.show_time.slice(11,16);
            festival_name = show.festival_name;

            if(festival_name != festival_name_previous){
                search_list_selector.append('<li id="search_festival_' + show.festival_id +'"></li>');

                $('#search_festival_' + show.festival_id).append(
                    '<header class="list_header row"><span>' + festival_name + '</span></header>' +
                        '<ul id="search_list_festival_' + show.festival_id +'" class="list"></ul>');
            }

            /*if(show_time != "00:01")
                $('#search_list_festival_' + show.festival_id).append(''+
                    '<li id="search_show_' + show.show_id +'" class="row">'+
                    '<div class="column fixed bdr_r">' +
                    '<time>' +
                    '<span>' + show_day + " " + show_month + '</span><br>' +
                    '<span>' + show_time +'</span>' +
                    '</time>' +
                    '</div>' +
                    '<div class="column">' +
                    '<h3 class="band_name">' + show.show_name + '</h3>'+
                    '<p class="heading2">' + show.stage_name + '</p>' +
                    '</div>' +
                    '</li>');
            else*/
                $('#search_list_festival_' + show.festival_id).append(''+
                    '<li id="search_show_' + show.show_id +'" class="row">'+
                        '<div class="column fixed bdr_r">' +
                            '<time>' +
                                '<span class="search_show_date">' + show_day + " " + show_month + '</span><br>' +
                                '<span class="show_time">' + show_time +'</span>' +
                            '</time>' +
                        '</div>' +
                        '<div class="column">' +
                            '<h3 class="band_name">' + show.show_name + '</h3>'+
                            '<p class="heading2">' + show.stage_name + '</p>' +
                        '</div>' +
                    '</li>');

            if(show_time == "00:01")
                $('#search_list_festival_' + show.festival_id + ' .show_time').text("--:--");
            if(show_day == "01" && show_month == "Jan")
                $('#search_show_' + show.show_id + ' .search_show_date').text("TBA");


            (function (show_name, show_festival_name){
                $('#search_show_' + show.show_id).unbind().bind('click', function(){
                    createShowContainer(this.id.replace("search_show_", ""));
                    changeContainers("#show", show_name, show_festival_name);
                });
            })(show.show_name, festival_name);

            festival_name_previous = festival_name;
        }

    changeContainers("#search_results", search_token, "Resultados da Pesquisa");
    search_list_selector.scroller();
}

