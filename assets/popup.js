//----- OPEN by function
function DataPopupOpen(targeted_popup_class) {
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

    //----- CLOSE
    $('[data-popup-close]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

        e.preventDefault();
    })
}