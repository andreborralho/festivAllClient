function createAds(){
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM ADS', [], function(tx, results){
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

            }
            showBannerAd();

        }, errorQueryCB );
    }, errorCB);

}

function showBannerAd(){
    var random = Math.random();

    for(var i = 0; i < ads.length; i++){alert(random+" "+ads[i].rel_percentage);
        if(i == 0 && random <= ads[i].rel_percentage ){
            $('#ad_banner_img').attr('src', ads[0].banner);
            return;
        }
        else if( random > ads[i-1].rel_percentage && random < ads[i].rel_percentage)
            $('#ad_banner_img').attr('src', ads[i].banner);
    }
}