app.controller('myOrderCtrl', function ($scope, $state, dataService, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        //$scope.bookings =
        //    [
        //    {   "booking_type":"Daily",
        //        "order_id": "1234567890",
        //        "center_id": "6",
        //        "center_name":"RNA Gym center",
        //        "center_image": "http://csusap.csu.edu.au/~ckp407/images/img1.jpg",
        //        "totalAmount":"100",
        //        "bookings": [
        //            {
        //                "d_bookingDate": "10 march 2016",
        //                "d_shift": "morning",
        //                "d_price":"100"
        //            }
        //        ]
        //    },
        //    {
        //        "booking_type": "Daily",
        //        "order_id": "1234567890",
        //        "center_id": "6",
        //        "center_name": "Gold Gym center",
        //        "center_image": "http://csusap.csu.edu.au/~ckp407/images/img1.jpg",
        //        "totalAmount": "1000",
        //        "bookings": [
        //            {
        //                "d_bookingDate": "17 march 2016",
        //                "d_shift": "morning",
        //                "d_price": "150"
        //            },
        //            {
        //                "d_bookingDate": "18 march 2016",
        //                "d_shift": "Evening",
        //                "d_price": "120"
        //            },
        //            {
        //                "d_bookingDate": "19 march 2016",
        //                "d_shift": "Afternoon",
        //                "d_price": "100"
        //            },
        //        ]
        //    },
        //    ]
        $scope.goBookingDetails = function (b) {
            $rootScope.bookingDetails = b;
            console.log($rootScope.bookingDetails);
            $state.go('myBookingOrderDetails');
        }

        //daily my order
        var dailyModel = {
            "User_Id": "19",
            "Booking_Type": "Daily Booking"
        }
        dataService.myOrderDetails(dailyModel).then(function (data) {
            $scope.bookings = data.data.response;
        }, function (err) {
        })
        //gym my order
        var gymModel = {
            "User_Id": "19",
            "Booking_Type": "Gym Booking"
        }
        dataService.myOrderDetails(gymModel).then(function (data) {
            console.log(data);
            $scope.gymBookings = data.data.response;
        }, function (err) {
        })

        //FLXY my order
        var flxyModel = {
            "User_Id": "19",
            "Booking_Type": "FLXY Booking"
        }
        dataService.myOrderDetails(flxyModel).then(function (data) {
            console.log(data);
            $scope.flxyBookings = data.data.response;
        }, function (err) {
        })
    })
    $scope.errSrc = "http://www.businessislamica.com/xml/no_available_image.gif";
})
