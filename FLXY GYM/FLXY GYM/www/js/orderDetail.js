app.controller('orderDetailCtrl', function ($scope, $cordovaInAppBrowser, $rootScope, $state, $http, $ionicLoading, dataService, $cordovaDialogs, $cordovaActionSheet) {
    $scope.openBrowser = function () {
        var options = {
            title: 'Pay via',
            buttonLabels: ['Wallet', 'Net Banking'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true,
            winphoneEnableCancelButton: true,
        };
        $cordovaActionSheet.show(options)
          .then(function (btnIndex) {
              var index = btnIndex;
              if (index == 1) {
                  wallet();
              }
              if (index == 2) {
                  netBanking();
              }
          });
    }

    $scope.dashList = JSON.parse(window.localStorage.getItem("UserProfile"));
    $scope.bookTypetoshowPrice = window.localStorage.getItem("bookType");
    $scope.totAmount = window.localStorage.getItem("amount");
    //$scope.transactionId = generateUUID();
    //$scope.bookingId = generateUUID();
    //$rootScope.checkout = {
    //                            "key": "i6mTzrDF",
    //                            "hash": "",
    //                            "txnid": $scope.transactionId,
    //                            "amount": window.localStorage.getItem("amount"),
    //                            "firstname": $scope.dashList.name,
    //                            "email": $scope.dashList.email,
    //                            "phone": $scope.dashList.mobile,
    //                            "productinfo": window.localStorage.getItem("bookType"),
    //                            "surl": "http://flxygym.com/home/api/success.php",
    //                            "furl": "http://flxygym.com/home/api/failure.php",
    //                            "service_provider": "payu_paisa",
    //                            "udf1": window.localStorage.getItem("bookType"),
    //                            "udf2": $scope.bookingId,
    //                            "udf3": window.localStorage.getItem("type"),
    //                     }



    $scope.gymDetails = JSON.parse(window.localStorage.getItem("GYMDetails"));
    $scope.userInfo = JSON.parse(window.localStorage.getItem("UserProfile"));
    $scope.catgoryInfo = JSON.parse(window.localStorage.getItem("selectedCategoryForBooking"));
    $scope.cName = window.localStorage.getItem("categoryOrder");
    var nextDay = new Date();
    $scope.FromDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
    $scope.ToDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 2)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
    $scope.bookingDateGymFlxy = {
        "fromDate": $scope.FromDate,
        "toDate": $scope.ToDate,
        "type": window.localStorage.getItem("type"),
        "price": window.localStorage.getItem("amount")
    }
    if (window.localStorage.getItem("bookType") == "Gym Booking") {
        $scope.postOrderData = {
            "CenterId": $scope.gymDetails[0].center_id,
            "CategoryName": window.localStorage.getItem("categoryOrder"),
            "BookingType": window.localStorage.getItem("bookType"),
            "BookingDate": JSON.stringify($scope.bookingDateGymFlxy),
            "UserId": window.localStorage.getItem("UserId"),
            "Amount": window.localStorage.getItem("amount")
        }
    }
    if (window.localStorage.getItem("bookType") == "FLXY Booking") {
        $scope.postOrderData = {
            "CenterId": $scope.gymDetails[0].center_id,
            "CategoryName": window.localStorage.getItem("categoryOrder"),
            "BookingType": window.localStorage.getItem("bookType"),
            "BookingDate": JSON.stringify($scope.bookingDateGymFlxy),
            "UserId": window.localStorage.getItem("UserId"),
            "Amount": window.localStorage.getItem("amount")

        }
    }
    if (window.localStorage.getItem("bookType") == "Daily Booking") {
        $scope.postOrderData = {
            "CenterId": $scope.gymDetails[0].center_id,
            "CategoryName": window.localStorage.getItem("categoryOrder"),
            "BookingType": window.localStorage.getItem("bookType"),
            "BookingDate": window.localStorage.getItem("selectedDate"),
            "UserId": window.localStorage.getItem("UserId"),
            "Amount": window.localStorage.getItem("amount")
        }
    }
    function wallet(){
        $scope.LoginData = JSON.parse(window.localStorage.getItem("LoginData"));
        var getProfileModel = {
            "mobile": $scope.LoginData.mobile
        }
        dataService.getProfile(getProfileModel).then(function (result) {
            window.localStorage.setItem("UserProfile", JSON.stringify(result.data.response[0]));
            $scope.walletAmount = parseInt(result.data.response[0].wallet);

            var payAmount = parseInt(window.localStorage.getItem("amount"));
            if($scope.walletAmount >= payAmount)
            {
                dataService.wallet_payment($scope.postOrderData).then(function (data) {
                    if (data.data.message == "success") {
                        $cordovaDialogs.alert('Your slot book successfully', 'Thank you', 'OK')
                           .then(function () {
                               $state.go('app.dashboard');
                           });
                    }
                }, function (err) {
                    $cordovaDialogs.alert('There is problem to book a slot check your wallet balance', 'Sorry', 'OK')
                          .then(function () {
                              $state.go('app.dashboard');
                          });
                })
            }
            else {
                $cordovaDialogs.alert('Your wallet balance is low.', 'Sorry', 'OK')
                             .then(function () {
                             });
            }
        }, function (err) {

        }); 
    }



    function netBanking() {
        if (navigator.connection.type == Connection.NONE) {
            $ionicLoading.show({ template: "Please check internet connection", noBackdrop: false, duration: 2000 });
        } else {
            var user = {"UserId":  window.localStorage.getItem("UserId")}
            dataService.checkUserTakenMemberShip(user).then(function (checkData) {
                console.log(checkData);
                if (checkData.data.message == "no details found!") {
                  
                    $ionicLoading.show({
                        noBackdrop: false,
                        template: '<ion-spinner icon="lines"/>'
                    });
                    var req = {
                        method: 'POST',
                        url: 'http://flxygym.com/home/api/get_order.php',
                        data: $scope.postOrderData
                    }
                    $http(req).then(function (res) {
                        if (res.data.message == "success") {
                            $ionicLoading.hide();
                            var paymentUrl = "http://flxygym.com/home/api/payment.php?transactionid=" + res.data.transaction_id;
                            var options = {
                                location: 'yes',
                                clearcache: 'yes',
                                toolbar: 'no'
                            };
                            setTimeout(function () {
                                $cordovaInAppBrowser.open(paymentUrl, '_blank', options)
                               .then(function (event) {
                                   $state.go('myOrder')
                               })
                               .catch(function (event) {
                               });
                            }, 3000)
                        }
                        else {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                noBackdrop: false,
                                template: res.data.message,
                                content: 'Loading',
                                animation: 'fade-in',
                                showBackdrop: true,
                                duration: 3000,
                                maxWidth: 200,
                                showDelay: 0
                            });
                        }
                    });
                }
                else {
                    console.log("taken member ship code come here");
                        var flxyModel = {
                            "CenterId": $scope.gymDetails[0].center_id,
                            "CategoryName": window.localStorage.getItem("categoryOrder"),
                            "BookingType": window.localStorage.getItem("bookType"),
                            "BookingDate": JSON.stringify($scope.bookingDateGymFlxy),
                            "UserId": window.localStorage.getItem("UserId"),
                            "Amount": window.localStorage.getItem("amount")
                        }

                        dataService.booking_flxy_membership(flxyModel).then(function (data) {
                            if (data.data.message == "success") {
                                $cordovaDialogs.alert('Your slot book successfully', 'Thank you', 'OK')
                                   .then(function () {
                                       $state.go('app.dashboard');
                                   });
                            }
                            else {
                                $cordovaDialogs.alert('Sorry there is problem to book a slot please try again.', 'Sorry', 'OK')
                                 .then(function () {
                                 });
                            }
                        }, function (err) {
                          
                        })
                }
            }, function (err) {

            })
        }
    }

    $rootScope.$on('$cordovaInAppBrowser:loadstart', function (e, event) {
        if (event.url == "http://flxygym.com/home/api/success.php")
        {
            $cordovaInAppBrowser.close();
            $cordovaDialogs.alert('Your slot book successfully', 'Thank you', 'OK')
            .then(function () {
                $state.go('app.dashboard');
              });
        }
        if (event.url == "http://flxygym.com/home/api/failure.php") {
            $cordovaInAppBrowser.close();
            $cordovaDialogs.alert('Transaction failed', 'Sorry', 'OK')
                      .then(function () {
                          $state.go('app.dashboard');
              });
        }
        });

    $rootScope.$on('$cordovaInAppBrowser:loadstop', function (e, event) {
       
    });

    $rootScope.$on('$cordovaInAppBrowser:loaderror', function (e, event) {

    });

    $rootScope.$on('$cordovaInAppBrowser:exit', function (e, event) {
        $state.go('app.dashboard');
    });
    $scope.testmethod = function () {
        onDeviceReadyTest();
    }
    if (window.localStorage.getItem("type") == "Daily")
    {
        $scope.showDateTable = true;
        $scope.showMemberShip = false;
    }
    else
    {
        $scope.showDateTable = false;
        $scope.showMemberShip = true;
        $scope.type = window.localStorage.getItem("bookType");
        $scope.totalMembershipPrice = window.localStorage.getItem("amount");
        $scope.period = window.localStorage.getItem("type")
    }





    $scope.dateDetails = JSON.parse(window.localStorage.getItem("selectedDate"));

