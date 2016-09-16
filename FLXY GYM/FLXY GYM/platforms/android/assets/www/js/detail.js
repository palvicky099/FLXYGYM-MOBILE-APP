app.controller('detailCtrl', function ($scope, $cordovaDialogs, $state, $ionicLoading, dataService, $ionicPopup, $rootScope, $ionicPlatform) {
        $scope.goBack = function () {
            $state.go(window.localStorage.getItem("goDetailsFrom"));
        }
        $ionicPlatform.onHardwareBackButton(function () {
            $state.go(window.localStorage.getItem("goDetailsFrom"));
        });
        $scope.bannerUrl = '../img/logo.png'
        $scope.detailItem = $rootScope.detailsItems;
    //$scope.gymDetails = JSON.parse(window.localStorage.getItem("GYMDetails"));
        $scope.gymDetails = $rootScope.gymDetail;

        $scope.visible = {};
        dataService.gym_membership($scope.detailItem.center_id).then(function (res) {
            if (res.data.message == "success") {
                $scope.flxyGymData = res.data;
            }
            else {
                $scope.gymFacilites = [];
            }
        })
        dataService.gym_facilities($scope.detailItem.center_id).then(function (result) {
            if (result.data.message == "details found!") {
                $scope.gymFacilites = result.data.response;
            }
            else {
                $scope.gymFacilites = [];
            }
        })
        var msg = "This will do a booking for" + " " + $scope.detailItem.center_name + " " + "and center will contact you soon. Please go to My Booking to track the status";
        $scope.reserve = function () {
            var popup = $ionicPopup.show({
                'templateUrl': 'selectBookingType.html',
                'title': 'Select Plan',
                'scope': $scope,
                'buttons': [
                            {
                                'text': 'Cancel'
                            },
                            {
                                'text': 'Save',
                                'onTap': function (event) {
                                    return $scope.visible.status;
                                }
                            }
                ]
            });
            popup.then(function (result) {
                if (result == "0") {
                    window.localStorage.setItem("plan", result);
                    window.localStorage.setItem("bookType", "Daily Booking");
                    window.localStorage.setItem("backFromBookDate", "detail");
                    $state.go('bookDate');
                }
                if (result == "1") {
                    window.localStorage.setItem("plan", result);
                    window.localStorage.setItem("bookType", "Gym Booking");
                    window.localStorage.setItem("backFromBookDate", "detail");
                    $state.go('bookDate');
                }
                if (result == "2") {
                    window.localStorage.setItem("plan", result);
                    window.localStorage.setItem("bookType", "Flxy Booking");
                    window.localStorage.setItem("backFromBookDate", "detail");
                    $state.go('bookDate');
                }
            });
        }
        $scope.rating = {};
        $scope.rating.rate = 3.5;
        $scope.rating.max = 5;
        $scope.call = function () {
            var number = $scope.gymDetails[0].landline;
            if (number) {
                window.plugins.CallNumber.callNumber(onSuccess, onError, number, true);
                // var call = "tel:" + $scope.gymDetails[0].landline;
                // document.location.href = call;
            }
            else {
                $cordovaDialogs.confirm('No network available please try again later', 'Information', ['OK']);
            }
            function onSuccess(result) {
                console.log("Success:" + result);
            }
            function onError(result) {
                console.log("Error:" + result);
            }
        }
        $scope.errSrc = "https://www.oandbhotel.com/wp-content/themes/onb003/elements/ibe/img/no-room.jpg";
    })

app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });

            attrs.$observe('ngSrc', function (value) {
                if (!value && attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});