// LINEUP_CONTAINER

var lineup_day_buttons_scroller;
var lineup_nav_items = [];

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
        fixHeaderLink('#'+festival_status+'_festival');
    });

    var days = results.rows;

    //Gets stages id's and names
    var stages = [];
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM STAGES WHERE FESTIVAL_ID='+days.item(0).festival_id , [],
            function(tx,results){
                for(var j = 0; j<results.rows.length; j++)
                    stages[j] = {"name":results.rows.item(j).name,"id":results.rows.item(j).id};

                buildLineup(stages, days);
            }, errorQueryCB);
    }, errorCB);
}

function buildLineup(stages, days){
    if (stages.length > 0){
        var days_length = days.length;
        for(var i = 0; i<days_length; i++){
            var day = days.item(i);

            $('#lineup_frame').append('' +
                '<div id="lineup_day_frame_' + day.id + '" class="lineup_day_frame">' +
                    '<div id="lineup_carousel_' + day.id + '" class="lineup_carousel" data-role="lineup_carousel"></div>' +
                '</div>');

            if(i==0){ //First day lineup shows on page open
                $('#lineup_day_frame_' + day.id).addClass('active');
            }

            for(var s = 0; s<stages.length; s++){
                (function(day,stage,len,s,day_i,day_len){ //manha gigante, pouco legivel
                    var day_opening_time = day.opening_time;
                    var day_closing_time = day.closing_time;

                    db.transaction(function(tx){
                        tx.executeSql('SELECT * FROM (SELECT * FROM SHOWS' +
                            ' WHERE festival_id=' + day.festival_id + ' AND stage_id=' + stage.id + ' AND day_id=' + day.id +
                            ' AND TIME(REPLACE(REPLACE(TIME,"Z",""),"T"," "))>=TIME(REPLACE("' + day_opening_time + '","T"," ")) ORDER BY TIME)' +
                            ' UNION ALL SELECT * FROM (SELECT * FROM SHOWS' +
                            ' WHERE festival_id=' + day.festival_id + ' AND stage_id=' + stage.id + ' AND day_id=' + day.id +
                            ' AND TIME(REPLACE(REPLACE(TIME,"Z",""),"T"," "))<=TIME(REPLACE("' + day_closing_time + '","T"," ")) ORDER BY TIME)', [],
                            function(tx,results){

                                var shows = results.rows;

                                //append day:stage frame
                                $('#lineup_carousel_' + day.id).append('' +
                                    '<div class="scroll_wrapper">' +
                                        '<div id="' + day.id + '_' + stage.id + '_lineup_frame"></div>' +
                                    '</div>');

                                if(shows.length > 0){
                                    for(var l = 0; l <shows.length; l ++){
                                        var show = shows.item(l);
                                        $('#' + day.id + '_' + stage.id + '_lineup_frame').append('' +
                                            '<li id="lineup_show_' + show.id + '" class="row">' +
                                                '<div class="column fixed bdr_r">' + show.time.slice(11,16) + '</div>' +
                                                '<div class="column"><h3 class="band_name">' + show.name + '</h3></div>' +
                                            '</li>');

                                        (function (show_name){
                                            $('#lineup_show_' + show.id ).unbind().bind('click', function(){
                                                createShowContainer(this.id.replace("lineup_show_", ""));
                                                changeContainers("#show", show_name, current_festival_name);
                                            });
                                        })(show.name);
                                    }
                                    $('#' + day.id + '_' + stage.id + '_lineup_frame').scroller();
                                }
                                else
                                    $('#' + day.id + '_' + stage.id + '_lineup_frame').append('' +
                                        '<div class="padded">Não existem espectáculos para este palco neste dia!</div>');

                                if(s == (len - 1))
                                    finishLineupStage(day, stages, day_len);

                                if(day_i == (day_len -1) && s == (len - 1)){

                                    changeContainers("#lineup", current_festival_name, "Cartaz");

                                    if(day_len > 4){//só inicia o scroll lineup_days se houver mais que 4 dias

                                        lineup_day_buttons_scroller = $('#lineup_day_buttons').scroller({
                                            verticalScroll:false,
                                            horizontalScroll:true
                                        });
                                        lineup_day_buttons_scroller.scrollTo({x:0,y:0});
                                    }
                                }
                            },errorQueryCB);
                    }, errorCB);
                })(day,stages[s],stages.length, s, i, days_length);
            }
        }
    }else { $('#lineup_frame').append('Ainda não há palcos para este cartaz!');}
}