// Global InAppBrowser reference
var iabRef = null;

//load start event
function iabLoadStart(event) {
      if (event.url.match("http://flxygym.com/response.php")) {
         iabRef.close();
     } 
}


function iabLoadStop(event) {
    alert("nn")
    if (event.url.match("http://flxygym.com/response.php")) {
        console.log(iabRef);
        iabRef.executeScript({
            code: "document.body.innerHTML"
        }, function(values) {
            //incase values[0] contains result string
            var a = getValue(values[0], 'mihpayid');
            var b = getValue(values[0], 'status');
            var c = getValue(values[0], 'unmappedstatus');
            console.log(a + b + c);//you can capture values from return SURL
            //or
            //incase values[0] contains result string
            // console.log(getValue(values, 'mihpayid'))
        });
  
        // iabRef.close();
    }
}

//get values from inner HTML page i.e success page or failure page values
function getValue(source, key) {
    var pattern = key + '=(\\w+)(&amp;)?';
    var expr = new RegExp(pattern);
    var result = source.match(expr);
    return result[1];
}


//load error event
function iabLoadError(event) {
    alert(event.type + ' - ' + event.message);
    alert("gggg")
    console.log(event);
}
//close event
function iabClose(event) {
    iabRef.removeEventListener('loadstart', iabLoadStart);
    iabRef.removeEventListener('loadstop', iabLoadStop);
    iabRef.removeEventListener('loaderror', iabLoadError);
    iabRef.removeEventListener('exit', iabClose);
}
// device APIs are available
//
function onDeviceReadyTest() {
    var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
    };
    iabRef = $cordovaInAppBrowser.open('templates/payuBiz.html', '_payment', options);
  //  iabRef = window.open('templates/payuBiz.html', '_blank', 'location=no');
    iabRef.addEventListener('loadstart', iabLoadStart);
    iabRef.addEventListener('loadstop', iabLoadStop);
    iabRef.addEventListener('loaderror', iabLoadError);
    iabRef.addEventListener('exit', iabClose);
}

$scope.getTotal = function () {
    var total = 0;
    for (var i = 0; i < $scope.dateDetails.length; i++) {
        var productPrice = parseInt($scope.dateDetails[i].price);
        total += productPrice;
    }
    window.localStorage.setItem("amount", total);
    return total;
}
$scope.errSrc = "http://www.businessislamica.com/xml/no_available_image.gif";
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




