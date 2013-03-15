// INFO_CONTAINER


// Inits carousel for info_container
var info_carousel;
function initInfo() {
	info_carousel=$('#info_carousel').carousel({
		preventDefaults:false
	});				
}
// Queries the local Database for a show
function createInfoContainer(festival_id){
    initInfo();

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM FESTIVALS WHERE ID='+festival_id, [], queryInfoSuccess, errorCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryInfoSuccess(tx, results) {

    var festival = results.rows.item(0);
    var coordinates = festival.coordinates;
    var latitude = coordinates[0];
    var longitude = coordinates[1];

    $('#tickets_page').html(festival.tickets);
    $('#tickets_page').html().replace(/\r\n/g, "<br>");
    $('#transports_page').text(festival.transports);
    //$('#transports_page').value.replace(/\n/g, "<br />");

    $.getJSON('http://free.worldweatheronline.com/feed/weather.ashx?q='+ 39.71 +',' + -8.75 +'&format=json&num_of_days=5&key=553a8863c6144236131203', function(data) {
        insertData(data);
    });
}
