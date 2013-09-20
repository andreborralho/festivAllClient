// FESTIVALS_CONTAINER


// Queries the local Database for all festivals
function createFestivalsContainer(){
    db.transaction(function queryFestivals(tx) {
        console.log('QUERYING FESTIVALS :');

        tx.executeSql('SELECT FESTIVALS.*, MIN(DAYS.date) as first_day ' +
                        'FROM DAYS INNER JOIN FESTIVALS ' +
                        'ON FESTIVALS.id = DAYS.festival_id ' +
                        'GROUP BY DAYS.festival_id ' +
                        'ORDER BY first_day', [], queryFestivalsSuccess, errorQueryCB);
                }, errorCB, successCB);
}



// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {

    //Create festivals container after insertions
    if(localStorage["firstRun"] == "true"){
        window.FestivallToaster.showMessage('Base de dados criada!');
        localStorage.setItem("firstRun", "false");
        $('#installer').removeClass('visible');
        console.log('INITIALIZING DISPLAY :');
        createAppDir('FestivAll'); //creates the directory for the local storage files
        initFestivalsDisplay();
    }
    incrementHistory("#festivals");
    $('#festivals_buttons').empty();

    var len = results.rows.length;
    var festivals = results.rows;
    console.log('FESTIVALS LENGTH :' + len);
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
                addFestivalToList(festival, i, len);
            }
            //add ended festivals and scroller
            if(i >= len-1){
                //meter linha
                $('#festivals_buttons').append('<br><div class="festivals_line_break">Terminados</div>');
                for(var j = 0; j <ended_festivals.length; j++){
                    addFestivalToList(ended_festivals[j], i, len);
                }
                //$('#festivals_buttons').scroller();
                console.log('FESTIVALS: INITIALIZING SCROLLER :');
                var festivals_scroller = new IScroll('#festivals_scroll_wrapper');


            }
        }, errorQueryCB);
    }, errorCB, successCB);

}

function addFestivalToList(festival, i, len){


    $('#festivals_buttons').append('' +
        '<li id="festival_' + festival.id +'" class="item">' +
            '<a href="#"><img class="festival_logo" src=""></a>' +
        '</li>');

    $('#festival_'+festival.id).unbind().bind('click', function(){
        createFestivalContainer(this.id.replace("festival_", ""));
    });


    //Check if the logo file exists
    var filename = festival.name + '.jpg';
    var hasLogo = localStorage[festival.name];
    var file_path = 'file:///data/data/com.festivall_new/FestivAll/'  + filename;
    var url = festival.logo;
    //Ajax call to download logo if it is not stored
    if(hasLogo == undefined || festival.logo != hasLogo){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
                var fileTransfer = new FileTransfer();
                fileTransfer.download(
                    url,
                    file_path,
                    function(entry) {
                        console.log('DOWNLOAD LOGO FROM ' + festival.name + 'SUCCESS, URL:' + url);
                        localStorage[festival.name] = url;
                        addLogo(festival, file_path,i, len);  //Reads from the file
                    },
                    function(error) {
                        console.log('ERROR MAP FROM ' + festival.name + 'FAIL, URL:' + url);
                    }
                );
            });
        }, fail);
    }
    else{  //Reads from the file
        addLogo(festival, file_path, i, len);
    }
    //Cache the map of the festival
    cacheMap(festival);

}

//fail reading
function fail(evt) {
    console.log(' 000.ERROR : ' + evt.target.error.code);
}

function addLogo(festival, file_path, i, len){
    var dummy = makeid();
    console.log('FETCHING LOGO :' + file_path);
    $('#festival_' + festival.id ).empty();
    $('#festival_' + festival.id ).append('<a href="#"><img class="festival_logo" src="' + file_path + '?dummy=' + dummy + '"></a>');

}


function makeid(){
    var text = "";
    var possible = "0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function cacheMap(festival){
    //Check if the logo file exists
    var filename = festival.name + '_map.jpg';
    var hasMap = localStorage[filename];
    console.log('ADDING MAP: hasMap :' + hasMap + ', festival.map : ' + festival.map);
    var file_path = 'file:///data/data/com.festivall_new/FestivAll/'  + filename;
    var url = festival.map;
    //Ajax call to download logo if it is not stored
    if(hasMap == undefined )
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {});
        });

    if(festival.map != hasMap || hasMap == undefined ){
        var fileTransfer = new FileTransfer();
        fileTransfer.download(
            url,
            file_path,
            function(entry) {
                console.log('DOWNLOAD MAP FROM ' + festival.name + 'SUCCESS, URL:' + url);
                localStorage[festival.name + '_map.jpg'] = url;
            },
            function(error) {
                console.log('ERROR MAP FROM ' + festival.name + 'FAIL, URL:' + url);
            }
        );
    }
}

function createAppDir(filename){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            var entry=fileSystem.root;
            entry.getDirectory(filename, {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail);
        } , null);


    function onGetDirectorySuccess(dir) {
        console.log("Created dir "+dir.name);
    }

    function onGetDirectoryFail(error) {
        console.log("Error creating directory "+error.code);
    }
}