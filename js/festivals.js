// FESTIVALS_CONTAINER


// Queries the local Database for all festivals
function createFestivalsContainer(){
    db.transaction(function queryFestivals(tx) {
        tx.executeSql('SELECT FESTIVALS.*, MIN(DAYS.date) as first_day ' +
                        'FROM DAYS INNER JOIN FESTIVALS ' +
                        'ON FESTIVALS.id = DAYS.festival_id ' +
                        'GROUP BY DAYS.festival_id ' +
                        'ORDER BY first_day', [], queryFestivalsSuccess, errorQueryCB);
                }, errorCB);

    createAds();
}



// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {
    if(isSynched)
        window.FestivallToaster.showMessage('Base de dados criada!');

    //Create festivals container after insertions
    if(localStorage["firstRun"] == "true"){
        localStorage.setItem("firstRun", "false");
        $('#installer').removeClass('visible');
        initFestivalsDisplay();
        updateLastSync();
    }

    incrementHistory("#festivals");
    $('#festivals_buttons').empty();

    var len = results.rows.length;
    var festivals = results.rows;
    var ended_festivals = [];
    for (var i=0; i<len; i++){
        var festival = festivals.item(i);
        var festival_id = festival.id;

        checkIfAfterFestival(festival.id, ended_festivals, i, len);
    }
}

function checkIfAfterFestival(festival_id, ended_festivals, i, len){
    var current_time = new Date().getTime();
    db.transaction(function (tx) {
        tx.executeSql('SELECT *, FESTIVALS.id AS id, DAYS.id as day_id ' +
            'FROM FESTIVALS INNER JOIN DAYS ON FESTIVALS.ID = DAYS.FESTIVAL_ID ' +
            'WHERE FESTIVALS.ID='+festival_id, [], function(tx,results){
            var closing_time = getLastDayClosingTime(results.rows);
            var festival = results.rows.item(0);
            if (current_time > closing_time){
                ended_festivals.push(festival);
            }else{
                addFestivalToList(festival);
            }
            //add ended festivals and scroller
            if(i >= len-1){
                //meter linha
                $('#festivals_buttons').append('<br><div class="festivals_line_break">Terminados</div>');
                for(var j = 0; j <ended_festivals.length; j++){
                    addFestivalToList(ended_festivals[j]);
                }
                //$('#festivals_buttons').scroller();
                new IScroll('#festivals_scroll_wrapper');
            }
        }, errorQueryCB);
    }, errorCB);
}

function addFestivalToList(festival){
    //Check if the logo file exists
    var filename = festival.name + '.jpg';
    var hasLogo = localStorage[filename];
    var filePath = 'file:///data/data/com.festivall_new/'  + filename;
    var url = festival.logo;
    //Ajax call to download logo
    if(hasLogo == undefined){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
                var fileTransfer = new FileTransfer();
                fileTransfer.download(
                    url,
                    filePath,
                    function(entry) {
                        console.log('download success');
                        localStorage[festival.name + '.jpg'] = "true";
                        addLogo(festival);
                },
                    function(error) {
                        console.log("download error source " + error.source);
                    }
                );
            });
        }, fail);
    }
    //Reads from the file
    else{
        //
        addLogo(festival);
    }
}


//fail reading
function fail(evt) {
    console.log(' 000.ERROR : ' + evt.target.error.code);
}


function addLogo(festival){
    var file_path = 'file:///data/data/com.festivall_new/' + festival.name + '.jpg';
    console.log('FETCHING LOGO with filename :' + file_path);
    $('#festivals_buttons').append('' +
        '<li id="festival_' + festival.id +'" class="item">' +
            '<a href="#"><img class="festival_logo" src="' + file_path + '"></a>' +
        '</li>');

    $('#festival_'+festival.id).unbind().bind('click', function(){
        createFestivalContainer(this.id.replace("festival_", ""));
    });
}
