function getAds(){
    db.transaction(function(tx){
        console.log("Getting Ads");
        tx.executeSql('SELECT * FROM ADS ', [], function(tx, results){
            var abs_ads = results.rows
            var percentage_sum = 0;
            //calculate percentage sum
            for(var i = 0; i <abs_ads.length; i++ ){
                percentage_sum += abs_ads.item(i).percentage;
            }
            //calculta relative percentages
            for(var i = 0; i <abs_ads.length; i++ ){
                var ad = abs_ads.item(i);
                var rel_percentage = ad.percentage / percentage_sum;
                ads[i] = {'sponsor': ad.sponsor, 'rel_percentage':ad.rel_percentage, 'banner':ad.banner, 'splash':ad.splash }
            }

        }, errorQueryCB );
    }, errorCB);

}

function showBannerAdd(){
    var random = new Math.random();
    for(var i = 0; i < ads.length; i++){
        if( i == 0){
            if( random >= 0 && random < ads[i].rel_percentage )
                //$('#banner').img(ads[i].banner);
                ;
        }
        else {
            if( random >=ads[i-1].rel_percentage && random < ads[i].rel_percentage )
            //$('#banner').img(ads[i].banner);
                ;
        }
    }
}