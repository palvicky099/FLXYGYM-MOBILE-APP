app.controller('offersCtrl', function ($scope, $state, dataService) {
$scope.$on('$ionicView.enter', function () {
	dataService.offers().then(function (res) {
	    if (res.data.message == "success") {
	        $scope.offers = res.data.response;
	        console.log(res)
	    }
	})
    $scope.goDetail=function(l){
window.localStorage.setItem("itemDetails", JSON.stringify(l));
$state.go('detail');
    }
})
})
