// INFO_CONTAINER

function init_info_carousel(){

    // Inits carousel for info_container
    $('#info_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#tickets_nav_item').addClass('current').removeClass('not_current prev');
                $('#transports_nav_item').addClass('not_current next').removeClass('current');
                $('#weather_nav_item').addClass('hidden').removeClass('current');
            }
            else if(index == 1){
                $('#tickets_nav_item').addClass('not_current prev').removeClass('current hidden');
                $('#transports_nav_item').addClass('current').removeClass('not_current next prev');
                $('#weather_nav_item').addClass('not_current next').removeClass('current hidden');
            }
            else if(index == 2){
                $('#tickets_nav_item').addClass('hidden').removeClass('current');
                $('#transports_nav_item').addClass('not_current prev').removeClass('current');
                $('#weather_nav_item').addClass('current').removeClass('not_current next');
            }
        }
    });
}

// Queries the local Database for a show
function createInfoContainer(festival_id){

    $('#header_link').unbind().bind('click', function(){
        createFestivalContainer(festival_id);
        changeContainers("#before_festival", current_festival_name, "");
    });

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM FESTIVALS WHERE ID='+festival_id, [], queryInfoSuccess, errorCB);
    }, errorCB);

    //keep the navbar on first page
    $('#tickets_nav_item').addClass('current').removeClass('hidden not_current prev');
    $('#transports_nav_item').addClass('not_current next').removeClass('hidden current prev');
    $('#weather_nav_item').addClass('hidden').removeClass('current');
}

