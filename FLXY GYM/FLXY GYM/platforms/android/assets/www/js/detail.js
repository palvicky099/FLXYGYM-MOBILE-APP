app.controller('detailCtrl', function ($scope, $cordovaDialogs, $state, $ionicLoading, dataService, $ionicPopup, $rootScope) {
    $scope.goBack = function () {
        $state.go(window.localStorage.getItem("goDetailsFrom"));
    }
    $scope.bannerUrl = '../img/logo.png'
    $scope.detailItem = JSON.parse(window.localStorage.getItem("itemDetails"));
    $scope.gymDetails = JSON.parse(window.localStorage.getItem("GYMDetails"));
    $scope.visible = {};
	var msg ="This will do a booking for" + " "+$scope.detailItem.center_name + " " + "and center will contact you soon. Please go to My Booking to track the status";
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
	            $rootScope.plan = result;
	            $state.go('bookDate');
	        }
	        if(result == "1")
	        {
	            $rootScope.plan = result;
	            $state.go('bookDate');
	        }
	        if (result == "2") {
	            $rootScope.plan = result;
	            $state.go('bookDate');
	        }
	    });
            //$state.go('bookDate');
	  }
	  ////var string = $scope.gymDetails[0].time;
	  ////$scope.timeSlotarray = string.split(',')
	  ////console.log($scope.timeSlotarray);
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
  //    $cordovaDialogs.confirm($scope.gymDetails.landline, ['Cancel', 'Call'])
  //          .then(function (buttonIndex) {
  //          var btnIndex = buttonIndex;
  //          if(btnIndex == 1)
  //          {
  //          }
  //          if(btnIndex==2)
  //              {
  //           $cordovaDialogs.confirm('No network available please try again later', 'Information', ['OK'])
  //          .then(function (buttonIndex) {
  //           var btnIndex = buttonIndex;
  //           if(btnIndex == 1)
  //             {
  //             }
  //           });
  //          }
  //          });
    //}



    
})
