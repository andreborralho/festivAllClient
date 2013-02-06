// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
    var db = window.openDatabase("FestivAllDB", "1.0", "FestivAll Database", 200000);
    db.transaction(populateDB, errorCB, successCB);
}

// Populate the database
function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS FESTIVALS', querySuccess, errorCB);
    tx.executeSql('CREATE TABLE IF NOT EXISTS FESTIVALS (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), country_id INTEGER, ' +
        'coordinates VARCHAR(255), city VARCHAR(255), logo VARCHAR(255), template VARCHAR(255), map VARCHAR(255), tickets TEXT, transports TEXT, updated_at DATETIME)', querySuccess, errorCB);

    $.getJSON("http://festivall.eu/festivals.json?callback=?", function(data) {
        $.each(data, function(){

            tx.executeSql('INSERT INTO FESTIVALS (id, name, country_id, coordinates, city, logo, template, map, tickets, transports, updated_at) ' +
                'VALUES (' + this.id+',' + this.name+',' + this.country_id +',' + this.coord +',' +this.city +',' +this.logo_url +',' +this.back_url +','
                +this.map_url +',' + this.tickets +',' + this.transports +',' + this.updated_at +')');
        });

        queryDB(tx);
    });

}

// Transaction error callback
function errorCB(err) {
    console.log("Error processing SQL: "+err.code);
}
// Transaction success callback
function successCB() {
    var db = window.openDatabase("FestivAllDB", "1.0", "FestivAll Database", 200000);
    db.transaction(queryDB, errorCB);
}
// Query the database
function queryDB(tx) {
    tx.executeSql('SELECT * FROM FESTIVALS', [], querySuccess, errorCB);
}
// Query the success callback
function querySuccess(tx, results) {
    var len = results.rows.length;     alert(len);

    for (var i=0; i<len; i++){
        alert(results.rows.item(i).name);
        //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
    }
}