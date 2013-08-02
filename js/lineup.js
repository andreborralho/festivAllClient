// LINEUP_CONTAINER
/*
var lineup_day_buttons_scroller;
var lineup_nav_items = [];
var current_linup_page = 0;

// Queries the local Database for a show
function createLineupContainer(festival_id){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM DAYS WHERE FESTIVAL_ID='+festival_id + ' ORDER BY date', [], queryLineupSuccess, errorQueryCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryLineupSuccess(tx, results) {

    $('#lineup_day_scroll_wrapper').empty().append('' +
        '<ul id="lineup_day_buttons" class="nav_top"></ul>');

    $('#lineup_stages_bar').empty();
    $('#lineup_frame').empty();

    $('#header_link').unbind().bind('click', function(){
        createFestivalContainer(current_festival_id);
        fixHeaderLink('#'+festival_container+'_festival');
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

    if(stages.length >0){
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
                                '<div id="' + day.id + '_' + stage.id + '_lineup_frame_wrapper" class="scroll_wrapper">' +
                                    '<div id="' + day.id + '_' + stage.id + '_lineup_frame"></div>' +
                                '</div>');

                            var show, show_time;
                            if(shows.length > 0){
                                for(var l = 0; l <shows.length; l ++){
                                    show = shows.item(l);
                                    show_time = show.time.slice(11,16);

                                    if(show_time != "00:01")
                                        $('#' + day.id + '_' + stage.id + '_lineup_frame').append('' +
                                            '<li id="lineup_show_' + show.id + '" class="row">' +
                                                '<div class="column fixed bdr_r">' + show.time.slice(11,16) + '</div>' +
                                                '<div class="column"><h3 class="band_name">' + show.name + '</h3></div>' +
                                            '</li>');
                                    else
                                        $('#' + day.id + '_' + stage.id + '_lineup_frame').append('' +
                                            '<li id="lineup_show_' + show.id + '" class="row">' +
                                            '<div class="column fixed bdr_r">--:--</div>' +
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
                                //var myscroll = new IScroll('#' + day.id + '_' + stage.id + '_lineup_frame_wrapper');
                            }
                            else
                                $('#' + day.id + '_' + stage.id + '_lineup_frame').append('' +
                                    '<div class="padded">' +
                                        '<p>Não existem espectáculos para este palco neste dia.</p>' +
                                    '</div>');

                            if(s == (len - 1))
                                finishLineupStage(day, stages, day_len);

                            if(day_i == 0 && s == (len -1)){
                                changeContainers("#lineup", current_festival_name, "Cartaz");
                            }
                            else if(day_i == (day_len -1) && s == (len - 1)){

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
    }
    else{
        $('#lineup_frame').append('' +
            '<div class="padded">' +
                '<p>Cartaz ainda não disponível.</p>' +
            '</div>');
        changeContainers("#lineup", current_festival_name, "Cartaz");
    }
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
                '<li><a id="stage_' + stages[p].id + '_nav_item" href="#">' + stages[p].name + '</a></li>');
        else
            lineup_stages_nav_bar.append('' +
                '<li><a id="stage_' + stages[p].id + '_nav_item" href="#">' + stages[p].name + '</a></li>');
    }
}

function finishLineupStage(day, stages, day_len){
    appendStagesToNavBar(stages);

    var lineup_carousel = $('#lineup_carousel_' + day.id).carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            createPagingSwipeBar(index, lineup_nav_items);
            current_linup_page = index;
        }
    });

    //ERRO: FALTA POR O BIND CLICK AO ENTRAR NO CARTAZ SEM CLICAR NO BOTAO DO DIA
    //bindClickToNavBar(lineup_nav_items, lineup_carousel);

    var show_day = day.date.slice(8,10);
    var numeric_month = day.date.slice(5,7);
    var month = changeNumberToMonthAbrev(numeric_month);

    if(show_day == "01" && month == "Jan")
        $('#lineup_day_buttons').append(''+
            '<li id="' + day.id + '_day_button" class="column">' +
            '<a class="item">&nbsp;TBA&nbsp;</a>' +
            '</li>'
        );
    else
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

        var swipe_bar_list = $('#lineup_stages_bar');
        swipe_bar_list.find('a').removeClass('current');
        swipe_bar_list.removeClass('middle last').addClass('first');
        $('#stage_' + stages[0].id + '_nav_item').addClass('current');

        bindClickToNavBar(lineup_nav_items, lineup_carousel);
        $('#lineup_carousel_' + day.id).carousel().onMoveIndex(0, 200);
    });

}
*/
/* _____________________________________________________*/

var current_lineup_page;

function createLineupContainer(festival_id){
    db.transaction(function (tx) {
        tx.executeSql('SELECT *, DAYS.id AS d_id, STAGES.id AS st_id, SHOWS.id AS sh_id, ' +
            'STAGES.name AS stage_name, SHOWS.name AS show_name ' +
            'FROM DAYS inner join STAGES inner join SHOWS ' +
            'ON DAYS.festival_id = STAGES.festival_id AND SHOWS.day_id = d_id AND SHOWS.stage_id = st_id ' +
            'WHERE SHOWS.festival_id = ' + festival_id + ' ' +
            'ORDER BY d_id, st_id, SHOWS.time' , [], queryLineupSuccess, errorQueryCB);
    }, errorCB);
}

