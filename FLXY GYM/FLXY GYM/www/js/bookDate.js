app.controller('bookDateCtrl', function ($scope, $ionicLoading, $cordovaDialogs, $state, dataService, $rootScope, $ionicPopup) {
    //$scope.$on('$ionicView.enter', function () {
    $scope.showMemberShip = $rootScope.plan;
    var DataArray = [];
    var myDate = new Date();
    for (var i = 0; i <= 6; i++)
    {
        var nextDay = new Date();
        nextDay.setDate(myDate.getDate() + i);
        var ds = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
        var DataArrays = {
            "id":i,
            "dateName":ds
        }
        DataArray.push(DataArrays);
    }
    //   $scope.dateScope = DataArray;
    $scope.detailItem = JSON.parse(window.localStorage.getItem("itemDetails"));
    var msg ="This will do a booking for" + " "+$scope.detailItem.gymName + " " + "and center will contact you soon. Please go to My Booking to track the status";
    var model = 5;
    $scope.dateScope = [];
    dataService.getAvailableGymCenter(model).then(function (result) {
        console.log(result.data.response)
        for(var i =0; i<result.data.response.length; i++)
        {
            var dateD = {
                "dateId": i,
                "Time": result.data.response[i].Time,
                "center_id": result.data.response[i].center_id,
                "center_name": result.data.response[i].center_name,
                "date":result.data.response[i].date,
                "remaining_seat": result.data.response[i].remaining_seat,
                "seat_per_day": result.data.response[i].seat_per_day,
                "price": result.data.response[i].price
            }
            $scope.dateScope.push(dateD);
        }
    })
    $scope.book=function(){
        $cordovaDialogs.confirm(msg, 'Information', ['Cancel', 'Book'])
                    .then(function (buttonIndex) {
                        var btnIndex = buttonIndex;
                        if(btnIndex == 1)
                        {
                        }
                        if(btnIndex==2)
                        {
                            $cordovaDialogs.confirm('Booking Confirmed is 343 entry to seats table is 445', 'Information', ['OK'])
                           .then(function (buttonIndex) {
                               var btnIndex = buttonIndex;
                               if(btnIndex == 1)
                               {
                                   $state.go('app.dashboard');
                               }
                           });
                        }
                    });
            
    }
    $scope.addToCart=function(){
        $ionicLoading.show({
            noBackdrop: false,
            template: '<p class="item flxy-button">Item added to cart</p>',
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            duration: 2000,
            maxWidth: 200,
            showDelay: 0
        });
    }
   
    $scope.tagsarray = [];
    $scope.callMe = function (item, a) {
        var listToDelete = [item.dateId];
        if (a == true) {
            $scope.tagsarray.push(item)
        }
        else {
            if (a == undefined) {
                a = false;
            }
            for (var i = 0; i < $scope.tagsarray.length; i++) {
                var obj = $scope.tagsarray[i];

                if (listToDelete.indexOf(obj.dateId) !== -1) {
                    $scope.tagsarray.splice(i, 1);
                }
            }
        }
        console.log($scope.tagsarray);
    }
    $scope.goOrderDetails = function () {
        window.localStorage.setItem("selectedDate", JSON.stringify($scope.tagsarray));
        $state.go('orderDetail');
    }
    dataService.gym_membership($scope.detailItem.center_id).then(function (result)
    {
        console.log(result.data)
        $scope.flxyGymData = result.data;
    })

    $scope.gymMemberShipClick=function(g)
    {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Your total amount to pay is' +' '+ g + ' '+ 'Rs',
            celText: 'Cancel',
            okText: 'Payment'
        });

        confirmPopup.then(function (res) {
            if (res) {
                onDeviceReadyTest();
            } else {
            }
        });
    }

//Proceed to payment
    // Global InAppBrowser reference
    var iabRef = null;

    //load start event
    function iabLoadStart(event) {
        /*  if (event.url.match("https://payu.herokuapp.com/success")) {
            // iabRef.close();
         } */
    }


    function iabLoadStop(event) {
        if (event.url.match("https://payu.herokuapp.com/success")) {
            console.log(iabRef);
            iabRef.executeScript({
                code: "document.body.innerHTML"
            }, function (values) {
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
        iabRef = window.open('payuBiz.html', '_blank', 'location=no');
        iabRef.addEventListener('loadstart', iabLoadStart);
        iabRef.addEventListener('loadstop', iabLoadStop);
        iabRef.addEventListener('loaderror', iabLoadError);
        iabRef.addEventListener('exit', iabClose);
    }

})
