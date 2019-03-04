coupon
  .controller('GiftCtrl', function ($scope, DataApi, $location, $window, $timeout, DTOptionsBuilder, Excel) {

    //custom toastr
    toastr.options = {
      "closeButton": false,
      "progressBar": true,
      "timeOut": 2300,
      "positionClass": "toast-top-right",
      "onclick": null
    }

    $scope.exportToExcel = function (tableId) {
      var exportHref = Excel.tableToExcel(tableId, 'Basic');
      $timeout(function () { location.href = exportHref; }, 100);
    }

    formatDayIso = (dayFormat) => {
      let parts = dayFormat.split("/");
      iday = parseInt(parts[0]) + 1;
      return parts[1] + '-' + iday + '-' + parts[2];
    }

    // lấy danh sách quà tặng
    giftGetAll = () => {
      DataApi.getGifts().then(response => {
        if (response.data.error_code === 0) {
          $scope.gifts = response.data.gifts;

          $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(10)
            .withOption('aLengthMenu', [
              [10, 20, 50, 100, 200, -1],
              [10, 20, 50, 100, 200, "All"]
            ])
            .withOption('bLengthChange', true)
            .withOption('iDisplayLength', 10)
        }
      });
    }
    giftGetAll();

    // lấy danh sách cửa hàng
    DataApi.getAllshop().then(function (response) {
      if (response.data.error_code === 0) {
        $scope.shops = response.data.shop;
        $scope.selectedShop = $scope.shops[0];
      }
    });

    // tới trang tạo quà tặng
    $scope.goAddGift = () => {
      $location.path('/quan-ly/tao-qua-tang');
      $window.scrollTo(0, 0);
    }

    // tới trang cập nhật quà tặng
    $scope.goUpGift = (id) => {
      $location.url('/quan-ly/qua-tang?id=' + id);
      $window.scrollTo(0, 0);
    }

    // tạo quà tặng
    $scope.giftAddNew = (data) => {
      let expiredDay = $('#expireDay').val();
      let expireDayIso = formatDayIso(expiredDay);

      if (data !== undefined && data !== null && data.name !== undefined && data.name !== '' &&
        data.price !== undefined && data.price !== '' &&
        data.quantity !== undefined && data.quantity !== '' &&
        data.point !== undefined && data.point !== '' &&
        data.address !== undefined && data.address !== '' &&
        data.info !== undefined && data.info !== '' &&
        $scope.giftImage !== undefined && $scope.giftImage.length > 0
      ) {

        let giftImages = [];
        $scope.giftImage.forEach(element => {
          giftImages.push(element.text)
        });

        let shop = {
          id: $scope.selectedShop._id,
          name: $scope.selectedShop.shop_info[0].shop_name
        }

        let giftNew = {
          giftShop: shop,
          giftName: data.name,
          giftPrice: data.price,
          giftPoint: data.point,
          giftInfo: data.info.replace(/\. /g, ".\r"),
          giftExpiredDay: expiredDay,
          giftExpiredDayIso: expireDayIso,
          giftAddress: data.address,
          giftTotal: data.quantity,
          giftImages: giftImages
        }

        DataApi.addGift(giftNew).then(response => {
          if (response.data.error_code === 0) {
            toastr.info('Tạo quà tặng mới thành công.');

            // reset page
            $scope.selectedShop = $scope.shops[0];
            data.name = '';
            data.price = '';
            data.point = '';
            data.info = '';
            $('#expireDay').val('');
            data.address = '';
            data.quantity = '';
            $scope.giftImage = '';
            giftGetAll();
          }
        })

      } else {
        toastr.info('Có lỗi trong quá trình xử lý vui lòng thử lại.');
      }
    }

    // lấy thông quà tặng
    $scope.openDisable = (data) => {
      $scope.giftDetail = data;
    }

    // hủy quà tặng
    $scope.giftDisable = () => {
      $scope.giftDetail.giftDisable = true;
      DataApi.editGift($scope.giftDetail).then(response => {
        if (response.data.error_code === 0) {
          toastr.info('Cập nhật quà tặng thành công.');
        } else {
          toastr.info('Có lỗi trong quá trình xử lý vui lòng thử lại.');
        }
      })
    }

  })

  .controller('UpGiftCtrl', function ($scope, $routeParams, DataApi) {
    const _id = $routeParams.id;

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

    getInfo = async () => {
      // lấy danh sách cửa hàng
      await DataApi.getAllshop().then(function (response) {
        if (response.data.error_code === 0) {
          $scope.shops = response.data.shop;
        }
      });

      // lấy chi tiết quà tặng
      await DataApi.getGift(_id).then(response => {
        if (response.data.error_code === 0) {
          $scope.giftDetail = response.data.gift;
          $scope.giftImage = $scope.giftDetail.giftImages;
          $scope.shops.forEach((element, index) => {
            if (element._id === $scope.giftDetail.giftShop[0].id) {
              $scope.selectedShop = $scope.shops[index];
            }
          })
          $('#expireDay').val($scope.giftDetail.giftExpiredDay);
        }
      })
    }

    getInfo();

    // cập nhật gift
    $scope.giftUpdate = () => {
      let expiredDay = $('#expireDay').val();
      let expireDayIso = formatDayIso(expiredDay);

      let giftImages = [];
      $scope.giftImage.forEach(element => {
        giftImages.push(element.text)
      });

      let shop = {
        id: $scope.selectedShop._id,
        name: $scope.selectedShop.shop_info[0].shop_name
      }

      $scope.giftDetail.giftExpiredDay = expiredDay;
      $scope.giftDetail.giftExpiredDayIso = expireDayIso;
      $scope.giftDetail.giftImages = giftImages;
      $scope.giftDetail.giftShop = shop;

      DataApi.editGift($scope.giftDetail).then(response => {
        if (response.data.error_code === 0) {
          toastr.info('Cập nhật quà tặng thành công.');
        } else {
          toastr.info('Có lỗi trong quá trình xử lý vui lòng thử lại.');
        }
      })
    }
  })