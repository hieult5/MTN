$('#formExport').on("submit", function (event) {
    event.preventDefault();
    var isDuBaos = document.getElementsByName("isDuBao");
    var isDuBao = null;
    for (var i = 0; i < isDuBaos.length; i++) {
        if (isDuBaos[i].checked === true) {
            isDuBao = isDuBaos[i].value;
        }
    }
    $.ajax({
        type: "POST",
        url: "/Excell/ExportData",
        data: JSON.stringify({
            fromDate: $('#fromDate').val(),
            toDate: $('#toDate').val(),
            isDuBao: isDuBao
        }),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            //startLoader();
        },
        success: function (response) {
            if (response.status) {
                window.location.href = "/Export/Download/?file=" + response.fileName;
            }
            else {
                alert("không có dữ liệu");
            }
        },
        error: function (response) {
            alert("lỗi");
            $scope.loadding = false;
        },
        complete: function () {
            //stopLoader();
        },
        always: function () {
            $scope.loadding = false;
        }
    });
});