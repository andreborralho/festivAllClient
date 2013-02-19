// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
    var db = window.openDatabase("FestivAllDB", "1.0", "FestivAll Database", 200000);
    db.transaction(populateDB, errorCB, querySuccess);
    loadApp();
}

// Populate the database
function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS FESTIVALS');
    tx.executeSql('CREATE TABLE FESTIVALS (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), coordinates VARCHAR(255), city VARCHAR(255), ' +
        'logo VARCHAR(255), map VARCHAR(255), template VARCHAR(255), tickets TEXT, transports TEXT, updated_at DATETIME)');

    $.getJSON("http://festivall.eu/festivals.json?callback=?", function(data) {
        $.each(data, function(){
            tx.executeSql('INSERT INTO FESTIVALS (id, name, coordinates, city, logo, map, template, tickets, transports, updated_at) VALUES (' + this.id +', "' + this.name + '", "' +
                this.coord +'", "' + this.city + '", "' + this.logo_url +'", "' + this.map_url + '", "' + this.back_url + '", "' +this.tickets + '", "' + this.transports + '" ,"' + this.updated_at +'")');
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
        alert(results.rows.item(i).tickets + " " + results.rows.item(i).transports);
        //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
    }
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