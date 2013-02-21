// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
    window.db = window.openDatabase("FestivAllDB", "1.0", "FestivAll Database", 1000000);
	alert(localStorage["firstRun"]);
	
	//checks if the application is running for the first time
	$.ajax({
        url: "http://festivall.eu",
        dataType:"html",
        success:function (changes) {
			if(localStorage["firstRun"] == undefined){
				db.transaction(populateDB, errorCB, successCB);
				localStorage.setItem("firstRun", false);
			}else if(localStorage["firstRun"] == false){
					alert("syncing");
					sync("http://festivall.eu/festivals.json", function(){alert("Synchronization Finished!");});
					}
        },
        error: function(model, response) {
            alert("No internet connection! " + response);
        }
    });

    //load Sencha app
    //loadApp();
}

// Get the last synchronization date
function getLastSync(callback) {
    this.db.transaction(
        function(tx) {
            var sql = "SELECT MAX(updated_at) as lastSync FROM FESTIVALS, " +
			"SHOWS, DAYS, PHOTOS, USERS, COMMENTS, STAGES, NOTIFICATIONS, GALLERIES, COUNTRIES";
			alert("executing query @sync");
            tx.executeSql(sql, [],
                function(tx, results) {
					alert("finished query @sync");
                    var lastSync = results.rows.item(0).lastSync;
                    alert("last synchronization date : " + lastSync);
                    callback(lastSync);
                }, errorCB);
        }
    );
}

// Get the changes from the server
function getChanges(syncURL, modifiedSince, callback) {
    $.ajax({
        url: syncURL,
        data: {start_date: modifiedSince},
        dataType:"json",
        success:function (changes) {
            callback(changes);
        },
        error: function(model, response) {
            alert(response.responseText);
        }
    });

}

// Apply the changes to cache webSQL database
function applyChanges(response, callback) {
    insertData(response);
    callback();
}

//Synchronization algorithm logic
function sync(syncURL, callback ) {
    getLastSync(function(lastSync){
        getChanges(syncURL, lastSync,
            function (changes) {
                applyChanges(changes, callback);
            }
        );
    });
}

// Populate the database
function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS FESTIVALS');
    tx.executeSql('DROP TABLE IF EXISTS SHOWS');
    tx.executeSql('DROP TABLE IF EXISTS DAYS');
    tx.executeSql('DROP TABLE IF EXISTS PHOTOS');
    tx.executeSql('DROP TABLE IF EXISTS USERS');
    tx.executeSql('DROP TABLE IF EXISTS COMMENTS');
    tx.executeSql('DROP TABLE IF EXISTS STAGES');
    tx.executeSql('DROP TABLE IF EXISTS NOTIFICATIONS');
    tx.executeSql('DROP TABLE IF EXISTS GALLERIES');
    tx.executeSql('DROP TABLE IF EXISTS COUNTRIES');

    tx.executeSql('CREATE TABLE FESTIVALS(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), country_id INTEGER, coordinates VARCHAR(255),  city VARCHAR(255), ' +
        'logo VARCHAR(255), map VARCHAR(255), template VARCHAR(255), tickets TEXT(1024), transports TEXT(1024), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE SHOWS(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), festival_id INTEGER, stage_id INTEGER, ' +
        'day_id INTEGER, description TEXT(1024), time TIME, updated_at DATETIME)');
    tx.executeSql('CREATE TABLE DAYS(id INTEGER PRIMARY KEY AUTOINCREMENT, festival_id INTEGER, date DATETIME, opening_time TIME, closing_time TIME, updated_at DATETIME)');
    tx.executeSql('CREATE TABLE PHOTOS(id INTEGER PRIMARY KEY AUTOINCREMENT, show_id INTEGER, small VARCHAR(255), large VARCHAR(255), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE USERS(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), hashed_password VARCHAR(255), salt VARCHAR(255), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE COMMENTS(id INTEGER PRIMARY KEY AUTOINCREMENT, show_id INTEGER, text TEXT(1024), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE STAGES(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), festival_id, updated_at DATETIME)');
    tx.executeSql('CREATE TABLE NOTIFICATIONS(id INTEGER PRIMARY KEY AUTOINCREMENT, festival_id INTEGER, text TEXT(1024), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE GALLERIES(id INTEGER PRIMARY KEY AUTOINCREMENT, festival_id INTEGER, photo VARCHAR(255), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE COUNTRIES(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), updated_at DATETIME, flag VARCHAR(255))');


    $.getJSON("http://festivall.eu/festivals.json?callback=?", function(data) {
        insertData(data);
		db.transaction(queryDB, errorCB);
    });

}

