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