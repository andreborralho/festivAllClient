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

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM FESTIVALS WHERE ID='+festival_id, [], queryInfoSuccess, errorCB);
    }, errorCB);
}

// Success callback for the the query of one festival
function queryInfoSuccess(tx, results) {

    var festival = results.rows.item(0);
    var coordinates = festival.coordinates;

    coordinates = coordinates.split(" ");

    var latitude = coordinates[0];
    var longitude = coordinates[1];

    $('#tickets_page').html(festival.tickets);
    $('#tickets_page').html().replace(/\r\n/g, "<br>");
    $('#transports_page').text(festival.transports);
    //$('#transports_page').value.replace(/\n/g, "<br />");
    alert(latitude + " " + longitude);
    $.getJSON('http://free.worldweatheronline.com/feed/weather.ashx?q='+ latitude +',' + longitude +'&format=json&num_of_days=5&key=553a8863c6144236131203', function(data) {
        $.each(data, function(k,v){
            $.each(v, function(weather_key, weather_value){
                if(weather_key=="current_condition"){
                    $.each(weather_value[0], function(temperature_key, temperature_value){
                        if(temperature_key=="temp_C"){alert(temperature_value);
                            $('#weather_temperature_current').empty();
                            $('#weather_temperature_current').text(temperature_value);
                        }

                        if(temperature_key=="weatherDesc"){
                            $.each(temperature_value[0], function(desc_key, desc_value){
                                $('#weather_description_current').text(desc_value);
                            });
                        }
                        if(temperature_key=="weatherIconUrl"){
                            $.each(temperature_value[0], function(icon_key, icon_value){
                                $('#weather_img_current').html('<img src="' + icon_value +'">');
                            });
                        }
                    });
                }
                var day_index;
                if(weather_key=="weather"){
                    $.each(weather_value, function(day_key, day_value){
                        $.each(day_value, function(temperature_key, temperature_value){
                            day_index = day_key +1;
                            if(temperature_key=="date"){
                                $('#weather_date'+day_index).text(temperature_value);
                            }
                            if(temperature_key=="tempMaxC"){
                                $('#weather_max_temperature'+day_index).text(temperature_value);
                            }
                            if(temperature_key=="tempMinC"){
                                $('#weather_min_temperature'+day_index).text(temperature_value);
                            }
                            if(temperature_key=="weatherDesc"){
                                $.each(temperature_value[0], function(desc_key, desc_value){
                                    $('#weather_description'+day_index).text(desc_value);
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
        initInfo();
    });
}
