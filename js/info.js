// INFO_CONTAINER

function init_info_carousel(){
    // Inits carousel for info_container
    $('#info_carousel').carousel({
        preventDefaults:false,
        pagingFunction:function(index){
            if(index == 0){
                $('#tickets_nav_item').removeClass('not_current prev');
                $('#transports_nav_item').addClass('not_current next');
                $('#weather_nav_item').addClass('hidden');
            }
            else if(index == 1){
                $('#transports_nav_item').removeClass('not_current next prev');
                $('#tickets_nav_item').addClass('not_current prev').removeClass('hidden');
                $('#weather_nav_item').addClass('not_current next').removeClass('hidden');
            }
            else if(index == 2){
                $('#weather_nav_item').removeClass('not_current next');
                $('#transports_nav_item').addClass('not_current prev');
                $('#tickets_nav_item').addClass('hidden');
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

}

// Success callback for the the query of one festival
function queryInfoSuccess(tx, results) {
    $('#info_carousel').remove();
    $('#info').append('' +
        '<div id="info_carousel" class="carousel" data-role="carousel">' +

            '<div id="tickets_page" class="page" data-role="page">' +
                '<div id="tickets_wrapper" class="scroll_wrapper">' +
                    '<div id="tickets_scroller"></div>' +
                '</div>' +
            '</div>' +

            '<div id="transports_page" class="page" data-role="page">' +
                '<div id=transports_wrapper class="scroll_wrapper">' +
                    '<div id="transports_scroller"></div>' +
                '</div>' +
            '</div>' +

            '<div id="weather_page" class="page" data-role="page">' +
                '<div id="weather_wrapper" class="scroll_wrapper">' +
                    '<div id="weather_scroller">' +
                        '<div id="weather_current" class="weather_entry">' +
                            '<div id="weather_text_current" class="weather_text">' +
                                '<div id="weather_temperature_current" class="weather_temperature"></div>' +
                                '<div id="weather_description_current" class="weather_description"></div>' +
                            '</div>' +
                            '<div id="weather_img_current" class="weather_img"></div>' +
                        '</div>' +
                        '<div id="weather_day1" class="weather_entry">' +
                            '<div id="weather_date1" class="weather_date"></div>' +
                            '<div class="weather_temperature">' +
                                '<span id="weather_max_temperature1"></span>' +
                                '<span id="weather_min_temperature1"></span>' +
                            '</div>' +
                            '<div id="weather_description1" class="weather_description"></div>' +
                            '<div id="weather_img1" class="weather_img"></div>' +
                        '</div>' +
                        '<div id="weather_day2" class="weather_entry">' +
                            '<div id="weather_text2" class="weather_text">' +
                                '<div id="weather_date2" class="weather_date"></div>' +
                                '<div id="weather_max_temperature2" class="weather_temperature"></div>' +
                                '<div id="weather_min_temperature2" class="weather_temperature"></div>' +
                                '<div id="weather_description2" class="weather_description"></div>' +
                            '</div>' +
                            '<div id="weather_img2" class="weather_img"></div>' +
                        '</div>' +
                        '<div id="weather_day3" class="weather_entry">' +
                            '<div id="weather_text3" class="weather_text">' +
                                '<div id="weather_date3" class="weather_date"></div>' +
                                '<div id="weather_max_temperature3" class="weather_temperature"></div>' +
                                '<div id="weather_min_temperature3" class="weather_temperature"></div>' +
                                '<div id="weather_description3" class="weather_description"></div>' +
                            '</div>' +
                            '<div id="weather_img3" class="weather_img"></div>' +
                        '</div>' +
                        '<div id="weather_day4" class="weather_entry">' +
                            '<div id="weather_text4" class="weather_text">' +
                                '<div id="weather_date4" class="weather_date"></div>' +
                                '<div id="weather_max_temperature4" class="weather_temperature"></div>' +
                                '<div id="weather_min_temperature4" class="weather_temperature"></div>' +
                                '<div id="weather_description4" class="weather_description"></div>' +
                            '</div>' +
                            '<div id="weather_img4" class="weather_img"></div>' +
                        '</div>' +
                        '<div id="weather_day5" class="weather_entry">' +
                            '<div id="weather_text5" class="weather_text">' +
                                '<div id="weather_date5" class="weather_date"></div>' +
                                '<div id="weather_max_temperature5" class="weather_temperature"></div>' +
                                '<div id="weather_min_temperature5" class="weather_temperature"></div>' +
                                '<div id="weather_description5" class="weather_description"></div>' +
                            '</div>' +
                            '<div id="weather_img5" class="weather_img"></div>' +
                        '</div>' +
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
                                    $('#weather_img_current').html('<img src="' + icon_value +'">');
                                });
                            }
                        });
                    }
                    var day_index, weather_day, numeric_month, weather_month;
                    if(weather_key=="weather"){
                        $.each(weather_value, function(day_key, day_value){
                            $.each(day_value, function(temperature_key, temperature_value){
                                day_index = day_key +1;
                                if(temperature_key=="date"){
                                    weather_day = temperature_value.slice(8,10);
                                    numeric_month = temperature_value.slice(5,7);
                                    weather_month = changeNumberToMonth(numeric_month);
                                    $('#weather_date'+day_index).text(weather_day + " de " + weather_month);
                                }
                                if(temperature_key=="tempMaxC"){
                                    $('#weather_max_temperature'+day_index).text(temperature_value + "ºC");
                                }
                                if(temperature_key=="tempMinC"){
                                    $('#weather_min_temperature'+day_index).text(temperature_value + "ºC");
                                }
                                if(temperature_key=="weatherDesc"){
                                    var weather_description_selector = $('#weather_description'+day_index);
                                    $.each(temperature_value[0], function(desc_key, desc_value){
                                        weather_description_selector.text(translateWeatherDescription(desc_value));
                                    });
                                }
                                if(temperature_key=="weatherIconUrl"){
                                    $.each(temperature_value[0], function(icon_key, icon_value){
                                        $('#weather_img'+day_index).html('<img src="' + icon_value +'">');
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
    else
        return desc_value;
}