function insertData(data){
    $.each(data, function(k,v){
        if(k=='festivals'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO FESTIVALS (id, name, country_id, coordinates, city, logo, map, template, tickets, transports, updated_at) VALUES (' + l.id +
                        ', "' + l.name + '", "' + l.country_id + '", "' + l.coord +'", "' + l.city + '", "' + l.logo_url +'", "' + l.map_url + '", "' + l.back_url + '", "'+
                        l.tickets + '", "' + l.transports + '", "' + l.updated_at +'")');}, errorCB,successCB);
            });
        }

        else if(k=='stages'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO STAGES (id, name, festival_id, updated_at) VALUES (' + l.id +
                        ', "' + l.name + '", ' + l.festival_id + ', "' + l.updated_at +'")');	}, errorCB,  successCB);
            });
        }

        else if(k=='days'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO DAYS (id, festival_id, date, opening_time, closing_time, updated_at) VALUES (' + l.id +
                        ', ' + l.festival_id + ', "' + l.date + '", "' + l.opening_time + '", "' + l.closing_time + '", "' + l.updated_at +'")');	}, errorCB, successCB);
            });
        }

        else if(k=='countries'){

            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO COUNTRIES (id, name, flag, updated_at) VALUES (' + l.id +
                        ', "' + l.name + '", "' + l.flag + '", "' + l.updated_at + '")');	}, errorCB, successCB);
            });
        }

        else if(k=='comments'){

            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO COMMENTS (id, show_id, text, updated_at) VALUES (' + l.id +
                        ', ' + l.show_id + ', "' + l.text + '", "' + l.updated_at + '")');	}, errorCB, successCB);
            });
        }

        else if(k=='notifications'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO NOTIFICATIONS (id, festival_id, text, updated_at) VALUES (' + l.id +
                        ', ' + l.festival_id + ', "' + l.text + '", "' + l.updated_at + '")');	}, errorCB, successCB);
            });
        }

        else if(k=='photos'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO PHOTOS (id, show_id, small, large, updated_at) VALUES (' + l.id +
                        ', ' + l.show_id + ', "' + l.small + '", "' + l.large + '", "' + l.updated_at + '")');	}, errorCB, successCB);
            });
        }

        else if(k=='galleries'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO GALLERIES (id, festival_id, photo, updated_at) VALUES (' + l.id +
                        ', ' + l.festival_id + ', "' + l.photo + '", "' + l.updated_at + '")');	}, errorCB, successCB);
            });

        }

        else if(k=='shows'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO SHOWS (id, name, festival_id, stage_id, day_id, description, time, updated_at) VALUES (' + l.id +
                        ', "' + l.name_id + '", ' + l.festival_id + ', ' + l.stage_id + ', ' + l.day_id + ', "' + l.description +
                        '", "' + l.time + '", "' + l.updated_at + '")');	}, errorCB, successCB);
            });
        }

        else if(k=='deleted_items'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Deleting from " + k);
					alert('DELETE FROM ' + l.table.toString().toUpperCase() + ' WHERE id=' + l.element );
                    tx.executeSql('DELETE FROM ' + l.table.toString().toUpperCase() +  ' WHERE id=' + l.element );}, errorCB, successCB);
                    alert("PopulateDB completed!");
            });
        }
    });
}

// Transaction success callback
function successCB(err) {
    //console.log("Transaction Success: " + err);
}

// Transaction error callback
function errorCB(err) {
    alert("Error processing SQL: " + err.message + err.code);
    //console.log("Error processing SQL: " + err.code + " : " + err.message);
}

// Query the success callback
function querySuccess(tx, results) {
    alert("query results");
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

function loadApp() {
    Ext.Loader.setConfig({
        enabled: true
    });

    Ext.application({
        name: 'SenchaFiddle',

        launch: function() {
            var ExtPanel = Ext.create('ExtPanel', {
                fullscreen: true,
                html: '<p style="color:orange">Hello from your first Sencha Touch App made by Sencha Fiddle.</p>' +
                    ''

            });
        }
    });

    Ext.define('Kitchensink.view.Fade', {
        extend: 'Ext.Panel',
        requires: ['Kitchensink.view.LoremIpsum2'],
        config: {
            cls: 'card card5',
            scrollable: true,
            items: [{
                docked: 'top',
                html: 'Fade Animation'
            }, {
                xtype: 'loremipsum2'
            }]
        }
    });
}