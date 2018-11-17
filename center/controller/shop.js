coupon
    .directive('ngFiles', ['$parse', function ($parse) {

        function fn_link(scope, element, attrs) {
            var onChange = $parse(attrs.ngFiles);
            element.on('change', function (event) {
                onChange(scope, { $files: event.target.files });
            });
        };

        return {
            link: fn_link
        }
    }])

    .directive('dropzone', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                // new array file
                scope.all_file = [];

                Dropzone.autoDiscover = false;
                var config = {
                    url: '#',
                    maxFiles: 8,
                    addRemoveLinks: true,
                    acceptedFiles: ".jpeg,.jpg,.png,.gif",
                };

                var eventHandlers = {
                    'addedfile': function (file) {
                        scope.file = file;
                        scope.$apply(function () {
                            scope.fileAdded = true;
                            if (scope.all_file.length < 8) {
                                scope.all_file.push(file);
                            }
                        });
                    },

                    // remove file from array
                    'removedfile': function (file) {
                        scope.all_file.forEach(function (item, idx) {
                            if (item.size === file.size) {
                                scope.all_file.splice(idx, 1);
                            }
                        });
                    },

                    'success': function (file, response) {
                    }

                };

                dropzone = new Dropzone(element[0], config);

                angular.forEach(eventHandlers, function (handler, event) {
                    dropzone.on(event, handler);
                });
            }
        }
    })

    .controller('ShopCtrl', function ($scope, $location, $window, DataApi, DTOptionsBuilder, $timeout, Excel) {
        $scope.auth = JSON.parse(localStorage.getItem('auth'));

        if (!$scope.auth) {
            // window.location.href = '#/';
            // $window.location.reload(true);
        } else {
            if ($scope.auth[0].role[0].id === 2) {
                // window.location.href = '#/manager';
                $location.path('/cua-hang/trang-chu');
            }
        }

        $scope.exportToExcel = function (tableId) {
			var exportHref = Excel.tableToExcel(tableId, 'Coupon');
			$timeout(function () { location.href = exportHref; }, 100);
		}

        // get all shop
        DataApi.getAllshop().then(function (response) {
            if (response.data.error_code === 0) {
                $scope.shop_result = [];
                response.data.shop.forEach(element => {
                    if (element.shop_rank.length > 0) {
                        $scope.shop_result.unshift(element);
                    }
                });

                $scope.shop_vip = [];
                $scope.shop_normal = [];
                $scope.shop_top = [];

                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withDisplayLength(10)
                    .withOption('aLengthMenu', [
                        [10, 20, 50, 100, 200, -1],
                        [10, 20, 50, 100, 200, "All"]
                    ])
                    .withOption('bLengthChange', true)
                    .withOption('iDisplayLength', 10)


                for (var i = 0; i < $scope.shop_result.length; i++) {
                    if ($scope.shop_result[i].shop_status[0].id === 0) {
                        $scope.shop_top.push($scope.shop_result[i]);
                    } else {
                        if ($scope.shop_result[i].shop_rank[0].id === 1) {
                            $scope.shop_vip.push($scope.shop_result[i]);
                        } else {
                            $scope.shop_normal.push($scope.shop_result[i]);
                        }
                    }
                }
            }
        });

        $scope.go_to_shop = function () {
            // window.location.href = '#/cshop';
            $location.path('/quan-ly/tao-cua-hang');
            window.scrollTo(0, 0);
        }

        $scope.go_update_shop = function (id) {
            $scope.shop_result.forEach(element => {
                if (element._id === id) {
                    localStorage.setItem('shop', JSON.stringify(element));
                }
            });
            window.scrollTo(0, 0);
            // window.location.href = '#/ushop';
            $location.path('/quan-ly/cap-nhat-cua-hang/'+ id);
        }

        // var formdata = new FormData();

        $scope.get_cover = function ($files) {
            $scope.cover = $files;
        }

        $scope.get_avatar = function ($files) {
            $scope.avatar = $files;
        }


        $scope.create_shop = function (data) {
            var _kind;
            if (data !== undefined && data !== null && $scope.avatar !== undefined && $scope.avatar.length !== 0 && $scope.cover !== undefined && $scope.cover.length !== 0 && $scope.all_file.length !== 0) {
                if (
                    data.shopid === undefined || data.shopid === "" ||
                    data.boss === undefined || data.boss === "" ||
                    data.shopname === undefined || data.shopname === "" ||
                    data.kind === undefined || data.kind === "" ||
                    data.service === undefined || data.service === "" ||
                    data.time === undefined || data.time === "" ||
                    data.address === undefined || data.address === "" ||
                    data.info === undefined || data.info === "" ||
                    $scope.avatar === undefined || $scope.avatar.length === 0 ||
                    $scope.cover === undefined || $scope.avatar.length === 0 ||
                    $scope.all_file.length === 0
                ) {
                    $scope.the_error = true;
                    $scope.error = true;
                    window.scrollTo(0, 0);

                } else {
                    _status = [{
                        id: 0,
                        name: "Tạm Ngưng"
                    }];
                    if (data.kind === "1") {
                        _kind = [{
                            id: 1,
                            name: "Ăn uống"
                        }]
                    } else if (data.kind === "2") {
                        _kind = [{
                            id: 2,
                            name: "Mua sắm"
                        }]
                    } else if (data.kind === "3") {
                        _kind = [{
                            id: 3,
                            name: "Du lịch"
                        }]
                    }


                    shop_info = [{
                        shop_name: data.shopname,
                        kind: _kind,
                        time: data.time,
                        address: data.address,
                        service: data.service,
                        info: data.info,
                        shop_avatar: "",
                        shop_cover: "",
                        shop_album: []
                    }];

                    shop_rank = [{
                        id: 0,
                        name: "Thường"
                    }]

                    DataApi.createShop(data.shopid, data.boss, $scope.manager, JSON.stringify(_status), JSON.stringify(shop_rank), JSON.stringify(shop_info)).then(function (response) {
                        if (response.data.error_code === 0) {
                            $scope.the_error = false;
                            $timeout(function () {
                                DataApi.uploadImg(data._id, $scope.avatar[0], $scope.cover[0], $scope.all_file).then(function (response) {
                                    if (response.data.error_code === 0) {
                                        $timeout(function () {
                                            $scope.ok = true;
                                        }, 1500)
                                    }
                                })
                            }, 300)

                        } else if (response.data.error_code === 4) {
                            $scope.the_error = true;
                            $scope.exist = true;
                            window.scrollTo(0, 0);
                            $timeout(function () {
                                $scope.exist = false;
                                $scope.$apply();
                            }, 10000);
                        }
                    });

                }
            } else {
                $scope.the_error = true;
                $scope.error = true;
                window.scrollTo(0, 0);
                // $timeout(function () {
                //     $scope.error = false;
                //     $scope.$apply();
                // }, 10000);
            }

        }

        $scope._reload = function () {
            window.scrollTo(0, 0);
            // window.location.href = '#/shop';
            // window.location.reload(true);
			$location.path('/quan-ly/cua-hang');
        }

    })

    .controller('UpdateCtrl', function ($scope, $location, DataApi, $timeout, $routeParams) {
        $scope.auth = JSON.parse(localStorage.getItem('auth'));
		let shopId = $routeParams.idshop;
		
        if (!$scope.auth) {
            // window.location.href = '#/';
            // $window.location.reload(true);
        }
		
		function getShopByid(){
			DataApi.getShopbyId(shopId).then(function(response){
				if(response.data.error_code === 0){
					$scope.shop = response.data.shop;
				}
			})
		}
		
		getShopByid();

        // $scope.shop = JSON.parse(localStorage.getItem('shop'));

        $scope._reload = function () {
            window.scrollTo(0, 0);
            // window.location.href = '#/shop';
            $location.path('/quan-ly/cua-hang');
            // window.location.reload(true);
        }

        $scope.get_cover = function ($files) {
            $scope.cover = $files;
        }

        $scope.get_avatar = function ($files) {
            $scope.avatar = $files;
        }


        // update info
        $scope.update = function (data) {
            if (data !== undefined && data !== null) {

                // update image
                if ($scope.avatar !== undefined) {
                    if ($scope.avatar.length !== 0) {
                        // update avatar appi
                        DataApi.uAvatar(data._id, $scope.avatar[0]).then(function (response) {
							if(response.data.error_code === 0){
								data.shop_info[0].shop_avatar = response.data.url;
							}
                        });
                    }
                }

                if ($scope.cover !== undefined) {
                    // update cover api
                    if ($scope.cover.length !== 0) {
                        DataApi.uCover(data._id, $scope.cover[0]).then(function (response) {
							if(response.data.error_code === 0){
								data.shop_info[0].shop_cover = response.data.url;
							}
                        });
                    }
                }

                if ($scope.all_file.length !== 0) {
                    // update album api
                    DataApi.uAlbum(data._id, $scope.all_file).then(function (response) {
						if(response.data.error_code === 0){
							data.shop_info[0].shop_album = response.data.url;
						}
                    });
                }

                // kind
                if (data.shop_info[0].kind === "1") {
                    data.shop_info[0].kind = [{
                        id: 1,
                        name: "Ăn uống"
                    }]
                } else if (data.shop_info[0].kind === "2") {
                    data.shop_info[0].kind = [{
                        id: 2,
                        name: "Mua sắm"
                    }]
                } else if (data.shop_info[0].kind === "3") {
                    data.shop_info[0].kind = [{
                        id: 3,
                        name: "Du lịch"
                    }]
                }

                // rank
                if (data.shop_rank === "0") {
                    data.shop_rank = [{
                        id: 0,
                        name: "Thường"
                    }]
                } else if (data.shop_rank === "1") {
                    data.shop_rank = [{
                        id: 1,
                        name: "Vip"
                    }]
                }

                // status
                if (data.shop_status === "0") {
                    data.shop_status = [{
                        id: 0,
                        name: "Tạm Ngưng"
                    }]
                } else if (data.shop_status === "1") {
                    data.shop_status = [{
                        id: 1,
                        name: "Hoạt Động"
                    }]
                }
				
				$timeout(function(){
					DataApi.updateShop(JSON.stringify(angular.copy(data))).then(function (response) {
						if (response.data.error_code === 0) {
							// $timeout(function () {
								$scope.ok = true;
							// }, 1500)
						} else {
							$scope.exist = true;
							window.scrollTo(0, 0);
							$timeout(function () {
								$scope.exist = false;
								$scope.$apply();
							}, 2000);
						}
					});
				}, 2000);
                
				
            } else {
                $scope.error = true;
                $timeout(function () {
                    $scope.error = false;
                    $scope.$apply();
                }, 2500);
            }
        }
    })