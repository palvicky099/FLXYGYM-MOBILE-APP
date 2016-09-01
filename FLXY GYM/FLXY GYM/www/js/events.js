app.controller('eventsCtrl', function ($scope, $state, dataService, $ionicPlatform, $cordovaCalendar, $ionicLoading, $cordovaLocalNotification) {
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
        dataService.events().then(function (res) {
            if (res.data.message == "success")
            {
                $scope.eventsData = res.data.response;
                console.log(res)
            }
        })
//    $scope.goDetail=function(l){
//window.localStorage.setItem("itemDetails", JSON.stringify(l));
//$state.go('detail');
//    }
        $scope.addToCalender = function (l) {
        $cordovaCalendar.createEvent({
            title: l.event_name + " " + "[" + l.event_type + "]",
            location: l.address,
            notes: l.about,
            startDate: new Date(2016, 0, 6, 18, 30, 0, 0, 0),
            endDate: new Date(2016, 1, 6, 12, 0, 0, 0, 0)
        }).then(function (result) {
            $ionicLoading.show({ template: "Event added to calender", noBackdrop: false, duration: 2000 });
            localNotification('FLXY Gym', 'Event added to calender');
        }, function (err) {
        });
        }

        function localNotification(a, b) {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: a,
                text: b,
                data: {
                    customProperty: 'custom value'
                }
            }).then(function (result) {
                // ...
            });
        };

})
})
