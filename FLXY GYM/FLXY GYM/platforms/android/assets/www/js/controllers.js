var  app = angular.module('starter.controllers', [])

app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicSideMenuDelegate, $state, $window) {
    $scope.dashList = JSON.parse(window.localStorage.getItem("UserProfile"));
 $scope.toggleLeftSideMenu = function() {
     $ionicSideMenuDelegate.toggleLeft();
     $scope.dashList = JSON.parse(window.localStorage.getItem("UserProfile"));
 };

 $scope.logOut = function () {
     $window.localStorage.clear();
     $state.go('login')
 }
 $scope.errSrc = "https://proseawards.com/wp-content/uploads/2015/08/no-profile-pic.png";
})

