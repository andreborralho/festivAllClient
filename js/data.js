// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

//Data - client side DB

// Cordova is ready
function onDeviceReady() {
    document.addEventListener("backbutton", backButton, false);

    window.db = window.openDatabase("FestivAllDB", "1.0", "FestivAll Database", 1000000);

    //menu button
    document.addEventListener("menubutton", menuButton, false);
    $('#menu_button').unbind().bind("click", menuButton);

    //Check if the application is running for the first time
    $.ajax({
        url: "http://festivall.eu",
        dataType:"html",
        success:function (changes) {
            if(localStorage["firstRun"] == undefined){
                db.transaction(populateDB, errorCB, successCreateDBCB);
                localStorage.setItem("firstRun", false);
            }
            else if(localStorage["firstRun"] == "false"){
                window.FestivallToaster.showMessage('Sincronizando...');
                sync("http://festivall.eu/festivals.json", function(){
                    window.FestivallToaster.showMessage('Sincronização terminada!');
                });
            }
        },
        error: function(model, response) {
            createFestivalsContainer();
            initFestivalsDisplay();
            window.FestivallToaster.showMessage("Não há conexão com a internet!");
        }
    });
}

// Callback for create db transaction
function successCreateDBCB(){
    window.FestivallToaster.showMessage('Base de dados criada!');
}


