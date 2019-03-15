angular.module('AdminService', [])
    .factory('DataApi', function ($http) {
        // var api_gateway_url = 'http://35.240.165.98:2018';
        var api_gateway_url = 'https://api.coupon10k.com';
        // var api_gateway_url = 'http://localhost:2018';
        var parameter;
        var url;
        var header = { header: { 'Conntent-Type': 'application/x-www-form-urlencoded' } };
        var _header = { transformRequest: angular.identity, headers: { 'Content-Type': undefined } };

        return {
			getAuthToken: function () {
				url = api_gateway_url + '/authtoken';
				return $http.post(url, parameter, header);
			},
            AccessToken: function (_id, access_token) {
				parameter = JSON.stringify({
					_id: _id,
					access_token: access_token
				})
				url = api_gateway_url + '/accesstoken';
				return $http.post(url, parameter, header);
			},
            getAuthToken: function () {
                url = api_gateway_url + '/authtoken';
                return $http.post(url, parameter, header);
            },
            signIn: function (user_id, user_img) {
                parameter = JSON.stringify({ user_id: user_id, user_img: user_img });
                url = api_gateway_url + '/signin';
                return $http.post(url, parameter, header);
            },
            signUp: function (user_id, user_img, info, point_per_day, point_per_today, total_slot, _class, download, count_access_time, point_plus, point_bad, total_list_coupon, empty_slot, use_coupon, call_server_in_day, role, _status) {
                parameter = JSON.stringify({
                    user_id: user_id,
                    user_img: user_img,
                    info: info,
                    point_per_day: point_per_day,
                    point_per_today: point_per_today,
                    total_slot: total_slot,
                    user_class: _class,
                    download: download,
                    count_access_time: count_access_time,
                    point_plus: point_plus,
                    point_bad: point_bad,
                    total_list_coupon: total_list_coupon,
                    empty_slot: empty_slot,
                    use_coupon: use_coupon,
                    call_server_in_day: call_server_in_day,
                    role: role,
                    _status: _status
                });
                url = api_gateway_url + '/signup';
                return $http.post(url, parameter, header);
            },
            blockUser: function (user_id) {
                parameter = JSON.stringify({
                    _id: user_id
                });
                url = api_gateway_url + '/blocku';
                return $http.post(url, parameter, header);
            },
            activeUser: function (user_id) {
                parameter = JSON.stringify({ _id: user_id });
                url = api_gateway_url + '/activeu';
                return $http.post(url, parameter, header);
            },
            delUser: function (user_id) {
                parameter = JSON.stringify({ _id: user_id });
                url = api_gateway_url + '/delu';
                return $http.post(url, parameter, header);
            },
            getAllshop: function () {
                url = api_gateway_url + '/getshop';
                return $http.post(url, parameter, header);
            },
            getAlluser: function () {
                url = api_gateway_url + '/alluser';
                return $http.post(url, parameter, header);
            },
            getNewuser: function () {
                url = api_gateway_url + '/getNewuser';
                return $http.post(url, parameter, header);
            },
            getAllaction: function () {
                url = api_gateway_url + '/allaction';
                return $http.post(url, parameter, header);
            },
            createAction: function (action_url, action_id, action_shop_id, action_expiredday, action_likemax, action_commentmax) {
                parameter = JSON.stringify({
                    action_kind: 2,
                    action_url: action_url,
                    action_id: action_id,
                    action_shop_id: action_shop_id,
                    action_user: [],
                    action_expiredday: action_expiredday,
                    action_likemax: action_likemax,
                    action_commentmax: action_commentmax
                });
                url = api_gateway_url + '/caction';
                return $http.post(url, parameter, header);
            },
            updateAction: function (_id, action_url, action_id, action_shop_id, action_user, action_expiredday, action_likemax, action_commentmax, _status) {
                parameter = JSON.stringify({
                    _id: _id,
                    action_kind: 2,
                    action_url: action_url,
                    action_id: action_id,
                    action_shop_id: action_shop_id,
                    action_user: action_user,
                    action_expiredday: action_expiredday,
                    action_likemax: action_likemax,
                    action_commentmax: action_commentmax,
                    _status: _status
                });
                url = api_gateway_url + '/updateac';
                return $http.post(url, parameter, header);
            },
            deleteAction: function (_id) {
                parameter = JSON.stringify({ _id: _id });
                url = api_gateway_url + '/delac';
                return $http.post(url, parameter, header);
            },
            uploadImg: function (shop_id, avatar, cover, album) {

                var fd = new FormData();
                var img = [];
                var _album = [];
                var avatar_ex = avatar.name.substr(avatar.name.lastIndexOf('.') + 1);
                var cover_ex = cover.name.substr(cover.name.lastIndexOf('.') + 1);

                fd.append('shopId', shop_id);
                fd.append('avatar', avatar);
                fd.append('cover', cover);

                for (let i = 0; i < album.length; i++) {
                    fd.append("album" + (i + 1), album[i]);
                    _album.push(shop_id + '-album' + (i + 1) + '.' + album[i].name.substr(album[i].name.lastIndexOf('.') + 1));
                }

                img.push({
                    avatar: shop_id + '-avatar.' + avatar_ex,
                    cover: shop_id + '-cover.' + cover_ex,
                    album: _album,
                })

                fd.append('img', JSON.stringify(img));
                url = api_gateway_url + '/img';
                return $http.post(url, fd, _header);
            },
            uAvatar: function (shopId, avatar) {
                var fd = new FormData();
                var img = [];
                var avatar_ex = avatar.name.substr(avatar.name.lastIndexOf('.') + 1);

                fd.append('shopId', shopId);
                fd.append('avatar', avatar);
                img.push({
                    avatar: shopId + '-avatar.' + avatar_ex,
                })

                fd.append('img', JSON.stringify(img));
                url = api_gateway_url + '/avatar';
                return $http.post(url, fd, _header);
            },
            uCover: function (shopId, cover) {
                var fd = new FormData();
                var img = [];
                var cover_ex = cover.name.substr(cover.name.lastIndexOf('.') + 1);

                fd.append('shopId', shopId);
                fd.append('cover', cover);
                img.push({
                    cover: shopId + '-cover.' + cover_ex,
                })

                fd.append('img', JSON.stringify(img));
                url = api_gateway_url + '/cover';
                return $http.post(url, fd, _header);
            },
            uAlbum: function (shopId, album) {
                var fd = new FormData();
                var img = [];
                var _album = [];

                fd.append('shopId', shopId);
                for (let i = 0; i < album.length; i++) {
                    fd.append("album" + (i + 1), album[i]);
                    _album.push(shopId + '-album' + (i + 1) + '.' + album[i].name.substr(album[i].name.lastIndexOf('.') + 1));
                }
                img.push({
                    album: _album,
                })

                fd.append('img', JSON.stringify(img));
                url = api_gateway_url + '/album';
                return $http.post(url, fd, _header);
            },
            createShop: function (shopId, shop_boss, shop_manager, shop_status, shop_rank, shop_info) {
                parameter = JSON.stringify({
                    shopId: shopId,
                    shop_boss: shop_boss,
                    shop_manager: shop_manager,
                    shop_coupon: [],
                    server_coupon: [],
                    user_get_coupon: [],
                    expire_coupon: [],
                    shop_use_coupon: [],
                    wallet: 0,
                    shop_status: shop_status,
                    shop_rank: shop_rank,
                    shop_info: shop_info
                });
                url = api_gateway_url + '/cshop';
                return $http.post(url, parameter, header);
            },
            updateShop: function (_shop) {
                parameter = JSON.stringify({
                    shop: _shop
                });
                url = api_gateway_url + '/ushop';
                return $http.post(url, parameter, header);
            },
            getAllcoupon: function () {
                url = api_gateway_url + '/getallcoupon';
                return $http.post(url, parameter, header);
            },
            getAllreaction: function () {
                url = api_gateway_url + '/getreac';
                return $http.post(url, parameter, header);
            },
            acceptCoupon: function (shop_id, point) {
                parameter = JSON.stringify({
                    _id: shop_id,
                    point: point
                });
                url = api_gateway_url + '/approvedc';
                return $http.post(url, parameter, header);
            },
            cancelApproved: function (shop_id) {
                parameter = JSON.stringify({ _id: shop_id });
                url = api_gateway_url + '/cancelapproved';
                return $http.post(url, parameter, header);
            },
            ServerCreateC: function (id, coupon, issuer) {
                parameter = JSON.stringify({ _id: id, coupon: coupon, issuer: issuer });
                url = api_gateway_url + '/createcoupon';
                return $http.post(url, parameter, header);
            },
            getshopByboss: function (boss) {
                parameter = JSON.stringify({ boss: boss });
                url = api_gateway_url + '/getshopbyboss';
                return $http.post(url, parameter, header);
            },
            getShopbyId: function (_id) {
                parameter = JSON.stringify({
                    _id: _id
                });
                url = api_gateway_url + '/getshopbyid';
                return $http.post(url, parameter, header);
            },
            createHotDeal: (hotDeal) => {
                parameter = JSON.stringify({
                    hotDeal: hotDeal
                })
                url = api_gateway_url + '/chotdeal';
                return $http.post(url, parameter, header);
            },
            getHotDeal: () => {
                url = api_gateway_url + '/gethotdeal';
                return $http.get(url, header);
            },
            updateHotDeal: (hotDeal) => {
                parameter = JSON.stringify({
                    hotDeal: hotDeal
                })
                url = api_gateway_url + '/updatehotdeal';
                return $http.post(url, parameter, header);
            },
            delHotDel: (_id) => {
                parameter = JSON.stringify({
                    _id: _id
                })
                url = api_gateway_url + '/delhotdeal';
                return $http.post(url, parameter, header);
            },
            createEmarket: function (ename, eimg) {
                parameter = JSON.stringify({
                    ename: ename,
                    eimg: eimg
                })
                url = api_gateway_url + '/emarket';
                return $http.post(url, parameter, header);
            },
            updateEmarket: (Emarket) => {
                parameter = JSON.stringify({
                    Emarket: Emarket
                })
                url = api_gateway_url + '/updateemarket';
                return $http.post(url, parameter, header);
            },
            updateEmarketForCode: (Emarket) => {
                parameter = JSON.stringify({
                    Emarket: Emarket
                })
                url = api_gateway_url + '/updateemarketforcode';
                return $http.post(url, parameter, header);
            },
            getEmarket: function () {
                url = api_gateway_url + '/getemarket';
                return $http.post(url, parameter, header);
            },
            getAllbasic: function () {
                url = api_gateway_url + '/getbasic';
                return $http.post(url, parameter, header);
            },
            createBasic: function (Eid, Ename, Eimg, Code, Url, Industry, Info, ValueC, Expireday) {
                parameter = JSON.stringify({
                    Eid: Eid,
                    Ename: Ename,
                    Eimg: Eimg,
                    Code: Code,
                    Url: Url,
                    Industry: Industry,
                    Info: Info,
                    ValueC: ValueC,
                    Expireday: Expireday
                });
                url = api_gateway_url + '/basic';
                return $http.post(url, parameter, header);
            },
            UpdateBasic: function (_id, Eid, Ename, Eimg, Code, Url, Industry, Info, ValueC, Expireday) {
                parameter = JSON.stringify({
                    _id: _id,
                    Eid: Eid,
                    Ename: Ename,
                    Eimg: Eimg,
                    Code: Code,
                    Url: Url,
                    Industry: Industry,
                    Info: Info,
                    ValueC: ValueC,
                    Expireday: Expireday
                });
                url = api_gateway_url + '/updatebasic';
                return $http.post(url, parameter, header);
            },
            removebasic: function (_id) {
                parameter = JSON.stringify({
                    _id: _id
                });
                url = api_gateway_url + '/removebasic';
                return $http.post(url, parameter, header);
            },
            updateImgBasic: function (code_coupon, avatar) {
                var fd = new FormData();
                var img = [];
                var avatar_ex = avatar.name.substr(avatar.name.lastIndexOf('.') + 1);

                fd.append('shopId', code_coupon);
                fd.append('avatar', avatar);
                img.push({
                    avatar: code_coupon + '-avatar.' + avatar_ex,
                })

                fd.append('img', JSON.stringify(img));
                url = api_gateway_url + '/imgbasic';
                return $http.post(url, fd, _header);
            },
            CreateSlider: function (ShopId, Button, Url) {
                parameter = JSON.stringify({
                    ShopId: ShopId,
                    Button: Button,
                    Url: Url
                })
                url = api_gateway_url + '/cslider';
                return $http.post(url, parameter, header);
            },
            Upslider: function (_id, slider) {
                var fd = new FormData();
                var img = [];
                var slider_ex = slider.name.substr(slider.name.lastIndexOf('.') + 1);

                fd.append('shopId', _id);
                fd.append('slider', slider);
                img.push({
                    slider: _id + '-slider.' + slider_ex,
                })
                fd.append('img', JSON.stringify(img));
                url = api_gateway_url + '/slider';
                return $http.post(url, fd, _header);
            },
            GetSlider: function () {
                url = api_gateway_url + '/getslider';
                return $http.post(url, parameter, header);
            },
            RemoveSlider: function (_id) {
                parameter = JSON.stringify({
                    _id: _id
                });
                url = api_gateway_url + '/rmslider';
                return $http.post(url, parameter, header);
            },
            TransactionGetAll: () => {
                url = api_gateway_url + '/transactiongetall';
                return $http.get(url, header);
            },
            setCommission: (commission) => {
                url = api_gateway_url + '/setcommission';
                parameter = JSON.stringify({
                    com: commission
                })
                return $http.post(url, parameter, header);
            },
            getCommission: () => {
                url = api_gateway_url + '/getcommission';
                return $http.get(url, header);
            },
            getGifts: () => {
                url = api_gateway_url + '/getgifts';
                return $http.get(url, header);
            },
            getGift: (_id) => {
                url = api_gateway_url + '/getgift?_id=' + _id;
                return $http.get(url, header);
            },
            addGift: (gift) => {
                url = api_gateway_url + '/addgift';
                parameter = JSON.stringify({
                    gift: gift
                })
                return $http.post(url, parameter, header);
            },
            editGift: (gift) => {
                url = api_gateway_url + '/editgift';
                parameter = JSON.stringify({
                    gift: gift
                })
                return $http.post(url, parameter, header);
            }
        }
    })
    .factory('Thesocket', function (socketFactory) {
        var api_gateway_url = 'https://api.coupon10k.com';
        var socketConnection = io.connect(api_gateway_url);
        var socket = socketFactory({
            ioSocket: socketConnection
        });
        return socket;
    })
    .factory('Excel', function ($window) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
            format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
        return {
            tableToExcel: function (tableId, worksheetName) {
                var table = $(tableId),
                    ctx = { worksheet: worksheetName, table: table.html() },
                    href = uri + base64(format(template, ctx));
                return href;
            }
        };
    })

