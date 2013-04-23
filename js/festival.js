// FESTIVAL_CONTAINER

var current_festival_id, current_festival_name;

// Queries the local Database for a festival
function createFestivalContainer(festival_id){

    db.transaction(function (tx) {
        tx.executeSql('SELECT FESTIVALS.*, DAYS.DATE AS day_date, DAYS.ID AS day_id ' +
            'FROM FESTIVALS INNER JOIN DAYS ON FESTIVALS.ID = DAYS.FESTIVAL_ID ' +
            'WHERE FESTIVALS.ID='+festival_id, [], queryFestivalSuccess, errorQueryCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryFestivalSuccess(tx, results) {

    var festival = results.rows.item(0);
    var festivals = results.rows;
    var festival_date = festival.day_date.toString().replace(/-/g,'/');

    var curr_date = new Date();
    var first_day_date = new Date(festival_date);
    var diff = Math.abs(first_day_date - curr_date);

    //diff = -1; //descomentar esta linha para experimentar o festival durante

    current_festival_id = festival.id;
    current_festival_name = festival.name;

    $('#header_link').unbind().bind('click', function(){
        changeContainers("#festivals", "FestivAll", "");
        fixHeaderLink("#festivals");
        history_array.pop();
    });

    if(diff < 0){ //during festival
        createDuringFestival(festival);
        changeContainers("#during_festival", current_festival_name, "");
    }
    else if (diff > 0){ //before festival
        createBeforeFestival(festival, festivals, diff);
    }
    /*
    else if (){ //after festival
        changeContainers("#after_festival");
        createAfterFestival();
    }*/
}

function appendFestivalHTML(){
    $('#before_festival_carousel').remove();
    $('#before_festival').append('' +
        '<div id="before_festival_carousel" class="carousel" data-role="carousel">' +
            '<div id="before_festival_page" data-role="page">' +

                '<ul class="before_festival_details padded">' +
                    '<li>' +
                        '<span class="icon_arrow"></span>' +
                        '<span id="festival_days"></span>' +
                    '</li>' +
                    '<li>' +
                        '<span class="icon_arrow"></span>' +
                        '<span id="festival_city"></span>' +
                    '</li>' +
                    '<li>' +
                        '<span class="icon_arrow"></span>' +
                        '<span id="festival_price"></span>' +
                    '</li>' +
                '</ul>' +
                
                '<p id="festival_countdown">' +
                    '<span>Faltam</span>' +
                    '<span id="festival_countdown_days"></span>' +
                    '<span class="last-line">dias</span>' +
                '</p>' +

                '<img class="countdown_bg" src="img/countdown_bg.png">' +

                '<nav class="nav_bottom">' +
                    '<ul class="row">' +
                        '<li class="column">' +
                            '<a href="#" id="before_shows_button" class="item">Bandas</a>' +
                        '</li>' +
                        '<li class="column">' +
                            '<a href="#" id="before_lineup_button" class="item">Cartaz</a>' +
                        '</li>' +
                        '<li class="column">' +
                            '<a href="#" id="before_info_button" class="item">Info</a>' +
                        '</li>' +
                        '<li class="column">' +
                            '<a href="#" id="before_map_button" class="item no_border">Mapa</a>' +
                        '</li>' +
                    '</ul>' +
                '</nav>' +
            '</div>' +

            '<div id="shows_page" class="page" data-role="page">' +
                '<div id="shows_scroll_wrapper" class="scroll_wrapper">' +
                    '<ul id="shows_page_list"></ul>' +
                '</div>' +
            '</div>' +
        '</div>');
}

function createBeforeFestival(festival, festivals, diff){
    appendFestivalHTML();

    db.transaction(function (tx){
        tx.executeSql('SELECT SHOWS.*, STAGES.NAME AS stage_name, DAYS.DATE AS day_date ' +
            'FROM SHOWS INNER JOIN STAGES ON STAGES.ID = SHOWS.STAGE_ID INNER JOIN DAYS ON DAYS.ID = SHOWS.DAY_ID ' +
            'WHERE SHOWS.FESTIVAL_ID='+festival.id +' ORDER BY SHOWS.NAME', [], queryFestivalShowsSuccess, errorQueryCB);
    }, errorCB);


    var dhms = dhm(diff).toString();

    $('#festival_countdown_days').text(dhms.split(':')[0]);
    $('#festival_city').text("Local: " + festival.city);
    $('#festival_price').text("Preço: " + festival.tickets_price);

    $('#before_lineup_button').unbind().bind('click', function(){
        createLineupContainer(festival.id);
        changeContainers("#lineup", current_festival_name, "Cartaz");
    });

    $('#before_info_button').unbind().bind('click', function(){
        createInfoContainer(festival.id);
        changeContainers("#info", current_festival_name, "Informação");
    });

    $('#before_map_button').unbind().bind('click', function(){
        createMapContainer(festival.map);
        changeContainers("#map", current_festival_name, "Mapa");
    });

    var festival_day, festival_day_first_number, festival_day_second_number,
        festival_month, numeric_month, next_numeric_month, festival_next_month;

    for(var i=0; i<festivals.length; i++){
        festival = festivals.item(i);

        festival_day = festival.day_date.slice(8,10);
        festival_day_first_number = festival_day.slice(0,1).replace("0", "");
        festival_day_second_number = festival_day.slice(1,2);
        festival_day = festival_day_first_number + festival_day_second_number;

        numeric_month = festival.day_date.slice(5,7);
        festival_month = changeNumberToMonth(numeric_month);

        if(i < festivals.length - 2){
            next_numeric_month = festivals.item(i+1).day_date.slice(5,7);
            festival_next_month = changeNumberToMonth(next_numeric_month);

            if(festival_month == festival_next_month)
                $('#festival_days').append(festival_day +", ");
            else
                $('#festival_days').append(festival_day + " de " + festival_month);
        }
        else if(i == festivals.length - 2){
            next_numeric_month = festivals.item(i+1).day_date.slice(5,7);
            festival_next_month = changeNumberToMonth(next_numeric_month);

            if(festival_month == festival_next_month)
                $('#festival_days').append(festival_day);
            else
                $('#festival_days').append(festival_day + " de " + festival_month);
        }
        else
            $('#festival_days').append(" e " + festival_day + " de " + festival_month);
    }
}

function createDuringFestival(festival){
    db.transaction(function (tx){
        tx.executeSql('SELECT * FROM STAGES WHERE STAGES.festival_id=' + festival.id,[],
            function(tx,results){
                var stages = results.rows;
                var stages_len = stages.length;
                var stage, stage_id;
                $('#during_festival_page').empty();

                if(stages_len > 0){
                    for(var i = 0; i<stages_len; i++){
                        stage = stages.item(i);
                        (function(stage){ //manha gigante, pouco legivel
                            db.transaction(  function(tx){
                                tx.executeSql('SELECT * FROM SHOWS WHERE SHOWS.stage_id=' + stage.id +' AND '+
                                'SHOWS.festival_id=' + festival.id + ' AND SHOWS.day_id=' + festival.day_id + ' ORDER BY SHOWS.time',[],
                                    function(tx,results){
                                        var shows = results.rows;
                                        var shows_len = shows.length;
                                        $('#during_festival_page').append(
                                            '<div class="row during_festival_header">' +
                                                '<span>' + stage.name + '</span>' +
                                            '</div>' +
                                            '<ul id="during_festival_' + stage.id + '_carousel" class="list"></ul>'
                                        );
                                        if(shows_len >0){
                                            for(var j = 0; j <shows_len; j++){
                                                var show = shows.item(j);
                                                $('#during_festival_' + stage.id + '_carousel').append(
                                                    '<li id="during_festival_show_'+ show.id + '" class="row">' +
                                                        '<span class="column icon_swipe_left"></span>' +
                                                        '<div class="column during_festival_column">' +
                                                            '<h3 class="band_name">' + show.name + '</h3>' +
                                                            '<span class="icon_current_show"></span>' +
                                                            '<span class="current_show">' + show.time.slice(11,16) + '</span>' +
                                                        '</div>' +
                                                        '<span class="column icon_swipe_right"></span>' +
                                                    '</li>'
                                                );
                                            }
                                         }
                                        else
                                            $('#during_festival_' + stage.id + '_carousel').append('<li>Não há bandas para este palco!</li>');

                                        $('#during_festival_' + stage.id + '_carousel').carousel({preventDefaults:false});
                                    },errorQueryCB);
                                }, errorCB);
                        })(stage);
                    }
                }
                else
                    $('#during_festival_page').append('Não ha palcos para este festival!');

                $('#during_festival_page').append(
                    '<nav class="nav_bottom">' +
                        '<ul class="row">' +
                            '<li class="column">' +
                                '<a href="#" id="during_shows_button" class="item">Bandas</a>' +
                            '</li>' +
                            '<li class="column">' +
                                '<a href="#" id="during_lineup_button" class="item">Cartaz</a>' +
                            '</li>' +
                            '<li class="column">' +
                                '<a href="#" id="during_info_button" class="item">Info</a>' +
                            '</li>' +
                            '<li class="column">' +
                                '<a href="#" id="during_map_button" class="item no_border">Mapa</a>' +
                            '</li>' +
                        '</ul>' +
                    '</nav>'
                );
            }, errorQueryCB);
    }, errorCB);

}

function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = '0' + Math.floor( (t - d * cd) / ch),
        m = '0' + Math.round( (t - d * cd - h * ch) / 60000);
    return [d, h.substr(-2), m.substr(-2)].join(':');
}

function changeNumberToMonth(numeric_month){
    var month;
    switch(numeric_month){
        case "01":
            month = "Janeiro";
            break;
        case "02":
            month = "Fevereiro";
            break;
        case "03":
            month = "Março";
            break;
        case "04":
            month = "Abril";
            break;
        case "05":
            month = "Maio";
            break;
        case "06":
            month = "Junho";
            break;
        case "07":
            month = "Julho";
            break;
        case "08":
            month = "Agosto";
            break;
        case "09":
            month = "Setembro";
            break;
        case "10":
            month = "Outubro";
            break;
        case "11":
            month = "Novembro";
            break;
        case "12":
            month = "Dezembro";
            break;
    }
    return month;
}
