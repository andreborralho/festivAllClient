function createSearchPage(){
    $('#input_button').bind('click', function(){

        var search_token = $('#search_input').value();
        alert('search token : ' + search_token);

        db.transaction(function(tx){
            var sql = 'select SHOWS.name, SHOWS.time FESTIVALS.festival_name, STAGES.name, DAYS.date ' +
                'FROM SHOWS INNER JOIN FESTIVALS INNER JOIN STAGES INNER JOIN DAYS ' +
                'ON SHOWS.festival_id = FESTIVALS.id AND SHOWS.stage_id = STAGE.id AND SHOWS.day_id = DAYS.id ' +
                'WHERE SHOWS.name LIKE \'%' + search_token + '%\'';
            tx.executeSql(sql, function(tx, results){
                var shows = results.rows;
                var shows_len = results.length;
                alert('shows length:' + shows_len);
                for(var i = 0; i<shows_len; i++){
                    var show = shows.item(i);
                    alert('name : ' + show.name);
                    $('#search_list').append(''+
                        '<li class="row">'+
                            '<div class="column fixed bdr_r">' +
                                '<time>' +
                                    '<span>' + show.date + '</span>' +
                                    '<span>' + show.time +'</span>' +
                                '</time>' +
                            '</div>' +
                            '<div class="column">' +
                                '<h3 class="band_name">' + show.name + '</h3>'+
                                '<p>' + show.festival_name + '</p>' +
                             '</div>' +
                             '<div class="column fixed bdr_l">' +
                                '<span>%</span>' +
                             '</div>' +
                        '</li>');
                }
                //init carousel
                initFestivals();
            }, errorQueryCb);
        }, errorCB);
    });
}