function appendStagesToNavBar(stages){
    var lineup_stages_nav_bar = $('#lineup_stages_bar');
    lineup_stages_nav_bar.empty();

    for(var p = 0; p < stages.length; p++){
        lineup_nav_items[p] = "#stage_" + stages[p].id + "_nav_item";

        if(p==0)
            lineup_stages_nav_bar.append('' +
                '<li><a id="stage_' + stages[p].id + '_nav_item" class="current" href="#">' + stages[p].name + '</a></li>');
        else if(p==1)
            lineup_stages_nav_bar.append('' +
                '<li><a id="stage_' + stages[p].id + '_nav_item" class="not_current next" href="#">' + stages[p].name + '</a></li>');
        else
            lineup_stages_nav_bar.append('' +
                '<li><a id="stage_' + stages[p].id + '_nav_item" class="hidden" href="#">' + stages[p].name + '</a></li>');

    }
}
var lineup_carousel_day = [];var i=0;
function finishLineupStage(day, stages, day_len){

    appendStagesToNavBar(stages);

    lineup_carousel_day[i] = $('#lineup_carousel_' + day.id).carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#stage_' + stages[index].id + '_nav_item').addClass('current').removeClass('hidden not_current next prev');
                $('#stage_' + stages[index+1].id + '_nav_item').addClass('not_current next').removeClass('hidden current prev');
                $('#stage_' + stages[index+2].id + '_nav_item').addClass('hidden').removeClass('current next prev');
            }
            else if(index == stages.length - 1){
                if(index > 1)
                    $('#stage_' + stages[index-2].id + '_nav_item').addClass('hidden').removeClass('current');

                $('#stage_' + stages[index-1].id + '_nav_item').addClass('not_current prev').removeClass('current hidden');
                $('#stage_' + stages[index].id + '_nav_item').addClass('current').removeClass('not_current next prev');
            }
            else{
                if(index > 1)
                    $('#stage_' + stages[index-2].id + '_nav_item').addClass('hidden').removeClass('current');

                $('#stage_' + stages[index-1].id + '_nav_item').addClass('not_current prev').removeClass('current hidden next');
                $('#stage_' + stages[index].id + '_nav_item').addClass('current').removeClass('hidden not_current next prev');
                $('#stage_' + stages[index+1].id + '_nav_item').addClass('not_current next').removeClass('current hidden prev');

                for(var i=2; i < stages.length - 1;i++)
                    $('#stage_' + stages[index+i].id + '_nav_item').addClass('hidden').removeClass('current');
            }
        }
    });

    bindClickToNavBar(lineup_nav_items, lineup_carousel_day[i]);
    i++;
    var show_day = day.date.slice(8,10);
    var numeric_month = day.date.slice(5,7);
    var month = changeNumberToMonthAbrev(numeric_month);


    $('#lineup_day_buttons').append(''+
        '<li id="' + day.id + '_day_button" class="column">' +
            '<a class="item">' +  show_day + ' ' + month + '</a>' +
        '</li>'
    );

    //Resize the lineup buttons according to their number
    var width;
    if(day_len == 1){
        width =  String(window.innerWidth);
        $('#' + day.id + '_day_button').css("width", width + 'px');
    }else if (day_len == 2){
        width =  String(window.innerWidth/2);
        $('#' + day.id + '_day_button').css("width", width + 'px');
    }else if (day_len == 3){
        width =  String(window.innerWidth/3);
        $('#' + day.id + '_day_button').css("width", width + 'px');
    }else if (day_len >= 4){
        width =  String(window.innerWidth/4);
        $('#' + day.id + '_day_button').css("width", width + 'px');
    }

    if(day_len <= 4)
        $('#lineup_day_buttons .item').css('width', '100%');

    $('#lineup_day_buttons .column').eq(0).addClass('current');

    $('#' + day.id + '_day_button').unbind().bind('click', function(){

        //set visibility to the correct lineup_day_frame
        $('.lineup_day_frame').removeClass('active');
        $('#lineup_day_frame_' + day.id).addClass('active');
        $('#lineup_day_buttons .column').removeClass('current');
        $(this).addClass('current');

        $('#stage_' + stages[0].id + '_nav_item').addClass('current').removeClass('hidden not_current next prev');
        $('#stage_' + stages[1].id + '_nav_item').addClass('not_current next').removeClass('hidden current prev');
        $('#stage_' + stages[2].id + '_nav_item').addClass('hidden').removeClass('current');
        $('#stage_' + stages[3].id + '_nav_item').addClass('hidden').removeClass('current');

        lineup_carousel_day.onMoveIndex(0, 0);
    });
}