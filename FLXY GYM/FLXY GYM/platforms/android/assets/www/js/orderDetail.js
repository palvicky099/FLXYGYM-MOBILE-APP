app.controller('orderDetailCtrl', function ($scope, $cordovaInAppBrowser, $rootScope, $state) {
    $scope.dashList = JSON.parse(window.localStorage.getItem("UserProfile"));
    $scope.transactionId = generateUUID();
    $scope.bookingId = generateUUID();
    $rootScope.checkout = {
        "key": "i6mTzrDF",
        "hash": "",
        "txnid": $scope.transactionId,
        "amount": window.localStorage.getItem("amount"),
        "firstname": $scope.dashList.name,
        "email": $scope.dashList.email,
        "phone": $scope.dashList.mobile,
        "productinfo": window.localStorage.getItem("bookType"),
        "surl": "http://flxygym.com/response.php",
        "furl": "http://flxygym.com/response.php",
        "service_provider": "payu_paisa",
        "udf1": window.localStorage.getItem("bookType"),
        "udf2": $scope.bookingId,
        "udf3": window.localStorage.getItem("type"),
    }
    console.log($rootScope.checkout);
    $scope.gymDetails = JSON.parse(window.localStorage.getItem("GYMDetails"));
    $scope.userInfo = JSON.parse(window.localStorage.getItem("UserProfile"));
    $scope.catgoryInfo = JSON.parse(window.localStorage.getItem("selectedCategoryForBooking"));

    var nextDay = new Date();
  
    $scope.FromDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
    $scope.ToDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 2)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
    $scope.bookingDateGymFlxy = {
        "fromDate":  $scope.FromDate,
        "toDate": $scope.ToDate,
        "type": window.localStorage.getItem("type"),
        "price": window.localStorage.getItem("amount")
    }

    if (window.localStorage.getItem("bookType") == "Gym Booking")
    {
        $scope.postOrderData = {
            "CenterId": $scope.gymDetails[0].center_id,
            "CategoryName": $scope.catgoryInfo.cat_name,
            "BookingType": window.localStorage.getItem("bookType"),
            "BookingDate": JSON.stringify($scope.bookingDateGymFlxy),
            "UserId": $scope.userInfo.user_id,
            "Amont": window.localStorage.getItem("amount")
           
        }
    }
    if (window.localStorage.getItem("bookType") == "FLXY Booking") {
        $scope.postOrderData = {
            "CenterId": $scope.gymDetails[0].center_id,
            "CategoryName": $scope.catgoryInfo.cat_name,
            "BookingType": window.localStorage.getItem("bookType"),
            "BookingDate": JSON.stringify($scope.bookingDateGymFlxy),
            "UserId": $scope.userInfo.user_id,
            "Amont": window.localStorage.getItem("amount")

        }
    }
    if (window.localStorage.getItem("bookType") == "Daily Booking") {
        $scope.postOrderData = {
            "CenterId": $scope.gymDetails[0].center_id,
            "CategoryName": $scope.catgoryInfo.cat_name,
            "BookingType": window.localStorage.getItem("bookType"),
            "BookingDate": window.localStorage.getItem("selectedDate"),
            "UserId": $scope.userInfo.user_id,
            "Amont": window.localStorage.getItem("amount")

        }
    }
    console.log($scope.postOrderData);
   // console.log("HASH ----" + string);
    $scope.openBrowser = function () {
        $state.go('payuBiz');
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
        };
        setTimeout(function () {
            $cordovaInAppBrowser.open('templates/payuBiz.html', '_blank', options)
           .then(function (event) {
               $state.go('myOrder')
           })
           .catch(function (event) {
           });
        }, 1000)
    }
    $rootScope.$on('$cordovaInAppBrowser:loadstart', function (e, event) {
        if(event.url =="http://flxygym.com/response.php")
        {
            $cordovaInAppBrowser.close();
        }
        });

    $rootScope.$on('$cordovaInAppBrowser:loadstop', function (e, event) {
       
    });

    $rootScope.$on('$cordovaInAppBrowser:loaderror', function (e, event) {

    });

    $rootScope.$on('$cordovaInAppBrowser:exit', function (e, event) {
        $state.go('app.dashboard');
    });
    //document.getElementById('amount').value = 200;
    $("#amount").val(200);


    $scope.testmethod = function () {
      //  document.getElementById("amount").value = "200";

        onDeviceReadyTest();
       
        console.log($scope.paymentDetails);
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
})
