app.controller('myBookingOrderDetailsCtrl', function ($scope, dataService, $ionicPlatform, $rootScope, $cordovaSQLite, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
        $ionicPlatform.onHardwareBackButton(function () {
            $state.go('tab.dailyOrder');
        });
        $scope.errSrc = "http://www.businessislamica.com/xml/no_available_image.gif";
        var noteQuery = "select * from dateOrderDetails where order_id = '" + $rootScope.bookingDetails + "'";
        $cordovaSQLite.execute(db, noteQuery, []).then(function (result) {
            var itemsColl = [];
            $scope.sumAmount = 0;
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    itemsColl[i] = result.rows.item(i);
                    $scope.sumAmount = $scope.sumAmount + parseInt(itemsColl[i].price);
                }
                var jsonData = JSON.parse(JSON.stringify(itemsColl));
                $scope.bookingDetails = jsonData;
            }
            else {
                $scope.bookingDetails = [];
            }
        }, function (err) {
            console.error(err);
        })
    })
});