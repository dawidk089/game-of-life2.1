window.onload = function () {
    register.valid_identical('#registration', 'email', 'email_repeat', 'Podane adresy email nie są identyczne.');
    register.valid_identical('#registration', 'password', 'password_repeat', 'Podane hasła nie są identyczne.');
};



register = {
    valid_state: false,


    valid_identical: function(scope, original, compared, message){

        var fun = function(){
            var first = $(scope+' [name="'+original+'"]').val();
            var second = $(scope+' [name="'+compared+'"]').val();
            if(first !== second) {
                $('#status').text(message);
                $(scope+' [type="submit"]').prop('disabled', true);
            }
            else {
                $('#status').text('');
                $(scope+' [type="submit"]').prop('disabled', false);
            }
        };

        $(scope+' [name='+original+'], '+scope+' [name='+compared+']').on('focus', function(){
            $(this).on('keyup', fun);
        }).on('focusout', function(){
            $(this).off('keyup', fun)
        });

    }



};



login = {





};

//$(document).ready(function() {
//
//    $('* [name="email2"]').on("change", function() {
//        checkEquality.call(this, $('* [name="email"]'), 'Adresy e-mail muszą być takie same');
//    }).change();
//
//    $('* [name="password2"]').on("change", function() {
//        checkEquality.call(this, $('* [name="password"]'), 'Hasła muszą być takie same');
//    }).change();
//
//});
//
///**
// * Funkcja sprawdza, czy tekst obiektu na rzecz którego została ta funkcja wywołana (this) jest równy tekstowi obiektu określonego w parametrze. Użyto Constraint Validation z HTML5
// * @param source - źródło, z którym należy porównać tekst obiektu wywołującego (this)
// * @param message - wiadomość gdy nastąpi błąd
// */
//function checkEquality(source, message) {
//    if ($(this).val() !== $(source).val())
//        $(this)[0].setCustomValidity(message);
//    else
//        $(this)[0].setCustomValidity('');
//}