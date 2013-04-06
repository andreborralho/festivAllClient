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
    $('#lineup_stages_bar').empty();
    $('#lineup_frame').empty();

    $('#header_link').unbind().bind('click', function(){
        createFestivalContainer(current_festival_id);
        changeContainers("#festival", current_festival_name, "");
    });

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

                        //append day:stage frame
                        $('#lineup_carousel_' + day.id).append('<div id="' + day.id + '_' + stage.id + '_lineup_frame"></div>');

                        if(shows.length > 0){
                            for(var l = 0; l <shows.length; l ++){
                                var show = shows.item(l);
                                $('#' + day.id + '_' + stage.id + '_lineup_frame').append('' +
                                    '<div id="lineup_show_' + show.id + '" class="row">' +
                                        '<div class="column fixed bdr_r">' + show.time.slice(11,16) + '</div>' +
                                        '<div class="column"><h3 class="band_name">' + show.name + '</h3></div>' +
                                    '</div>');

                                (function (show_name){
                                    $('#lineup_show_' + show.id ).bind('click', function(){
                                        createShowContainer(this.id.replace("lineup_show_", ""));
                                        changeContainers("#show", show_name, current_festival_name);
                                    });
                                })(show.name);
                            }
                        }else {$('#' + day.id + '_' + stage.id + '_lineup_frame').append('Ainda não espectáculos para este palco neste dia!')}
                        if(s == (len - 1)){
                            finishLineupStage(day, stages);
                        }
                    },errorQueryCB);
                 }, errorCB);
            })(day,stages[s],stages.length, s);
        }
    }

    //scroll lineup days
}

function appendStagesToNavBar(stages){
    var lineup_stages_nav_bar = $('#lineup_stages_bar');
    lineup_stages_nav_bar.empty();

    for(var p = 0; p<stages.length; p++){
        if(p==0)
            lineup_stages_nav_bar.append('<li><a id="stage_' + stages[p].id + '_nav_item" href="#">' + stages[p].name + '</a></li>');
        else if(p==1)
            lineup_stages_nav_bar.append('<li><a id="stage_' + stages[p].id + '_nav_item" class="not_current next" href="#">' + stages[p].name + '</a></li>');
        else
            lineup_stages_nav_bar.append('<li><a id="stage_' + stages[p].id + '_nav_item" class="hidden" href="#">' + stages[p].name + '</a></li>');
    }
}

function finishLineupStage(day, stages){

    appendStagesToNavBar(stages);

    $('#lineup_carousel_' + day.id).carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#stage_' + stages[index].id + '_nav_item').removeClass('not_current next prev');
                $('#stage_' + stages[index+1].id + '_nav_item').addClass('not_current next');
                $('#stage_' + stages[index+2].id + '_nav_item').addClass('hidden');
                $('#stage_' + stages[index+3].id + '_nav_item').addClass('hidden');
            }
            else if(index == 1){
                $('#stage_' + stages[index].id + '_nav_item').removeClass('not_current next prev');
                $('#stage_' + stages[index-1].id + '_nav_item').addClass('not_current prev').removeClass('hidden');
                $('#stage_' + stages[index+1].id + '_nav_item').addClass('not_current next').removeClass('hidden');
                $('#stage_' + stages[index+2].id + '_nav_item').addClass('hidden');

            }
            else if(index == 2){
                $('#stage_' + stages[index].id + '_nav_item').removeClass('not_current next prev');
                $('#stage_' + stages[index-1].id + '_nav_item').addClass('not_current prev').removeClass('hidden');
                $('#stage_' + stages[index-2].id + '_nav_item').addClass('hidden');
                $('#stage_' + stages[index+1].id + '_nav_item').addClass('not_current next').removeClass('hidden');

            }
            else if(index == 3){
                $('#stage_' + stages[index].id + '_nav_item').removeClass('not_current next prev');
                $('#stage_' + stages[index-1].id + '_nav_item').addClass('not_current prev').removeClass('hidden');
                $('#stage_' + stages[index-2].id + '_nav_item').addClass('hidden');
            }
        }
    });

    var show_day = day.date.slice(8,10);
    var numeric_month = day.date.slice(5,7);
    var month = changeNumberToMonthAbrev(numeric_month);

    $('#lineup_day_buttons').append('<li id="' + day.id + '_day_button" class="column one-quarter">' +
        '<a href="#" class="item">' + show_day + ' ' + month + '</a></li>');

    $('#' + day.id + '_day_button').bind('click', function(){
        //set visibility to the correct carousel in the lineup frame
        $('[data-role="lineup_carousel"]').css('display', 'none');
        $('#lineup_carousel_' + day.id).css('display', 'block');
    });

}