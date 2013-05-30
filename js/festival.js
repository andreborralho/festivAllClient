// FESTIVAL_CONTAINER

var current_festival_id, current_festival_name, festival_container, status;

// Queries the local Database for a festival
function createFestivalContainer(festival_id){

    db.transaction(function (tx) {
        tx.executeSql('SELECT *, FESTIVALS.id AS id, DAYS.id as day_id ' +
            'FROM FESTIVALS INNER JOIN DAYS ON FESTIVALS.ID = DAYS.FESTIVAL_ID ' +
            'WHERE FESTIVALS.ID='+festival_id, [], queryFestivalSuccess, errorQueryCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryFestivalSuccess(tx, results) {

    var festival = results.rows.item(0);
    var festivals = results.rows;
    var festival_date = festival.date.toString().replace(/-/g,'/');
    //window.current_time =  new Date(2013, 5, 2, 07, 00, 00).getTime(); // o mes é de 0-11
    window.current_time = new Date().getTime();
    //alert(new Date (current_time));
    var first_day_date = new Date(festival_date).getTime();   //falta ver quando um festival tem interregnos no meio sem dias de festival checkIfDuringFestival()

    var diff = first_day_date - current_time;

    current_festival_id = festival.id;
    current_festival_name = festival.name;

    $('#header_link').unbind().bind('click', function(){
        changeContainers("#festivals", "FestivAll", "");
        fixHeaderLink("#festivals");
        history_array.pop();
    });

    var last_closing_time = getLastDayClosingTime(festivals);

    if (current_time > last_closing_time){//after festival
        festival_container = "before";
        status="after";
        createBeforeFestival(festival, festivals, 0, status);

    }
    else if(diff > 0){ //before festival
        festival_container = "before";
        status = "before";
        createBeforeFestival(festival, festivals, diff, status);

    }
    else if (diff < 0){ //during festival
        var curr_time = current_time;
        var closest_closing_time = {"diff":9007199254740992,"day":undefined }
        var during = false;

        for(var i = 0; i< festivals.length; i++){
            var day = festivals.item(i);
            var day_date = toDate(day.date);
            var day_time =  new Date(day_date[0], day_date[1], day_date[2]).getTime();

            var closing_time = new Date(day_date[0], day_date[1], day_date[2]).getTime() + 24*60*60*1000 + getMiliSeconds(day.closing_time);
            //alert("curr_time :" + new Date(curr_time) + "\n closing time : " + new Date(closing_time) + "\n day_time : " + new Date(day_time));
            if (curr_time >= day_time && curr_time <= closing_time){
                var aux_diff = closing_time - curr_time;
                if (aux_diff < closest_closing_time["diff"])
                    closest_closing_time = {"diff":aux_diff, "day":day };
                during = true;
            }
        }

        if (!during){//in between days
            festival_container = "before";
            status="in_between"
            createBeforeFestival(festival, festivals, 0, status);
        }else{//during festival day
            createDuringFestival(closest_closing_time["day"]);
            festival_container = "during";
        }
    }

    changeContainers('#' + festival_container + '_festival', current_festival_name, "");
}

function getLastDayClosingTime(festivals){
    var result = 0;
    for(var i = 0; i< festivals.length; i++){
        var day = festivals.item(i);
        var day_date = toDate(day.date);

        var closing_time = new Date(day_date[0], day_date[1], day_date[2]).getTime() + 24*60*60*1000 + getMiliSeconds(day.closing_time);
        if (closing_time > result)
            result = closing_time;
    }
    return result;
}

function createBeforeFestival(festival, festivals, diff, status){

    var dhms = dhm(diff).toString();
    var countdown_days = dhms.split(':')[0];

    $('#festival_days').empty();

    if(status == "before"){
        $('#festival_countdown_days').text(countdown_days);
        $('#festival_city').text("Local: " + festival.city);
        $('#festival_price').text("Preço: " + festival.tickets_price);
        $('#festival_poster').attr("src", festival.logo);

        if (countdown_days.length == 1) {
            $('#festival_countdown_days').addClass('one');
        }
        else if (countdown_days.length == 2) {
            $('#festival_countdown_days').addClass('two');
        }
        else if (countdown_days.length == 3) {
            $('#festival_countdown_days').addClass('three');
        }

        if(countdown_days == 1){
            $('#festival_countdown_quantifier').text("Falta");
            $('#festival_countdown_last_line').text("dia!");
        }

    }else if(status == "in_between"){
        alert("in between");
        //to do
    }
    else if(status == "after"){
        alert("after");
        //to do
    }

    var festival_day, festival_day_first_number, festival_day_second_number,
        festival_month, numeric_month, next_numeric_month, festival_next_month;

    for(var i=0; i<festivals.length; i++){
        festival = festivals.item(i);

        festival_day = festival.date.slice(8,10);
        festival_day_first_number = festival_day.slice(0,1).replace("0", "");
        festival_day_second_number = festival_day.slice(1,2);
        festival_day = festival_day_first_number + festival_day_second_number;

        numeric_month = festival.date.slice(5,7);
        festival_month = changeNumberToMonth(numeric_month);

        if(i < festivals.length - 2){
            next_numeric_month = festivals.item(i+1).date.slice(5,7);
            festival_next_month = changeNumberToMonth(next_numeric_month);

            if(festival_month == festival_next_month)
                $('#festival_days').append(festival_day +", ");
            else
                $('#festival_days').append(festival_day + " de " + festival_month);
        }
        else if(i == festivals.length - 2){
            next_numeric_month = festivals.item(i+1).date.slice(5,7);
            festival_next_month = changeNumberToMonth(next_numeric_month);

            if(festival_month == festival_next_month)
                $('#festival_days').append(festival_day);
            else
                $('#festival_days').append(festival_day + " de " + festival_month);
        }
        else
            $('#festival_days').append(" e " + festival_day + " de " + festival_month);
    }
    bindClickToNavBottom("before", festival);
}




function createDuringFestival(festival){
    db.transaction(function (tx){
        tx.executeSql('SELECT * FROM STAGES WHERE STAGES.festival_id=' + festival.id,[],
            function(tx,results){
                var stages = results.rows;
                var stages_len = stages.length;
                var stage, stage_id;
                $('#during_festival_scroller').empty();

                if(stages_len > 0){
                    for(var i = 0; i<stages_len; i++){
                        stage = stages.item(i);
                        (function(stage){ //manha gigante, pouco legivel
                            db.transaction(  function(tx){
                                tx.executeSql('SELECT * FROM (SELECT * FROM SHOWS ' +
                                    ' WHERE SHOWS.festival_id=' + festival.id + ' AND SHOWS.stage_id=' + stage.id + ' AND SHOWS.day_id = ' + festival.day_id +
                                    ' AND TIME(REPLACE(REPLACE(TIME,"Z",""),"T"," "))>=TIME(REPLACE("' + festival.opening_time + '","T"," ")) ORDER BY TIME)' +
                                    ' UNION ALL SELECT * FROM (SELECT * FROM SHOWS ' +
                                    ' WHERE SHOWS.festival_id=' + festival.id + ' AND SHOWS.stage_id=' + stage.id + ' AND SHOWS.day_id = ' + festival.day_id +
                                    ' AND TIME(REPLACE(REPLACE(TIME,"Z",""),"T"," "))<=TIME(REPLACE("' + festival.closing_time + '","T"," ")) ORDER BY TIME)',
                                    [],
                                    function(tx,results){
                                        var shows = results.rows;
                                        var curr_index = -1;

                                        var shows_len = shows.length;
                                        $('#during_festival_scroller').append(
                                            '<div class="row during_festival_header">' +
                                                '<span>' + stage.name + '</span>' +
                                            '</div>' +
                                            '<ul id="during_festival_' + stage.id + '_carousel" class="list"></ul>'
                                        );

                                        if(shows_len >0){
                                            for(var j = 0; j <shows_len; j++){

                                                var show = shows.item(j);


                                                //alert(current_minutes+" " +show_minutes+" "+next_show_minutes);

                                                $('#during_festival_' + stage.id + '_carousel').append(
                                                    '<li id="during_festival_show_'+ show.id + '" class="row">' +
                                                        '<span class="column icon_swipe_left"></span>' +
                                                        '<div class="column during_festival_column">' +
                                                            '<h3 class="band_name">' + show.name + '</h3>' +
                                                            '<span id="show_curr_icon' + show.id + '_' + stage.id +'"></span>' +
                                                            '<span class="current_show">' + show.time.slice(11,16) + '</span>' +
                                                        '</div>' +
                                                        '<span class="column icon_swipe_right"></span>' +
                                                    '</li>'
                                                );

                                                if(j==0) //tirar a seta para a esquerda na 1ºbanda
                                                    $('#during_festival_show_'+ show.id + ' .icon_swipe_left').remove();
                                                if(j==shows_len - 1)
                                                    $('#during_festival_show_'+ show.id + ' .icon_swipe_right').remove();


                                                if(checkIfCurrentShow(shows, j, festival.date, festival.opening_time, festival.closing_time)){
                                                    //alert(show.name + 'is currently on stage ' + stage.name);
                                                    $('#show_curr_icon' + show.id + '_' + stage.id).addClass('icon_current_show');
                                                    curr_index = j;
                                                }

                                                (function (show_name){
                                                    $('#during_festival_show_' + show.id ).unbind().bind('click', function(){
                                                        createShowContainer(this.id.replace("during_festival_show_", ""));
                                                        changeContainers("#show", show_name, current_festival_name);
                                                    });
                                                })(show.name);
                                            }
                                        }
                                        else
                                            $('#during_festival_' + stage.id + '_carousel').append('<li>Não há bandas para este palco!</li>');

                                        var curr_carousel = $('#during_festival_' + stage.id + '_carousel').carousel({preventDefaults:false});
                                        if(curr_index != -1)
                                            curr_carousel.onMoveIndex(curr_index, 150);
                                    },errorQueryCB);
                            }, errorCB);
                        })(stage);
                    }
                }
                else
                    $('#during_festival_scroller').append('Não há palcos para este festival!');


                bindClickToNavBottom("during", festival);

            }, errorQueryCB);
    }, errorCB);
    $('#during_festival_scroller').scroller();
}


function bindClickToNavBottom(festival_status, festival){
    $('#'+festival_status+'_shows_button').unbind().bind('click', function(){
        createShowsContainer(festival.id);
        changeContainers("#shows", current_festival_name, "Bandas");
    });

    $('#'+festival_status+'_lineup_button').unbind().bind('click', function(){
        createLineupContainer(festival.id);
        //changeContainers("#lineup", current_festival_name, "Cartaz");
    });

    $('#'+festival_status+'_info_button').unbind().bind('click', function(){
        createInfoContainer(festival.id);
        changeContainers("#info", current_festival_name, "Informação");
    });

    $('#'+festival_status+'_map_button').unbind().bind('click', function(){
        createMapContainer(festival.map);
        changeContainers("#map", current_festival_name, "Mapa");
    });

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



//______________Functions for determining the current show______________________________________________________________



//returns the miliseconds equivalent of some Time(HH:MM:SS)
function getMiliSeconds(time){

    var hours = time.slice(11,13);
    var mins = time.slice(14,16);
    var minutes = parseInt(hours)*60 + parseInt(mins);

    return  minutes*60*1000;
}

//Returns the start time in miliseconds of the next show
function getNextShowTime(show_time, shows, j, closing_time, day_time, opening_time,  next_day_time){
    var next_show_time = closing_time;
    if (j < shows.length-1){
        var next_show = shows.item(j+1);

        var next_show_time_test = day_time + getMiliSeconds(next_show.time);
        next_show_time_test = amPmTranslation(next_show_time_test, opening_time, closing_time, next_day_time, day_time );
        if (next_show_time_test >= show_time && next_show_time_test < next_show_time )
            next_show_time = next_show_time_test;
    }
    return next_show_time;
}


//Adds 24 hours to the show if its after mid-night
function amPmTranslation(show_time, opening_time, closing_time, next_day_time, day_time ){
    closing_time = closing_time - 24*60*60*1000;
    if (next_day_time >= show_time &&  show_time >= opening_time){
        //do nothing test
    }
    else if (day_time <= show_time && show_time <= closing_time){ //depois da meia-noite, acrescenta 24 hora ao show_time
        show_time = show_time + 24*60*60*1000;
    }

    return show_time;
}

function toDate(date){
    var year = parseInt(date.slice(0,4));
    var month = parseInt(date.slice(5,7))-1;//month in date is 0-11
    var day = parseInt(date.slice(8,10));
    return [year, month, day];
}

//checks if a show is currently playing on a stage
function checkIfCurrentShow(shows, j, date, opening_time, closing_time){
    var show = shows.item(j);
    //ar current_time = new Date().getTime();

    var aux_date = toDate(date);

    var day_time = new Date(aux_date[0], aux_date[1], aux_date[2]).getTime();
    var next_day_time = new Date(aux_date[0], aux_date[1], aux_date[2]).getTime() + 24*60*60*1000; //dia + 24h

    var opening_time = new Date(aux_date[0], aux_date[1], aux_date[2]).getTime() + getMiliSeconds(opening_time);
    var closing_time = new Date(aux_date[0], aux_date[1], aux_date[2]).getTime() + 24*60*60*1000 + getMiliSeconds(closing_time);


    var show_time = new Date(aux_date[0], aux_date[1], aux_date[2]).getTime() + getMiliSeconds(show.time);

    show_time = amPmTranslation(show_time, opening_time, closing_time, next_day_time, day_time);
    var next_show_time = getNextShowTime(show_time, shows, j, closing_time, day_time, opening_time, next_day_time);


    if (next_show_time >= current_time && current_time >= show_time)
        return true;
    else return false;
}


//____________________________________________________________________________________________________________________