app.controller('offersCtrl', function ($scope, $state, dataService, $ionicPlatform, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        if (navigator.connection.type == Connection.NONE) {
            $scope.noInternet = true;
        }
        else {
            $scope.noInternet = false;
        }
        $ionicPlatform.onHardwareBackButton(function () {
            $state.go('app.dashboard');
        });
	dataService.offers().then(function (res) {
	    if (res.data.message == "success") {
	        $scope.offers = res.data.response;
	        console.log(res)
	    }
	})
	$scope.goDetail = function (l) {
	    $rootScope.detailsItems = l;
	    $rootScope.detailsItems.center_imgpath = "";
        window.localStorage.setItem("itemDetails", JSON.stringify(l));
        window.localStorage.setItem("goDetailsFrom", "offers");
        $state.go('detail');
    }
})
})