// Get the last synchronization date
function getLastSync(callback) {
    db.transaction(
        function(tx) {
            var sql = "SELECT MAX(lastSync) as lastSync FROM("
                + "SELECT MAX(updated_at) as lastSync FROM FESTIVALS UNION ALL "
                + "SELECT MAX(updated_at) as lastSync FROM SHOWS UNION ALL "
                + "SELECT MAX(updated_at) as lastSync FROM DAYS UNION ALL "
                //+ "SELECT MAX(updated_at) as lastSync FROM PHOTOS UNION ALL "
                //+ "SELECT MAX(updated_at) as lastSync FROM USERS UNION ALL "
                + "SELECT MAX(updated_at) as lastSync FROM COMMENTS UNION ALL "
                + "SELECT MAX(updated_at) as lastSync FROM STAGES UNION ALL "
                //+ "SELECT MAX(updated_at) as lastSync FROM NOTIFICATIONS UNION ALL "
                //+ "SELECT MAX(updated_at) as lastSync FROM GALLERIES UNION ALL "
                + "SELECT MAX(updated_at) as lastSync FROM VIDEOS UNION ALL "
                + "SELECT MAX(updated_at) as lastSync FROM ABOUT_US UNION ALL "
                + "SELECT MAX(updated_at) as lastSync FROM COUNTRIES)";

            tx.executeSql(sql, [],
                function(tx, results) {

                    var lastSync = results.rows.item(0).lastSync.replace("T"," ");
                    //alert("last synchronization date : " + lastSync);
                    callback(lastSync);
                }, errorQueryCB);
        }, errorCB
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
    window.FestivallToaster.showMessage("Base de dados a ser construída...");

    tx.executeSql('DROP TABLE IF EXISTS FESTIVALS');
    tx.executeSql('DROP TABLE IF EXISTS SHOWS');
    tx.executeSql('DROP TABLE IF EXISTS DAYS');
    //tx.executeSql('DROP TABLE IF EXISTS PHOTOS');
    tx.executeSql('DROP TABLE IF EXISTS USERS');
    tx.executeSql('DROP TABLE IF EXISTS COMMENTS');
    tx.executeSql('DROP TABLE IF EXISTS STAGES');
    //tx.executeSql('DROP TABLE IF EXISTS NOTIFICATIONS');
    tx.executeSql('DROP TABLE IF EXISTS GALLERIES');
    tx.executeSql('DROP TABLE IF EXISTS COUNTRIES');
    tx.executeSql('DROP TABLE IF EXISTS VIDEOS');
    tx.executeSql('DROP TABLE IF EXISTS ABOUT_US');

    tx.executeSql('CREATE TABLE FESTIVALS(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), country_id INTEGER, coordinates VARCHAR(255),  city VARCHAR(255), ' +
        'logo VARCHAR(255), map VARCHAR(255), template VARCHAR(255), tickets_price VARCHAR(255), tickets TEXT(1024), transports TEXT(1024), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE SHOWS(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), festival_id INTEGER, stage_id INTEGER, ' +
        'day_id INTEGER, photo VARCHAR(255), description TEXT(1024), time TIME, updated_at DATETIME)');
    tx.executeSql('CREATE TABLE DAYS(id INTEGER PRIMARY KEY AUTOINCREMENT, festival_id INTEGER, date DATETIME, opening_time TIME, closing_time TIME, updated_at DATETIME)');
    //tx.executeSql('CREATE TABLE PHOTOS(id INTEGER PRIMARY KEY AUTOINCREMENT, show_id INTEGER, small VARCHAR(255), large VARCHAR(255), updated_at DATETIME)');
    //tx.executeSql('CREATE TABLE USERS(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), hashed_password VARCHAR(255), salt VARCHAR(255), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE COMMENTS(id INTEGER PRIMARY KEY AUTOINCREMENT, show_id INTEGER, text TEXT(1024), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE STAGES(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), festival_id, updated_at DATETIME)');
    //tx.executeSql('CREATE TABLE NOTIFICATIONS(id INTEGER PRIMARY KEY AUTOINCREMENT, festival_id INTEGER, text TEXT(1024), updated_at DATETIME)');
    //tx.executeSql('CREATE TABLE GALLERIES(id INTEGER PRIMARY KEY AUTOINCREMENT, festival_id INTEGER, photo VARCHAR(255), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE COUNTRIES(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), updated_at DATETIME, flag VARCHAR(255))');
    tx.executeSql('CREATE TABLE VIDEOS(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), show_id INTEGER, url VARCHAR(255), updated_at DATETIME)');
    tx.executeSql('CREATE TABLE ABOUT_US(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), text TEXT(1024), updated_at DATETIME)');


    $.getJSON("http://festivall.eu/festivals.json?callback=?", function(data) {
        insertData(data);
    });

}

function insertData(data){
    $.each(data, function(k,v){
        if(k=='festivals'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    //console.log("Inserting in " + k);
                    var urlservidor = l.map;
                    window.btoa(urlservidor);

                    tx.executeSql('INSERT OR REPLACE INTO FESTIVALS (id, name, country_id, coordinates, city, logo, map, template, tickets_price, tickets, transports, updated_at) VALUES (' + l.id +
                        ', "' + l.name + '", "' + l.country_id + '", "' + l.coordinates +'", "' + l.city + '", "' + l.logo +'", "' + l.map + '", "' + l.template + '", "'+
                        l.tickets_price + '", "' + l.tickets + '", "' + l.transports + '", "' + l.updated_at +'")');
                }, errorCB, successCB);
            });
        }

        else if(k=='stages'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    //console.log(k + 'VALUES (' + l.id + ', "' + l.name + '", ' + l.festival_id + ', "' + l.updated_at+')');
                    tx.executeSql('INSERT OR REPLACE INTO STAGES (id, name, festival_id, updated_at) VALUES (' + l.id +
                        ', "' + l.name + '", ' + l.festival_id + ', "' + l.updated_at +'")');
                }, errorCB,  successCB);
            });
        }

        else if(k=='days'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    //console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO DAYS (id, festival_id, date, opening_time, closing_time, updated_at) VALUES (' + l.id +
                        ', ' + l.festival_id + ', "' + l.date + '", "' + l.opening_time + '", "' + l.closing_time + '", "' + l.updated_at +'")');
                }, errorCB, successCB);
            });
        }

        else if(k=='countries'){

            $.each(v, function(i, l){
                db.transaction(function(tx){
                    //console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO COUNTRIES (id, name, flag, updated_at) VALUES (' + l.id +
                        ', "' + l.name + '", "' + l.flag + '", "' + l.updated_at + '")');
                }, errorCB, successCB);
            });
        }

        else if(k=='comments'){

            $.each(v, function(i, l){
                db.transaction(function(tx){
                    //console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO COMMENTS (id, show_id, text, updated_at) VALUES (' + l.id +
                        ', ' + l.show_id + ', "' + l.text + '", "' + l.updated_at + '")');
                }, errorCB, successCB);
            });
        }
        /*
         else if(k=='notifications'){
         $.each(v, function(i, l){
         db.transaction(function(tx){
         console.log("Inserting in " + k);
         tx.executeSql('INSERT OR REPLACE INTO NOTIFICATIONS (id, festival_id, text, updated_at) VALUES (' + l.id +
         ', ' + l.festival_id + ', "' + l.text + '", "' + l.updated_at + '")');	}, errorCB, successCB);
         });
         }*/
        /*
         else if(k=='photos'){
         $.each(v, function(i, l){
         db.transaction(function(tx){
         console.log("Inserting in " + k);
         tx.executeSql('INSERT OR REPLACE INTO PHOTOS (id, show_id, small, large, updated_at) VALUES (' + l.id +
         ', ' + l.show_id + ', "' + l.small + '", "' + l.large + '", "' + l.updated_at + '")');	}, errorCB, successCB);
         });
         }
         */
        /*else if(k=='galleries'){
         $.each(v, function(i, l){
         db.transaction(function(tx){
         //console.log("Inserting in " + k);
         tx.executeSql('INSERT OR REPLACE INTO GALLERIES (id, festival_id, photo, updated_at) VALUES (' + l.id +
         ', ' + l.festival_id + ', "' + l.photo + '", "' + l.updated_at + '")');
         }, errorCB, successCB);
         });

         }*/

        else if(k=='shows'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO SHOWS (id, name, festival_id, stage_id, day_id, photo, description, time, updated_at) VALUES (' + l.id +
                        ', "' + l.name + '", ' + l.festival_id + ', ' + l.stage_id + ', ' + l.day_id + ', "' + l.photo + '", "' + l.description +
                        '", "' + l.time + '", "' + l.updated_at + '")');
                }, errorCB, successCB);
            });
        }

        else if(k=='videos'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    //console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO VIDEOS (id, name, show_id, url, updated_at) VALUES (' + l.id +
                        ', "' + l.name + '", ' + l.show_id + ', "' + l.url + '", "' + l.updated_at + '")');
                }, errorCB, successCB);
            });
        }

        else if(k=='about_us'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    //console.log("Inserting in " + k);
                    tx.executeSql('INSERT OR REPLACE INTO ABOUT_US (id, title, text, updated_at) VALUES (' + l.id +
                        ', "' + l.title + '", "' + l.text + '", "' + l.updated_at + '")');
                }, errorCB, successCB);
            });
        }

        else if(k=='deleted_items'){
            $.each(v, function(i, l){
                db.transaction(function(tx){
                    console.log("Deleting from " + k);
                    tx.executeSql('DELETE FROM ' + l.table.toString().toUpperCase() +  ' WHERE id=' + l.element );
                }, errorCB, successCB);
            });
            updateLastSync();
        }
    });
    //Create festivals container after insertions

    createFestivalsContainer();
    initFestivalsDisplay();
}

