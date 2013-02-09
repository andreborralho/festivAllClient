// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
    var db = window.openDatabase("FestivAllDB", "1.0", "FestivAll Database", 200000);
    db.transaction(populateDB, errorCB, querySuccess);
}

// Populate the database
function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS FESTIVALS');
    tx.executeSql('CREATE TABLE FESTIVALS (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255))');
        //', coordinates VARCHAR(255), city VARCHAR(255), logo VARCHAR(255), template VARCHAR(255), map VARCHAR(255))');

    $.getJSON("http://festivall.eu/festivals.json?callback=?", function(data) {
        $.each(data, function(){
            tx.executeSql('INSERT INTO FESTIVALS (id, name) VALUES (' + this.id +', "' + this.name + '")');
               // + f.coord + '", "'+ f.city +'", "' +f.logo_url +'", "' + f.back_url +'", "' +f.map_url +'")');
                 /* + this.updated_at +')*/
        });

        queryDB(tx);
    });
}

// Transaction error callback
function errorCB(err) {alert(err);
    console.log("Error processing SQL: "+err);
}
// Query the success callback
function querySuccess(tx, results) {
    var len = results.rows.length;

    for (var i=0; i<len; i++){
        alert(results.rows.item(i).name); //+ " " + results.rows.item(i).city+ " " + results.rows.item(i).logo+ " " + results.rows.item(i).coordinates);
        //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
    }
}

// Query the database
function queryDB(tx) {
    tx.executeSql('SELECT * FROM FESTIVALS', [], querySuccess, errorCB);
}