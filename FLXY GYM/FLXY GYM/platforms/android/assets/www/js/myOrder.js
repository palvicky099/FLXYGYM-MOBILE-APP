app.controller('myOrderCtrl', function ($scope, $state, dataService, $rootScope, $ionicLoading, $cordovaSQLite, $ionicHistory, $ionicPlatform) {
    $scope.$on('$ionicView.enter', function () {
        $ionicPlatform.onHardwareBackButton(function () {
            $state.go('app.dashboard');
        });
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
        loading();
        $scope.goBookingDetails = function (b) {
            $rootScope.bookingDetails = b.order_id;
            console.log($rootScope.bookingDetails);
            $state.go('myBookingOrderDetails');
        }
        function loading() {
            $ionicLoading.show({
                noBackdrop: false,
                template: '<ion-spinner icon="lines"/>',
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 3000,
                maxWidth: 200,
                showDelay: 0
            });
        }

        if ($ionicHistory.currentStateName() == 'tab.dailyOrder') {
            //daily my order
            var dailyModel = {
                "User_Id": window.localStorage.getItem('UserId'),
                "Booking_Type": "Daily Booking"
            }
            dataService.myOrderDetails(dailyModel).then(function (data) {
                if (data.data.message == "details found!") {
                    console.log(data);
                    $scope.bookDateDate = data.data.response;
                    var delGroupSpeakerAssociation = "Delete from dateOrderDetails";
                    $cordovaSQLite.execute(db, delGroupSpeakerAssociation, []).then(function (res) {

                        var dateSlotBookQuery = "INSERT INTO dateOrderDetails(booking_date, category, center_id, center_name, date, image, order_id, price, result, time, transaction_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                        var Arrayactivity;
                        for (var i = 0; i < $scope.bookDateDate.length; i++) {
                            Arrayactivity = $scope.bookDateDate[i];
                            $cordovaSQLite.execute(db, dateSlotBookQuery, [Arrayactivity.booking_date, Arrayactivity.category, Arrayactivity.center_id, Arrayactivity.center_name, Arrayactivity.date, Arrayactivity.image, Arrayactivity.order_id, Arrayactivity.price, Arrayactivity.result, Arrayactivity.time, Arrayactivity.transaction_id]).then(function (res) {
                               
                            }, function (err) {
                                getDateData();
                            });
                        }
                        if (i === $scope.bookDateDate.length) {
                            getDateData();
                        }
                    }, function (err) {
                        getDateData();
                    });
                }
                else {
                    getDateData();
                    $ionicLoading.hide();
                }
            }, function (err) {
                $ionicLoading.hide();
            })
        }
        //gym my order
        if ($ionicHistory.currentStateName() == 'tab.gymOrder') {
        var gymModel = {
            "User_Id": window.localStorage.getItem("UserId"),
            "Booking_Type": "Gym Booking"
        }
        dataService.myOrderDetails(gymModel).then(function (data) {
            $ionicLoading.hide();
            $scope.gymBookings = data.data.response;
            console.log(data.data.response)
        }, function (err) {
            $ionicLoading.hide();
        })
    }
        //FLXY my order
        if ($ionicHistory.currentStateName() == 'tab.flxyOrder') {
            var flxyModel = {
                "User_Id": window.localStorage.getItem("UserId"),
                "Booking_Type": "FLXY Booking"
            }
            dataService.myOrderDetails(flxyModel).then(function (data) {
                $ionicLoading.hide();
                $scope.flxyBookings = data.data.response;
            }, function (err) {
                $ionicLoading.hide();
            })
        }
        })
        
    $scope.errSrc = "http://www.businessislamica.com/xml/no_available_image.gif";


    function getDateData() {
        var noteQuery = "select center_name,category, order_id, booking_date, result, price, image, sum(cast(price as INTEGER)) as total from dateOrderDetails group by cast(order_id as INTEGER)";
        $cordovaSQLite.execute(db, noteQuery, []).then(function (result) {
            var itemsColl = [];
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    itemsColl[i] = result.rows.item(i);
                }
                var jsonData = JSON.parse(JSON.stringify(itemsColl));
                $scope.bookings = jsonData;
                console.log(jsonData)
                $ionicLoading.hide();
            }
            else {
                $scope.bookings = [];
                $ionicLoading.hide();
            }
        }, function (err) {
            console.error(err);
            $ionicLoading.hide();
        });
    }
})
