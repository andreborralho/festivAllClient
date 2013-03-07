currentIndex = 0;
pages = [$('#festivals_page'), $('#search_page')];

function scrollRight() {

    if (currentIndex === 0) return;
    pages[currentIndex].removeClass('stage_center');
    pages[currentIndex].addClass('stage_right');

    pages[currentIndex - 1].removeClass('stage_left');
    pages[currentIndex - 1].addClass('stage_center');

    currentIndex = currentIndex - 1;

}

function scrollLeft() {

    if (currentIndex === pages.length - 1) return;

    pages[currentIndex].removeClass('stage_center');
    pages[currentIndex].addClass('stage_left');

    pages[currentIndex + 1].removeClass('stage_right');
    pages[currentIndex + 1].addClass('stage_center');

    currentIndex = currentIndex + 1;

}


$('#festivals_container').swipeLeft(scrollLeft);
$('#festivals_container').swipeRight(scrollRight);

iscroll = new iScroll('festivals_frame', {hScrollbar: false, vScrollbar: false });


