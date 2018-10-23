coupon
	.controller('CouponCtrl', function ($scope, $location, $rootScope, $window, $timeout, DataApi, Thesocket, DTOptionsBuilder, Excel) {
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

		$scope.getAllcoupon = function () {
			DataApi.getAllcoupon().then(function (response) {
				if (response.data.error_code === 0) {
					$scope.all_coupon = response.data.coupon;
					$scope.new_coupon = [];
					var shop = $scope.all_coupon.shop;
					shop.forEach(element => {
						if (element.approved === "pending") {
							$scope.new_coupon.push(element);
						}
					});
					$scope.the_data = [];
					var server = $scope.all_coupon.server;
					var user_get_coupon = $scope.all_coupon.user_get_coupon;
					var expire = $scope.all_coupon.expire_coupon;
					var shop_use = $scope.all_coupon.shop_use_coupon;

					if (shop.length > 0) {
						shop.forEach(element => {
							element.coupon.forEach(el => {
								$scope.the_data.push(el);
							})
						});
					}
					if (server.length > 0) {
						server.forEach(element => {
							element.coupon.forEach(el => {
								$scope.the_data.push(el);
							})
						});
					}
					if (user_get_coupon.length > 0) {
						user_get_coupon.forEach(element => {
							$scope.the_data.push(element);
						});
					}
					if (expire.length > 0) {
						expire.forEach(element => {
							element.coupon.forEach(el => {
								$scope.the_data.push(el);
							})
						});
					}
					if (shop_use.length > 0) {
						shop_use.forEach(element => {
							$scope.the_data.push(element.coupon);
						});
					}					
				}

				$scope.dtOptions = DTOptionsBuilder.newOptions()
					.withDisplayLength(10)
					.withOption('aLengthMenu', [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "All"]
					])
					.withOption('bLengthChange', true)
					.withOption('iDisplayLength', 10)

			});
		}
		$scope.getAllcoupon();

		Thesocket.on('get_all_coupon', function () {
			$scope.getAllcoupon();
		})

		// get coupon detail
		$scope.get_coupon_detail = function (id) {
			$scope.the_data.forEach(element => {
				if (element._id === id) {
					$scope._detail_coupon = element;
				}
			});
		}

		// get user id
		$scope.get_id_coupon = function (id) {
			for (var i = 0; i < $scope.new_coupon.length; i++) {
				if (id === $scope.new_coupon[i].coupon[0]._id) {
					$scope.detail = $scope.new_coupon[i].coupon[0];
				}
			}
		}

		$scope.go_c_coupon = function () {
			window.scrollTo(0, 0);
			// window.location.href = '#/ccoupon';
			$location.path('/quan-ly/tao-coupon-moi');
		}

		$scope.set_is_cancel = function () {
			$timeout(function () {
				$scope.cancel = false;
			}, 1000);
		}

		$scope.set_is_accept = function () {
			$timeout(function () {
				$scope.accept = false;
			}, 1000);
		}

		// accept coupon api
		$scope.a_coupon = function (data) {
			if (data !== undefined) {
				if (data.point > 0) {
					_point = data.point;
				} else {
					_point = 0;
				}
			} else {
				_point = 0;
			}
			DataApi.acceptCoupon($scope.detail.the_issuer[0].id, _point).then(function (response) {
				if (response.data.error_code === 0) {
					Thesocket.emit('server_accept');
					DataApi.getAllcoupon().then(function (response) {
						if (response.data.error_code === 0) {
							$scope.all_coupon = response.data.coupon;
							$scope.new_coupon = [];
							var shop = $scope.all_coupon.shop;
							shop.forEach(element => {
								if (element.approved === "pending") {
									$scope.new_coupon.push(element);
								}
							});
						}
					});
					$timeout(function () {
						$scope.accept = true;
						$scope.$apply();
					}, 100)
				}
			});
		}

		// cancel coupon api
		$scope.c_coupon = function () {
			DataApi.cancelApproved($scope.detail.the_issuer[0].id).then(function (response) {
				if (response.data.error_code === 0) {
					Thesocket.emit('server_accept');
					DataApi.getAllcoupon().then(function (response) {
						if (response.data.error_code === 0) {
							$scope.all_coupon = response.data.coupon;
							$scope.new_coupon = [];
							var shop = $scope.all_coupon.shop;
							shop.forEach(element => {
								if (element.approved === "pending") {
									$scope.new_coupon.push(element);
								}
							});
						}
					});
					$timeout(function () {
						$scope.cancel = true;
						$scope.$apply();
					}, 100)
				}
			});
		}
	})

	.controller('cCouponCtrl', function ($scope, $filter, $timeout, DataApi, md5, Thesocket) {
		$scope.auth = JSON.parse(localStorage.getItem('auth'));
		if (!$scope.auth) {
			// window.location.href = '#/';
		}

		// get all shop
		DataApi.getAllshop().then(function (response) {
			if (response.data.error_code === 0) {
				$scope.shop_result = [];
				response.data.shop.forEach(element => {
					if (element.shop_rank.length > 0) {
						if (element.shop_coupon.length === 0) {
							$scope.shop_result.push(element);
						}
					}
				});
			}
		});

		$scope._reload = function () {
			window.scrollTo(0, 0);
			window.location.reload(true);
		}

		if ($scope.auth[0].role[0].id === 2) {
			detail_shop = JSON.parse(localStorage.getItem('shop_detail'));
			$scope.shop_detail_id = detail_shop[0].shopId;
			$scope.shop_avatar = detail_shop[0].shop_info[0].shop_avatar;
			$scope.shop_cover = detail_shop[0].shop_info[0].shop_cover;
			$scope._id_shop = detail_shop[0]._id;
			$scope.name_shop = detail_shop[0].shop_info[0].shop_name;
		}

		$scope.get_shop = function (data) {
			$scope.selected_shop = data;
		}

		$scope.c_cuopon = function (data) {
			var date = new Date();
			var _m = date.getMonth();
			var _d = $filter('date')(date, "dd");
			var _y = date.getFullYear();
			if (parseInt($scope.enday) !== 1) {
				if (_m + parseInt($scope.enday) >= 12) {
					_y = _y + 1;
					_m = ((_m + parseInt($scope.enday)) - 12) + 1;
					if (_m < 10) {
						_m = "0" + _m;
					}
				} else {
					_m = (_m + parseInt($scope.enday)) + 1;
					if (_m < 10) {
						_m = "0" + _m;
					}
				}
			} else {
				if (_m + 12 >= 12) {
					_y = _y + 1;
					_m = ((_m + 12) - 12) + 1;
					if (_m < 10) {
						_m = "0" + _m;
					}
				} else {
					_m = (_m + 12) + 1;
					if (_m < 10) {
						_m = "0" + _m;
					}
				}
			}
			$scope._limit = _d + '/' + _m + '/' + _y;

			$scope._today = $filter('date')(new Date(), 'dd/MM/yyyy');
			if ($scope.checked === true) {
				$scope.rfeedback = [{
					id: 1,
					name: "Có"
				}]
			} else {
				$scope.rfeedback = [{
					id: 2,
					name: "Không"
				}]
			}

			if ($scope.checked2 === true) {
				$scope.loyal = [{
					id: 1,
					name: "Có"
				}]
			} else {
				$scope.loyal = [{
					id: 2,
					name: "Không"
				}]
			}

			// var enday = $('#enday').val();
			var all_coupon = [];

			if (data !== undefined && data !== null) {
				if ($scope.auth[0].role[0].id === 1) {
					$scope.shop_avatar = $scope.selected_shop.shop_info[0].shop_avatar;
					$scope.shop_cover = $scope.selected_shop.shop_info[0].shop_cover;
					$scope.name_shop = $scope.selected_shop.shop_info[0].shop_name;
				}

				if ($scope.auth[0].role[0].id === 2) {
					if (data.class === "" || data.value === undefined || data.value === "" || data.quantity === undefined || data.quantity === "" || data.info === undefined || data.info === "" || $scope.enday === "") {
						window.scrollTo(0, 0);
						$scope.error = true;
					} else {
						// set value class
						if (data.class === "1") {
							_class = [{
								id: 1,
								name: "Bạch Kim"
							}]
						} else if (data.class === "2") {
							_class = [{
								id: 2,
								name: "Vàng"
							}]
						} else if (data.class === "3") {
							_class = [{
								id: 3,
								name: "Bạc"
							}]
						} else if (data.class === "4") {
							_class = [{
								id: 4,
								name: "Thường"
							}]
						}

						_the_issuer = [{
							id: $scope.shop_detail_id,
							name: $scope.name_shop
						}]

						_status_coupon = [{
							id: 1,
							status: "Còn hạn và chưa sử dụng"
						}]

						if (data.point !== undefined) {
							if (data.point > 0) {
								_point = data.point;
							} else {
								_point = 0;
							}
						} else {
							_point = 0;
						}

						var _info = data.info.replace(/(?:\r\n|\r|\n)/g, '<br>');
						// get shop id and shop name
						for (let i = 0; i < data.quantity; i++) {
							_coupon = {
								_id: md5.createHash(new Date().toLocaleString() + i),
								shop_name: $scope.name_shop,
								shop_avatar: $scope.shop_avatar,
								shop_cover: $scope.shop_cover,
								shop_id: $scope.shop_detail_id,
								coupon_info: _info,
								value: data.value,
								class_user: _class,
								release_day: $scope._today,
								time_expire: $scope.enday,
								limit_time: $scope._limit,
								the_issuer: _the_issuer,
								status_coupon: _status_coupon,
								userid_get_coupon: "",
								time_user_get: null,
								time_user_use: null,
								rating: 0,
								rfeedback: $scope.rfeedback,
								loyal: $scope.loyal,
								point: _point,
								feedback: "",
								approved: "pending"
							}
							all_coupon.push(_coupon);
						}

						var the_new_coupon = [{
							approved: "pending",
							coupon: all_coupon
						}]

						DataApi.ServerCreateC($scope._id_shop, JSON.stringify(the_new_coupon), 2).then(function (response) {
							if (response.data.error_code === 0) {
								Thesocket.emit('shop_create_new_coupon');
								$timeout(function () {
									$scope.ok = true;
								}, 1500)
							}
						})

					}
				} else {
					if ($scope.selected_shop === undefined || data.class === undefined || data.class === "" || data.value === undefined || data.value === "" || data.quantity === undefined || data.quantity === "" || data.info === undefined || data.info === "" || $scope.enday === "") {
						window.scrollTo(0, 0);
						$scope.error = true;
					} else {

						// set value class
						if (data.class === "1") {
							_class = [{
								id: 1,
								name: "Bạch Kim"
							}]
						} else if (data.class === "2") {
							_class = [{
								id: 2,
								name: "Vàng"
							}]
						} else if (data.class === "3") {
							_class = [{
								id: 3,
								name: "Bạc"
							}]
						} else if (data.class === "4") {
							_class = [{
								id: 4,
								name: "Thường"
							}]
						}

						_the_issuer = [{
							id: 1,
							name: "Server"
						}]

						_status_coupon = [{
							id: 1,
							status: "Còn hạn và chưa sử dụng"
						}]

						if (data.point !== undefined) {
							if (data.point > 0) {
								_point = data.point;
							} else {
								_point = 0;
							}
						} else {
							_point = 0;
						}

						var _info = data.info.replace(/(?:\r\n|\r|\n)/g, '<br>');
						// get shop id and shop name
						for (let i = 0; i < data.quantity; i++) {
							_coupon = {
								_id: md5.createHash(new Date().toLocaleString() + i),
								shop_id: $scope.selected_shop.shopId,
								shop_name: $scope.name_shop,
								shop_avatar: $scope.shop_avatar,
								shop_cover: $scope.shop_cover,
								coupon_info: _info,
								value: data.value,
								class_user: _class,
								release_day: $scope._today,
								time_expire: $scope.enday,
								limit_time: $scope._limit,
								the_issuer: _the_issuer,
								status_coupon: _status_coupon,
								userid_get_coupon: "",
								time_user_get: null,
								time_user_use: null,
								rating: 0,
								rfeedback: $scope.rfeedback,
								loyal: $scope.loyal,
								point: _point,
								feedback: "",
								approved: true
							}
							all_coupon.push(_coupon);
						}

						var the_new_coupon = [{
							approved: true,
							coupon: all_coupon
						}]
						DataApi.ServerCreateC($scope.selected_shop._id, JSON.stringify(the_new_coupon), 1).then(function (response) {
							if (response.data.error_code === 0) {
								$timeout(function () {
									$scope.ok = true;
								}, 1500)
							}
						})

					}
				}

			} else {
				window.scrollTo(0, 0);
				$scope.error = true;
			}
		}
	})						