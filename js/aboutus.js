function createAboutUsContainer(){
    $('#header_link').unbind().bind('click', function(){
        menuButton();
        fixHeaderLink("#menu");
    });

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ABOUT_US', [], queryAboutUsSuccess, errorCB);
    }, errorCB);

}

// Success callback for the the query about_us
function queryAboutUsSuccess(tx, results) {

    var about_us = results.rows;
    var len = about_us.length;

    $('#about_us_page_list').empty();

    for(var i = 0; i <len; i++){
        var about_u = about_us.item(i);
        var about_u_title = about_u.title;
        var about_u_text = about_u.text;

        $('#about_us_page_list').append('<li class="about_us_title">' + about_u_title + '</li><li>' + about_u_text + '</li>');
    }

    $('#about_us_page_list').scroller();
}