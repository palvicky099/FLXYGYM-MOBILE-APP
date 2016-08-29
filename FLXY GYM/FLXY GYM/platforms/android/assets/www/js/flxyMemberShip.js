app.controller('flxyMemberShipCtrl', function ($scope, dataService, $ionicPlatform) {
    $ionicPlatform.onHardwareBackButton(function () {
        $state.go('app.dashboard');
    });
	dataService.membership().then(function (res) {
	    $scope.memberShip = res.data.response;
	})

	$scope.dcustom = true;
	$scope.dailyCustom = function () {
	    $scope.dcustom = $scope.dcustom === false ? true : false;
	};



	$scope.gcustom = true;
	$scope.gymCustom = function () {
	    $scope.gcustom = $scope.gcustom === false ? true : false;
	};


	$scope.fcustom = true;
	$scope.flxyCustom = function () {
	    $scope.fcustom = $scope.fcustom === false ? true : false;
	};
})