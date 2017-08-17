 $('.findTable').click(function(){
    $seats = $('#seats').val();
    $dateTemp = $('#date').val();
    $timeTemp = $('#time').val();
    if(parseInt($timeTemp.substr(0,2)) > 12 ) {
        $time = parseInt($timeTemp.substr(0,2) - 12) + $timeTemp.substr(2,4);
    }else{
        $time = $timeTemp;
    }
    $date = $dateTemp.substring(5,7) + '/' + $dateTemp.substring(8,10) + '/' + $dateTemp.substring(0,4);
    $fwidth = $(window).width()*7/10;
    $fheight = $(window).width()*8/10;

    $url = "https://opentable.com/restaurant-search.aspx?StartDate=" + $date + "&ResTime=" + $time +
    "PM&txtDateFormat=MM/dd/yyyy&RestaurantID=238150&rid=238150&GeoID=7&RestaurantReferralID=238150&PartySize=" + $seats + "&hover=true&wt=true&KeepThis=true&";

    $('.bookResult').html(('<iframe frameborder="0" sandbox="allow-top-navigation allow-forms allow-scripts allow-same-origin" height="' + $fheight +'" width="' + $fwidth + '" src="' + $url + '"></iframe>'));
    $('.bookResult, .shader, .shader .back').css('display', 'block');
    $('.bookResult').css('z-index', '99999');
    $('.shader, .shader .back').css('z-index', '99998');

});
$('.shader .back').click(function(){
    $('.bookResult, .shader, .shader .back').css('display', 'none');
    $('.bookResult, .shader, .shader .back').css('z-index', '-1');
});