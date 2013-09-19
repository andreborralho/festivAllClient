function createAds(){
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM ADS', [], function(tx, results){
            console.log('HOW MANY ADDS ? ' +  results.rows.length);

            var abs_ads = results.rows;
            var percentage_sum = 0;

            //calculate percentage sum
            for(var i = 0; i < abs_ads.length; i++ )
                percentage_sum += abs_ads.item(i).percentage;

            var ad = 0; var rel_percentage = 0;

            //calculate relative percentages
            for(var j = 0; j <abs_ads.length; j++ ){
                ad = abs_ads.item(j);
                //Exemplo: 0.666% = 40%(ad.percentage) / 60%(percentage_sum)
                rel_percentage = ad.percentage / percentage_sum;
                ads[j] = {'name': ad.name, 'rel_percentage':rel_percentage, 'banner':ad.banner, 'splash':ad.splash };
                console.log('ads[' + j + '] name: ' + ad.name);
            }

            showBannerAd();

        }, errorQueryCB );
    }, errorCB);

}

function showBannerAd(){
    var random = Math.random();


    if(random <= ads[0].rel_percentage ){
        $('#ad_banner_img').attr('src', ads[0].banner);
        return;
    }

    if(random > ads[ads.length-2].rel_percentage ){
        $('#ad_banner_img').attr('src', ads[ads.length-1].banner);
        return;
    }

    var percentage_sum = ads[0].rel_percentage;

    for(var i = 1; i < ads.length-1; i++){

        if(random >= percentage_sum && random < ads[i].rel_percentage){
            $('#ad_banner_img').attr('src', ads[i].banner);
            return;
        }

        //calculate percentage sum
        percentage_sum += ads[i].rel_percentage;
    }
}