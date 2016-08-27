app.controller('aboutUsCtrl', function ($scope, $cordovaInAppBrowser, $rootScope) {
    $scope.social = function (url) {
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes'
        };
        $cordovaInAppBrowser.open(url, '_SocialOpen', options)
              .then(function (event) {
              })
              .catch(function (event) {
              });
    }
})
