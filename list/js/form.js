var appl_path = "/";

window.onload = function(){
    var fun = function(){
        var id = $(this).data("id");
        console.log("clicked at delete nr "+id);
    };
    $("input[name='delete']").data('id', $("input[name='id']").value).on('click', delete_simulation).on('click', fun);
    //$("aside input[name='delete']").on('click', fun);
    //var cl = $("input[name='delete']");
    //console.log("jquery: ", cl);
    console.log('test: ' + $(this.parent).value);
};

var delete_simulation = function() {
    console.log("ajax_path:", appl_path + "SimList/delete_simulation");
    console.log('id: ', $(this.parent).value);

    $.ajax( appl_path + "SimList/delete_simulation", {
        type: "POST",
        data: {
            id: 'id1'
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

