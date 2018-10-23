coupon
    .controller('UsersCtrl', function ($scope, $location, $window, DataApi, DTOptionsBuilder, $timeout, Excel) {
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
		
		$scope.exportToExcel=function(tableId){ // ex: '#my-table'
            var exportHref=Excel.tableToExcel(tableId,'Users');
            $timeout(function(){location.href=exportHref;},100); // trigger download
        }
		
        $scope.copyToClipboard = function (name) {
            var copyElement = document.createElement("textarea");
            copyElement.style.position = 'fixed';
            copyElement.style.opacity = '0';
            copyElement.textContent = decodeURI(name);
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(copyElement);
            copyElement.select();
            document.execCommand('copy');
            body.removeChild(copyElement);

            //custom toastr
            toastr.options = {
                "closeButton": false,
                "progressBar": true,
                "timeOut": 2300,
                "positionClass": "toast-top-left",
                "onclick": null
            }
            toastr.info('Copy ' + name + ' Success !');
        }

        // get all user
        DataApi.getAlluser().then(function (response) {
            if (response.data.error_code === 0) {
                $scope.all_user = [];
                response.data.users.forEach(element => {
                    if (element.role[0].id !== 1) {
                        $scope.all_user.push(element);
                    }
                });
                $scope.user_bk = [];
                $scope.user_gold = [];
                $scope.user_silver = [];
                $scope.user_normal = [];

                $scope.all_user.forEach(function (item) {
                    if (item.user_class[0].id === 4) {
                        $scope.user_normal.push(item);
                        $scope.user_normal_per = ($scope.user_normal.length / $scope.all_user.length) * 100;
                    } else if (item.user_class[0].id === 3) {
                        $scope.user_silver.push(item);
                        $scope.user_silver_per = ($scope.user_silver.length / $scope.all_user.length) * 100;
                    } else if (item.user_class[0].id === 2) {
                        $scope.user_gold.push(item);
                        $scope.user_gold_per = ($scope.user_gold.length / $scope.all_user.length) * 100;
                    } else if (item.user_class[0].id === 1) {
                        $scope.user_bk.push(item);
                        $scope.user_bk_per = ($scope.user_bk.length / $scope.all_user.length) * 100;
                    }
                });


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
        //

        // get user id
        $scope.get_id_user = function (id) {
            for (var i = 0; i < $scope.all_user.length; i++) {
                if (id === $scope.all_user[i]._id) {
                    $scope.detail = $scope.all_user[i];
                }
            }
			}

        $scope.set_is_block = function () {
            $timeout(function () {
                $scope.block = false;
            }, 1000);
        }

        $scope.set_is_del = function () {
            $timeout(function () {
                $scope.del = false;
            }, 1000);
        }

        $scope.set_is_active = function () {
            $timeout(function () {
                $scope.active = false;
            }, 1000);
        }

        // block user by id
        $scope.block_user = function (id) {
            DataApi.blockUser(id).then(function (response) {
                if (response.data.error_code === 0) {
                    DataApi.getAlluser().then(function (response) {
                        $scope.all_user = [];
                        response.data.users.forEach(element => {
                            if (element.role[0].id !== 1) {
                                $scope.all_user.push(element);
                            }
                        });
                    });
                    $timeout(function () {
                        $scope.block = true;
                        $scope.$apply();
                    }, 100)
                }
            });
        }

        // del user by id
        $scope.del_user = function (id) {
            DataApi.delUser(id).then(function (response) {
                if (response.data.error_code === 0) {
                    DataApi.getAlluser().then(function (response) {
                        $scope.all_user = [];
                        response.data.users.forEach(element => {
                            if (element.role !== 1) {
                                $scope.all_user.push(element);
                            }
                        });
                    });
                    $timeout(function () {
                        $scope.del = true;
                        $scope.$apply();
                    }, 100)
                }
            });
        }

        // active user by id
        $scope.active_user = function (id) {
            DataApi.activeUser(id).then(function (response) {
                if (response.data.error_code === 0) {
                    DataApi.getAlluser().then(function (response) {
                        $scope.all_user = [];
                        response.data.users.forEach(element => {
                            if (element.role[0].id !== 1) {
                                $scope.all_user.push(element);
                            }
                        });
                    });
                    $timeout(function () {
                        $scope.active = true;
                        $scope.$apply();
                    }, 100)
                }
            })
        }

    })