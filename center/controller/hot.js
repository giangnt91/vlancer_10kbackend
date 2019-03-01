coupon
  .controller('HotCtrl', function ($scope, DataApi, DTOptionsBuilder, Excel, $timeout) {
    //custom toastr
    toastr.options = {
      "closeButton": false,
      "progressBar": true,
      "timeOut": 2300,
      "positionClass": "toast-top-right",
      "onclick": null
    }

    formatDayIso = (dayFormat) => {
      let parts = dayFormat.split("/");
      iday = parseInt(parts[0]) + 1;
      return parts[1] + '-' + iday + '-' + parts[2];
    }

    $scope.exportToExcel = function (tableId) {
      var exportHref = Excel.tableToExcel(tableId, 'Basic');
      $timeout(function () { location.href = exportHref; }, 100);
    }

    // lấy danh sách khuyến mãi hot
    hotDealGetAll = () => {
      DataApi.getHotDeal().then(response => {
        if (response.data.error_code === 0) {
          $scope.listHotDeal = response.data.hots;

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
    }
    hotDealGetAll();

    // tạo mã khuyến mãi hot
    $scope.createHotDeal = (data) => {
      if (
        data !== undefined && data !== "" &&
        data.urlImage !== undefined && data.info !== '' &&
        data.urlCommission !== undefined && data.urlCommission !== ''
      ) {
        let today = $('#enday').val();
        let todayIso = formatDayIso(today);

        let hotDeal = {
          urlImage: data.urlImage,
          Info: data.info.replace(/\. /g, ".\r"),
          expiredDay: today,
          expiredDayIso: todayIso,
          urlCommission: data.urlCommission
        }

        DataApi.createHotDeal(hotDeal).then(response => {
          if (response.data.error_code === 0) {
            toastr.info('Tạo mã khuyến mãi thành công.');

            $('#enday').val('');
            data.urlImage = '';
            data.urlCommission = '';
            data.info = '';

            hotDealGetAll();
          } else {
            toastr.info('Có lỗi trong quá trình xử lý vui lòng thử lại.');
          }
        })
      } else {
        toastr.info('Thông tin chưa được nhập đầy đủ.');
      }

    }

    // mở modal update
    $scope.openEdit = (data) => {
      $scope.detailHotDeal = data;
      $('#enday2').val(data.expiredDay);
    }

    // cập nhật mã khuyến mãi
    $scope.updateHotDeal = () => {
      let today = $('#enday2').val();
      let todayIso = formatDayIso(today);

      $scope.detailHotDeal.expiredDay = today;
      $scope.detailHotDeal.expiredDayIso = todayIso;
      $scope.detailHotDeal = angular.fromJson(angular.toJson($scope.detailHotDeal));
      DataApi.updateHotDeal($scope.detailHotDeal).then(response => {
        if(response.data.error_code === 0){
          toastr.info('Cập nhật mã khuyến mãi thành công.');
        }else{
          toastr.info('Có lỗi trong quá trình xử lý vui lòng thử lại.');
        }
      })
    }

  })