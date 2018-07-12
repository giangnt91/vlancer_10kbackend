coupon
    .controller('BasicodeCtrl', function ($scope, $window, DataApi, $timeout, DTOptionsBuilder) {
        $scope.get_all = function () {
            DataApi.getAllbasic().then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.basic = response.data.basic;

                    $scope.dtOptions = DTOptionsBuilder.newOptions()
                        .withDisplayLength(10)
                        .withOption('bLengthChange', true)
                        .withOption('iDisplayLength', 10)
                }
            });
        }

        $scope.get_all();

        $scope.get_avatar = function ($files) {
            $scope.avatar = $files;
        }

        // create action
        $scope.create = function (data) {
            $('#create').animate({ scrollTop: 0 }, 'slow');
            $scope.waiting = true;
            var enday = $('#enday').val();
            if (data !== undefined && data !== null && $scope.avatar !== undefined && $scope.avatar.length !== 0 && $scope.loai !== undefined) {
                if (
                    data.shopid === undefined || data.shopid === "" ||
                    data.basiccode === undefined || data.basiccode === "" ||
                    enday === undefined || enday === "" ||
                    data.value === undefined || data.value == "" ||
                    data.url === undefined || data.url === "" ||
                    data.info === undefined || data.info === ""
                ) {
                    // $('#create').animate({ scrollTop: 0 }, 'slow');
                    $scope.waiting = false;
                    $scope.error = true;
                    $timeout(function () {
                        $scope.error = false;
                    }, 4000);
                } else {
                    var _value = [];
                    if ($scope.loai === "1") {
                        _value = {
                            id: 1,
                            name: "VNĐ",
                            value: data.value
                        }
                    } else {
                        _value = {
                            id: 2,
                            name: "%",
                            value: data.value
                        }
                    }
                    $timeout(function () {
                        DataApi.createBasic(data.shopid, "", data.info, _value, data.basiccode, enday, data.url).then(function (response) {
                            if (response.data.error_code === 0) {
                                $timeout(function () {
                                    DataApi.updateImgBasic(data.basiccode, $scope.avatar[0]).then(function (response) {
                                        if (response.data.error_code === 0) {
                                            // $('#create').animate({ scrollTop: 0 }, 'slow');
                                            $scope.waiting = false;
                                            $scope.success = true;
                                            document.getElementById("avatar").value = "";
                                            data.shopid = "";
                                            data.basiccode = "";
                                            data.url = "";
                                            data.info = "";
                                            data.value = "";
                                            document.getElementById("enday").value = "";
                                            $scope.get_all();
                                            $timeout(function () {
                                                $scope.success = false;
                                            }, 2500)
                                        } else {
                                            // $('#create').animate({ scrollTop: 0 }, 'slow');
                                            $scope.server_error = true;
                                            $timeout(function () {
                                                $scope.server_error = false;
                                            }, 2500)
                                        }
                                    })
                                }, 300)
                            }
                        })
                    }, 1500);
                }
            } else {
                // $('#create').animate({ scrollTop: 0 }, 'slow');
                $scope.waiting = false;
                $scope.error = true;
                $timeout(function () {
                    $scope.error = false;
                }, 4000);
            }
        }

        // get action id
        $scope.get_id_action = function (id) {
            for (var i = 0; i < $scope.basic.length; i++) {
                if (id === $scope.basic[i]._id) {
                    $scope.detail = $scope.basic[i];
                }
            }
        }

        // update code
        $scope.update = function (data) {
            var enday = $('#enday2').val();
            $('#update').animate({ scrollTop: 0 }, 'slow');
            $scope.waiting = true;
            var _value = [];

            if (enday !== data.expire_day) {
                data.expire_day = enday;
            }

            // update image
            if ($scope.avatar !== undefined) {
                if ($scope.avatar.length !== 0) {
                    DataApi.updateImgBasic(data.code_coupon, $scope.avatar[0]).then(function (response) {
                    });
                }
            }

            if ($scope.uloai !== undefined) {
                if ($scope.uloai === "1") {
                    _value = {
                        id: 1,
                        name: "VNĐ",
                        value: data.value[0].value
                    }
                } else {
                    _value = {
                        id: 2,
                        name: "%",
                        value: data.value[0].value
                    }
                }
            } else {
                _value = {
                    id: data.value[0].id,
                    name: data.value[0].name,
                    value: data.value[0].value
                }
            }


            $timeout(function () {
                DataApi.UpdateBasic(data.shopId, data.info_coupon, _value, data.code_coupon, data.expire_day, data.shopUrl).then(function (response) {
                    if (response.data.error_code === 0) {
                        // $('#update').animate({ scrollTop: 0 }, 'slow');
                        $scope.waiting = false;
                        $scope.success = true;
                        $scope.get_all();
                        $timeout(function () {
                            $scope.success = false;
                        }, 4000)
                    } else {
                        // $('#update').animate({ scrollTop: 0 }, 'slow');
                        $scope.waiting = false;
                        $scope.server_error = true;
                        $timeout(function () {
                            $scope.server_error = false;
                        }, 4000);
                    }
                })
            }, 1500)
        }

        $scope.set_is_del = function () {
            $scope.del = false;
        }
        // remove code
        $scope.remove = function (id) {
            DataApi.removebasic(id).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.del = true;
                    $scope.get_all();
                }
            })
        }
    })