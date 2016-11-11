$(document).ready(function() {
    /* ======= Fixed header when scrolled ======= */    
    $(window).on('scroll load', function() {
         
         if ($(window).scrollTop() > 0) {
             $('#header').addClass('scrolled');
         }
         else {
             $('#header').removeClass('scrolled');         
         }
    });

    $('#searchKeyword').on('input propertychange', function(e) {
    	var input = $(this)[0];

    	if($(input).val()) {
    		$('#goBtn').attr('disabled', false);
    	} else {
    		$('#goBtn').attr('disabled', true);
    	}
    });
});

// function customOpStock(li) {
    
// }
