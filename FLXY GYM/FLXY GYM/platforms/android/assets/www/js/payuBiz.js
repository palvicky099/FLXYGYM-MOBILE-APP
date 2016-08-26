app.controller('payuBizCtrl', function ($scope, $state, dataService) {
  //  document.sendParam.submit();
    $scope.dashList = JSON.parse(window.localStorage.getItem("UserProfile"));
    $scope.transactionId = uuid.newguid();
    $scope.bookingId = uuid.newguid()
    $scope.paymentDetails = {
        "key": i6mTzrDF,
        "hash": "1234567890qwertyuiopasdfghjklzxcvbnm",
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
  //  $scope.abc = "i6mTzrDF|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";
})
