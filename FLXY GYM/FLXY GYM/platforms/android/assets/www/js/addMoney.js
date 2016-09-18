app.controller('addMoneyCtrl', function ($scope, dataService, $ionicLoading, $cordovaInAppBrowser, $rootScope, $cordovaDialogs, $state) {
    $scope.selectAdd = function (a) {
            $scope.amount = a;
    }
    $scope.addMoney = function (amount) {
        if (amount == '' || amount == undefined)
        {
            $ionicLoading.show({
                template: 'Please enter amount',
                animation: 'fade-in',
                showBackdrop: true,
                noBackdrop: false,
                duration: 3000,
                maxWidth: 200,
                showDelay: 0
            });
        }
        else {
            loading();
            var walletModel = {
                "UserId": window.localStorage.getItem('UserId'),
                "Amount":amount
            }
            dataService.get_wallet(walletModel).then(function (res) {
                if (res.data.message == "success") {
                    $ionicLoading.hide();
                    var paymentUrl = "http://flxygym.com/home/api/payment_wallet.php?transactionid=" + res.data.transaction_id;
                    var options = {
                        location: 'yes',
                        clearcache: 'yes',
                        toolbar: 'no'
                    };
                    setTimeout(function () {
                        $cordovaInAppBrowser.open(paymentUrl, 'wallet_blank', options)
                       .then(function (event) {
                         //  $state.go('myOrder')
                       })
                       .catch(function (event) {
                       });
                    }, 3000)
                }
                else {
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        noBackdrop: false,
                        template: res.data.message,
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        duration: 3000,
                        maxWidth: 200,
                        showDelay: 0
                    });
                }
            }, function (err) {
                $ionicLoading.hide();
            })
        }
    }
    $rootScope.$on('$cordovaInAppBrowser:loadstart', function (e, event) {
        if (event.url == "http://flxygym.com/home/api/success.php") {
            $state.go('app.dashboard');
            $cordovaInAppBrowser.close();
            $cordovaDialogs.alert('Your slot book successfully', 'Thank you', 'OK')
            .then(function () {
            });
        }
        if (event.url == "http://flxygym.com/home/api/failure.php") {
          ///  $state.go('app.dashboard');
            $cordovaInAppBrowser.close();
            $cordovaDialogs.alert('Transaction failed', 'Sorry', 'OK')
                      .then(function () {
                          
                      });
        }
    });
    $rootScope.$on('$cordovaInAppBrowser:loadstop', function (e, event) {
    });
    $rootScope.$on('$cordovaInAppBrowser:loaderror', function (e, event) {

    });

    $rootScope.$on('$cordovaInAppBrowser:exit', function (e, event) {
        $state.go('app.dashboard');
    });
    function loading() {
        $ionicLoading.show({
            noBackdrop: false,
            template: '<ion-spinner icon="lines"/>',
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            duration: 3000,
            maxWidth: 200,
            showDelay: 0
        });
    }
})
