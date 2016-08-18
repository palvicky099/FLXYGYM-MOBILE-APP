app.controller('feedbackCtrl', function ($scope, $state, $ionicLoading, dataService) {
    $scope.f = {};
    $scope.feedback = function (f) {
        if (f) {
            if (f.feed != undefined || f.feed != null || f.feed != '') {
                $scope.LoginData = JSON.parse(window.localStorage.getItem("LoginData"));
                var feedModel = {
                    "mobile": $scope.LoginData.mobile,
                    "message": f.feed
                }
                $ionicLoading.show({
                    noBackdrop: false,
                    template: '<p class="item"><ion-spinner icon="lines"/></p><p class="item flxy-button">Please Wait...</p>'
                });
                dataService.Feedback(feedModel).then(function (result) {
                    $ionicLoading.hide();
                    if (result.data.message == 'details found!') {
                        $ionicLoading.show({
                            template: 'Feedback send successfully',
                            animation: 'fade-in',
                            showBackdrop: true,
                            noBackdrop: true,
                            duration: 2000,
                            maxWidth: 200,
                            showDelay: 0
                        });
                        f.feed = '';
                      //  $state.go('app.dashboard')
                    }
                })
            }
            else {
            }
        }
    }
})
