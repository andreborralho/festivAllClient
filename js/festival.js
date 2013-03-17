// FESTIVAL_CONTAINER

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
    var festival_date = festival.day_date.toString();
    festival_date = festival_date.replace(/-/g,'/');

    var curr_date = new Date();
    var first_day_date = new Date(festival_date);
    var diff = Math.abs(first_day_date - curr_date);

    //diff = -1; //descomentar esta linha para experimentar o festival durante

    $('.festival_title').text(festival.name);

    $('.festival_title').bind('click', function(){
        changeContainers("#festivals");
    });


    if(diff < 0){ //during festival
        changeContainers("#during_festival");
        createDuringFestival(festival);
    }
    else if ( diff > 0){ //before festival
        changeContainers("#before_festival");
        createBeforeFestival(festival, diff);
    }

    /*
    else if (){ //after festival
        changeContainers("#after_festival");
        createAfterFestival();

    }*/


}


function createBeforeFestival(festival, diff){

    db.transaction(function (tx){
        tx.executeSql('SELECT SHOWS.*, STAGES.NAME AS stage_name, DAYS.DATE AS day_date ' +
            'FROM SHOWS INNER JOIN STAGES ON STAGES.ID = SHOWS.STAGE_ID INNER JOIN DAYS ON DAYS.ID = SHOWS.DAY_ID ' +
            'WHERE SHOWS.FESTIVAL_ID='+festival.id +' ORDER BY SHOWS.NAME', [], queryFestivalShowsSuccess, errorQueryCB);
    }, errorCB);

    var dhms = dhm(diff).toString();

    $('#festival_countdown').text("Faltam " + dhms.split(':')[0] + " dias!");

    $('#festival_city').text("Local: " + festival.city);

    $('#lineup_button').bind('click', function(){
        changeContainers("#lineup");
        $('#lineup_button').unbind();
        createLineupContainer(festival.id);
    });

    $('#info_button').bind('click', function(){
        changeContainers("#info");
        $('#info_button').unbind();
        createInfoContainer(festival.id);
    });

    $('#map_button').bind('click', function(){
        changeContainers("#map");
        createMapContainer(festival.map);
    });

    $('#festival_days').empty();
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
                if(stages_len > 0){
                    $('#during_festival_page').empty();
                    for(var i = 0; i<stages_len; i++){
                        stage = stages.item(i);
                        (function(stage){ //manha gigante, pouco legivel
                            db.transaction(  function(tx){
                                tx.executeSql('SELECT * FROM SHOWS WHERE SHOWS.stage_id=' + stage.id +' AND '+
                                'SHOWS.festival_id=' + festival.id + ' AND SHOWS.day_id=' + festival.day_id + ' ORDER BY SHOWS.time',[],
                                    function(tx,results){
                                        var shows = results.rows;
                                        var shows_len = shows.length;
                                        if(shows_len >0 ){
                                            $('#during_festival_page').append('<div id="during_festival_' + stage.id + '_carousel"></div>');
                                            for(var j = 0; j <shows_len; j++){
                                                var show = shows.item(j);
                                                $('#during_festival_' + stage.id + '_carousel').append('<div id="during_festival_show_'+ show.id + '"> Nome:' + show.name + ', Hora:' + show.time + '</div>');
                                            }
                                            $('#during_festival_' + stage.id + '_carousel').carousel({preventDefaults:false});
                                         }else {alert('No bands for this stage!');}
                                    },errorQueryCB);
                                }, errorCB);
                        })(stage);
                    }
                }
                else {alert('Error: No stages for this festival id.');}
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
