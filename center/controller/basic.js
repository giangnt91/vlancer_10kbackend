coupon
    // .directive('ngFiles', ['$parse', function ($parse) {

    //     function fn_link(scope, element, attrs) {
    //         var onChange = $parse(attrs.ngFiles);
    //         element.on('change', function (event) {
    //             onChange(scope, { $files: event.target.files });
    //         });
    //     };

    //     return {
    //         link: fn_link
    //     }
    // }])

    .controller('BasicodeCtrl', function ($scope, $window, DataApi, $timeout, DTOptionsBuilder, Excel) {
        $scope.get_all = function () {
            DataApi.getAllbasic().then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.basic = response.data.basic;

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

        $scope.get_all();

        $scope.exportToExcel = function (tableId) {
			var exportHref = Excel.tableToExcel(tableId, 'Basic');
			$timeout(function () { location.href = exportHref; }, 100);
		}

        // create action
        $scope.create = function (data) {
            $('#create').animate({ scrollTop: 0 }, 'slow');
            $scope.waiting = true;
            var enday = $('#enday').val();
            if (data !== undefined && data !== null && $scope.loai !== undefined) {
                if (
                    data.basiccode === undefined || data.basiccode === "" ||
                    enday === undefined || enday === "" ||
                    data.value === undefined || data.value == "" ||
                    data.url === undefined || data.url === "" ||
                    data.info === undefined || data.info === "" ||
                    data.nganhhang === undefined || data.nganhhang === "" ||
                    $scope.chooseEmarket._id === null
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
                        DataApi.createBasic($scope.chooseEmarket._id, $scope.chooseEmarket.Ename, $scope.chooseEmarket.Eimg, data.basiccode, data.url, data.nganhhang, data.info, _value, enday).then(function (response) {
                            if (response.data.error_code === 0) {
                                $scope.waiting = false;
                                $scope.success = true;
                                $scope.get_all();
                                data.basiccode = '';
                                data.url = '';
                                data.info = '';
                                data.nganhhang = '';
                                data.value = '';
                                $scope.chooseEmarket = $scope.list_Emarket[0];
                                $scope.loai = null;
                                $('#enday').val(null);
                                $timeout(function () {
                                    $scope.success = false;
                                }, 2500)
                            } else {
                                $timeout(function () {
                                    $scope.server_error = false;
                                }, 2500)
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
                    $scope.list_Emarket.forEach(element => {
                        if (element._id === $scope.detail.Eid) {
                            $scope.chooseEmarket2 = element;
                            $('#enday2').val($scope.detail.Expireday)
                        }
                    });
                }
            }
        }

        // update code
        $scope.update = function (data) {
            var enday = $('#enday2').val();
            $('#update').animate({ scrollTop: 0 }, 'slow');
            $scope.waiting = true;
            var _value = [];

            if (enday !== data.Expireday) {
                $scope.detail.Expireday = enday;
            }

            if ($scope.uloai !== undefined) {
                if ($scope.uloai === "1") {
                    _value = {
                        id: 1,
                        name: "VNĐ",
                        value: data.ValueC[0].value
                    }
                } else {
                    _value = {
                        id: 2,
                        name: "%",
                        value: data.ValueC[0].value
                    }
                }
            } else {
                _value = {
                    id: $scope.detail.ValueC[0].id,
                    name: $scope.detail.ValueC[0].name,
                    value: $scope.detail.ValueC[0].value
                }
            }

            $scope.detail.ValueC = [_value];

            $timeout(function () {
                DataApi.UpdateBasic($scope.detail._id, $scope.chooseEmarket2._id, $scope.chooseEmarket2.Ename, $scope.chooseEmarket2.Eimg, $scope.detail.Code, $scope.detail.Url, $scope.detail.Industry, $scope.detail.Info, $scope.detail.ValueC, $scope.detail.Expireday).then(function (response) {
                    if (response.data.error_code === 0) {
                        // $('#update').animate({ scrollTop: 0 }, 'slow');
                        $scope.waiting = false;
                        $scope.success = true;
                        $scope.get_id_action($scope.detail._id);
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


        // trang thương mại điện tử

        $scope.createEmarket = function (data) {
            $scope.waiting = true;
            if (data === undefined || data === '' || data.ename === undefined || data.ename === '' || data.eimg === undefined || data.eimg === '') {
                $scope.waiting = false;
                $scope.error = true;
                $timeout(function () {
                    $scope.error = false;
                }, 4000);
                return;
            } else {
                DataApi.createEmarket(data.ename, data.eimg).then(function (response) {
                    if (response.data.error_code === 0) {
                        $scope.waiting = false;
                        $scope.success = true;
                        data.ename = '';
                        data.eimg = '';
                        $timeout(function () {
                            $scope.success = false;
                        }, 2500)
                    } else {
                        $scope.server_error = true;
                        $timeout(function () {
                            $scope.server_error = false;
                        }, 2500)
                    }
                })
            }
        }


        // lấy danh sách trang thương mại
        function get_Emarket() {
            $scope.list_Emarket = [{
                Ename: 'Chọn',
                _id: null
            }]
            $scope.chooseEmarket = $scope.list_Emarket[0];
            DataApi.getEmarket().then(function (response) {
                if (response.data.error_code === 0) {
                    response.data.emarket.forEach(element => {
                        $scope.list_Emarket.push(element);
                    });

                }
            })
        }

        get_Emarket();
    })

    .controller('SliderCtrl', function ($scope, $window, DataApi, $timeout, DTOptionsBuilder) {
        DataApi.getAllshop().then(function (response) {
            if (response.data.error_code === 0) {
                $scope.Shops = [{
                    _id: null,
                    shop_info: [{
                        shop_name: 'Khác'
                    }]
                }];
                $scope.chooseShop = $scope.Shops[0];
                response.data.shop.forEach(element => {
                    if (element.shop_status[0].id > 0) {
                        $scope.Shops.push(element);
                    }
                });

                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withDisplayLength(10)
                    .withOption('bLengthChange', true)
                    .withOption('iDisplayLength', 10)
            }
        });

        $scope.get_slider = function ($files) {
            $scope.slider = $files;
        }


        function bo_dau_tv(key) {
            var str = key;
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
            str = str.replace(/ + /g, " ");
            str = str.trim();
            return str;
        }

        function get_url(id) {
            let url;
            $scope.Shops.forEach(element => {
                if (element._id === id) {
                    var slug = bo_dau_tv(element.shop_info[0].shop_name).split(' ').join('-');
                    var _id = element._id.slice(-5);

                    if (element.shop_info[0].kind[0].id === 1) {
                        url = '/an-uong/cua-hang/' + slug + '-' + _id;
                    } else if (element.shop_info[0].kind[0].id === 2) {
                        url = '/mua-sam/cua-hang/' + slug + '-' + _id;
                    } else {
                        url = '/du-lich/cua-hang/' + slug + '-' + _id;
                    }
                }
            });
            return url;
        }

        // end go menu

        $scope.checkchange = function () {
            $scope.khac = false;
            if ($scope.chooseShop._id !== null) {
                $scope.khac = true;
                $scope.Url = get_url($scope.chooseShop._id);
            } else {
                $scope.Url = '';
            }
        }

        function getSlider() {
            DataApi.GetSlider().then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.Sliders = response.data.sliders;
                }
            })
        }

        getSlider();

        $scope.Create = function (data) {
            if (data === undefined ||
                data === '' ||
                data.button === undefined ||
                data.button === '' ||
                $scope.Url === '' ||
                $scope.slider === undefined ||
                $scope.slider.length === 0
            ) {
                $scope.error = true;
                window.scrollTo(0, 0);
                $timeout(function () {
                    $scope.error = false;
                }, 1500)
                return;
            } else {
                DataApi.CreateSlider($scope.chooseShop._id, data.button, $scope.Url).then(function (response) {
                    if (response.data.error_code === 0) {
                        DataApi.Upslider(response.data._id, $scope.slider[0]).then(function (res) {
                            if (res.data.error_code === 0) {
                                $scope.success = true;
                                $scope.chooseShop = $scope.Shops[0];
                                data.button = '';
                                $scope.Url = '';
                                getSlider();
                                $timeout(function () {
                                    $scope.success = false;
                                }, 1500)
                            } else {
                                $scope.error = true;
                            }
                        })
                    }
                })
            }
        }

        // get slider id
        $scope.set_is_del = function () {
            $scope.del = false;
        }
        $scope.get_id_slider = function(id){
            for (var i = 0; i < $scope.Sliders.length; i++) {
                if (id === $scope.Sliders[i]._id) {
                    $scope.detail = $scope.Sliders[i];
                }
            }
        }

        // remove code
        $scope.remove = function (id) {
            DataApi.RemoveSlider(id).then(function (response) {
                if (response.data.error_code === 0) {
                    $scope.del = true;
                    $scope.getSlider();
                }
            })
        }
    })