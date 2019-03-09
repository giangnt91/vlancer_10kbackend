coupon
	.controller('AuthCtrl', function ($rootScope, $location, $scope, $window, DataApi, $timeout) {

		$window.fbAsyncInit = function () {
			FB.XFBML.parse();

			FB.getLoginStatus(function (fbres) {
				if (fbres.status === 'connected') {
					faceLogin(fbres);
				}else{
					FB.Event.subscribe('auth.login', function (fbres) {
						faceLogin(fbres);
					})
				}
			})

			faceLogin = (fbres) => {
					FB.api('/me', (rs) => {
						$scope.fbName = rs.name;
					})
					// get long access token
					FB.api('/oauth/access_token?grant_type=fb_exchange_token&client_id=1946240225621730&client_secret=15ecc2d337244c224a6497f9b91931f1&fb_exchange_token=' + fbres.authResponse.accessToken, function (res) {
						$scope.access_token = res.access_token;
					});

					// get image avatar
					Imgurl = "https://graph.facebook.com/" + fbres.authResponse.userID + "/picture?width=180&height=180";

					DataApi.getshopByboss(fbres.authResponse.userID).then(function (response) {
						if (response.data.error_code === 0) {
							$scope.is_boss = true;
						}
					})

					$timeout(function () {
						DataApi.signIn(fbres.authResponse.userID, Imgurl).then(function (signin_res) {
							var signin_result = signin_res.data;
							if (signin_result.error_code === 2) {
								$scope.info = [{
									fulname: $scope.fbName,
									bith_day: 'Chưa cập nhật',
									sex: 'Chưa cập nhật',
									work: 'Chưa cập nhật',
									mobile: 'Chưa cập nhật',
									email: 'Chưa cập nhật',
									full_update: 0,
									provider: 'facebook'
								}
								];
								var _class = {
									id: 4,
									name: "Thường"
								}
								var _status = {
									id: 0,
									name: "Active"
								}

								var _role = {
									id: 2,
									name: "Shop Owner"
								}

								if ($scope.is_boss === true) {
									DataApi.signUp(fbres.authResponse.userID, Imgurl, JSON.stringify($scope.info), 0, 0, 5, JSON.stringify(_class), false, 1, 0, 0, null, 5, [], null, JSON.stringify(_role), JSON.stringify(_status)).then(function (signup_res) {
										var signup_result = signup_res.data;
										if (signup_result.error_code === 0) {
											DataApi.signIn(fbres.authResponse.userID, Imgurl).then(function (signin_res_2) {
												var signin_result_2 = signin_res_2.data;
												if (signin_result_2.error_code === 0) {
													localStorage.setItem('auth', JSON.stringify(signin_result_2.auth));
													if (signin_result_2.auth[0].role[0].id === 1) {
														$location.path('/quan-ly/trang-chu');
														// window.location.href = '#/home';
														window.location.reload(true);
													} else if (signin_result_2.auth[0].role[0].id === 2) {
														// window.location.href = '#/manager';
														$location.path('/cua-hang/trang-chu');
														window.location.reload(true);
													} else {
														$scope._error_role = true;
														$timeout(function () {
															$scope._error_role = false;
														}, 10000)
													}

												}
											});
										}
									});
								} else {
									$scope._error_role = true;
									$timeout(function () {
										$scope._error_role = false;
									}, 10000)
								}
							}
							if (signin_result.error_code === 0) {
								localStorage.setItem('auth', JSON.stringify(signin_result.auth));
								if (signin_result.auth[0].role[0].id === 1) {
									// window.location.href = '#/home';
									$location.path('/quan-ly/trang-chu');
									window.location.reload(true);
								} else if (signin_result.auth[0].role[0].id === 2) {
									// window.location.href = '#/manager';
									$location.path('/cua-hang/trang-chu');
									window.location.reload(true);
								} else {
									$scope._error_role = true;
									$timeout(function () {
										$scope._error_role = false;
									}, 10000)
								}

							} else if (signin_result.error_code === 5) {
								$scope._error_login = true;
								$timeout(function () {
									$scope._error_login = false;
								}, 10000)
							} else if (signin_result.error_code === 4) {
								$scope._error_reg = true;
								$timeout(function () {
									$scope._error_reg = false;
								}, 10000)
							}
						});
					}, 500);
			}

		}


		// login goole
		$rootScope.$on('event:social-sign-in-success', function (event, userDetails) {
			if (userDetails) {

				if (userDetails.provider === 'google') {
					Imgurl = userDetails.imageUrl;
				} else {
					Imgurl = "https://graph.facebook.com/" + userDetails.uid + "/picture?width=180&height=180";
				}

				// get long live access token
				if (userDetails.product === 'facebook') {
					FB.api('/oauth/access_token?grant_type=fb_exchange_token&client_id=1946240225621730&client_secret=15ecc2d337244c224a6497f9b91931f1&fb_exchange_token=' + userDetails.token, function (res) {
						localStorage.setItem('accessToken', res.access_token);
					});
				} else {
					$scope.access_token = null;
				}

				DataApi.getshopByboss(userDetails.uid).then(function (response) {
					if (response.data.error_code === 0) {
						$scope.is_boss = true;
					}
				})

				DataApi.signIn(userDetails.uid, Imgurl).then(function (signin_res) {
					var signin_result = signin_res.data;
					if (signin_result.error_code === 2) {
						$scope.info = [{
							fulname: userDetails.name,
							bith_day: 'Chưa cập nhật',
							sex: 'Chưa cập nhật',
							work: 'Chưa cập nhật',
							mobile: 'Chưa cập nhật',
							email: userDetails.email,
							full_update: 0,
							provider: userDetails.provider
						}
						];
						var _class = {
							id: 4,
							name: "Thường"
						}
						var _status = {
							id: 0,
							name: "Active"
						}

						var _role = {
							id: 2,
							name: "Shop Owner"
						}

						if ($scope.is_boss === true) {
							DataApi.signUp(userDetails.uid, Imgurl, JSON.stringify($scope.info), 0, 0, 5, JSON.stringify(_class), false, 1, 0, 0, null, 5, [], null, JSON.stringify(_role), JSON.stringify(_status)).then(function (signup_res) {
								var signup_result = signup_res.data;
								if (signup_result.error_code === 0) {
									DataApi.signIn(userDetails.uid, Imgurl).then(function (signin_res_2) {
										var signin_result_2 = signin_res_2.data;
										if (signin_result_2.error_code === 0) {
											localStorage.setItem('auth', JSON.stringify(signin_result_2.auth));
											if (signin_result_2.auth[0].role[0].id === 1) {
												$location.path('/quan-ly/trang-chu');
												// window.location.href = '#/home';
												window.location.reload(true);
											} else if (signin_result_2.auth[0].role[0].id === 2) {
												// window.location.href = '#/manager';
												$location.path('/cua-hang/trang-chu');
												window.location.reload(true);
											} else {
												$scope._error_role = true;
												$timeout(function () {
													$scope._error_role = false;
												}, 10000)
											}

										}
									});
								}
							});
						} else {
							$scope._error_role = true;
							$timeout(function () {
								$scope._error_role = false;
							}, 10000)
						}
					}
					if (signin_result.error_code === 0) {
						localStorage.setItem('auth', JSON.stringify(signin_result.auth));
						if (signin_result.auth[0].role[0].id === 1) {
							// window.location.href = '#/home';
							$location.path('/quan-ly/trang-chu');
							window.location.reload(true);
						} else if (signin_result.auth[0].role[0].id === 2) {
							// window.location.href = '#/manager';
							$location.path('/cua-hang/trang-chu');
							window.location.reload(true);
						} else {
							$scope._error_role = true;
							$timeout(function () {
								$scope._error_role = false;
							}, 10000)
						}

					} else if (signin_result.error_code === 5) {
						$scope._error_login = true;
						$timeout(function () {
							$scope._error_login = false;
						}, 10000)
					} else if (signin_result.error_code === 4) {
						$scope._error_reg = true;
						$timeout(function () {
							$scope._error_reg = false;
						}, 10000)
					}
				});
			}
		})
	})