//Updates de timestamp of 'a' festival with the date of the most recent synchronization
function updateLastSync(){
    db.transaction(function(tx){
    console.log("Updating updated_at");
        tx.executeSql('SELECT * FROM FESTIVALS ', [], function(tx, results){
           var festival = results.rows.item(0);
           db.transaction(function(tx){
               tx.executeSql('UPDATE FESTIVALS SET updated_at="' + getCurrentDate() + '" WHERE id=' + festival.id);
           }, errorCB, successCB);
       }, errorQueryCB );
    }, errorCB);
}

// Transaction success callback
function successCB() {
    console.log("Transaction Success: ");
}

// Transaction error callback
function errorCB(err) {
    alert("Error processing SQL: " + err + ", " + err.message + ", " + err.code);
    console.log("Error processing SQL: " + err.code + " : " + err.message);
}

function errorQueryCB(tx, err){
    alert("Error processing SQL query: " + err + ", " + err.message + ", " + err.code);
    console.log("Error processing SQL query: " + err.code + " : " + err.message);
}


// Get the current Date, used in syncronization
function getCurrentDate(){
    var d = new Date();
    var df = d.getFullYear() + '-' + ('0' + String(d.getMonth()+1)).substr(-2)+ '-' +('0' + String(d.getDate())).substr(-2) +
        'T' + ('0' + String(d.getHours())).substr(-2) + ':' + ('0' + String(d.getMinutes())).substr(-2) + ':' + ('0' + String(d.getSeconds())).substr(-2) + 'Z';
    return df;
}