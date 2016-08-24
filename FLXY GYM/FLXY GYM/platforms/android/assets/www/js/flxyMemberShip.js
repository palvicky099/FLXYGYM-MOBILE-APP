app.controller('flxyMemberShipCtrl', function ($scope, dataService, $ionicPlatform) {
    $ionicPlatform.onHardwareBackButton(function () {
        $state.go('app.dashboard');
    });
	dataService.membership().then(function (res) {
	    $scope.memberShip = res.data.response;
	})
})