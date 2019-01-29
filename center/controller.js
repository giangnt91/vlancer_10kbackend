var coupon = angular.module('AdminController', ['ngRoute', 'ngTagsInput', 'AdminService', 'datatables', 'angular-md5', 'btford.socket-io', 'socialLogin']);
coupon
  .controller('HomeCtrl', function ($rootScope, $location, $route, $templateCache, $scope, $window, DataApi, $timeout, socialLoginService) {

    $scope.auth = JSON.parse(localStorage.getItem('auth'));

    if (!$scope.auth) {
      // window.location.href = '#/';
      // $window.location.reload(true);
    } else {
      // if ($scope.auth[0].role[0].id === 2) {
      //   window.location.href = '#/manager';
      // }
      // get all shop
	  
      
	  DataApi.getAllshop().then(function (response) {
        $scope.shop_result = [];
        response.data.shop.forEach(element => {
          if (element.shop_rank.length > 0) {
            $scope.shop_result.push(element);
          }
        });
        if (response.data.error_code === 0) {
          $scope.shop_vip = [];
          $scope.shop_normal = [];
          $scope.shop_top = [];

          for (var i = 0; i < $scope.shop_result.length; i++) {
            if ($scope.shop_result[i].status === false) {
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
          let x;

          $scope.all_user.forEach(function (item) {
            if (item.user_class[0].id === 4) {
              $scope.user_normal.push(item);
              x = ($scope.user_normal.length / $scope.all_user.length) * 100;
              $scope.user_normal_per = parseFloat(x).toFixed(2);
            } else if (item.user_class[0].id === 3) {
              $scope.user_silver.push(item);
              x = ($scope.user_silver.length / $scope.all_user.length) * 100;
              $scope.user_silver_per = parseFloat(x).toFixed(2);
            } else if (item.user_class[0].id === 2) {
              $scope.user_gold.push(item);
              x = ($scope.user_gold.length / $scope.all_user.length) * 100;
              $scope.user_gold_per = parseFloat(x).toFixed(2);
            } else if (item.user_class[0].id === 1) {
              $scope.user_bk.push(item);
              x = ($scope.user_bk.length / $scope.all_user.length) * 100;
              $scope.user_bk_per = parseFloat(x).toFixed(2);
            }
          });
        }
      });
      //

      //menu
      $scope.go_home = function () {
        // window.location.href = '/home';
        $location.path('/quan-ly/trang-chu');
        $window.scrollTo(0, 0);
        // window.location.reload(true);

      }

      $scope.go_action = function () {
        // window.location.href = '/action';
        $location.path('/quan-ly/tac-vu');
        $window.scrollTo(0, 0);
        // window.location.reload(true);
      }

      $scope.go_user = function () {
        // window.location.href = '/users';
        $location.path('/quan-ly/thanh-vien');
        $window.scrollTo(0, 0);
        // window.location.reload(true);
      }

      $scope.go_shop = function () {
        // $window.location.href = '/shop';
        $location.path('/quan-ly/cua-hang');
        $window.scrollTo(0, 0);
        // window.location.reload(true);
      }

      $scope.go_coupon = function () {
        // $window.location.href = '/coupon';
        $location.path('/quan-ly/duyet-coupon');
        $window.scrollTo(0, 0);
        // window.location.reload(true);
      }

      $scope.go_data_coupon = function () {
        // $window.location.href = '/data';
        $location.path('/quan-ly/du-lieu-coupon');
        $window.scrollTo(0, 0);
        // window.location.reload(true);
      }

      $scope.go_basic = function () {
        // $window.location.href = '/basic';
        $location.path('/quan-ly/ma-giam-gia');
        $window.scrollTo(0, 0);
        // window.location.reload(true);
      }

      $scope.go_slider = function () {
        $location.path('/quan-ly/slider');
        $window.scrollTo(0, 0);
      }

      // for shop
      $scope.go_manager = function () {
        // $window.location.href = '/manager';
        $location.path('/cua-hang/trang-chu');
        $window.scrollTo(0, 0);
        // window.location.reload(true);
      }

      $scope.go_shop_coupon = function () {
        // $window.location.href = '/scoupon';
        $location.path('/cua-hang/quan-ly-coupon');
        $window.scrollTo(0, 0);
        // window.location.reload(true);
      }
      // end

      $scope.go_login = function () {
        // $window.location.href = '/';
        $location.path('/');
        socialLoginService.logout();
        FB.logout(function(response) {
        });
        localStorage.clear();
        $window.scrollTo(0, 0);
        $window.location.reload(true);
      }
    }
  })