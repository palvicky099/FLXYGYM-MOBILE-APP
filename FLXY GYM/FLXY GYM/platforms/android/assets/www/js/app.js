// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;
var app = angular.module('app', ['ionic', 'starter.controllers', 'ngCordova', 'ionic.rating', 'starter.services', 'ionicLazyLoad'])
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
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('login', {
      url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
           })
    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'dashboardCtrl'
        }
      }
    })
    .state('register', {
           url: "/register",
           templateUrl: "templates/register.html",
           controller: 'registerCtrl'

       })
    .state('otp', {
           url: "/otp",
           templateUrl: "templates/otp.html",
           controller: 'registerCtrl'
     })
      .state('feeds', {
           url: "/feeds",
           templateUrl: "templates/feeds.html",
           controller: 'feedsCtrl'

      })
       .state('feedback', {
           url: "/feedback",
           templateUrl: "templates/feedback.html",
           controller: 'feedbackCtrl'

       })
       .state('events', {
           url: "/events",
           templateUrl: "templates/events.html",
           controller: 'eventsCtrl'
       })
        .state('placenearby', {
           url: "/placenearby",
           templateUrl: "templates/placenearby.html",
           controller: 'placenearbyCtrl'
       })
          .state('profile', {
           url: "/profile",
           templateUrl: "templates/profile.html",
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
           templateUrl: "templates/detail.html",
           controller: 'detailCtrl'
       })
           .state('distanceMap', {
           url: "/distanceMap",
           templateUrl: "templates/distanceMap.html",
           controller: 'distanceMapCtrl'
       })
           .state('bookDate', {
           url: "/bookDate",
           templateUrl: "templates/bookDate.html",
           controller: 'bookDateCtrl'
       })
             .state('cart', {
           url: "/cart",
           templateUrl: "templates/cart.html",
           controller: 'cartCtrl'
       })
             .state('orderDetail', {
           url: "/orderDetail",
           templateUrl: "templates/orderDetail.html",
           controller: 'orderDetailCtrl'
       })
               .state('gymGallary', {
           url: "/gymGallary",
           templateUrl: "templates/gymGallary.html",
           controller: 'detailCtrl'
       })
                   .state('flxyMemberShip', {
           url: "/flxyMemberShip",
           templateUrl: "templates/flxyMemberShip.html",
           controller: 'flxyMemberShipCtrl'
       })
           .state('forgotPassword', {
           url: "/forgotPassword",
           templateUrl: "templates/forgotPassword.html",
           controller: 'forgotPasswordCtrl'
           })
       .state('newPassword', {
           url: "/newPassword",
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
});
