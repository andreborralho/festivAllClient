// FESTIVAL_CONTAINER

// Success callback for the query all the shows of one festival
function queryFestivalShowsSuccess(tx, results) {

    var shows = results.rows;
	var len = shows.length;
    var show, show_id;
    var show_name_letter, show_name_previous_letter, numeric_month, month;

	for (var i=0; i<len; i++){
        show = shows.item(i);
		show_id = shows.item(i).id;
        numeric_month = show.day_date.slice(5,7);
        show_name_letter = show.name.slice(0,1);

        switch(numeric_month){
            case "01":
                month = "January";
                break;
            case "02":
                month = "February";
                break;
            case "03":
                month = "March";
                break;
            case "04":
                month = "April";
                break;
            case "05":
                month = "May";
                break;
            case "06":
                month = "June";
                break;
            case "07":
                month = "July";
                break;
            case "08":
                month = "August";
                break;
            case "09":
                month = "September";
                break;
            case "10":
                month = "October";
                break;
            case "11":
                month = "November";
                break;
            case "12":
                month = "December";
                break;
        }

        if(show_name_letter != show_name_previous_letter)
            $('#shows_page').append('<div class="show_letter">' + show_name_letter + '</div>');

		$('#shows_page').append('<div id="show_' + show_id + '" class="show_entry"></div>');
		$('#show_'+show_id).append('<div class="show_entry_name">'+show.name+'</div>' +
            '<div class="show_entry_stage">' +show.stage_name+'</div>' +
            '<div class="show_entry_stage">' +show.day_date.slice(8,10) + " " + month +' | ' + show.time.slice(11,16) +'</div>');

        $('#show_'+show_id).bind('click', function(){
            changeContainers("#show");
            createShowContainer(this.id.replace("show_", ""));
        });

        show_name_previous_letter = show_name_letter;

	}
    initFestival();
    //inits the before_festival_carousel
    $('#before_festival_carousel').carousel({preventDefaults:false});
}
