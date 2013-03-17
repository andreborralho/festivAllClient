// LINEUP_CONTAINER

// Queries the local Database for a show
function createLineupContainer(festival_id){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM DAYS WHERE FESTIVAL_ID='+festival_id + ' ORDER BY date', [], queryLineupSuccess, errorQueryCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryLineupSuccess(tx, results) {
    $('#lineup_day_buttons').empty();
    $('#lineup_frame').empty();
    var days = results.rows;

    //Gets stages id's and names
    var stages = [];
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM STAGES WHERE FESTIVAL_ID='+days.item(0).festival_id , [],
            function(tx,results){
                for(var j = 0; j<results.rows.length; j++){
                    stages[j] = {"name":results.rows.item(j).name,"id":results.rows.item(j).id};
                }
                buildLineup(stages, days);
            }, errorQueryCB);
    }, errorCB);
}

function buildLineup(stages, days){
    var days_length = days.length;
    for(var i = 0; i<days_length; i++){
        var day = days.item(i);

        $('#lineup_frame').append('<div id="lineup_carousel_' + day.id + '" data-role="lineup_carousel"></div>');
        if(i!=0){//First day lineup shows on page open
             $('#lineup_carousel_' + day.id).css('display', 'none');
        }

        for(var s = 0; s<stages.length; s++){

            (function(day,stage,len,s){ //manha gigante, pouco legivel
                db.transaction(function(tx){
                    tx.executeSql('SELECT * FROM SHOWS WHERE festival_id=' + day.festival_id + ' AND ' +
                    ' stage_id=' + stage.id + ' AND day_id=' + day.id, [], function(tx,results){
                        var shows = results.rows;
                        if(shows.length > 0){
                            //por palco no swipe bar :
                            //nao sei fazer! perguntar ao pimba

                            //append day:stage frame
                            $('#lineup_carousel_' + day.id).append('<div id="' + day.id + '_' + stage.id + '_lineup_frame"></div>');

                            for(var l = 0; l <shows.length; l ++){
                                var show = shows.item(l);
                                $('#' + day.id + '_' + stage.id + '_lineup_frame').append('<div id="lineup_show_' + show.id + '">' + show.name + ' ' + show.time + '</div>');
                                $('#lineup_show_' + show.id ).bind('click', function(){
                                    changeContainers("#show");
                                    createShowContainer(this.id.replace("show_", ""));
                                });
                            }
                            if(s == len -1){
                                finishLineupStage(day);
                            }
                        }
                    },errorQueryCB);
                 }, errorCB);
            })(day,stages[s],stages.length, s);
        }
    }
}

function finishLineupStage(day){
    $('#lineup_carousel_' + day.id).carousel({preventDefaults:false});
    $('#lineup_day_buttons').append('<li id="' + day.id + '_day_button" class="item">' + day.date  + '</div>');


    $('#' + day.id + '_day_button').bind('click', function(){
        //set visibility to the correct carousel in the lineup frame
        $('[data-role="lineup_carousel"]').css('display', 'none');
        $('#lineup_carousel_' + day.id).css('display', 'block');
    });

}