// Success callback for the the query of one festival
function queryInfoSuccess(tx, results) {
    $('#info_carousel').remove();
    $('#info').append('' +
        '<div id="info_carousel" class="carousel" data-role="carousel">' +

            '<div id="tickets_page" class="page" data-role="page">' +
                '<div id="tickets_wrapper" class="scroll_wrapper">' +
                    '<div id="tickets_scroller" class="padded"></div>' +
                '</div>' +
            '</div>' +

            '<div id="transports_page" class="page" data-role="page">' +
                '<div id=transports_wrapper class="scroll_wrapper">' +
                    '<div id="transports_scroller" class="padded"></div>' +
                '</div>' +
            '</div>' +

            '<div id="weather_page" class="page" data-role="page">' +
                '<div id="weather_wrapper" class="scroll_wrapper">' +
                    '<div id="weather_scroller">' +

                        // CURRENT
                        '<div id="weather_current">' +
                            '<div class="row">' +
                                '<div class="column centered">' +
                                    '<img src="" id="weather_img_current">' +
                                    '<span id="weather_temperature_current"></span>' +
                                '</div>' +
                            '</div>' +
                            '<p id="weather_description_current" class="row"></p>' +
                        '</div>' +

                        '<ul class="list">' +
                            // TODAY
                            '<div id="weather_day1" class="row">' +
                                '<div class="column centered">' +
                                    '<strong id="weather_weekday1" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date1" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<img src="" id="weather_img1">' +
                                '</div>' +
                                '<div class="column">' +
                                    '<p id="weather_description1"></p>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<span id="weather_max_temperature1"></span>/' +
                                    '<span id="weather_min_temperature1"></span>' +
                                '</div>' +
                            '</div>' +

                            // TOMORROW
                            '<div id="weather_day2" class="row">' +
                                '<div class="column centered">' +
                                    '<strong id="weather_weekday2" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date2" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<img src="" id="weather_img2">' +
                                '</div>' +
                                '<div class="column">' +
                                    '<p id="weather_description2"></p>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<span id="weather_max_temperature2"></span>/' +
                                    '<span id="weather_min_temperature2"></span>' +
                                '</div>' +
                            '</div>' +

                            // 2 DAYS FROM NOW
                            '<div id="weather_day3" class="row">' +
                                '<div class="column centered">' +
                                    '<strong id="weather_weekday3" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date3" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<img src="" id="weather_img3">' +
                                '</div>' +
                                '<div class="column">' +
                                    '<p id="weather_description3"></p>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<span id="weather_max_temperature3"></span>/' +
                                    '<span id="weather_min_temperature3"></span>' +
                                '</div>' +
                            '</div>' +

                            // DAY 4
                            '<div id="weather_day4" class="row">' +
                                '<div class="column centered">' +
                                    '<strong id="weather_weekday4" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date4" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<img src="" id="weather_img4">' +
                                '</div>' +
                                '<div class="column">' +
                                    '<p id="weather_description4"></p>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<span id="weather_max_temperature4"></span>/' +
                                    '<span id="weather_min_temperature4"></span>' +
                                '</div>' +
                            '</div>' +

                            // DAY 5
                            '<div id="weather_day5" class="row">' +
                                '<div class="column centered">' +
                                    '<strong id="weather_weekday5" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date5" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<img src="" id="weather_img5">' +
                                '</div>' +
                                '<div class="column">' +
                                    '<p id="weather_description5"></p>' +
                                '</div>' +
                                '<div class="column">' +
                                    '<span id="weather_max_temperature5"></span>/' +
                                    '<span id="weather_min_temperature5"></span>' +
                                '</div>' +
                            '</div>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>');


    var festival = results.rows.item(0);
    var coordinates = festival.coordinates;
    coordinates = coordinates.split(" ");

    var latitude = coordinates[0];
    var longitude = coordinates[1];

    var tickets_html_tags = festival.tickets.replace(/\r\n/g, "<br>");
    $('#tickets_scroller').html(tickets_html_tags);
    $('#tickets_scroller').scroller();

    var transports_html_tags = festival.transports.replace(/\r\n/g, "<br>");
    $('#transports_scroller').html(transports_html_tags);
    $('#transports_scroller').scroller();


    $.ajax({
        url: 'http://free.worldweatheronline.com/feed/weather.ashx?q='+ latitude +',' + longitude +
        '&format=json&num_of_days=5&key=553a8863c6144236131203',
        dataType:'application/json',
        contentType:'application/json',
        success:function (data) {
            data = JSON.parse(data);
            $.each(data, function(k,v){
                $.each(v, function(weather_key, weather_value){
                    if(weather_key=="current_condition"){
                        $.each(weather_value[0], function(temperature_key, temperature_value){
                            if(temperature_key=="temp_C"){
                                $('#weather_temperature_current').empty();
                                $('#weather_temperature_current').text(temperature_value + " ºC");
                            }

                            if(temperature_key=="weatherDesc"){
                                var weather_description_selector = $('#weather_description_current');
                                $.each(temperature_value[0], function(desc_key, desc_value){
                                    weather_description_selector.text(translateWeatherDescription(desc_value));
                                });
                            }
                            if(temperature_key=="weatherIconUrl"){
                                $.each(temperature_value[0], function(icon_key, icon_value){
                                    $('#weather_img_current').attr('src', icon_value);
                                });
                            }
                        });
                    }
                    var day_index, weather_day, numeric_month, weather_month, week_day;
                    if(weather_key=="weather"){
                        $.each(weather_value, function(day_key, day_value){
                            $.each(day_value, function(temperature_key, temperature_value){
                                day_index = day_key +1;
                                if(temperature_key=="date"){
                                    weather_day = temperature_value.slice(8,10);
                                    numeric_month = temperature_value.slice(5,7);
                                    weather_month = changeNumberToMonthAbrev(numeric_month);
                                    week_day = new Date(2013, numeric_month-1, weather_day);
                                    $('#weather_weekday'+day_index).text(numberToWeekDay(week_day.getDay()));
                                    $('#weather_date'+day_index).text(weather_day + " " + weather_month);
                                }
                                if(temperature_key=="tempMaxC"){
                                    $('#weather_max_temperature'+day_index).text(temperature_value + "°");
                                }
                                if(temperature_key=="tempMinC"){
                                    $('#weather_min_temperature'+day_index).text(temperature_value + "°");
                                }
                                if(temperature_key=="weatherDesc"){
                                    $.each(temperature_value[0], function(desc_key, desc_value){
                                        $('#weather_description'+day_index).text(translateWeatherDescription(desc_value));
                                    });
                                }
                                if(temperature_key=="weatherIconUrl"){
                                    $.each(temperature_value[0], function(icon_key, icon_value){
                                        $('#weather_img'+day_index).attr('src', icon_value);
                                    });
                                }
                            });
                        });
                    }
                });
            });
        init_info_carousel();
        },
        error: function(model, response){
            init_info_carousel();
        }
    });

    $('#weather_scroller').scroller();

}

function numberToWeekDay(weekday_number){
    var week_day;

    switch(weekday_number){
        case 0:
            return week_day = "Dom";
        case 1:
            return week_day = "Seg";
        case 2:
            return week_day = "Ter";
        case 3:
            return week_day = "Qua";
        case 4:
            return week_day = "Qui";
        case 5:
            return week_day = "Sex";
        case 6:
            return week_day = "Sab";
    }
    return week_day;
}

function translateWeatherDescription(desc_value){
    if(desc_value == "Sunny" || desc_value == "Clear")
        return "Céu limpo";
    else if(desc_value == "Moderate rain")
        return "Chuva moderada";
    else if(desc_value == "Partly Cloudy")
        return "Nuvens com abertas";
    else if(desc_value == "Patchy rain nearby")
        return "Períodos de chuva";
    else if(desc_value == "Patchy light rain")
        return "Períodos de chuva fraca";
    else if(desc_value == "Heavy rain")
        return "Chuva forte";
    else if(desc_value == "Light rain shower" || desc_value == "Light rain")
        return "Chuva fraca";
    else if(desc_value == "Moderate or heavy rain shower")
        return "Chuva forte ou moderada";
    else if(desc_value == "Torrential rain shower")
        return "Chuva torrencial";
    else if(desc_value == "Mist")
        return "Nevoeiro";
    else if(desc_value == "Light drizzle")
        return "Chuviscos";
    else
        return desc_value;
}
