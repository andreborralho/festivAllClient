// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
    window.db = window.openDatabase("FestivAllDB", "1.0", "FestivAll Database", 200000);
    db.transaction(populateDB, errorCB, successCB);
}

// Populate the database
function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS FESTIVALS');
    tx.executeSql('CREATE TABLE FESTIVALS (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), coordinates VARCHAR(255), city VARCHAR(255), ' +
        'logo VARCHAR(255), map VARCHAR(255), template VARCHAR(255), tickets TEXT, transports TEXT, updated_at DATETIME)');

    $.getJSON("http://festivall.eu/festivals.json?callback=?", function(data) {
        $.each(data, function(k,v){
			db.transaction(function(tx){
            tx.executeSql('INSERT INTO FESTIVALS (id, name, coordinates, city, logo, map, template, tickets, transports, updated_at) VALUES (' + v.id +
			', "' + v.name + '", "' + v.coord +'", "' + v.city + '", "' + v.logo_url +'", "' + v.map_url + '", "' + v.back_url + '", "' +v.tickets + '", "' + 
			v.transports + '" ,"' + v.updated_at +'")');
			}, errorCB, successCB);
        });
		db.transaction(queryDB, errorCB);
    });

}

// Transaction success callback
function successCB(err) {
    console.log("Transaction Success!");
}

// Transaction error callback
function errorCB(err) {
	console.log("Error processing SQL: " + err.code + " : " + err.message);
}

// Query the success callback
function querySuccess(tx, results) {
    var len = results.rows.length;

	var str = "";
    for (var i=0; i<len; i++){
		
        str += "name :" + results.rows.item(i).name + "\n";
        //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
    }
	alert(str);
}

// Query the database
function queryDB(tx) {
    tx.executeSql('SELECT * FROM FESTIVALS', [], querySuccess, errorCB);
}