function queryLineupSuccess(tx, results) {
/*
    alert('len ' + results.rows.length);*/
    for(var i = 0; i <results.rows.length; i++){
        var row = results.rows.item(i);
        console.log(i + '. ' + row.show_name + ', ' + row.stage_name + ', ' + row.time + ', ' + row.date + ', day_id:' + row.d_id + ', stage_id :' + row.st_id);
    }

    $('#lineup_day_scroll_wrapper').empty().append('' +
        '<ul id="lineup_day_buttons" class="nav_top"></ul>');

    $('#lineup_stages_bar').empty();
    $('#lineup_frame').empty();

    $('#header_link').unbind().bind('click', function(){
        createFestivalContainer(current_festival_id);
        fixHeaderLink('#'+festival_container+'_festival');
    });


    var row = results.rows.item(0);
    var day_id = row.d_id;
    var stage_id = row.st_id;
    beginDay(row);  //adicionar o div do primeiro dia // se um dia não tem shows não aparece o botão
    $('#lineup_day_frame_' + day_id).addClass('active');
    beginStage(row);
    addShow(row);

    //Iterar sobre todos os espectáculos ordenados
    for(var i = 1; i <results.rows.length; i++){
        var curr_row = results.rows.item(i);
        if(row.d_id != curr_row.d_id){
            finishStage(row);
            finishDay(row); //finalizar o dia anterior
            beginDay(curr_row); //começar o dia currente
            beginStage(curr_row);
        }
        else if(row.st_id != curr_row.st_id){
            finishStage(row);
            beginStage(curr_row);
        }

        addShow(curr_row);
        row = curr_row;
    }
    changeContainers("#lineup", current_festival_name, "Cartaz");
}

function beginDay(show){
    var day_id = show.d_id;

    //adicionar o botão do dia
    var show_day = show.date.slice(8,10);
    var numeric_month = show.date.slice(5,7);
    var month = changeNumberToMonthAbrev(numeric_month);

    if(show_day == "01" && month == "Jan")
        $('#lineup_day_buttons').append(''+
            '<li id="' + day_id + '_day_button" class="column">' +
            '<a class="item">&nbsp;TBA&nbsp;</a>' +
            '</li>'
        );
    else
        $('#lineup_day_buttons').append(''+
            '<li id="' + day_id + '_day_button" class="column">' +
            '<a class="item">' +  show_day + ' ' + month + '</a>' +
            '</li>'
        );

    //Adicionar a frame do dia e a swipe bar
    $('#lineup_frame').append('' +
        '<div id="lineup_day_frame_' + day_id + '" class="lineup_day_frame">' +
            '<nav class="swipe_bar row" data-role="swipe_bar">' +
            '    <ul id="lineup_stages_bar_' + day_id + '" class="lineup_swipe_bar_list">'+
            '    </ul>' +
            '</nav>' +
        '   <div id="lineup_carousel_' + day_id + '" class="lineup_carousel" data-role="lineup_carousel"></div>' +
        '</div>');
}

function finishDay(show){
    var day_id = show.d_id;
    //Inicializar o carousel

    var lineup_nav_items = $('#lineup_stages_bar_' + day_id + ' .stage_nav_item');


    var lineup_carousel = $('#lineup_carousel_' + day_id).carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            //createPagingSwipeBar(index, lineup_nav_items);
            current_lineup_page = index; //watt
        }
    });

    //interacção do botão dos dias
    $('#' + day_id + '_day_button').unbind().bind('click', function(){

        //set visibility to the correct lineup_day_frame
        $('.lineup_day_frame').removeClass('active');
        $('#lineup_day_frame_' + day_id).addClass('active');
        $('#lineup_day_buttons .column').removeClass('current');
        $(this).addClass('current');

        lineup_nav_items.find('a').removeClass('current');
        lineup_nav_items.removeClass('middle last').addClass('first');

        lineup_nav_items[0].addClass('current');

        //bindClickToNavBar(lineup_nav_items, lineup_carousel);
        $('#lineup_carousel_' + day_id).carousel().onMoveIndex(0, 200);
    });
}

function beginStage(show){
    var stage_id = show.st_id;
    var day_id = show.d_id;
    //Adicionar a frame do palco
    $('#lineup_carousel_' + day_id).append('' +
        '<div id="' + day_id + '_' + stage_id + '_lineup_frame_wrapper" class="scroll_wrapper">' +
            '<div id="' + day_id + '_' + stage_id + '_lineup_frame"></div>' +
        '</div>');
    //adicionar a tab ao swipe bar

    $('lineup_stages_bar_' + day_id).append(''
        + '<li><a id="stage_' + stage_id + '_nav_item" class="stage_nav_item">' + show.stage_name + '</a></li>');
}

function finishStage(show){
    var day_id = show.d_id;
    var stage_id = show.st_id;
    //Activar o scroller
    $('#' + day_id + '_' + stage_id + '_lineup_frame').scroller();
}

function addShow(show){
    var day_id = show.d_id;
    var stage_id = show.st_id;
    var show_time = show.time.slice(11,16);

    if(show_time != "00:01")
        $('#' + day_id + '_' + stage_id + '_lineup_frame').append('' +
            '<li id="lineup_show_' + show.sh_id + '" class="row">' +
            '<div class="column fixed bdr_r">' + show.time.slice(11,16) + '</div>' +
            '<div class="column"><h3 class="band_name">' + show.show_name + '</h3></div>' +
            '</li>');
    else
        $('#' + day_id + '_' + stage_id + '_lineup_frame').append('' +
            '<li id="lineup_show_' + show.sh_id + '" class="row">' +
            '<div class="column fixed bdr_r">--:--</div>' +
            '<div class="column"><h3 class="band_name">' + show.show_name + '</h3></div>' +
            '</li>');
}
