coupon
  .controller('PaymentCtrl', function ($scope, DataApi, Excel, $timeout, DTOptionsBuilder) {
    // lấy danh sách giao dịch của user
    DataApi.TransactionGetAll().then(function (response) {
      if (response.data.error_code === 0) {
        $scope.listTransition = response.data.payments;

        $scope.dtOptions = DTOptionsBuilder.newOptions()
          .withDisplayLength(10)
          .withOption('aLengthMenu', [
            [10, 20, 50, 100, 200, -1],
            [10, 20, 50, 100, 200, "All"]
          ])
          .withOption('bLengthChange', true)
          .withOption('iDisplayLength', 10)
      }
    })

    $scope.exportToExcel = function (tableId) {
      var exportHref = Excel.tableToExcel(tableId, 'Basic');
      $timeout(function () { location.href = exportHref; }, 100);
    }

    // cập nhật tỉ lệ hoa hồng
    $scope.commission = (data) => {
      //custom toastr
      toastr.options = {
        "closeButton": false,
        "progressBar": true,
        "timeOut": 2300,
        "positionClass": "toast-top-right",
        "onclick": null
      }
      if (data !== undefined && data.com !== null) {
        DataApi.setCommission(data.com).then(response => {
          if (response.data.error_code === 0) {
            toastr.info('Cập nhật thông tin thành công !');
            getCommission();
          } else {
            toastr.info('Cập nhật thông tin có lỗi vui lòng thử lại sau !');
          }
        })
      }
    }

    // lấy tỉ lệ hoa hồng
    getCommission = () => {
      DataApi.getCommission().then(response => {
        if(response.data.error_code === 0){
          $scope.Commission = response.data.com;
        }
      })
    }

    getCommission();

  })