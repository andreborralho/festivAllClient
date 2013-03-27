// INFO_CONTAINER

// Queries the local Database for a show
function createInfoContainer(festival_id){
    $('.page_title').text("Info");

    $('.column').bind('click', function(){
        $('.column').unbind();
        changeContainers("#festival");
        createFestivalContainer(festival_id);
    });

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM FESTIVALS WHERE ID='+festival_id, [], queryInfoSuccess, errorCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryInfoSuccess(tx, results) {
    incrementHistory("#festival");

    $('#info_carousel').remove();
    $('#info').append('' +
        '<div id="info_carousel" data-role="carousel">' +
            '<div id="tickets_page" data-role="page"></div>' +

            '<div id="transports_page" data-role="page"></div>' +

            '<div id="weather_page" data-role="page">' +
                '<div id="weather_current" class="row">' +
                    '<div id="weather_img_current" class="weather_img"></div>' +
                    '<div id="weather_temperature_current" class="weather_temperature"></div>' +
                    '<div id="weather_description_current" class="weather_description"></div>' +
                '</div>' +
                '<li id="weather_day1" class="row">' +
                    '<div id="weather_date1" class="column fixed bdr_r"></div>' +
                    '<div class="column fixed">' +
                        '<span id="weather_max_temperature1"></span><br>' +
                        '<span id="weather_min_temperature1"></span>' +
                    '</div>' +
                    '<div id="weather_description1" class="column"></div>' +
                    '<div id="weather_img1" class="column fixed"></div>' +
                '</li>' +
                '<li id="weather_day2" class="row">' +
                    '<div id="weather_date2" class="column fixed bdr_r"></div>' +
                    '<div class="column fixed">' +
                        '<span id="weather_max_temperature2"></span><br>' +
                        '<span id="weather_min_temperature2"></span>' +
                    '</div>' +
                    '<div id="weather_description2" class="column"></div>' +
                    '<div id="weather_img2" class="column fixed"></div>' +
                '</li>' +
                '<li id="weather_day3" class="row">' +
                    '<div id="weather_date3" class="column fixed bdr_r"></div>' +
                    '<div class="column fixed">' +
                        '<span id="weather_max_temperature3"></span><br>' +
                        '<span id="weather_min_temperature3"></span>' +
                    '</div>' +
                    '<div id="weather_description3" class="column"></div>' +
                    '<div id="weather_img3" class="column fixed"></div>' +
                '</li>' +
                '<li id="weather_day4" class="row">' +
                    '<div id="weather_date4" class="column fixed bdr_r"></div>' +
                    '<div class="column fixed">' +
                        '<span id="weather_max_temperature4"></span><br>' +
                        '<span id="weather_min_temperature4"></span>' +
                    '</div>' +
                    '<div id="weather_description4" class="column"></div>' +
                    '<div id="weather_img4" class="column fixed"></div>' +
                '</li>' +
                '<li id="weather_day5" class="row">' +
                    '<div id="weather_date5" class="column fixed bdr_r"></div>' +
                    '<div class="column fixed">' +
                        '<span id="weather_max_temperature5"></span><br>' +
                        '<span id="weather_min_temperature5"></span>' +
                    '</div>' +
                    '<div id="weather_description5" class="column"></div>' +
                    '<div id="weather_img5" class="column fixed"></div>' +
                '</li>' +
            '</div>' +
        '</div>');


    var festival = results.rows.item(0);
    var coordinates = festival.coordinates;
    coordinates = coordinates.split(" ");

    var latitude = coordinates[0];
    var longitude = coordinates[1];

    var tickets_html_tags = festival.tickets.replace(/\r\n/g, "<br>");
    $('#tickets_page').html(tickets_html_tags);

    var transports_html_tags = festival.transports.replace(/\r\n/g, "<br>");
    $('#transports_page').html(transports_html_tags);

    $.getJSON('http://free.worldweatheronline.com/feed/weather.ashx?q='+ latitude +',' + longitude +
        '&format=json&num_of_days=5&key=553a8863c6144236131203', function(data) {
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

                                if(desc_value == "Sunny" || desc_value == "Clear")
                                    weather_description_selector.text("Céu limpo");
                                else if(desc_value == "Moderate rain")
                                    weather_description_selector.text("Chuva moderada");
                                else if(desc_value == "Partly Cloudy")
                                    weather_description_selector.text("Nuvens com abertas");
                                else if(desc_value == "Patchy rain nearby")
                                    weather_description_selector.text("Períodos de chuva");
                                else if(desc_value == "Patchy light rain")
                                    weather_description_selector.text("Períodos de chuva fraca");
                                else if(desc_value == "Light rain shower")
                                    weather_description_selector.text("Chuva fraca");
                                else if(desc_value == "Moderate or heavy rain shower")
                                    weather_description_selector.text("Chuva forte ou moderada");
                                else if(desc_value == "Mist")
                                    weather_description_selector.text("Nevoeiro");
                                else
                                    weather_description_selector.text(desc_value);



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

                                    if(desc_value == "Sunny" || desc_value == "Clear")
                                        weather_description_selector.text("Céu limpo");
                                    else if(desc_value == "Partly Cloudy")
                                        weather_description_selector.text("Nuvens com abertas");
                                    else if(desc_value == "Patchy rain nearby")
                                        weather_description_selector.text("Céu limpo com nuvens e aguaceiros");
                                    else if(desc_value == "Patchy light rain")
                                        weather_description_selector.text("Períodos de chuva");
                                    else if(desc_value == "Heavy rain")
                                        weather_description_selector.text("Chuva forte");
                                    else if(desc_value == "Light rain shower")
                                        weather_description_selector.text("Chuva fraca");
                                    else if(desc_value == "Moderate or heavy rain shower")
                                        weather_description_selector.text("Chuva forte ou moderada");
                                    else if(desc_value == "Mist")
                                        weather_description_selector.text("Nevoeiro");
                                    else
                                        weather_description_selector.text(desc_value);
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
    });
}
