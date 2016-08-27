app.controller('aboutCtrl', function ($scope, $cordovaInAppBrowser, $rootScope, $state) {
    $scope.faq = function () {
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes'
        };
        $cordovaInAppBrowser.open('http://www.flxygym.com/home/faq.php', '_faq', options)
              .then(function(event) {
              })
              .catch(function(event) {
              });
    }
    $scope.terms = function () {
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes'
        };
        $cordovaInAppBrowser.open('http://www.flxygym.com/home/terms.php', '_terms', options)
              .then(function (event) {
              })
              .catch(function (event) {
              });
    }
    $scope.goAboutUsPage = function(a)
    {
        if(a == 'about')
        {
            $rootScope.aboutTitle = 'ABOUT US';
            $state.go('aboutUs')
        }
        else {
            $rootScope.aboutTitle = 'SOCIAL CONNECT';
            $state.go('aboutUs')
        }
    }



})
