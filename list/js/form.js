var appl_path = "/";

window.onload = function(){

    $("input[name='delete']").data('id', $("input[name='id']").value).on('click', delete_simulation);
};

var delete_simulation = function() {
    console.log("ajax_path:", appl_path + "SimList/delete_simulation");
    //console.log('id: ', $(this).siblings("input[type='hidden']").attr('value'));

    $.ajax( appl_path + "SimList/delete_simulation", {
        type: "POST",
        data: {
            id: $(this).siblings("input[type='hidden']").attr('value')
        },
        statusCode: {
            404: function() {
                console.error("[404]");
            },
            200: function() {
                console.error("[200]");
            },
            0: function () {
                console.error("[000]");
            }
        }
    });
};

