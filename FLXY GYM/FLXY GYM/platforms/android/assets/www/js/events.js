app.controller('eventsCtrl', function ($scope, $state, dataService) {
    $scope.$on('$ionicView.enter', function () {
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
