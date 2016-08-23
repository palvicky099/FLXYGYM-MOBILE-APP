app.controller('eventsCtrl', function ($scope, $state, dataService, $ionicPlatform) {
    $scope.$on('$ionicView.enter', function () {
        $ionicPlatform.onHardwareBackButton(function () {
            $state.go('app.dashboard');
        });
        dataService.events().then(function (res) {
            if (res.data.message == "success")
            {
                $scope.eventsData = res.data.response;
                console.log(res)
            }
        })
    $scope.goDetail=function(l){
window.localStorage.setItem("itemDetails", JSON.stringify(l));
$state.go('detail');
    }
})
})
