function createAboutusContainer(){
    $('#header_link').unbind().bind('click', function(){
        menuButton();
    });

    $('#aboutus').text('festivAll - aplicação para festivais de verão');
}
