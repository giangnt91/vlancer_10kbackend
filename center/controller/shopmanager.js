coupon
    .controller('ManagerCtrl', function ($scope, $location, $timeout, DataApi) {
        $scope.auth = JSON.parse(localStorage.getItem('auth'));

        if (!$scope.auth) {
            // window.location.href = '#/';
            // $window.location.reload(true);
        } else {
            if ($scope.auth[0].role[0].id === 1) {
                // window.location.href = '#/home';
                $location.path('/quan-ly/trang-chu');
            }
        }

        $scope._reload = function () {
            // window.location.href = '#/manager';
            $location.path('/cua-hang/trang-chu');
            window.scrollTo(0, 0);
            window.location.reload(true);
        }

        DataApi.getshopByboss($scope.auth[0].user_id).then(function (response) {
            if (response.data.error_code === 0) {
                $scope.shop_detail = response.data.shop;
            }
        })

        $scope.go_update_shop = function (id) {
            localStorage.setItem('shop', JSON.stringify($scope.shop_detail[0]));
            window.scrollTo(0, 0);
            // window.location.href = '#/ushop';
            $location.path('/quan-ly/cap-nhat-cua-hang');
        }
    })

    .controller('ShopcouponCtrl', function ($scope, $timeout, $location, DataApi, DTOptionsBuilder, Thesocket) {
        $scope.auth = JSON.parse(localStorage.getItem('auth'));
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(10)
            .withOption('bLengthChange', true)
            .withOption('iDisplayLength', 10)

        $scope.go_c_coupon = function () {
            window.scrollTo(0, 0);
            // window.location.href = '#/ccoupon';
            $location.path('/quan-ly/tao-coupon-moi');

        }
        $scope.get_shop_by_boss = function () {
            DataApi.getshopByboss($scope.auth[0].user_id).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.all_coupon = [];
                    $scope.shop_detail = response.data.shop;
                    localStorage.setItem('shop_detail', JSON.stringify($scope.shop_detail));


                    if ($scope.shop_detail[0].shop_coupon.length > 0) {
                        $scope.shop_detail[0].shop_coupon[0].coupon.forEach(element => {
                            $scope.all_coupon.push(element);
                        });
                        $scope.active_shop = $scope.shop_detail[0].shop_coupon[0].approved;
                    }

                    if ($scope.shop_detail[0].server_coupon.length > 0) {
                        $scope.shop_detail[0].server_coupon[0].coupon.forEach(element => {
                            $scope.all_coupon.push(element);
                        });
                        $scope.active_server = $scope.shop_detail[0].server_coupon[0].approved;
                    }
                }
            });
        }

        $scope.get_shop_by_boss();
        Thesocket.on('show_coupon_accept', function () {
            $scope.get_shop_by_boss();
        });
    })