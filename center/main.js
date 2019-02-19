angular.module('couponWeb', ['ngRoute', 'AdminController', 'AdminService'])

  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider

      // Pages for admin
      .when("/quan-ly/trang-chu", { templateUrl: "partials/home.html", controller: "HomeCtrl" })
      .when("/quan-ly/tac-vu", { templateUrl: "partials/action.html", controller: "ActionCtrl" })
      .when("/quan-ly/thanh-vien", { templateUrl: "partials/users.html", controller: "UsersCtrl" })
      .when("/quan-ly/cua-hang", { templateUrl: "partials/shop.html", controller: "ShopCtrl" })
      .when("/quan-ly/tao-cua-hang", { templateUrl: "partials/cshop.html", controller: "ShopCtrl" })
      .when("/quan-ly/cap-nhat-cua-hang/:idshop", { templateUrl: "partials/ushop.html", controller: "UpdateCtrl" })
      .when("/quan-ly/duyet-coupon", { templateUrl: "partials/coupon.html", controller: "CouponCtrl" })
      .when("/quan-ly/du-lieu-coupon", { templateUrl: "partials/data.html", controller: "CouponCtrl" })
      .when("/quan-ly/tao-coupon-moi", { templateUrl: "partials/ccoupon.html", controller: "cCouponCtrl" })
      .when("/quan-ly/ma-giam-gia", { templateUrl: "partials/basicode.html", controller: "BasicodeCtrl" })
      .when("/quan-ly/slider", { templateUrl: "partials/sliders.html", controller: "SliderCtrl" })
      .when("/", { templateUrl: "partials/login.html", controller: "AuthCtrl" })

      // Pages for shop
      .when('/cua-hang/trang-chu', { templateUrl: "partials/shopmanager.html", controller: "ManagerCtrl" })
      .when('/cua-hang/quan-ly-coupon', { templateUrl: "partials/shopcoupon.html", controller: "ShopcouponCtrl" })

      // else 404
      .otherwise({ redirectTo: '/' });

    $locationProvider
    $locationProvider.html5Mode(true);

  }])


  .config(function (socialProvider) {
    socialProvider.setFbKey({ appId: "1946240225621730", apiVersion: "v3.2" });
    socialProvider.setGoogleKey("1026230976029-cja0blpg6q54tq9pr6rru5rq9c6pducu.apps.googleusercontent.com");
  });
