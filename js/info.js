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
        fixHeaderLink('#'+festival_status+'_festival');
    });

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM FESTIVALS WHERE ID='+festival_id, [], queryInfoSuccess, errorCB);
    }, errorCB);

    //keep the navbar on first page
    $('#tickets_nav_item').addClass('current').removeClass('hidden not_current prev');
    $('#transports_nav_item').addClass('not_current next').removeClass('hidden current prev');
    $('#weather_nav_item').addClass('hidden').removeClass('current');
}

// Success callback for the the query info of one festival
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

                        // CURRENT WEATHER
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
                                '<div class="column centered" style="width: 23%;">' +
                                    '<strong id="weather_weekday1" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date1" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column no_padding" style="width: 23%;">' +
                                    '<img src="" id="weather_img1" class="weather_icon">' +
                                '</div>' +
                                '<div class="column" style="width: 31%;">' +
                                    '<p id="weather_description1"></p>' +
                                '</div>' +
                                '<div class="column" style="width: 23%;">' +
                                    '<span id="weather_max_temperature1"></span>/' +
                                    '<span id="weather_min_temperature1"></span>' +
                                '</div>' +
                            '</div>' +

                            // TOMORROW
                            '<div id="weather_day2" class="row">' +
                                '<div class="column centered" style="width: 23%;">' +
                                    '<strong id="weather_weekday2" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date2" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column no_padding" style="width: 23%;">' +
                                    '<img src="" id="weather_img2" class="weather_icon">' +
                                '</div>' +
                                '<div class="column" style="width: 31%;">' +
                                    '<p id="weather_description2"></p>' +
                                '</div>' +
                                '<div class="column" style="width: 23%;">' +
                                    '<span id="weather_max_temperature2"></span>/' +
                                    '<span id="weather_min_temperature2"></span>' +
                                '</div>' +
                            '</div>' +

                            // 2 DAYS FROM NOW
                            '<div id="weather_day3" class="row">' +
                                '<div class="column centered" style="width: 23%;">' +
                                    '<strong id="weather_weekday3" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date3" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column no_padding" style="width: 23%;">' +
                                    '<img src="" id="weather_img3" class="weather_icon">' +
                                '</div>' +
                                '<div class="column" style="width: 31%;">' +
                                    '<p id="weather_description3"></p>' +
                                '</div>' +
                                '<div class="column" style="width: 23%;">' +
                                    '<span id="weather_max_temperature3"></span>/' +
                                    '<span id="weather_min_temperature3"></span>' +
                                '</div>' +
                            '</div>' +

                            // DAY 4
                            '<div id="weather_day4" class="row">' +
                                '<div class="column centered" style="width: 23%;">' +
                                    '<strong id="weather_weekday4" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date4" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column no_padding" style="width: 23%;">' +
                                    '<img src="" id="weather_img4" class="weather_icon">' +
                                '</div>' +
                                '<div class="column" style="width: 31%;">' +
                                    '<p id="weather_description4"></p>' +
                                '</div>' +
                                '<div class="column" style="width: 23%;">' +
                                    '<span id="weather_max_temperature4"></span>/' +
                                    '<span id="weather_min_temperature4"></span>' +
                                '</div>' +
                            '</div>' +

                            // DAY 5
                            '<div id="weather_day5" class="row">' +
                                '<div class="column centered fixed">' +
                                    '<strong id="weather_weekday5" class"weather_weekday"></strong><br>' +
                                    '<span id="weather_date5" class"weather_date"></span>' +
                                '</div>' +
                                '<div class="column no_padding">' +
                                    '<img src="" id="weather_img5" class="weather_icon">' +
                                '</div>' +
                                '<div class="column">' +
                                    '<p id="weather_description5"></p>' +
                                '</div>' +
                                '<div class="column fixed">' +
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
                                    icon_changed = changeWeatherIcon(icon_value);
                                    $('#weather_img_current').attr('src', icon_changed);
                                });
                            }
                        });
                    }
                    var day_index, weather_day, numeric_month, weather_month, week_day, icon_changed;
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
                                        description_changed = translateWeatherDescription(desc_value);
                                        $('#weather_description'+day_index).text(description_changed);
                                    });
                                }
                                if(temperature_key=="weatherIconUrl"){
                                    $.each(temperature_value[0], function(icon_key, icon_value){
                                        icon_changed = changeWeatherIcon(icon_value);
                                        $('#weather_img'+day_index).attr('src', icon_changed);
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
            week_day = "Dom";
            break;
        case 1:
            week_day = "Seg";
            break;
        case 2:
            week_day = "Ter";
            break;
        case 3:
            week_day = "Qua";
            break;
        case 4:
            week_day = "Qui";
            break;
        case 5:
            week_day = "Sex";
            break;
        case 6:
            week_day = "Sáb";
            break;
    }
    return week_day;
}

function translateWeatherDescription(desc_value){

    switch (desc_value){
        case "Moderate or heavy snow in area with thunder":
            desc_value = "Nevões fortes e trovoada";
            break;
        case "Patchy light snow in area with thunder":
            desc_value = "Nevões fracos e trovoada";
            break;
        case "Moderate or heavy rain in area with thunder":
            desc_value = "Chuva forte e trovoada";
            break;
        case "Patchy light rain in area with thunder":
            desc_value = "Chuva fraca e trovoada";
            break;
        case "Moderate or heavy showers of ice pellets":
            desc_value = "Chuva forte com granizo";
            break;
        case "Light showers of ice pellets":
            desc_value = "Chuva fraca com granizo";
            break;
        case "Light sleet showers":
            desc_value = "Chuva fraca com granizo";
            break;
        case "Light snow showers":
            desc_value = "Nevões fracos";
            break;
        case "Moderate or heavy sleet showers":
            desc_value = "Chuva com granizo";
            break;
        case "Torrential rain shower":
            desc_value = "Chuva torrencial";
            break;
        case "Moderate or heavy rain shower":
            desc_value = "Chuva forte ou moderada";
            break;
        case "Light rain shower":
            desc_value = "Chuva fraca";
            break;
        case "Ice pellets":
            desc_value = "Granizo";
            break;
        case "Heavy snow":
            desc_value = "Nevões forte";
            break;
        case "Patchy heavy snow":
            desc_value = "Nevões fortes";
            break;
        case "Moderate snow":
            desc_value = "Neve moderada";
            break;
        case "Patchy moderate snow":
            desc_value = "Neve moderada";
            break;
        case "Light snow":
            desc_value = "Queda fraca de neve";
            break;
        case "Patchy light snow":
            desc_value = "Queda fraca de neve";
            break;
        case "Moderate or heavy sleet":
            desc_value = "Chuva de granizo moderada";
            break;
        case "Light sleet":
            desc_value = "Chuva fraca";
            break;
        case "Moderate or Heavy freezing rain":
            desc_value = "Chuva forte ou moderada";
            break;
        case "Light freezing rain":
            desc_value = "Chuva fraca";
            break;
        case "Heavy rain":
            desc_value = "Chuva forte";
            break;
        case "Heavy rain at times":
            desc_value = "Períodos de chuva forte";
            break;
        case "Moderate rain":
            desc_value = "Chuva moderada";
            break;
        case "Moderate rain at times":
            desc_value = "Períodos de chuva moderada";
            break;
        case "Light rain":
            desc_value = "Chuva fraca";
            break;
        case "Patchy light rain":
            desc_value = "Chuva fraca";
            break;
        case "Heavy freezing drizzle":
            desc_value = "Chuviscos fortes";
            break;
        case "Freezing drizzle":
            desc_value = "Chuviscos";
            break;
        case "Light drizzle":
            desc_value = "Chuviscos fracos";
            break;
        case "Patchy light drizzle":
            desc_value = "Chuviscos fracos";
            break;
        case "Freezing fog":
            desc_value = "Nevoeiro";
            break;
        case "Fog":
            desc_value = "Nevoeiro";
            break;
        case "Blizzard":
            desc_value = "Tempestade de neve";
            break;
        case "Blowing snow":
            desc_value = "Neve";
            break;
        case "Thundery outbreaks in nearby":
            desc_value = "Tempestade";
            break;
        case "Patchy freezing drizzle nearby":
            desc_value = "Chuviscos";
            break;
        case "Patchy sleet nearby":
            desc_value = "Granizo";
            break;
        case "Patchy snow nearby":
            desc_value = "Neve";
            break;
        case "Patchy rain nearby":
            desc_value = "Chuva";
            break;
        case "Mist":
            desc_value = "Neblina";
            break;
        case "Overcast":
            desc_value = "Céu nublado";
            break;
        case "Cloudy":
            desc_value = "Céu nublado";
            break;
        case "Partly Cloudy":
            desc_value = "Céu parcialmente nublado";
            break;
        case "Clear":
            desc_value = "Céu limpo";
            break;
        case "Sunny":
            desc_value = "Céu limpo";
            break;
    }
    return desc_value;
}

function changeWeatherIcon(weather_icon_url){
    var weather_icon;
    weather_icon_url = weather_icon_url.split('/');
    var weather_icon_url_splited = weather_icon_url[weather_icon_url.length -1];

    switch(weather_icon_url_splited){
        case "wsymbol_0001_sunny.png":
            weather_icon = "img/weather/sunny.png";
            break;
        case "wsymbol_0002_sunny_intervals.png":
            weather_icon = "img/weather/cloudy1.png";
            break;
        case "wsymbol_0003_white_cloud.png":
            weather_icon = "img/weather/cloudy5.png";
            break;
        case "wsymbol_0004_black_low_cloud.png":
            weather_icon = "img/weather/overcast.png";
            break;
        case "wsymbol_0006_mist.png":
            weather_icon = "img/weather/mist.png";
            break;
        case "wsymbol_0007_fog.png":
            weather_icon = "img/weather/fog.png";
            break;
        case "wsymbol_0008_clear_sky_night.png":
            weather_icon = "img/weather/sunny_night.png";
            break;
        case "wsymbol_0009_light_rain_showers.png":
            weather_icon = "img/weather/light_rain.png";
            break;
        case "wsymbol_0010_heavy_rain_showers.png":
            weather_icon = "img/weather/shower3.png";
            break;
        case "wsymbol_0011_light_snow_showers.png":
            weather_icon = "img/weather/snow2.png";
            break;
        case "wsymbol_0012_heavy_snow_showers.png":
            weather_icon = "img/weather/snow4.png";
            break;
        case "wsymbol_0013_sleet_showers.png":
            weather_icon = "img/weather/sleet.png";
            break;
        case "wsymbol_0016_thundery_showers.png":
            weather_icon = "img/weather/tstorm1.png";
            break;
        case "wsymbol_0017_cloudy_with_light_rain.png":
            weather_icon = "img/weather/light_rain.png";
            break;
        case "wsymbol_0018_cloudy_with_heavy_rain.png":
            weather_icon = "img/weather/shower3.png";
            break;
        case "wsymbol_0019_cloudy_with_light_snow.png":
            weather_icon = "img/weather/snow1.png";
            break;
        case "wsymbol_0020_cloudy_with_heavy_snow.png":
            weather_icon = "img/weather/snow4.png";
            break;
        case "wsymbol_0021_cloudy_with_sleet.png":
            weather_icon = "img/weather/sleet.png";
            break;
        case "wsymbol_0024_thunderstorms.png":
            weather_icon = "img/weather/tstorm3.png";
            break;
        case "wsymbol_0025_light_rain_showers_night.png":
            weather_icon = "img/weather/shower1_night.png";
            break;
        case "wsymbol_0026_heavy_rain_showers_night.png":
            weather_icon = "img/weather/shower2_night.png";
            break;
        case "wsymbol_0027_light_snow_showers_night.png":
            weather_icon = "img/weather/snow1_night.png";
            break;
        case "wsymbol_0028_heavy_snow_showers_night.png":
            weather_icon = "img/weather/snow3_night.png";
            break;
        case "wsymbol_0029_sleet_showers_night.png":
            weather_icon = "img/weather/sleet.png";
            break;
        case "wsymbol_0032_thundery_showers_night.png":
            weather_icon = "img/weather/tstorm1_night.png";
            break;
        case "wsymbol_0033_cloudy_with_light_rain_night.png":
            weather_icon = "img/weather/shower1_night.png";
            break;
        case "wsymbol_0034_cloudy_with_heavy_rain_night.png":
            weather_icon = "img/weather/shower2_night.png";
            break;
        case "wsymbol_0035_cloudy_with_light_snow_night.png":
            weather_icon = "img/weather/snow1_night.png";
            break;
        case "wsymbol_0036_cloudy_with_heavy_snow_night.png":
            weather_icon = "img/weather/snow3_night.png";
            break;
        case "wsymbol_0037_cloudy_with_sleet_night.png":
            weather_icon = "img/weather/sleet.png";
            break;
        case "wsymbol_0040_thunderstorms_night.png":
            weather_icon = "img/weather/tstorm2_night.png";
            break;
    }
    return weather_icon;
}
