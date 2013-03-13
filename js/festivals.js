// FESTIVALS_CONTAINER


// Inits carousel for festivals_container
var festivals_carousel;
function init_festivals() {
	festivals_carousel=$('#festivals_carousel').carousel({
		preventDefaults:false
	});
}
window.addEventListener('load', init_festivals, false);

// Queries the local Database for all festivals
function createFestivalsContainer(){
    db.transaction(function queryFestivals(tx) {
		tx.executeSql('SELECT * FROM FESTIVALS', [], queryFestivalsSuccess, errorQueryCB);
		}, errorCB);
}

// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {
	$('#festivals_carousel').css('display', 'block');

    var len = results.rows.length;
    for (var i=0; i<len; i++){
        var festival = results.rows.item(i);
		var festival_id = festival.id;

        $('#festivals_buttons').append('<li id="festival_' + festival_id +'" class="item"></li>');
        $('#festival_'+festival_id).append('<a href="#"><img src="' + festival.logo + '"></a>');

        $('#festival_'+festival_id).bind('click', function(){

			changeContainers("#festival");
            createFestivalContainer(this.id.replace("festival_", ""));
        });
    }


}
