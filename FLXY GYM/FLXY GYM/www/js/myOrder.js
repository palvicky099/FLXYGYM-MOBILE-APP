app.controller('myOrderCtrl', function ($scope, $state, dataService, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        $scope.bookings =
            [
            {   "booking_type":"Daily",
                "order_id": "1234567890",
                "center_id": "6",
                "center_name":"RNA Gym center",
                "center_image": "http://csusap.csu.edu.au/~ckp407/images/img1.jpg",
                "totalAmount":"100",
                "bookings": [
                    {
                        "d_bookingDate": "10 march 2016",
                        "d_shift": "morning",
                        "d_price":"100"
                    }
                ]
            },
            {
                "booking_type": "Daily",
                "order_id": "1234567890",
                "center_id": "6",
                "center_name": "Gold Gym center",
                "center_image": "http://csusap.csu.edu.au/~ckp407/images/img1.jpg",
                "totalAmount": "1000",
                "bookings": [
                    {
                        "d_bookingDate": "17 march 2016",
                        "d_shift": "morning",
                        "d_price": "150"
                    },
                    {
                        "d_bookingDate": "18 march 2016",
                        "d_shift": "Evening",
                        "d_price": "120"
                    },
                    {
                        "d_bookingDate": "19 march 2016",
                        "d_shift": "Afternoon",
                        "d_price": "100"
                    },
                ]
            },
            ]
        $scope.goBookingDetails = function (b) {
            $rootScope.bookingDetails = b;
            console.log($rootScope.bookingDetails);
            $state.go('myBookingOrderDetails');
        }
    })
})
