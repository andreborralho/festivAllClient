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

        month = changeNumberToMonth(numeric_month);

        if(show_name_letter != show_name_previous_letter)
            $('#shows_page').append('<div class="show_letter">' + show_name_letter + '</div>');

		$('#shows_page').append('<div id="show_' + show_id + '" class="show_entry"></div>');
		$('#show_'+show_id).append('<div class="show_entry_name">'+show.name+'</div>' +
            '<div class="show_entry_stage">' +show.stage_name+'</div>' +
            '<div class="show_entry_stage">' +show.day_date.slice(8,10) + " " + month +' | ' + show.time.slice(11,16) +'</div>');


        $('#shows_page_list').append('<li></li>');

        if(show_name_letter != show_name_previous_letter)
            $('#shows_page_list li').append(
                '<header class="list_header"><span>' + show_name_letter + '</span></header>' +
                '<ul class="list">' +
                    '<li id="#show_' + show_id + '" class="row">' +
                    '</li>' +
                '</ul>'
            );

        $('#show_'+show_id).append(
            '<div class="column fixed bdr_r">' +
                '<span class="show_date">' + show.day_date.slice(8,10) + " " + month + '</span>' +
                '<span class="show_time">' + show.time.slice(11,16) + '</span>' +
            '</div>' +
            '<div class="column">' +
                '<h3 class="band_name">' + show.name + '</h3>' +
                '<p class="stage_name">' + show.stage_name + '</p>' +
            '</div>'/* +
            '<div class="column fixed bdr_l">' +
                '<span>%</span>' +
            '</div>'*/
        );


        $('#show_'+show_id).bind('click', function(){
            changeContainers("#show");
            createShowContainer(this.id.replace("show_", ""));
        });

        show_name_previous_letter = show_name_letter;

	}
    //inits the before_festival_carousel
    $('#before_festival_carousel').carousel({preventDefaults:false});
}


function changeNumberToMonth(numeric_month){
    var month;
    switch(numeric_month){
        case "01":
            month = "Janeiro";
            break;
        case "02":
            month = "Fevereiro";
            break;
        case "03":
            month = "Março";
            break;
        case "04":
            month = "Abril";
            break;
        case "05":
            month = "Maio";
            break;
        case "06":
            month = "Junho";
            break;
        case "07":
            month = "Julho";
            break;
        case "08":
            month = "Agosto";
            break;
        case "09":
            month = "Setembro";
            break;
        case "10":
            month = "Outubro";
            break;
        case "11":
            month = "Novembro";
            break;
        case "12":
            month = "Dezembro";
            break;
    }
    return month;
}
