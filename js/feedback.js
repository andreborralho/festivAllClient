function createFeedbackContainer(){
    current_page = "feedback";

    $('#header_link').unbind().bind('click', function(){
        backButton();
    });

    $("#feedbackForm").submit(function(event) {
        submitFeedback();
    });
}

function submitFeedback(){
    /* stop form from submitting normally */
    event.preventDefault();

    /* get some values from elements on the page: */
    var name = $('#inputFeedbackAuthor').val();
    var text = $('#inputFeedbackText').val();
    var email = $('#inputFeedbackAuthorEmail').val();


    if(name == "")
        alert("Please insert a name");
    else if(text == "")
        alert("Please insert a comment");

    else{
        $.post("http://festivall.eu/feedbacks", {name: name, text: text, email: email}, function(){

            $('#inputFeedbackText').val('');
            window.FestivallToaster.showMessage("Obrigado pela tua contribuição ;)");
        }, 'text/html');
    }
}