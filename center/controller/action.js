coupon
    .controller('ActionCtrl', function ($rootScope, $location, $scope, $window, DataApi, DTOptionsBuilder, $timeout, Excel) {
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
			var exportHref = Excel.tableToExcel(tableId, 'Basic');
			$timeout(function () { location.href = exportHref; }, 100);
		}

        // get all action
        DataApi.getAllaction().then(function (response) {
            if (response.data.error_code === 0) {
                $scope.all_action = response.data.action;

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

        // get all reaction
        DataApi.getAllreaction().then(function (response) {
            if (response.data.error_code === 0) {
                $scope._all_action_like_comment = response.data.reaction;

                // var reaction_detail = [];
                var like = 0;
                var com = 0;

                $scope.return_like = function (id) {
                    $scope._all_action_like_comment.forEach(element => {
                        if (element.id_post_reaction === id) {
                            if (element.kind_reaction[0].id === 1) {
                                like += 1;
                            }
                        }
                    });
                    $scope.like = like;
                    like = 0;
                }

                $scope.return_com = function (id) {
                    $scope._all_action_like_comment.forEach(element => {
                        if (element.id_post_reaction === id) {
                            if (element.kind_reaction[0].id === 2) {
                                com += 1;
                            }
                        }
                    });
                    $scope.com = com;
                    com = 0;
                }
            }
        })


        // create new action
        $scope.create_action = function (data) {
            if (data !== undefined && data !== null) {
                if (data.shopid === undefined || data.shopid === "" || data.actionid === undefined || data.actionid === "" || data.actionurl === undefined || data.actionurl === "" || data.like === undefined || data.like === "" || data.comment === undefined || data.comment === "") {
                    $scope.error = true;
                    $timeout(function () {
                        $scope.error = false;
                        $scope.$apply();
                    }, 2500);
                } else {
                    var enday = $('#aenday').val();
                    DataApi.createAction(data.actionurl, data.actionid, data.shopid, enday, data.like, data.comment).then(function (response) {
                        if (response.data.error_code === 0) {
                            DataApi.getAllaction().then(function (response) {
                                $scope.all_action = response.data.action;
                            });

                            $scope.success = true;
                            data.shopid = "";
                            data.actionid = "";
                            data.actionurl = "";
                            data.like = "";
                            data.comment = "";
                            $('#aenday').val(null)

                            $timeout(function () {
                                $scope.success = false;
                                $scope.$apply();
                            }, 2500);
                        } else {
                            $scope.server_error = true;
                            $scope.error_message = response.data.message;
                            data.shopid = "";
                            data.actionid = "";
                            data.actionurl = "";
                            data.like = "";
                            data.comment = "";
                            $('#aenday').val(null)

                            $timeout(function () {
                                $scope.server_error = false;
                                $scope.$apply();
                            }, 2500);
                        }
                    });
                }
            } else {
                $scope.error = true;
                $timeout(function () {
                    $scope.error = false;
                    $scope.$apply();
                }, 2500);
            }
        }

        $scope.ActionStatus = [
            {
                id: 1,
                name: "Hoạt Động"
            },
            {
                id: 2,
                name: "Ngưng Hoạt Động"
            }
        ]

        // get action id
        $scope.get_id_action = function (id) {
            for (var i = 0; i < $scope.all_action.length; i++) {
                if (id === $scope.all_action[i]._id) {
                    $scope.detail = $scope.all_action[i];
                    $('#uaenday').val($scope.detail.action_expiredday);
                    $scope.ActionStatus.forEach(element => {
                        if(element.id === $scope.detail.action_status[0].id){
                            $scope.chooseStatus = element;
                        }
                    })
                }
            }
        }


        // edit action by id
        $scope.edit = function (data) {
            if (data !== undefined && data !== null) {
                if (data.action_shop_id === undefined || data.action_shop_id === "" || data.action_id === undefined || data.action_id === "" || data.action_url === undefined || data.action_url === "" || data.action_likemax === undefined || data.action_likemax === "" || data.action_commentmax === undefined || data.action_commentmax === "") {
                    $scope.error = true;
                    $timeout(function () {
                        $scope.error = false;
                        $scope.$apply();
                    }, 2500);
                } else {
                    var day = $('#uaenday').val();

                    var _status;
                    if(day === undefined || day === null || day === ''){
                        day = $scope.detail.action_expiredday;
                    }

                    if($scope.chooseStatus.id !== $scope.detail.action_status[0].id){
                        _status = {
                            id: $scope.chooseStatus.id,
                            name: $scope.chooseStatus.name
                        }
                    }else{
                        _status = {
                            id: $scope.detail.action_status[0].id,
                            name: $scope.detail.action_status[0].name
                        }
                    }

                    DataApi.updateAction(data._id, data.action_url, data.action_id, data.action_shop_id, JSON.stringify(data.action_user), day, data.action_likemax, data.action_commentmax, _status).then(function (response) {
                        if (response.data.error_code === 0) {
                            DataApi.getAllaction().then(function (response) {
                                $scope.all_action = response.data.action;
                            });
                            $scope.success = true;
                            $timeout(function () {
                                $scope.success = false;
                                $scope.$apply();
                            }, 2500);
                        } else {
                            $scope.server_error = true;
                            $timeout(function () {
                                $scope.server_error = false;
                                $scope.$apply();
                            }, 2500);
                        }
                    });
                }
            } else {
                $scope.error = true;
                $timeout(function () {
                    $scope.error = false;
                    $scope.$apply();
                }, 2500);
            }
        }

        $scope.set_is_del = function () {
            $scope.del = false;
        }

        // delete action by id
        $scope.delete = function (id) {
            DataApi.deleteAction(id).then(function (response) {
                if (response.data.error_code === 0) {
                    DataApi.getAllaction().then(function (response) {
                        $scope.all_action = response.data.action;
                    });
                    $timeout(function () {
                        $scope.del = true;
                        $scope.$apply();
                    }, 100)
                }
            });
        }

    })