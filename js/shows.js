// FESTIVAL_CONTAINER

// Success callback for the query all the shows of one festival
function queryFestivalShowsSuccess(tx, results) {

    var shows = results.rows;
	var len = shows.length;
    var show, show_id;
    var show_name_letter, show_name_previous_letter, numeric_month, month;

    $('#shows_page_list').empty();
	for (var i=0; i<len; i++){
        show = shows.item(i);
		show_id = shows.item(i).id;
        numeric_month = show.day_date.slice(5,7);
        show_name_letter = show.name.slice(0,1);

        month = changeNumberToMonthAbrev(numeric_month);

        if(show_name_letter != show_name_previous_letter){
            $('#shows_page_list').append('<li id="show_letter_' + show_name_letter +'"></li>');

            $('#show_letter_' + show_name_letter).append(
                '<header class="list_header row"><span>' + show_name_letter + '</span></header>' +
                '<ul id="show_list_letter_' + show_name_letter +'" class="list"></ul>');
        }
        
        $('#show_list_letter_'+show_name_letter).append(
            '<li id="show_' + show_id + '" class="row">' +
                '<div class="column fixed bdr_r">' +
                    '<span class="show_date">' + show.day_date.slice(8,10) + " " + month + '</span><br>' +
                    '<span class="show_time">' + show.time.slice(11,16) + '</span>' +
                '</div>' +
                '<div class="column">' +
                    '<h3 class="band_name">' + show.name + '</h3>' +
                    '<p class="stage_name">' + show.stage_name + '</p>' +
                '</div>' +
            '</li>'
        /* +
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

    show_visited = false;

    //inits the before_festival_carousel
    $('#before_festival_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#festival_nav_item').removeClass('not_current');
                $('#shows_nav_item').addClass('not_current next');
            }
            else if(index == 1){
                $('#shows_nav_item').removeClass('not_current next');
                $('#festival_nav_item').addClass('not_current prev');
            }
        }
    });
}


function changeNumberToMonthAbrev(numeric_month){
    var month;
    switch(numeric_month){
        case "01":
            month = "Jan";
            break;
        case "02":
            month = "Fev";
            break;
        case "03":
            month = "Mar";
            break;
        case "04":
            month = "Abr";
            break;
        case "05":
            month = "Mai";
            break;
        case "06":
            month = "Jun";
            break;
        case "07":
            month = "Jul";
            break;
        case "08":
            month = "Ago";
            break;
        case "09":
            month = "Set";
            break;
        case "10":
            month = "Out";
            break;
        case "11":
            month = "Nov";
            break;
        case "12":
            month = "Dez";
            break;
    }
    return month;
}
