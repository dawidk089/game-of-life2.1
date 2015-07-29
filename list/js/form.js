/**
 * funkcja wysylajaca do serwera polecenie usuniecia symulacji z baz danych (nie dziala narazie)
 */
var delete_simulation = function() {
    console.log("ajax_path:", appl_path + "SimList/delete_simulation");

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

