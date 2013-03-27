// FESTIVALS_CONTAINER


// Inits carousel for festivals_container
var festivals_carousel, festivals_scroll;
function initFestivals() {
	festivals_carousel=$('#festivals_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#festivals_nav_item').removeClass('not_current');
                $('#search_nav_item').addClass('not_current next');
            }
            else if(index == 1){
                $('#search_nav_item').removeClass('not_current next');
                $('#festivals_nav_item').addClass('not_current prev');
            }
        }
	});
    festivals_scroll=$('#festivals_buttons').scroller();
}


window.addEventListener('load', initFestivals, false);


// Queries the local Database for all festivals
function createFestivalsContainer(){
    db.transaction(function queryFestivals(tx) {
		tx.executeSql('SELECT * FROM FESTIVALS', [], queryFestivalsSuccess, errorQueryCB);
    }, errorCB);

}

// Callback for the festivals query
function queryFestivalsSuccess(tx, results) {
	$('#festivals_carousel').css('display', 'block');

    incrementHistory("exit");

    var len = results.rows.length;
    for (var i=0; i<len; i++){
        var festival = results.rows.item(i);
		var festival_id = festival.id;

        $('#festivals_buttons').append('<li id="festival_' + festival_id +'" class="item"></li>');
        $('#festival_'+festival_id).append('<a href="#"><img src="' + festival.logo + '"></a>');

        $('#festival_'+festival_id).bind('click', function(){

            createFestivalContainer(this.id.replace("festival_", ""));
        });
    }
    initFestivals();

}
