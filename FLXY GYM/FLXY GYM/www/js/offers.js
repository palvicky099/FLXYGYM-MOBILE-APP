app.controller('offersCtrl', function ($scope, $state, dataService, $ionicPlatform) {
    $scope.$on('$ionicView.enter', function () {
        $ionicPlatform.onHardwareBackButton(function () {
            $state.go('app.dashboard');
        });
	dataService.offers().then(function (res) {
	    if (res.data.message == "success") {
	        $scope.offers = res.data.response;
	        console.log(res)
	    }
	})
    $scope.goDetail=function(l){
        window.localStorage.setItem("itemDetails", JSON.stringify(l));
        window.localStorage.setItem("backFromBookDate", "offers");
        $state.go('detail');
    }
})
})
