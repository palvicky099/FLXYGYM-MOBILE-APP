// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;
var app = angular.module('app', ['ionic', 'starter.controllers', 'ngCordova', 'ionic.rating', 'starter.services', 'ionicLazyLoad', 'jrCrop'])
.run(function ($ionicPlatform, $cordovaSQLite, $rootScope) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        db = window.openDatabase("FLXY.db", "1.0", "FLXYGYM", 500000);
       // db = $cordovaSQLite.openDB('WD.db');
        //--------------GYM center table------------------
        $cordovaSQLite.execute(db,
            "CREATE TABLE IF NOT EXISTS gymCenter (id integer primary key,cat_id text, center_id text, " +
                                  " center_name text, center_imgpath text, price text, price_id text, address text , branch_addr text," +
                                  " center_slot_data text, grade text, grade_id text, landmark text, latitude text, longitude text, " +
                                  " margin text, s_id text, s_name text, seats_perday text, distance text, location text, loc_id text)");
               });
    if (window.localStorage.getItem("isLogin") == "yes")
        {
        setTimeout(function () {
            if (navigator.connection.type == Connection.NONE) {
            }
            else {
             $rootScope.categoryLoad();
            }
        }, 2000)
        }
       })

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
 //$ionicConfigProvider.views.transition('none');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.tabs.position('bottom');
  $stateProvider
    .state('app', {
        url: '/app',
        cache: false,
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('login', {
      url: '/login',
      cache: false,
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
           })
    .state('app.dashboard', {
        url: '/dashboard',
        cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'dashboardCtrl'
        }
      }
    })
    .state('register', {
        url: "/register",
        cache: false,
           templateUrl: "templates/register.html",
           controller: 'registerCtrl'

    })
       .state('myOrder', {
           url: "/myOrder",
           cache: false,
           templateUrl: "templates/myOrder.html",
           controller: 'myOrderCtrl'

       })
    .state('otp', {
        url: "/otp",
        cache: false,
           templateUrl: "templates/otp.html",
           controller: 'registerCtrl'
     })
      .state('offers', {
          url: "/offers",
          cache: false,
          templateUrl: "templates/offers.html",
          controller: 'offersCtrl'

      })
       .state('feedback', {
           url: "/feedback",
           cache: false,
           templateUrl: "templates/feedback.html",
           controller: 'feedbackCtrl'

       })
       .state('events', {
           url: "/events",
           cache: false,
           templateUrl: "templates/events.html",
           controller: 'eventsCtrl'
       })
        .state('placenearby', {
            url: "/placenearby",
            cache: false,
           templateUrl: "templates/placenearby.html",
           controller: 'placenearbyCtrl'
       })
          .state('profile', {
              url: "/profile",
              cache: false,
           templateUrl: "templates/profile.html",
           controller: 'profileCtrl'
          })
       .state('displayProfile', {
           url: "/displayProfile",
           cache: false,
           templateUrl: "templates/displayProfile.html",
           controller: 'profileCtrl'
       })
          .state('list', {
           url: "/list",
           cache: false,
           templateUrl: "templates/list.html",
           controller: 'listCtrl'
       })
          .state('detail', {
              url: "/detail",
              cache: false,
           templateUrl: "templates/detail.html",
           controller: 'detailCtrl'
       })
           .state('distanceMap', {
               url: "/distanceMap",
               cache: false,
           templateUrl: "templates/distanceMap.html",
           controller: 'distanceMapCtrl'
       })
           .state('bookDate', {
               url: "/bookDate",
               cache: false,
           templateUrl: "templates/bookDate.html",
           controller: 'bookDateCtrl'
       })
             .state('cart', {
                 url: "/cart",
                 cache: false,
           templateUrl: "templates/cart.html",
           controller: 'cartCtrl'
       })
             .state('orderDetail', {
                 url: "/orderDetail",
                 cache: false,
           templateUrl: "templates/orderDetail.html",
           controller: 'orderDetailCtrl'
       })
        .state('payuBiz', {
            url: "/payuBiz",
            cache: false,
            templateUrl: "templates/payuBiz.html",
            controller: 'orderDetailCtrl'
        })
      .state('gymGallary', {
          url: "/gymGallary",
          cache: false,
           templateUrl: "templates/gymGallary.html",
           controller: 'detailCtrl'
       })
                   .state('flxyMemberShip', {
                       url: "/flxyMemberShip",
                       cache: false,
           templateUrl: "templates/flxyMemberShip.html",
           controller: 'flxyMemberShipCtrl'
       })
           .state('forgotPassword', {
               url: "/forgotPassword",
               cache: false,
           templateUrl: "templates/forgotPassword.html",
           controller: 'forgotPasswordCtrl'
           })
       .state('newPassword', {
           url: "/newPassword",
           cache: false,
           templateUrl: "templates/newPassword.html",
           controller: 'forgotPasswordCtrl'
       })
    ;

  if (window.localStorage.getItem("isLogin") == "yes")
  {
      $urlRouterProvider.otherwise('/app/dashboard');
  }
  else {
      $urlRouterProvider.otherwise('/login');
  }
})
app.factory('Camera', function ($q) {

    return {
        getPicture: function (options) {
            var q = $q.defer();

            navigator.camera.getPicture(function (result) {
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            }, options);

            return q.promise;
        }
    }

});

app.factory('backcallFactory', ['$state', '$ionicPlatform', '$ionicHistory', '$timeout', function ($state, $ionicPlatform, $ionicHistory, $timeout) {
    var obj = {}
    obj.backcallfun = function () {
        $ionicPlatform.registerBackButtonAction(function () {
            if ($state.current.name == "app.dashboard" || $state.current.name == "login") {
                var action = confirm("Do you want to Exit?");
                if (action) {
                    navigator.app.exitApp();
                }
            }
            else if ($state.current.name == "flxyMemberShip" || $state.current.name == "feedback" || $state.current.name == "myOrder") {
                $state.go('app.dashboard');
            }
            //else if ($state.current.name == "tab2.attend" || $state.current.name == "tab2.notAttend" || $state.current.name == "tab2.graph" || $state.current.name == "tab2.table") {
            //    $state.go('tab.scanning');
            //}

            //else if ($state.current.name == "app.activities") {
            //    $state.go('events');
            //}
            else {
                $ionicHistory.nextViewOptions({
                    disableBack: false
                });
                $ionicHistory.goBack();
            }
        }, 100);
    }
    return obj;
}])
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};